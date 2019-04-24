var jwt = require('jsonwebtoken');
var config = require('../config/dev');

var excluedRoutes = [
    '/api/v1/user/signin',
    '/api/v1/user/forgotpassword',
    '/api/v1/user/resetpassword',
    '/api/v1/institute/register',
];

var isTokenExpired = (user) => {
    if(user.expire && Date.now() <= user.expire ) {
        return false;
    }
    return true;
};

var verfifyAccessToken = (req, res, next) => {
    
    var token = req.headers['x-api-token'];
    var errors = [{ msg: "Unauthorized Access"}];

    if (token) {
        jwt.verify(token, config.PRIVATE_KEY, function (err, decoded) {
            
            if (err || !(decoded && decoded.userId && !isTokenExpired(decoded))) {
                req.isUserAuthenticated = false;
            } else {
                req.isUserAuthenticated = true;
                req.user = decoded;
            }

            if(req.isUserAuthenticated) {
                next();
            } else {
                req.app.responseHelper.send(res, false, {}, errors, 401);
            }

        });
    } else {
        req.app.responseHelper.send(res, false, {}, errors, 401);
    }
};

var verifyRefreshToken = (req, res, next) => {
    next();
};

var verify = (req, res, next) => {
    if(req.path == '/api/v1/user/token') {
        verifyRefreshToken(req, res, next);
    } else if(excluedRoutes.indexOf(req.path) !== -1) {
        next();
    } else {
        verfifyAccessToken(req, res, next);
    }
};

var auth = {};
auth.verify = verify;

module.exports = auth;
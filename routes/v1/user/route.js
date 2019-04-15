var express = require('express');
var router = express.Router();
var validator = require('./validator');
var model = require('./model');


var onError = (req, res, errors, statusCode) => {
    if (!(Array.isArray(errors) && errors.length)) {
        errors = [{
            "msg": "Something went wrong!"
        }];
    }
    req.app.responseHelper.send(res, false, {}, errors, statusCode);
};

router.get('/:id', function(req, res) {

    req.checkQuery("id", "Not Integer").toInt();
    req.checkQuery("limit", "Limit cannot be blank").exists();
    req.checkQuery("offset", "Offset cannot be blank").exists();

    var promise = req.getValidationResult();

    promise.then(function(result) {
        if (!result.isEmpty()) {
            var errors = result.array();
            res.json({id: req.params.id, error: errors});
        } else {
            var data = {id: req.params.id, error: false, msg: 1234};
            req.app.responseHelper.send(res, true, data, [], 200);
        }
    });
});

router.post("/forgotpassword", (req, res) => {

    var errors = validator.forgotPassword(req);

    if(errors && errors.length) {
        onError(req, res, errors, 400);
    }

    var email = req.body.email;
    model.findByEmail(email).then((data) => {
        if(data.error) {
            onError(req, res, errors, 500);
        } else {
            var user = data.user;

            if(user && user._id) {

                var data = {
                    email: user.email,
                    userId: user._id
                };

                model.createOtp(data).then((result) => {
                    if(result.error) {
                        onError(req, res, errors, 500);
                    } else {
                        req.app.responseHelper.send(res, true, {}, [], 200);
                    }
                });

            } else {
                req.app.responseHelper.send(res, true, {}, [], 200);
            }
            
        }
    });

});

router.post("/resetpassword", (req, res) => {
    var data = {abcd: 5678};
    req.app.responseHelper.send(res, true, data, [], 200);
});


module.exports = router;
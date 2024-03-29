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

router.get('/list', (req, res) => {
    var currentUser = req.user;

    var obj = {
        instituteId: req.query.instituteId,
        roles: [],
        entity: []
    };

    if(currentUser.entity === 'institute') {
        if(currentUser.role === 'admin') {
            obj.roles.push('manager', 'admin');
            obj.entity.push('institute', 'affiliate');
        } else if(currentUser.role === 'manager') {
            obj.roles = ['reviewer', 'certifier', 'manager'];
            obj.entity = ['institute'];
        }
    } else if(currentUser.entity === 'affiliate') {
        if(currentUser.role === 'manager') {
            obj.roles = ['reviewer', 'approver', 'manager'];
            obj.entity = ['affiliate'];
        }
    }

    if(req.query.departmentId) {
        obj.departmentId = req.query.departmentId;
    }

    if(req.query.affiliateId) {
        obj.affiliateId = req.query.affiliateId;
    }

    model.list(obj).then((result) => {
        console.log(obj);
        if(result.isError || !(result.users)) {
			onError(req, res, [], 500);
		} else {
			req.app.responseHelper.send(res, true, {users: result.users}, [], 200);
		}
    });
});

router.get('/:id', (req, res) => {
    var id = req.params.id;

    model.findById(id).then((result) => {
        if(result.isError) {
            onError(req, res, result.errors, 500);
        } else {
            var user = result.user;
            req.app.responseHelper.send(res, true, user, [], 200);
        }
    })
});

router.put("/:id/changeStatus", (req, res) => {
    var id = req.params.id;

    model.findById(id).then((result) => {
        if (result.isError) {
            var errors = result.errors;
			onError(req, res, errors, 500);
        } else {
            var user = result.user;
            user.isActive = req.body.isActive;
            model.update(user).then((result) => {
                if (result.isError) {
                    onError(req, res, result.errors, 500);
                } else {
                    var user = result.user;
                    req.app.responseHelper.send(res, true, user, [], 200);
                }
            });
        }
    });
});

router.post("/signin", (req, res) => {
    
    var errors = validator.forgotPassword(req);

    if (errors && errors.length) {
        onError(req, res, errors, 400);
        return true;
    }

    var errors = [{param: "login", msg: "Login Failed: Invalid Credentails"}];

    var signin = (data) => {
        model.createSession(data).then((result) => {
            if(result.isError || !(result && result.user && result.user._id)) {
                onError(req, res, errors, 200);
            } else {
                req.app.responseHelper.send(res, true, result.user, [], 200);
            }
        });
    };

    var verifyPassword = (user) => {
        var password = req.body.password;
        model.verifyPassword(user, password).then((result) => {
            if(result.isError || !(result && result.user && result.user._id)) {
                onError(req, res, errors, 200);
            } else {
                var user = result.user;
                signin(user);
            }
        });
    };

    var findUserByEmail = () => {
        var email = req.body.email;
        model.findByEmail(email).then((result) => {
            if (result.isError || !(result.user && result.user._id)) {
                onError(req, res, errors, 200);
            } else {
                var user = result.user;
                verifyPassword(user);
            }
        });
    };

    findUserByEmail();
});

router.post("/forgotpassword", (req, res) => {


    var errors = validator.forgotPassword(req);

    if (errors && errors.length) {
        onError(req, res, errors, 400);
        return true;
    }

    var email = req.body.email;
    model.findByEmail(email).then((data) => {
        if (data.isError) {
            onError(req, res, [], 500);
        } else {
            var user = data.user;
            if (user && user._id) {
                var data = {
                    email: user.email,
                    userId: user._id
                };

                model.createOtp(data).then((result) => {
                    if (result.isError) {
                        var errors = (result.errors && result.errors.length) ? result.errors : [];
                        onError(req, res, errors, 500);
                    } else {
                        req.app.responseHelper.send(res, true, {}, [], 200);
                    }
                });
            }
            else {
                req.app.responseHelper.send(res, true, {}, [], 200);
            }

        }
    });

});

router.post("/resetpassword", (req, res) => {

    var errors = validator.resetPassword(req);

    if (errors && errors.length) {
        onError(req, res, errors, 400);
        return true;
    }

    var updateOtp = (id) => {
        model.updateOtp(id).then((result) => {
            req.app.responseHelper.send(res, true, {}, [], 200);
        });
    };

    var updatePassword = (data) => {
        data.password = req.body.password;
        model.updatePassword(data).then((result) => {
            if (result.isError) {
                var errors = (result.errors && result.errors.length) ? result.errors : [];
                onError(req, res, [], 500);
            } else {
                updateOtp(data.otpId);
            }
        });
    };

    var findOtp = () => {

        var data = {
            email: req.body.email,
            code: req.body.code
        };

        model.findOtp(data).then((result) => {
            if (result.isError) {
                var errors = (result.errors && result.errors.length) ? result.errors : [];
                onError(req, res, errors, 500);
            } else {
                var otp = result.otp;
                if (otp && otp._id) {
                    var data = {
                        otpId: otp._id,
                        email: otp.email,
                        userId: otp.userId
                    };
                    updatePassword(data);
                }
            }
        });
    };

    findOtp();


});

router.post("/token", (req, res) => {

    var session = req.session;
    var userId = session.userId;
    var sessionId = session._id;

    var updateSession = (user) => {
        model.updateSession(user, sessionId).then((result) => {
            if(result.isError || !(result && result.user && result.user._id)) {
                var errors = (result.errors && result.errors.length) ? result.errors : [];
                onError(req, res, errors, 401);
            } else {
                req.app.responseHelper.send(res, true, result.user, [], 200);
            }
        });
    };

    var findUserById = (id) => {
        model.findById(id).then((result) => {
            if(result.isError || !(result && result.user && result.user._id)) {
                var errors = (result.errors && result.errors.length) ? result.errors : [];
                onError(req, res, errors, 500);
            } else {
                var user = result.user;
                updateSession(user);
            }
        });
    };
    findUserById(userId);

});

router.post("/create", (req, res) => {
    var errors = validator.create(req);

    if(errors && errors.length) {
        onError(req, res, errors, 400);
        return false;
    }

    var user = {};
    user.name = req.body.name;
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.phoneNumber = req.body.phoneNumber;
    user.role = req.body.role;
    user.entity = req.body.entity;
    user.instituteId = req.body.instituteId;
    user.departmentId = req.body.departmentId;
    user.affiliateId = req.body.affiliateId;

    model.create(user).then((result) => {
        if(result.isError || !(result.user && result.user._id)) {
            onError(req, res, [], 500);
        } else {
            req.app.responseHelper.send(res, true, result.user, [], 200);
        }
    });
});



module.exports = router;
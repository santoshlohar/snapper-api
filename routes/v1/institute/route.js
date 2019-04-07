var express = require('express');
var router = express.Router();
var schema = require('./schema');
var model = require('./model');
var validator = require('./validator');
var userModel = require('../user/model');


router.post('/register', function(req, res) {

    var errors = validator.register(req);

    var onError = (errors, statusCode) => {
        if (!(Array.isArray(errors) && errors.length)) {
            errors = [{
                "msg": "Failed to create institute. Please try again."
            }];
        }
        req.app.responseHelper.send(res, false, {}, errors, statusCode);
    };

    if(errors && errors.length) {
        onError(errors, 400);
        return true;
    }

    var createAdmin = (user, institute) => {
        userModel.create(user).then((data) => {
            if(data.error) {
                onError([], 500);
            } else {
                req.app.responseHelper.send(res, true, institute, [], 200);
            }
        }).catch((err) => {
            onError([], 500);
        });
    };

    var body = req.body;
    var user = body.instituteAdmin;
    delete body.instituteAdmin;

    model.create(body).then((data) => {
        if(data.error) {
            onError([], 500);
        } else {
            // create Admin
            createAdmin(user, data.institute);
        }
    }).catch((err) => {
        onError([], 500);
    });

});

module.exports = router;

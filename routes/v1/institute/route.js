var express = require('express');
var router = express.Router();
var schema = require('./schema');
var model = require('./model');
var validator = require('./validator');
var userModel = require('../user/model');


router.post('/register', function(req, res) {

    var validationPromise = validator.register(req);

    var onError = (errors, statusCode) => {
        if (!(Array.isArray(errors) && errors.length)) {
            errors = [{
                "msg": "Failed to create institute. Please try again."
            }];
        }
        req.app.responseHelper.send(res, false, {}, errors, statusCode);
    };

    var createAdmin = (user, institute) => {
        userModel.create(user).then((data) => {
            if(data.error) {
                onError({}, 500);
            } else {
                req.app.responseHelper.send(res, true, institute, [], 200);
            }
        }).catch((err) => {
            onError({}, 500);
        });
    };

    validationPromise.then((result) => {
        var body = req.body;
        var user = body.instituteAdmin;
        delete body.instituteAdmin;

        model.create(body).then((data) => {
            if(data.error) {
                onError({}, 500);
            } else {
                // create Admin
                createAdmin(user, data.institute);
            }
        }).catch((err) => {
            onError([], 500);
        });
        
    }).catch((result) => {
        console.log(result);
        var errors = [];
        if(result && result.array) {
            var errors = result.array({
                onlyFirstError: true
            });
        }
        onError(errors, 400);
    });

});

module.exports = router;

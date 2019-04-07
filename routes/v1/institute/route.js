var express = require('express');
var router = express.Router();
var schema = require('./schema');
var model = require('./model');
var validator = require('./validator');


router.post('/register', function(req, res) {

    var validationPromise = validator.register(req);

    validationPromise.then((result) => {
        var body = req.body;
        var instituteAdmin = body.instituteAdmin;
        delete body.instituteAdmin;
        model.create(body, (err, institute) => {
            if(err) {
                var errors = [{
                    "msg": "Failed to create institute. Please try again."
                }];
                req.app.responseHelper.send(res, false, {}, errors, 500);
            } else {
                req.app.responseHelper.send(res, true, institute, [], 200);
            }
        });
        
    }).catch((result) => {
        console.log(result);
        var errors = [{
            msg: "Something went wrong!"
        }];
        if(result && result.array) {
            var errors = result.array({
                onlyFirstError: true
            });
        }
        req.app.responseHelper.send(res, false, {}, errors, 400);
    });

});

module.exports = router;

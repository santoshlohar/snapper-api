var express = require('express');
var router = express.Router();
var model = require('./model');
var validator = require('./validator');
var userModel = require('./../user/model');

var onError = (req, res, errors, statusCode) => {
    if (!(Array.isArray(errors) && errors.length)) {
        errors = [{
            "msg": "Something went wrong!"
        }];
    }
    req.app.responseHelper.send(res, false, {}, errors, statusCode);
};

router.get('/list', (req, res) => {

    var affiliateId = req.query.affiliateId;
    var batchId = req.query.batchId;
    var data = {
        affiliateId: affiliateId,
        batchId: batchId
    };

    model.list(data).then((result) => {
        if(result.isError) {
            onError(req, res, result.errors, 500);
        } else {
            req.app.responseHelper.send(res, true, {students: result.students}, [], 200);
        }
    });

});

router.get('/:id', (req, res) => {
    var id = req.params.id;

    model.findById(id).then((result) => {
        if(result.isError && !(result.student && result.student._id)) {
            onError(req, res, result.errors, 500);
        } else {
            req.app.responseHelper.send(res, true, {student: result.student}, [], 200);
        }
    })
});

router.put('/:id/changeStatus', (req, res) => {
    var id = req.params.id;
    var user = req.user;
    var affiliateId = req.user.reference.affiliateId;

    var changeStatus = () => {

    };

    var findStudent = () => {
        model.findById(id).then((result) => {
            if(result.isError || !(result.student && result.student._id)) {
                onError(req, res, result.errors, 500);
            } else {
                changeStatus(result.student);
            }
        });
    };
    
    var getReviewers = () => {
        userModel.getAffiliateReviewers(affiliateId).then((result) => {
            if(result.isError || !(result.reviewers)) {
                onError(req, res, result.errors, 500);
            } else {
                var reviewers = result.reviewers;
                var status = "reviewed";
                if(reqviewers.length > 1) {
                    status = "under review";
                }
            }
        });
    };

});

module.exports = router;
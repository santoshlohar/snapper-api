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
    var userId = req.user._id;
    var instituteId = req.user.reference.instituteId;
    var affiliateId = req.user.reference.affiliateId;
    var status = req.body.status;

    var changeStatus = (data, student) => {
        model.changeStatus(data).then((result) => {
            if(result.isError) {
                onError(req, res, result.errors, 500);
            } else {
                student.status = data.student;
                req.app.responseHelper.send(res, true, {student: student}, [], 200);
            }
        });
    };

    var processStatus = (obj) => {

        if (obj.student.status = 'rejected') {
            onError(req, res, [{msg: "Action not Allowed, Student is already rejected"}], 500);
        } if (obj.student.status = 'reviewed') {
            onError(req, res, [{msg: "Action not Allowed, Student is already reviewed"}], 500);
        } else {

            var data = {
                studentId: data.student._id
            };

            var reviewersObj = (student.reviewers) ? student.reviewers : {};
            
            if(!reviewersObj[userId]) {
                reviewersObj[userId] = {userId: userId, date: Date.now()};
            }


            if(obj.student.status == 'new') {

                if (status == 'rejected') {
                    data.status = 'rejected';
                    reviewersObj[userId].status = 'rejected';
                } else {
                    data.status = 'reviewed';
                    if(obj.reviewers.length > 1) {
                        data.status = 'under review';
                    }
                    reviewersObj[userId].status = 'reviewed';
                }
                
            } else if(obj.student.status == 'under review') {

                if (status == 'rejected') {
                    data.status = 'rejected';
                    reviewersObj[userId].status = 'rejected';
                } else {
                    var reviewedCount = 0;
                    for(var i in reviewersObj) {
                        if(reviewerObj[i].status == 'reviewed' ) {
                            reviewedCount++;
                        }
                    }

                    if(reviewedCount+1 == obj.reviewers.length) {
                        data.status = 'reviewed';
                    }
                    reviewersObj[userId].status = 'reviewed';
                }
                
            }

            data.reviewers = reviewersObj;
            changeStatus(data, obj.student);
        }
    };

    var findStudent = (reviewers) => {
        model.findById(id).then((result) => {
            if(result.isError || !(result.student && result.student._id)) {
                onError(req, res, result.errors, 500);
            } else {

                var student = result.student;
                var obj = {
                    student: student,
                    reviewers: reviewers
                };
                processStatus(obj);
            }
        });
    };
    
    var getReviewers = () => {
        userModel.getAffiliateReviewers(instituteId, affiliateId).then((result) => {
            if(result.isError || !(result.reviewers)) {
                onError(req, res, result.errors, 500);
            } else {
                var reviewers = result.reviewers;
                findStudent(reviewers);
            }
        });
    };

    getReviewers();

});

module.exports = router;
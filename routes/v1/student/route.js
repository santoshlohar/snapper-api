var express = require('express');
var router = express.Router();
var model = require('./model');
var validator = require('./validator');
var userModel = require('./../user/model');
var uuid = require('uuid');

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
    var userId = req.user.userId;
    var instituteId = req.user.reference.instituteId;
    var affiliateId = req.user.reference.affiliateId;
    var status = req.body.status;

    var changeStatus = (data, student) => {
        model.changeStatus(data).then((result) => {
            if(result.isError) {
                onError(req, res, result.errors, 500);
            } else {
                student = JSON.parse(JSON.stringify(student));
                student.status = data.status;
                req.app.responseHelper.send(res, true, {student: student}, [], 200);
            }
        });
    };

    var processStatus = (obj) => {

        if (obj.student.status == 'rejected') {
            onError(req, res, [{msg: "Action not Allowed, Student is already rejected"}], 500);
            return true;
        } else if (obj.student.status == 'reviewed') {
            onError(req, res, [{msg: "Action not Allowed, Student is already reviewed"}], 500);
            return true;
        } else {

            var data = {
                studentId: obj.student._id
            };

            var reviewersObj = (obj.student.reviewers) ? obj.student.reviewers : {};
            
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
                }  else {
                    var reviewedCount = 0;
                    var isUserAlreadyReviewed = false;
                    for(var i in reviewersObj) {

                        if(i == userId && reviewersObj[i].status) {
                            isUserAlreadyReviewed = true;
                            break;
                        }

                        if(reviewersObj[i].status == 'reviewed' ) {
                            reviewedCount++;
                        }
                    }

                    if(isUserAlreadyReviewed) {
                        onError(req, res, [{msg: "Action not Allowed, Student is already reviewed by Current Reviewer"}], 500);
                        return true;
                    }
                    
                    data.status = 'under review';
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
                var isValidReviewer = false;
                for(var i=0; i < reviewers.length; i++) {
                    if(reviewers[i].userId == userId) {
                        isValidReviewer = true;
                        break;
                    }
                }

                if(isValidReviewer) {
                    findStudent(reviewers);
                } else {
                    onError(req, res, [{msg: "You are not authorized to perform this action"}], 403);
                }
                
                
            }
        });
    };

    getReviewers();

});

router.post('/:id/comment', (req, res) => {
    var id = req.params.id;
	var text = req.body.text;
	var commentId = (req.body.commentId) ? req.body.commentId : 0;
	var userId = req.user.userId;
	var entity = req.user.reference.entity;
    var role = req.user.reference.role;
    var firstName = '';
    var lastName = '';
	var comment = {
		id: uuid(),
		text: text,
		date: Date.now(),
		user: {
			id: userId,
			entity: entity,
			role: role,
			firstName: "",
			lastName: ""
		}
    };
    
    if(commentId) {
		comment.id = commentId;
    }

    var update = (studentId, comments) => {
        var data = {
			comments: comments
        };
        model.update(studentId, data).then((result) => {
            if(result.isError) {
                onError(req, res, result.errors, 500);
            } else {
                req.app.responseHelper.send(res, true, {comment: comment}, [], 200);
            }
        });
    };

    var findStudentById = () => {
        model.findById(id).then((result) => {
            if(result.isError || !(result.student && result.student._id)) {
                onError(req, res, result.errors, 500);
            } else {
                var student = result.student;
                var comments = (student.comments) ? student.comments : [];
                comment.user.firstName = firstName;
                comment.user.lastName = lastName;
				if(comments.length && commentId) {
					for(var i=0; i < comments.length; i++) {
						if (comments[i].id == commentId) {
							comments[i] = comment;
						}
					}
				} else {
					comments.push(comment);
				}
                console.log("ID", student._id)
                update(student._id, comments);
            }
        });
    };
    
    userModel.findById(userId).then((result) => {
        if(result.isError || !(result.user && result.user._id)) {
            onError(req, res, result.errors, 500);
        } else {
            firstName = result.user.firstName;
            lastName = result.user.lastName;
            findStudentById();
        }
    });
});

module.exports = router;
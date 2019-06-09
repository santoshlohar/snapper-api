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
    var instituteId = req.query.instituteId;
    var departmentId = req.query.departmentId;
    var affiliateId = req.query.affiliateId;
    var batchId = req.query.batchId;
    var data = {
        instituteId: instituteId,
        departmentId: departmentId, 
        affiliateId: affiliateId,
        batchId: batchId
    };

    model.list(data).then((result) => {
        if(result.isError) {
            onError(req, res, result.errors, 500);
        } else {
            req.app.responseHelper.send(res, true, {certificates: result.certificates}, [], 200);
        }
    });

});

router.get('/:id', (req, res) => {

    model.findById(req.params.id, true).then((result) => {
        if(result.isError && !(result.certificate && result.certificate._id)) {
            onError(req, res, result.errors, 500);
        } else {
            req.app.responseHelper.send(res, true, {certificate: result.certificate}, [], 200);
        }
    })
});


router.put('/:id/reviewer/status', (req, res) => {
    var id = req.params.id;
    var userId = req.user.userId;
    var instituteId = req.user.reference.instituteId;
    var departmentId = req.user.reference.departmentId ;
    var status = req.body.status;

    var changeStatus = (data, certificate) => {
        model.changeStatus(data, 'review').then((result) => {
            if(result.isError) {
                onError(req, res, result.errors, 500);
            } else {
                certificate = JSON.parse(JSON.stringify(certificate));
                certificate.status = data.certificate;
                req.app.responseHelper.send(res, true, {certificate: certificate}, [], 200);
            }
        });
    };
 
    var processStatus = (obj) => {

        if (obj.certificate.status == 'certified') {
            onError(req, res, [{msg: "Action not Allowed, Certificate is already certified"}], 500);
        } if (obj.certificate.status == 'under certify') {
            onError(req, res, [{msg: "Action not Allowed, Certificate is already in under certify status"}], 500);
        } else if (obj.certificate.status == 'rejected') {
            onError(req, res, [{msg: "Action not Allowed, Certificate is already rejected"}], 500);
        } if (obj.certificate.status == 'reviewed') {
            onError(req, res, [{msg: "Action not Allowed, Certificate is already reviewed"}], 500);
        } else {

            var data = {
                certificateId : obj.certificate._id
            };

            var reviewersObj = (obj.certificate.reviewers) ? obj.certificate.reviewers : {};
            
            if(!reviewersObj[userId]) {
                reviewersObj[userId] = {userId: userId, date: Date.now()};
            }


            if(obj.certificate.status == 'new') {

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
                
            } else if(obj.certificate.status == 'under review') {

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
                        onError(req, res, [{msg: "Action not Allowed, Certificate is already reviewed by Current Reviewer"}], 500);
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
            changeStatus(data, obj.certificate);
        }
    };

    var findCertificate = (reviewers) => {
        model.findById(id, false).then((result) => {
            if(result.isError || !(result.certificate && result.certificate._id)) {
                onError(req, res, result.errors, 500);
            } else {

                var certificate = result.certificate;

                var obj = {
                    certificate: certificate,
                    reviewers: reviewers
                };
                processStatus(obj);
            }
        });
    };
    
    var getReviewers = () => {
        userModel.getInstituteReviewers(instituteId, departmentId).then((result) => {
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
                    findCertificate(reviewers);
                } else {
                    onError(req, res, [{msg: "You are not authorized to perform this action"}], 403);
                }
                
                
            }
        });
    };

    getReviewers();

});


router.put('/:id/certifier/status', (req, res) => {
    var id = req.params.id;
    var userId = req.user.userId;
    var instituteId = req.user.reference.instituteId;
    var departmentId = req.user.reference.departmentId ;
    var status = req.body.status;

    var changeStatus = (data, certificate) => {
        model.changeStatus(data, 'certify').then((result) => {
            if(result.isError) {
                onError(req, res, result.errors, 500);
            } else {
                certificate = JSON.parse(JSON.stringify(certificate));
                certificate.status = data.certificate;
                req.app.responseHelper.send(res, true, {certificate: certificate}, [], 200);
            }
        });
    };

    var processStatus = (obj) => {
        if (obj.certificate.status == 'rejected') {
            onError(req, res, [{msg: "Action not Allowed, Certificate is already rejected"}], 500);
        } if (obj.certificate.status == 'certified') {
            onError(req, res, [{msg: "Action not Allowed, Certificate is already certified"}], 500);
        } if (obj.certificate.status == 'under review' ||  obj.certificate.status == 'new') {
            onError(req, res, [{msg: "Action not Allowed, Certificate will be reviewed first"}], 500);
        } else {

            var data = {
                certificateId : obj.certificate._id
            };

            var certifiersObj = (obj.certificate.certifiers) ? obj.certificate.certifiers : {};
            
            if(!certifiersObj[userId]) {
                certifiersObj[userId] = {userId: userId, date: Date.now()};
            }


            if(obj.certificate.status == 'reviewed') {

                if (status == 'rejected') {
                    data.status = 'rejected';
                    certifiersObj[userId].status = 'rejected';
                } else {

                    data.status = 'certified';
                    if(obj.certifiers.length > 1) {
                        data.status = 'under certify';
                    }
                    certifiersObj[userId].status = 'certified';
                }
                
            } else if(obj.certificate.status == 'under certify') {

                if (status == 'rejected') {
                    data.status = 'rejected';
                    certifiersObj[userId].status = 'rejected';
                }  else {
                    var certifiedCount = 0;
                    var isUserAlreadyCertified = false;
                    for(var i in certifiersObj) {

                        if(i == userId && certifiersObj[i].status) {
                            isUserAlreadyCertified = true;
                            break;
                        }

                        if(certifiersObj[i].status == 'certified' ) {
                            certifiedCount++;
                        }
                    }

                    if(isUserAlreadyCertified) {
                        onError(req, res, [{msg: "Action not Allowed, Certificate is already certified by Current Certifier"}], 500);
                        return true;
                    }
                    
                    data.status = 'under certify';
                    if(certifiedCount+1 == obj.certifiers.length) {
                        data.status = 'certified';
                    }
                    certifiersObj[userId].status = 'certified';
                    
                }
                
            }

            data.certifiers = certifiersObj;
            changeStatus(data, obj.certificate);
        }
    };

    var findCertificate = (certifiers) => {
        model.findById(id, false).then((result) => {
            if(result.isError || !(result.certificate && result.certificate._id)) {
                onError(req, res, result.errors, 500);
            } else {

                var certificate = result.certificate;

                var obj = {
                    certificate: certificate,
                    certifiers: certifiers
                };
                processStatus(obj);
            }
        });
    };
    
    var getCertifiers = () => {
        userModel.getInstituteCertifiers(instituteId, departmentId).then((result) => {
            if(result.isError || !(result.certifiers)) {
                onError(req, res, result.errors, 500);
            } else {
                var certifiers = result.certifiers;
                var isValidCertifier = false;
                for(var i=0; i < certifiers.length; i++) {
                    if(certifiers[i].userId == userId) {
                        isValidCertifier = true;
                        break;
                    }
                }

                if(isValidCertifier) {
                    findCertificate(certifiers);
                } else {
                    onError(req, res, [{msg: "You are not authorized to perform this action"}], 403);
                }
                
                
            }
        });
    };

    getCertifiers();

});

module.exports = router;
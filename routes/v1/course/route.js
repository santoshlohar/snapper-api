var express = require('express');
var router = express.Router();
var schema = require('./schema');
var model = require('./model');
var validator = require('./validator');

// On Error
var onError = (req, res, errors, statusCode) => {
    if (!(Array.isArray(errors) && errors.length)) {
        errors = [{
            "msg": "Something went wrong!"
        }];
    }
    req.app.responseHelper.send(res, false, {}, errors, statusCode);
};

router.post("/create", (req, res) => {
    var errors = validator.course(req);

    if (errors && errors.length) {
        onError(req, res, errors, 400);
        return false;
    }

    var course = {
        "instituteId": req.body.instituteId,
        "departmentId": req.body.departmentId,
        "courseType": req.body.courseType,
        "courseName": req.body.courseName,
        "specialization": req.body.specialization,
        "certificateGenerate": req.body.certificateGenerate,
        "certificatePrint": req.body.certificatePrint,
        "gpaCalculated": req.body.gpaCalculated,
        "subjectCredits": req.body.subjectCredits,
        "courseDuration": req.body.courseDuration,
        "durationUnit": req.body.durationUnit,
        "termType": req.body.termType,
        "noOfTerms": req.body.noOfTerms
    };

    model.create(course).then((data) => {
        if (data.error) {
            onError(req, res, data.error, 500);
        } else {
            req.app.responseHelper.send(res, true, data.course, [], 200);
        }
    }).catch((error) => {
        onError([], 500);
    });
});

router.get("/list", (req, res) => {
    var offset = req.body.offset === undefined ? 0 : req.query.offset;
    var limit = req.query.limit === undefined ? 0 : req.query.limit;
    var instituteId = req.body.instituteId;
    var departmentId = req.body.departmentId;

    var obj = {
        offset: offset,
        limit: limit,
        instituteId: instituteId,
        departmentId: departmentId
    }

    model.getList(obj).then((data) => {
        console.log('data: ' + JSON.stringify(data));
        if (data.error) {
            onError([], 500);
        } else {
            req.app.responseHelper.send(res, true, data.courses, [], 200);
        }
    });
});

router.get("/:id", (req, res) => {

    var id = req.params.id;

    model.findById(id).then((data) => {
        if (data.error) {
            var errors = [{
                "msg": "Failed to get Course!"
            }];
            onError(req, res, errors, 500);
        } else {
            var response = data.course;
            req.app.responseHelper.send(res, true, response, [], 200);
        }
    });
});

router.put("/:id", (req, res) => {

    var errors = validator.course(req);

    if (errors && errors.length) {
        onError(req, res, errors, 400);
        return false;
    }

    var id = req.params.id;

    model.findById(id).then((data) => {
        if (data.error) {
            var errors = [{
                "msg": "Failed to get Course!"
            }];

            onError(req, res, errors, 500);
        } else {
            var course = data.course;
            course.departmentId = req.body.departmentId;
            course.courseType = req.body.courseType;
            course.courseName = req.body.courseName;
            course.specialization = req.body.specialization;
            course.certificateGenerate = req.body.certificateGenerate;
            course.certificatePrint = req.body.certificatePrint;
            course.gpaCalculated = req.body.gpaCalculated;
            course.subjectCredits = req.body.subjectCredits;
            course.courseDuration = req.body.courseDuration;
            course.durationUnit = req.body.durationUnit;
            course.termType = req.body.termType;
            course.noOfTerms = req.body.noOfTerms;

            model.update(course).then((result) => {
                if (result.error) {
                    var errors = [{
                        "msg": "Failed to update Course!"
                    }];

                    onError(req, res, errors, 500);
                } else {
                    var course = result.course;

                    req.app.responseHelper.send(res, true, course, [], 200);
                }
            });
        }
    });
});

router.put("/:id/changeStatus", (req, res) => {
    var id = req.params.id;

    model.findById(id).then((data) => {
        if (data.error) {
            var errors = [{
                "msg": "Failed to get Course!"
            }];

            onError(req, res, errors, 500);
        } else {
            var course = data.course;
            course.isActive = req.body.isActive;
            model.update(course).then((data) => {
                if (data.error) {
                    var errors = [{
                        "msg": "Failed to update Course!"
                    }];

                    onError(req, res, errors, 500);
                } else {
                    var course = data.course;
                    req.app.responseHelper.send(res, true, course, [], 200);
                }
            });
        }
    });
});

module.exports = router;
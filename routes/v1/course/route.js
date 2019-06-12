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
    var errors = validator.create(req);

    if (errors && errors.length) {
        onError(req, res, errors, 400);
        return false;
    }

    var course = {
        instituteId: req.body.instituteId,
        departmentId: req.body.departmentId,
        type: req.body.type,
        code: req.body.code,
        name: req.body.name,
        specialization: req.body.specialization,
        certificateGenerate: req.body.certificateGenerate,
        certificatePrint: req.body.certificatePrint,
        gpaCalculated: req.body.gpaCalculated,
        subjectCredits: req.body.subjectCredits,
        duration: req.body.duration,
        durationUnit: req.body.durationUnit,
        termType: req.body.termType,
        noOfTerms: req.body.noOfTerms
    };

    var findObj = {
        departmentId: course.departmentId,
        code: course.code
    }

    var checkDuplicate = (findObj) => {
        model.findByCode(findObj).then((result) => {
            if(result.isError || result.courses.length) {
                onError(req, res, result.errors, 500);
            } else {
                addCourse(course);
            }
        })
    };

    var addCourse = (course) => {
        model.create(course).then((result) => {
            if(result.isError || !(result.course && result.course._id) ) {
                onError(req, res, [], 500);
            } else {
                req.app.responseHelper.send(res, true, result.course, [], 200);
            }
        }).catch((err) => {
            onError([], 500);
        });
    };

    checkDuplicate(findObj);
});

router.get("/list", (req, res) => {
    var skip = req.body.skip === undefined ? 0 : req.query.skip;
    var limit = req.query.limit === undefined ? 10 : req.query.limit;
    var instituteId = req.query.instituteId;
    var departmentId = req.query.departmentId;

    var obj = {
        skip: skip,
        limit: limit,
        instituteId: instituteId,
        departmentId: departmentId
    }

    model.list(obj).then((result) => {
        console.log(" abc",result);
        if(result.isError || !(result.courses && result.courses.length)) {
			onError(req, res, [], 500);
		} else {
			req.app.responseHelper.send(res, true, result.courses, [], 200);
		}
    });
});

router.get("/affiliateCourses", (req, res) => {
    var data = {
        instituteId: req.query.instituteId,
        departmentId: req.query.departmentId,
        affiliateId: req.query.affiliateId
    };

    model.getAffiliateCourses(data).then((result) => {
        if(result.isError || !(result.courses && result.courses.length)) {
			onError(req, res, [], 500);
		} else {
			req.app.responseHelper.send(res, true, result.courses, [], 200);
		}
    });
});

router.get("/:id", (req, res) => {

    var id = req.params.id;

    model.findById(id).then((result) => {
        if (result.isError) {
            var errors = result.errors;
			onError(req, res, errors, 500);
        } else {
            var course = result.course;
            req.app.responseHelper.send(res, true, course, [], 200);
        }
    });
});

router.put("/:id", (req, res) => {

    var errors = validator.update(req);

    if (errors && errors.length) {
        onError(req, res, errors, 400);
        return false;
    }

    var id = req.params.id;

    model.findById(id).then((result) => {
        if (result.isError) {
            onError(req, res, result.errors, 500);
        } else {
            var course = result.course;
            course.name = req.body.name;
            course.specialization = req.body.specialization;
            course.certificateGenerate = req.body.certificateGenerate;
            course.certificatePrint = req.body.certificatePrint;
            course.gpaCalculated = req.body.gpaCalculated;
            course.subjectCredits = req.body.subjectCredits;
            course.duration = req.body.duration;
            course.durationUnit = req.body.durationUnit;
            course.termType = req.body.termType;
            course.noOfTerms = req.body.noOfTerms;

            model.update(course).then((result) => {
                if (result.isError) {
                    onError(req, res, result.errors, 500);
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

    model.findById(id).then((result) => {
        if (result.isError) {
            var errors = result.errors;
			onError(req, res, errors, 500);
        } else {
            var course = result.course;
            course.isActive = req.body.isActive;
            model.update(course).then((result) => {
                if (result.isError) {
                    onError(req, res, result.errors, 500);
                } else {
                    var course = result.course;
                    req.app.responseHelper.send(res, true, course, [], 200);
                }
            });
        }
    });
});

router.post("/link/affiliates", (req, res) => {
    var courses = req.body.courses;
    var affiliateId = req.body.affiliateId;
    
    model.linkAffiliates(courses, affiliateId).then((result) => {
        if(result.isError) {
            onError(req, res, [], 500);
        } else {
            req.app.responseHelper.send(res, true, result.courses, [], 200);
        }
    });
});

router.put("/affiliate/:id/changeStatus", (req, res) => {
    var id = req.params.id;

    var course = {
        isActive: req.body.affiliateReferenceIsActive
    }

    model.affiliateCourseUpdate(id, course).then((result) => {
        if (result.isError) {
            onError(req, res, result.errors, 500);
        } else {
            var course = result.course;
            req.app.responseHelper.send(res, true, course, [], 200);
        }
    });
});

module.exports = router;
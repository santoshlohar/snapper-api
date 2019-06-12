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

router.post('/create', (req, res) => {
	var errors = validator.batch(req);

	if(errors && errors.length) {
		onError(req, res, errors, 400);
		return false;
	}
	
	var batch = {
		instituteId: req.body.instituteId,
		departmentId: req.body.departmentId,
		affiliateId: req.body.affiliateId,
		courseId: req.body.courseId,
		code: req.body.code,
		year: req.body.year,
		start: req.body.start,
		end: req.body.end,
		minCredits: req.body.minCredits,
		minCgpa: req.body.minCgpa,
		totalCgpa: req.body.totalCgpa,
		minScore: req.body.minScore,
		totalScore: req.body.totalScore,
	};

	var findObj = {
		instituteId: req.body.instituteId,
		departmentId: req.body.departmentId,
		affiliateId: req.body.affiliateId,
		code: req.body.code
	}

	var checkDuplicate = (findObj) => {
		model.findByCode(findObj).then((result) => {
            if(result.isError || (result.batches && result.batches.length)) {
                onError(req, res, result.errors, 500);
            } else {
                addBatch();
            }
        });
	};

	var addBatch = () => {
		model.create(batch).then((result) => {
			if(result.isError  || !(result.batch && result.batch._id)) {
				onError(req, res, result.errors, 500);
			} else {
				var batch = result.batch;
				req.app.responseHelper.send(res, true, batch, [], 200);
			}
		})
    };

	checkDuplicate(findObj);

});

router.put('/:id', (req, res) => {
	var errors = validator.batch(req);

	if(errors && errors.length) {
		onError(req, res, errors, 400);
		return false;
	}

	var id = req.params.id;

	var batch = {
		instituteId: req.body.instituteId,
		departmentId: req.body.departmentId,
		affiliateId: req.body.affiliateId,
		courseId: req.body.courseId,
		code: req.body.code,
		year: req.body.year,
		start: req.body.start,
		end: req.body.end,
		minCredits: req.body.minCredits,
		minCgpa: req.body.minCgpa,
		totalCgpa: req.body.totalCgpa,
		minScore: req.body.minScore,
		totalScore: req.body.totalScore
	}

	model.update(id, batch).then((result) => {
		if(result.isError  || !(result.batch && result.batch._id)) {
			onError(req, res, result.errors, 500);
		} else {
			var batch = result.batch;
			req.app.responseHelper.send(res, true, batch, [], 200);
		}
	});
	
});

router.delete("/delete", (req, res) => {
	var batchIds = req.body.batchIds;
	model.deleteMany(batchIds).then((result) => {
		if(result.isError) {
			onError(req, res, result.errors, 500);
		} else {
			var batches = result.batches;
			req.app.responseHelper.send(res, true, batches, [], 200);
		}
	});
});

router.get('/list', (req, res) => {

	var skip = req.query.skip === undefined ? 0 : req.query.skip;
	var limit = req.query.limit === undefined ? 0 : req.query.limit;
	var obj = {
		affiliateId: req.query.affiliateId,
		skip: skip,
		limit: limit
	};
	
	model.list(obj).then((result) => {
		if(result.isError && !(result.batches)) {
			onError(req, res, result.errors, 500);
		} else {
			req.app.responseHelper.send(res, true, {batches: result.batches}, [], 200);
		}
	});
});

router.get('/:id', (req, res) => {

	var id = req.params.id;

	model.findById(id).then((result) => {
        if(result.isError) {
			onError(req, res, result.errors, 500);
		} else {
			var batch = result.batch;
			req.app.responseHelper.send(res, true, batch, [], 200);
		}
    })
});

router.put("/:id/changeStatus", (req, res) => {
	var id = req.params.id;
	
	var batch = {
		isDeleted: req.body.isDeleted
	}
	
	model.update(id, batch).then((result) => {
		if(result.isError  || !(result.batch && result.batch._id)) {
			onError(req, res, result.errors, 500);
		} else {
			var batch = result.batch;
			req.app.responseHelper.send(res, true, batch, [], 200);
		}
	});
});

module.exports = router;
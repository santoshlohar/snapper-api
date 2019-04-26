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

//create affiliate
router.post("/create", (req, res) => {

	var errors = validator.affiliate(req);

	if(errors && errors.length) {
		onError(req, res, errors, 400);
		return false;
    }

	var affiliate = {
		name: req.body.name,
		instituteId: req.body.instituteId,
		departmentId: req.body.departmentId,
		address: req.body.address
	};

	model.create(affiliate).then((result) => {
		if(result.isError || !(result.affiliate && result.affiliate._id) ) {
            onError(req, res, [], 500);
        } else {
            req.app.responseHelper.send(res, true, result.affiliate, [], 200);
        }
	}).catch((err) => {
		onError([], 500);
	});
});

// List affiliate
router.get("/list", (req, res) => {
	var skip = req.query.skip === undefined ? 0 : req.query.skip;
	var limit = req.query.limit === undefined ? 0 : req.query.limit;
	var instituteId = req.query.instituteId;

	var obj = {
		skip: skip,
		limit: limit,
		instituteId: instituteId
	}

	model.getList(obj).then((result) => {
		if(result.isError || !(result.affiliates)) {
			onError([], 500);
		} else {
			req.app.responseHelper.send(res, true, result.affiliates, [], 200);
		}
	});
});
// Get affiliate
router.get("/:id", (req, res) => {
	
	var id = req.params.id;

	model.findById(id).then((data) => {
		if(data.error) {
			var errors = [{
				"msg": "Failed to get Affiliated Institute!"
			}];
			onError(req, res, errors, 500);
		} else {
			var affiliate = data.affiliate;
			req.app.responseHelper.send(res, true, affiliate, [], 200);
		}
	});
});

// Active/Inactive affiliate
router.put("/:id/changeStatus", (req, res) => {
    
});

// Update affiliate
router.put("/:id", (req, res) => {
    
});

// Delete affiliate
router.delete("/:id/delete", (req, res) => {

});


module.exports = router;
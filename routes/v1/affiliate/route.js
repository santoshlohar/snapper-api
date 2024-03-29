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
		address: req.body.address,
		code: req.body.code
	};

	var findObj = {
		instituteId: affiliate.instituteId,
		departmentId: affiliate.departmentId,
		code: affiliate.code		
	};
	
	var checkDuplicate = (findObj) => {
		model.findByCode(findObj).then((result) => {
            if(result.isError || (result.affiliates && result.affiliates.length)) {
                onError(req, res, result.errors, 500);
            } else {
                addAffiliate(affiliate);
            }
        });
	};

	var addAffiliate = (affiliate) => {
		model.create(affiliate).then((result) => {
			if(result.isError || !(result.affiliate && result.affiliate._id) ) {
				onError(req, res, [], 500);
			} else {
				req.app.responseHelper.send(res, true, result.affiliate, [], 200);
			}
		});
    };

	checkDuplicate(findObj);
});

// List affiliate
router.get("/list", (req, res) => {
	var skip = req.query.skip === undefined ? 0 : req.query.skip;
	var limit = req.query.limit === undefined ? 0 : req.query.limit;
	var instituteId = req.query.instituteId;
	var departmentId = req.query.departmentId;

	var obj = {
		skip: skip,
		limit: limit,
		instituteId: instituteId,
		departmentId: departmentId
	};

	model.list(obj).then((result) => {
		if(result.isError || !(result.affiliates)) {
			console.log("error" , result.errors);
			onError(req, res, result.errors, 500);
		} else {
			req.app.responseHelper.send(res, true, result.affiliates, [], 200);
		}
	});
});
// Get affiliate
router.get("/:id", (req, res) => {
	
	var id = req.params.id;

	model.findById(id).then((result) => {
		if(result.isError) {
			var errors = result.errors;
			onError(req, res, errors, 500);
		} else {
			var affiliate = result.affiliate;
			req.app.responseHelper.send(res, true, affiliate, [], 200);
		}
	});
});

// Active/Inactive affiliate
router.put("/:id/changeStatus", (req, res) => {
    var id = req.params.id;
	
	model.findById(id).then((result) => {
		if(result.isError) {
			onError(req, res, result.errors, 500);
		} else {
			var affiliate = result.affiliate;
			affiliate.isActive = req.body.isActive;
			model.update(affiliate).then((result) => {
				if(result.isError) {
					onError(req, res, result.errors, 500);
				} else {
					var affiliate = result.affiliate;
					req.app.responseHelper.send(res, true, affiliate, [], 200);
				}
			});
		}
	});
});

// Update affiliate
router.put("/:id", (req, res) => {
    
	var errors = validator.affiliate(req);

	if(errors && errors.length) {
		onError(req, res, errors, 400);
		return false;
    }
	
	var id = req.params.id;

	model.findById(id).then((result) => {
		if(result.isError) {
			onError(req, res, result.errors, 500);
		} else {
			var affiliate = data.affiliate;
			affiliate.name = req.body.name;
			affiliate.departmentId = req.body.departmentId;
			affiliate.address = req.body.address;
			affiliate.code = req.body.code;
			
			model.update(affiliate).then((result) => {
				if(result.isError) {
					onError(req, res, result.errors, 500);
				} else {
					var affiliate = result.affiliate;
					req.app.responseHelper.send(res, true, affiliate, [], 200);
				}
			});
		}
	});
});

// Delete affiliate
router.delete("/:id/delete", (req, res) => {

});


module.exports = router;
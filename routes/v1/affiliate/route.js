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

// Get affiliate
router.get("/:id", (req, res) => {

});

// List affiliate
router.get("/list", (req, res) => {

});

//create affiliate
router.post("/create", (req, res) => {

	var errors = validator.affiliate(req);

	if(errors && errors.length) {
        onError(req, res, errors, 400);
    }

	var affiliate = {
		name: req.body.name,
		instituteId: req.body.instituteId,
		departmentId: req.body.departmentId,
		address: req.body.address,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted
	};

	model.create(affiliate).then((data) => {
		if(data.error) {
			onError([], 500);
		} else {
			req.app.responseHelper.send(res, true, data.affiliate, [], 200);
		}
	}).catch((err) => {
		onError([], 500);
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
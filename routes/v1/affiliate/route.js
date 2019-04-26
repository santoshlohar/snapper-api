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
	console.log("affiliate")
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
		console.log(result)
		if(result.isError || !(result.affiliate && result.affiliate._id) ) {
            onError(req, res, [], 500);
        } else {
            req.app.responseHelper.send(res, true, result.affiliate, [], 200);
        }
	}).catch((err) => {
		console.log(err)
		onError([], 500);
	});
});

// List affiliate
router.get("/list", (req, res) => {

});

// Get affiliate
router.get("/:id", (req, res) => {

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
var express = require('express');
var router = express.Router();
var model = require('./model');
var validator = require('./validator');

var onError = (req, res, errors, statusCode) => {
    if (!(Array.isArray(errors) && errors.length)) {
        errors = [{
            "msg": "Something went wrong!"
        }];
    }
    req.app.responseHelper.send(res, false, {}, errors, statusCode);
};

// List department
router.get("/list", (req, res) => {
    var errors = validator.list(req);

    if (errors && errors.length) {
        onError(req, res, errors, 400);
        return true;
    }

    var data = {
        instituteId: req.query.instituteId,
        skip: req.query.skip,
        limit: req.query.limit
    };

    model.list(data).then((result) => {
        if (result.isError) {
            onError(req, res, [], 500);
        } else {
            req.app.responseHelper.send(res, true, result.departments, [], 200);
        }
    })

});

//create department
router.post("/create", (req, res) => {

    var errors = validator.create(req);

    if (errors && errors.length) {
        onError(req, res, errors, 400);
        return true;
    }

    var data = req.body;

    model.create(data).then((result) => {
        if(result.isError || !(result.department && result.department._id) ) {
            onError(req, res, [], 500);
        } else {
            req.app.responseHelper.send(res, true, result.department, [], 200);
        }
    });


});

// Get department
router.get("/:id", (req, res) => {
    console.log("---- c ");
});

// Update deparment
router.put("/:id", (req, res) => {
    
});

// Active/Inactive department
router.put("/:id/changeStatus", (req, res) => {
    
});

// Delete deparment
router.delete("/:id/delete", (req, res) => {

});


module.exports = router;
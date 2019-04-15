var express = require('express');
var router = express.Router();
var schema = require('./schema');
var departmentModel = require('./model');
var validator = require('./validator');
var { ObjectId } = require('mongodb');

// Get department
router.get("/:id", (req, res) => {

});

// List department
router.get("/list", (req, res) => {

    departmentModel.findDeptByInstituteID().then((data) => {
        console.log(data);

        res.send();
    });

});

//create department
router.post("/create", (req, res) => {


    var errors = validator.department(req);

    var onError = (errors, statusCode) => {
        if (!(Array.isArray(errors) && errors.length)) {
            errors = [{

                "msg": "Failed to create Department. Please try again."
            }];
        }
        req.app.responseHelper.send(res, false, {}, errors, statusCode);

    };

    if (errors && errors.length) {

        onError(errors, 400);
        return true;
    }

    var createDepartment = (department) => {
        departmentModel.create(department).then((data) => {
            if (data.error) {
                onError([], 500);
            } else {
                req.app.responseHelper.send(res, true, department, [], 200);
            }
        }).catch((err) => {
            onError([], 500);
        });
    };

    var findDetails =
    {
        instituteId: req.body.instituteId,
        name: req.body.name
    };

    departmentModel.findDeptByInstituteID(findDetails).then((data) => {
        
        if (data.error == "0") {
            //res.send("Record Allready Available");
            onError([{"msg":"Department Allready Available for this Institute "}], 400);
        } else {
            console.log(data.error);
            var body = req.body;
            createDepartment(body);
        }
    });







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
var express = require('express');
var router = express.Router();
var schema = require('./schema');
var model = require('./model');
var validator = require('./validator');

// Get department
router.get("/:id", (req, res) => {

});

// List department
router.get("/list", (req, res) => {

});

//create department
router.post("/create", (req, res) => {

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
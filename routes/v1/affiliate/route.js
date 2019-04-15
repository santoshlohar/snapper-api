var express = require('express');
var router = express.Router();
var schema = require('./schema');
var model = require('./model');
var validator = require('./validator');

// Get affiliate
router.get("/:id", (req, res) => {

});

// List affiliate
router.get("/list", (req, res) => {

});

//create affiliate
router.post("/create", (req, res) => {

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
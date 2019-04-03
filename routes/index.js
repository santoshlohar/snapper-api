var express = require('express');
var router = express.Router();


router.use("/api/v1/user", require("../routes/v1/user/route"));

module.exports = router;

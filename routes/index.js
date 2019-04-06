var express = require('express');
var router = express.Router();

router.use("/api/v1/user", require("../routes/v1/user/route"));
router.use("/api/v1/institute", require("../routes/v1/institute/route"));

module.exports = router;

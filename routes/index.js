var express = require('express');
var router = express.Router();

router.use("/api/v1/user", require("../routes/v1/user/route"));
router.use("/api/v1/institute", require("../routes/v1/institute/route"));
router.use("/api/v1/department", require("../routes/v1/department/route"));
router.use("/api/v1/affiliate", require("../routes/v1/affiliate/route"));
router.use("/api/v1/course", require("../routes/v1/course/route"));
router.use("/api/v1/batch", require("../routes/v1/batch/route"));
router.use("/api/v1/student/draft", require("../routes/v1/student/draft/route"));
router.use("/api/v1/student", require("../routes/v1/student/route"));
router.use("/api/v1/certificate/draft", require("../routes/v1/certificate/draft/route"));
router.use("/api/v1/certificate", require("../routes/v1/certificate/route"));


module.exports = router;

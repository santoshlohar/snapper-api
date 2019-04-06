var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res) {
    res.json({abc: 1234});
});

module.exports = router;

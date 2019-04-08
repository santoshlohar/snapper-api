var express = require('express');
var router = express.Router();

router.get('/:id', function(req, res) {

    req.checkQuery("id", "Not Integer").toInt();
    req.checkQuery("limit", "Limit cannot be blank").exists();
    req.checkQuery("offset", "Offset cannot be blank").exists();

    var promise = req.getValidationResult();

    promise.then(function(result) {
        if (!result.isEmpty()) {
            var errors = result.array();
            res.json({id: req.params.id, error: errors});
        } else {
            var data = {id: req.params.id, error: false, msg: 1234};
            req.app.responseHelper.send(res, true, data, [], 200);
        }
    });
});

router.post("/", (req, res) => {
    
});


module.exports = router;
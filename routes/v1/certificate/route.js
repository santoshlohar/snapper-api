var express = require('express');
var router = express.Router();
var model = require('./model');
var validator = require('./validator');
var path = require('path');
var assert = require('assert');
var multer = require('multer');
var bodyParser = require('body-parser');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs');

// -> Multer Upload Storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname)
    }
});

const upload = multer({ storage: storage });

router.post('/uploadfile', upload.single("uploadfile"), (req, res) => {
    var filepath = './uploads/' + req.file.filename;
    const excelData = excelToJson({
        sourceFile: filepath,
        sheets: [{
            // Excel Sheet Name
            name: 'Customers',
            // Header Row -> be skipped and will not be present at our result object.
            header: {
                rows: 1
            },
            // Mapping columns to keys
            columnToKey: {
                A: 'instituteno',
                B: 'name',
                C: 'address',
                D: 'age'
            }
        }]
    });
    fs.unlinkSync(filepath);
    var data = excelData;

    model.create(data.Customers).then((result) => {
        if (result.isError || !(result.department && result.department._id)) {
            onError(req, res, [], 500);
        } else {
            req.app.responseHelper.send(res, true, result.department, [], 200);
        }
    });
});

module.exports = router;
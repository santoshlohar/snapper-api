var express = require('express');
var router = express.Router();
var model = require('./model');
var validator = require('./validator');
var fs = require('fs');
var multer = require('multer');
var studentModel = require('./../model');

var excelToJson = require('convert-excel-to-json');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
    }
});

var upload = multer({ //multer settings
    storage: storage
    // fileFilter : function(req, file, callback) { //file filter
    //     if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length-1]) === -1) {
    //         return callback(new Error('Wrong extension type'));
    //     }
    //     callback(null, true);
    // }
}).single('file');

var onError = (req, res, errors, statusCode) => {
    if (!(Array.isArray(errors) && errors.length)) {
        errors = [{
            "msg": "Something went wrong!"
        }];
    }
    req.app.responseHelper.send(res, false, {}, errors, statusCode);
};

var isAffiliateDataManager = (req, res, next) => {

    var user = req.user;
    var affiliateId = 0;
    
    if((req.method === 'POST' || req.method === 'PUT') && req.body && req.body.affiliateId) {
        affiliateId = req.body.affiliateId;
    } else if(req.method == 'GET' && req.query && req.query.affiliateId) {
        affiliateId = req.query.affiliateId;
    }

    if(user.entity === 'affiliate' && user.role === 'manager') {

        if(affiliateId && user.reference && (affiliateId !== user.reference.affiliateId)) {
            onError(req, res, [{msg: "You are not authorized to perform this action"}], 403);
        } else {
            next();
        }
        
    } else {
        onError(req, res, [{msg: "You are not authorized to perform this action"}], 403);
    }
    
};


router.post('/upload', isAffiliateDataManager, (req, res) => {
    upload(req, res,function(err) {
        if(err){
            onError(req, res, [], 500);
            return;
        }
        if(!req.file){
            var errors = [{
                'msg': "No file passed"
            }];
            onError(req, res, errors, 500);
            return;
        }       

        var filepath = './uploads/' + req.file.filename;
        const excelData = excelToJson({
            sourceFile: filepath,
            columnToKey: {
                A: 'code',
                B: 'name',
                C: 'father',
                D: 'dob',
                E: 'aadhar',
                F: 'email',
                G: 'phoneNumber'
            }
        });

        var records = excelData.Sheet1;
        var students = validator.buildData(req, records);
        
        model.insertMany(students).then((result) => {
            if(result.isError  || !(result.students)) {
                onError(req, res, result.errors, 500);
            } else {
                var students = result.students;
                req.app.responseHelper.send(res, true, students, [], 200);
            }
        });
        
    })
});

router.get('/list', isAffiliateDataManager, (req, res) => {
    var skip = req.query.skip === undefined ? 0 : req.query.skip;
	var limit = req.query.limit === undefined ? 10 : req.query.limit;
	var obj = {
        affiliateId: req.query.affiliateId,
        batchId: req.query.batchId,
        status: "new",
        skip: skip,
        limit: limit
    };
    
    model.list(obj).then((result) => {
		if(result.isError && !(result.drafts)) {
			onError(req, res, result.errors, 500);
		} else {
			req.app.responseHelper.send(res, true, {drafts: result.drafts}, [], 200);
		}
	});
});

router.post('/delete', isAffiliateDataManager, (req, res) => {
    var draftIds = req.body.draftIds;
    var affiliateId = req.body.affiliateId;
    
    var deleteDrafts = (ids) => {
        model.deleteMany(ids).then((result) => {
            if(result.isError) {
                onError(req, res, result.errors, 500);
            } else {
                req.app.responseHelper.send(res, true, [], [], 200);
            }
        });
    };

    model.findDraftByIds(draftIds, affiliateId).then((result) => {
        if(result.isError || !result.drafts.length) {
            onError(req, res, result.errors, 500);
        } else if(result.drafts.length == draftIds.length) {
            deleteDrafts(draftIds);
        }
    });

});

router.put('/process', isAffiliateDataManager, (req, res) => {

    var data = validator.process(req);

    var addStudents = (students) => {
        studentModel.insertMany(students).then((result) => {
            if(result.isError && !(result.students)) {
                updateDrafts(data.draftIds, 'new');
            } else {
                req.app.responseHelper.send(res, true, {students: result.students}, [], 200);
            }
        });
    };

    var updateDrafts = (ids, status) => {
        model.changeStatus(ids, status).then((result) => {
            if(result.isError) {
                onError(req, res, result.errors, 500);
            } else {
                if(status == 'processed') {
                    addStudents(data.students);
                } else {
                    onError(req, res, [{msg: "Failed to update drafts"}], 500);
                }
            }
        });
    };

    var findDraftByIds = (draftIds, affiliateId) => {
        model.findDraftByIds(draftIds, affiliateId).then((result) => {
            if(result.isError || !result.drafts.length) {
                onError(req, res, result.errors, 500);
            } else if(result.drafts.length == draftIds.length) {
                updateDrafts(draftIds, 'processed');
            }
        });
    };

    if (data.students.length && data.draftIds.length) {
        findDraftByIds(data.draftIds, data.affiliateId);
    } else if (data.isAffiliateCheckFailed) {
        onError(req, res, [{msg: "You are not authorized to perform this action"}], 403);
    } else if(data.isDataInvalid) {
        onError(req, res, [{msg: "There is error in data. Please correct and try again."}], 500);
    } else {
        onError(req, res, [{msg: "Failed to update drafts"}], 500);
    }

});

router.put('/:id', isAffiliateDataManager, (req, res) => {
    var inputDraft = validator.updateDraft(req);

    var updateDraft = (id, draft) => {
        model.update(id, draft).then((result) => {
            if(result.isError  || !(result.draft && result.draft._id)) {
                onError(req, res, result.errors, 500);
            } else {
                req.app.responseHelper.send(res, true, result.draft, [], 200);
            }
        })
    };

    var findDraftById = (draftId) => {
        model.findById(draftId).then((result) => {
            if(result.isError || !(result.draft && result.draft._id)) {
                onError(req, res, result.errors, 500);
            } else {
                var draft = result.draft;
                if((draft.instituteId == inputDraft.instituteId) && (draft.batchId == inputDraft.batchId) && (draft.affiliateId == inputDraft.affiliateId)) {
                    draft.code = inputDraft.code;
                    draft.name = inputDraft.name;
                    draft.father = inputDraft.father;
                    draft.aadhar = inputDraft.aadhar;
                    draft.email = inputDraft.email;
                    draft.phoneNumber = inputDraft.phoneNumber;
                    updateDraft(draftId, draft);
                } else {
                    onError(req, res, [{param: "id", msg: "Invalid draft id"}], 500);
                }
            }
        })
    };

    var id = req.params.id;
    var draftId = inputDraft._id;

    if(id === draftId) {
        findDraftById(draftId);
    } else {
        onError(req, res, [{param: "id", msg: "Invalid draft id"}], 500);
    }

    
});

module.exports = router;
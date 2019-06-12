var express = require('express');
var router = express.Router();
var model = require('./model');
var validator = require('./validator');
var fs = require('fs');
var multer = require('multer');
var certificateModel = require('./../model');
var studentModel = require('./../../student/model');
var batchModel = require("./../../batch/model");

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
}).single('file');

var onError = (req, res, errors, statusCode) => {
    if (!(Array.isArray(errors) && errors.length)) {
        errors = [{
            "msg": "Something went wrong!"
        }];
    }
    req.app.responseHelper.send(res, false, {}, errors, statusCode);
};

var isInstituteDataManager = (req, res, next) => {
    var user = req.user;
    var instituteId = 0;
    var departmentId = 0;

    if((req.method === 'POST' || req.method === 'PUT') && req.body && req.body.instituteId &&
    req.body.departmentId) {
        instituteId = req.body.instituteId;
        departmentId = req.body.departmentId;
    } else if(req.method == 'GET' && req.query && req.query.instituteId &&
    req.body.departmentId) {
        instituteId = req.query.instituteId;
        departmentId = req.body.departmentId;
    }

    if(user.entity === 'institute' && user.role === 'manager') {

        if(instituteId && departmentId && user.reference && (instituteId !== user.reference.instituteId)
        && (departmentId !== user.reference.departmentId)) {
            console.log(instituteId);
            console.log(user.reference.instituteId);

            onError(req, res, [{msg: "You are not authorized to perform this action"}], 403);
        } else {
            next();
        }
        
    } else {
        onError(req, res, [{msg: "You are not authorized to perform this action"}], 403);
    }
};

router.post('/upload', isInstituteDataManager, (req, res) => {

    var records = [];


    var add = () => {
        var certificates = validator.buildData(req, records);
        model.insertMany(certificates).then((result) => {
            if(result.isError  || !(result.certificates)) {
                onError(req, res, result.errors, 500);
            } else {
                var certificates = result.certificates;
                req.app.responseHelper.send(res, true, certificates, [], 200);
            }
        });
    };


    var findBatchById = (id) => {
        batchModel.findById(id).then((result) => {
            if(result.isError || !(result && result.batch && result.batch._id)) {
                onError(req, res, result.errors, 500);
            } else {
                req.body.courseId = result.batch.courseId;
                add();
            }
        });
    };

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
                A: 'studentId',
                B: 'specialization',
                C: 'scoreEarned',
                D: 'totalScore',
                E: 'cgpa',
                F: 'creditsEarned',
                G: 'completionDate'
            }
        });

        records = excelData.Sheet1;

        var batchId = req.body.batchId;
        findBatchById(batchId);
    });
});

router.get('/list', isInstituteDataManager, (req, res) => {
    var skip = req.query.skip === undefined ? 0 : req.query.skip;
	var limit = req.query.limit === undefined ? 10 : req.query.limit;
	var obj = {
        instituteId: req.query.instituteId,
        affiliateId: req.query.affiliateId,
        batchId: req.query.batchId,
        status: "new"
    };
    
    model.list(obj).then((result) => {
		if(result.isError && !(result.drafts)) {
			onError(req, res, result.errors, 500);
		} else {
			req.app.responseHelper.send(res, true, {drafts: result.drafts}, [], 200);
		}
	});
});

router.post('/delete', isInstituteDataManager, (req, res) => {
    var draftIds = req.body.draftIds;
    var instituteId = req.body.instituteId;
    var affiliateId = req.body.affiliateId;
    var batchId = req.body.batchId;
    
    var deleteDrafts = (ids) => {
        model.deleteMany(ids).then((result) => {
            if(result.isError) {
                onError(req, res, result.errors, 500);
            } else {
                req.app.responseHelper.send(res, true, [], [], 200);
            }
        });
    };

    model.findDraftByIds(draftIds, batchId).then((result) => {
        if(result.isError || !result.drafts.length) {
            onError(req, res, result.errors, 500);
        } else if(result.drafts.length == draftIds.length) {
            deleteDrafts(draftIds);
        }
    });

});

router.put('/process', isInstituteDataManager, (req, res) => {

    var data = validator.process(req);

    var studentCodes = data.studentCodes;
    var hashIds = data.hashIds;
    var errorMessage = "Invalid Students or duplicate certificates found";

    var addCertificates = (certificates) => {
        certificateModel.insertMany(certificates).then((result) => {
            if(result.isError && !(result.certificates)) {
                updateDrafts(data.draftIds, 'new');
            } else {
                req.app.responseHelper.send(res, true, {certificates: result.certificates}, [], 200);
            }
        });
    };

    var checkDuplicateCertificates = () => {
        certificateModel.findByHashIds(hashIds, data.batchId).then((result) => {
            if(result.isError || (result.certificates && result.certificates.length)) {
                updateDrafts(data.draftIds, 'new');
            } else {
                addCertificates(data.certificates);
            }
        });
    };

    var findStudentsByCode = (codes) => {
        studentModel.findByCodes(codes, data.batchId).then((result) => {
            if(result.isError || !(result && result.students.length && result.students.length == codes.length)) {
                updateDrafts(data.draftIds, 'new');
            } else {
                checkDuplicateCertificates(data.students);
            }
        });
    };

    var updateDrafts = (ids, status) => {
        model.changeStatus(ids, status).then((result) => {
            if(result.isError) {
                onError(req, res, result.errors, 500);
            } else {
                if(status == 'processed') {
                    findStudentsByCode(studentCodes);
                } else {
                    onError(req, res, [{msg: errorMessage}], 500);
                }
            }
        });
    }

    var findDraftByIds = (draftIds, departmentId) => {
        model.findDraftByIds(draftIds, departmentId).then((result) => {
            if(result.isError || !result.drafts.length) {
                onError(req, res, result.errors, 500);
            } else if(result.drafts.length == draftIds.length) {
                updateDrafts(draftIds, 'processed');            
            }
        });
    };

    if (data.certificates.length && data.draftIds.length) {
        findDraftByIds(data.draftIds, data.departmentId);
    } else if (data.isInstituteCheckFailed) {
        onError(req, res, [{msg: "You are not authorized to perform this action"}], 403);
    } else if(data.isDataInvalid) {
        onError(req, res, [{msg: "There is error in data. Please correct and try again."}], 500);
    } else {
        onError(req, res, [{msg: "Failed to update drafts"}], 500);
    }
});

router.put('/:id', isInstituteDataManager, (req, res) => {
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
                console.log(draft);
                if((draft.instiuteId == inputDraft.instiuteId) && (draft.affiliateId == inputDraft.affiliateId) 
                && (draft.departmentId == inputDraft.departmentId) && (draft.batchId == inputDraft.batchId) ) {
                    draft.studentId = inputDraft.studentId;
                    draft.certificateId = inputDraft.certificateId;
                    draft.specialization = inputDraft.specialization;
                    draft.scoreEarned = inputDraft.scoreEarned;
                    draft.totalScore = inputDraft.totalScore;
                    draft.cgpa = inputDraft.cgpa;
                    draft.creditsEarned = inputDraft.creditsEarned;
                    draft.completionDate = inputDraft.completionDate;
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
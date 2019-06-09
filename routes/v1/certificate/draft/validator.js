var validator = require('validator');
var moment = require('moment');
var bcrypt = require('bcrypt');

var isValidDate = (date) => {
    var d = moment(date, 'DD-MM-YYYY').isValid();
    return (d = true) ? true : false;
};

var generateHash = (obj) => {

    var hash = "";
    hash += obj.instituteId + ":";
    hash += obj.departmentId + ":";
    hash += obj.affiliateId  + ":";
    hash += obj.batchId + ":";
    hash += obj.courseId + ":";
    hash += obj.studentId + ":";

    hash = bcrypt.hashSync(hash, 10);

    return hash;
};

var buildData = (req, records) => {
    var certificates = [];

    var instituteId = req.body.instituteId;
    var departmentId = req.body.departmentId;
    var affiliateId = req.body.affiliateId;
    var batchId = req.body.batchId;
    var courseId = req.body.courseId;

    for(var i=1; i < records.length; i++) {
        records[i].studentId = (records[i].studentId) ? records[i].studentId : "";
        records[i].specialization = (records[i].specialization) ? records[i].specialization : "";
        records[i].scoreEarned = (records[i].scoreEarned) ? records[i].scoreEarned.toString() : "";
        records[i].totalScore = (records[i].totalScore) ? records[i].totalScore.toString() : "";
        records[i].cgpa = (records[i].cgpa) ? records[i].cgpa.toString() : "";
        records[i].creditsEarned = (records[i].creditsEarned) ? records[i].creditsEarned.toString() : "";
        records[i].completionDate = (records[i].completionDate) ? records[i].completionDate : "";

        var certificate = {};

        certificate.instituteId = instituteId;
        certificate.departmentId = departmentId;
        certificate.affiliateId = affiliateId;
        certificate.batchId = batchId;
        certificate.courseId = courseId;
        certificate.studentId = { value: records[i].studentId, error: true };
        certificate.specialization = { value: records[i].specialization, error: true };
        certificate.scoreEarned = { value: records[i].scoreEarned, error: true };
        certificate.totalScore = { value: records[i].totalScore.toString(), error: true };
        certificate.cgpa = { value: records[i].cgpa.toString(), error: true };
        certificate.creditsEarned = { value: records[i].creditsEarned.toString(), error: true };
        certificate.completionDate = { value: records[i].completionDate, error: true };

        if(records[i].studentId && validator.isAlphanumeric(records[i].studentId)) {
            certificate.studentId.error = false;
        }

        if(records[i].specialization && validator.isAlpha(records[i].specialization)) {
            certificate.specialization.error = false;
        }

        if(records[i].scoreEarned && validator.isNumeric(records[i].scoreEarned)) {
            certificate.scoreEarned.error = false;
        }

        if(records[i].totalScore && validator.isNumeric(records[i].totalScore)) {
            certificate.totalScore.error = false;
        }

        if(records[i].cgpa && validator.isNumeric(records[i].cgpa)) {
            certificate.cgpa.error = false;
        }

        if(records[i].creditsEarned && validator.isNumeric(records[i].creditsEarned)) {
            certificate.creditsEarned.error = false;
        }

        if(records[i].completionDate && isValidDate(records[i].completionDate)) {
            certificate.completionDate.error = false;
        }

        certificates.push(certificate);
    }

    return certificates;
};

var updateDraft = (req) => {
    var draft = {};
    draft._id = req.body._id;
    draft.instituteId = req.body.instituteId;
    draft.affiliateId = req.body.affiliateId;
    draft.departmentId = req.body.departmentId;
    draft.batchId = req.body.batchId;
    draft.courseId = req.body.courseId;
    draft.studentId = {value : req.body.studentId.value, error: true };
    draft.specialization = {value : req.body.specialization.value, error: true };
    draft.scoreEarned = {value : req.body.scoreEarned.value, error: true };
    draft.totalScore = {value : req.body.totalScore.value, error: true };
    draft.cgpa = {value : req.body.cgpa.value, error: true };
    draft.creditsEarned = {value : req.body.creditsEarned.value, error: true };
    draft.completionDate = {value : req.body.completionDate.value, error: true };
    draft.status = req.body.status;

    if(draft.studentId.value && validator.isAlphanumeric(draft.studentId.value)) {
        draft.studentId.error = false;
    }


    if(draft.specialization.value && validator.isAlpha(draft.specialization.value)) {
        draft.specialization.error = false;
    }

    if(draft.scoreEarned.value && validator.isNumeric(draft.scoreEarned.value)) {
        draft.scoreEarned.error = false;
    }

    if(draft.totalScore.value && validator.isNumeric(draft.totalScore.value)) {
        draft.totalScore.error = false;
    }

    if(draft.cgpa.value && validator.isNumeric(draft.cgpa.value)) {
        draft.cgpa.error = false;
    }

    if(draft.creditsEarned.value && validator.isNumeric(draft.creditsEarned.value)) {
        draft.creditsEarned.error = false;
    }

    if(draft.completionDate.value && isValidDate(draft.completionDate.value)) {
        draft.completionDate.error = false;
    }

    return draft;

};

var process = (req) => {

    var user = req.user;

    var data = {
        certificates : [],
        hashIds: [],
        draftIds : [],
        studentCodes: [],
        isInstituteCheckFailed: false,
        instituteId: 0,
        departmentId: 0,
        affiliateId: 0,
        batchId: 0,
        courseId: 0,
        isDataInvalid: false
    };

    var userInstituteId = (user && user.reference && user.reference.instituteId) ? user.reference.instituteId : 0;
    var userDepartmentId = (user && user.reference && user.reference.departmentId && (user.reference.departmentId != '111111111111111111111111')) ? user.reference.departmentId : 0;
 
    var drafts = req.body.drafts;

    for(var i=0; i < drafts.length; i++) {
        var draft = drafts[i];
        if(draft.batchId && draft.affiliateId && draft.departmentId && draft.instituteId 
        && (draft.studentId.error === false) && (draft.specialization.error === false) && (draft.scoreEarned.error === false) 
        && (draft.totalScore.error === false) && (draft.cgpa.error === false) && (draft.creditsEarned.error === false)
        && (draft.completionDate.error === false)) {

            if(userInstituteId && userDepartmentId && (userInstituteId != draft.instituteId) && (userDepartmentId != draft.departmentId) ) {
                data.isInstituteCheckFailed = true;
                break;
            }

            if(!data.instituteId && !data.departmentId && !data.affiliateId && !data.batchId && !data.studentId) {
                data.instituteId = draft.instituteId;
                data.departmentId = draft.departmentId;
                data.affiliateId = draft.affiliateId;
                data.batchId = draft.batchId;
                data.courseId = draft.courseId;
            } else if(data.instituteId && (data.instituteId != draft.instituteId) && 
                        data.departmentId && (data.departmentId != draft.departmentId) &&
                        data.affiliateId && (data.affiliateId != draft.affiliateId) && 
                        data.batchId && (data.batchId != draft.batchId) && 
                        data.courseId && (data.courseId != draft.courseId)
                    ) {
                data.isInstituteCheckFailed = true;
                break;
            }  

            data.draftIds.push(draft._id);
            data.studentCodes.push(draft.studentId.value);

            var certificate = {};
            certificate.studentId = draft.studentId.value;
            certificate.certificateId = draft.certificateId;
            certificate.specialization = draft.specialization.value;
            certificate.scoreEarned = draft.scoreEarned.value;
            certificate.totalScore = draft.totalScore.value;
            certificate.cgpa = draft.cgpa.value;
            certificate.creditsEarned = draft.creditsEarned.value;
            certificate.completionDate = draft.completionDate.value;
            certificate.instituteId = draft.instituteId;
            certificate.departmentId = draft.departmentId;
            certificate.affiliateId = draft.affiliateId;
            certificate.batchId = draft.batchId;
            certificate.courseId = draft.courseId;

            var obj = {
                instituteId: draft.instituteId,
                departmentId: draft.departmentId,
                affiliateId: draft.affiliateId,
                batchId: draft.batchId,
                courseId: draft.courseId,
                studentId: draft.studentId
            };

            certificate.hash = generateHash(obj);
            data.hashIds.push(certificate.hash);

            data.certificates.push(certificate);


        } else {
            data.isDataInvalid = true;
            break;
        }
    }

    if(data.isInstituteCheckFailed && data.isDataInvalid) {
        data.draftIds = [];
        data.studentCodes = [];
        data.certificates = [];
        data.hashIds = [];
    }
    
    return data;
};

module.exports = {
    buildData,
    updateDraft,
    process
}
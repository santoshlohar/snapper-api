
var validator = require('validator');
var moment = require('moment');

var isValidDate = (date) => {
    var d = moment(date, 'DD-MM-YYYY').isValid();
    return (d = true) ? true : false;
};

var buildData = (req, records) => {
    var students = [];

    var batchId = req.body.batchId;
    var affiliateId = req.body.affiliateId;

    for(var i=1; i < records.length; i++) {
        records[i].code = (records[i].code) ? records[i].code : "";
        records[i].name = (records[i].name) ? records[i].name : "";
        records[i].father = (records[i].father) ? records[i].father : "";
        records[i].dob = (records[i].dob) ? records[i].dob : "";
        records[i].aadhar = (records[i].aadhar) ? records[i].aadhar.toString() : "";
        records[i].phoneNumber = (records[i].phoneNumber) ? records[i].phoneNumber.toString() : "";
        records[i].email = (records[i].email) ? records[i].email : "";

        var student = {};

        student.batchId = batchId;
        student.affiliateId = affiliateId;
        student.code = { value: records[i].code, error: true };
        student.name = { value: records[i].name, error: true };
        student.father = { value: records[i].father, error: true };
        student.dob = { value: records[i].dob, error: true };
        student.aadhar = { value: records[i].aadhar, error: true };
        student.phoneNumber = { value: records[i].phoneNumber, error: true };
        student.email = { value: records[i].email, error: true };
        
        if(records[i].code && validator.isAlphanumeric(records[i].code)) {
            student.code.error = false;
        }

        if(records[i].name && validator.isAlpha(records[i].name)) {
            student.name.error = false;
        }

        if(records[i].father && validator.isAlpha(records[i].father)) {
            student.father.error = false;
        }

        if(records[i].dob && isValidDate(records[i].dob)) {
            student.dob.error = false;
        }

        if(records[i].aadhar && validator.isNumeric(records[i].aadhar)) {
            student.aadhar.error = false;
        }

        if(records[i].email && validator.isEmail(records[i].email)) {
            student.email.error = false;
        }

        if(records[i].phoneNumber && validator.isMobilePhone(records[i].phoneNumber)) {
            student.phoneNumber.error = false;
        }
        

        students.push(student);
    }

    return students;
};

var process = (req) => {

    var user = req.user;
    var data = {
        students : [],
        draftIds : [],
        isAffiliateCheckFailed: false,
        affiliateId: 0,
        isDataInvalid: false
    };

    var userAffiliateId = (user && user.reference && user.reference.affiliateId) ? user.reference.affiliateId : 0;

    var drafts = req.body.drafts;

    for(var i = 0; i < drafts.length; i++) {
        var draft = drafts[i];
        if(draft.status === "new") {
            if (draft.batchId && draft.affiliateId && (draft.code.error === false) && (draft.name.error === false) && (draft.father.error === false)
            && (draft.dob.error === false) && (draft.aadhar.error === false) && (draft.phoneNumber.error === false)
            && (draft.email.error === false)) {

                if(userAffiliateId && (userAffiliateId != draft.affiliateId)) {
                    data.isAffiliateCheckFailed = true;
                    break;
                }

                if(!data.affiliateId) {
                    data.affiliateId = draft.affiliateId;
                } else if(data.affiliateId && (data.affiliateId != draft.affiliateId)) {
                    data.isAffiliateCheckFailed = true;
                    break;
                }  

                data.draftIds.push(draft._id);

                var student = {};
                student.code = draft.code.value;
                student.name = draft.name.value;
                student.father = draft.father.value;
                student.dob = draft.dob.value;
                student.aadhar = draft.aadhar.value;
                student.phoneNumber = draft.phoneNumber.value;
                student.email = draft.email.value;
                student.batchId = draft.batchId;
                student.affiliateId = draft.affiliateId;
                data.students.push(student);
            } else {
                data.isDataInvalid = true;
                break;
            }
        }
    }

    if(data.isAffiliateCheckFailed && data.isDataInvalid) {
        data.draftIds = [];
        data.students = [];
    }
    
    return data;
};

var updateDraft = (req) => {
    var draft = {};
    draft._id = req.body._id;
    draft.batchId = req.body.batchId;
    draft.affiliateId = req.body.affiliateId;
    draft.code = {value : req.body.code.value, error: true };
    draft.name = {value : req.body.name.value, error: true };
    draft.father = {value : req.body.father.value, error: true };
    draft.dob = {value : req.body.dob.value, error: true };
    draft.aadhar = {value : req.body.aadhar.value, error: true };
    draft.email = {value : req.body.email.value, error: true };
    draft.phoneNumber = {value : req.body.phoneNumber.value, error: true };
    draft.status = req.body.status;

    if(draft.code.value && validator.isAlphanumeric(draft.code.value)) {
        draft.code.error = false;
    }

    if(draft.name.value && validator.isAlpha(draft.name.value)) {
        draft.name.error = false;
    }

    if(draft.father.value && validator.isAlpha(draft.father.value)) {
        draft.father.error = false;
    }

    if(draft.dob.value && isValidDate(draft.dob.value)) {
        draft.dob.error = false;
    }

    if(draft.aadhar.value && validator.isNumeric(draft.aadhar.value)) {
        draft.aadhar.error = false;
    }

    if(draft.email.value && validator.isEmail(draft.email.value)) {
        draft.email.error = false;
    }

    if(draft.phoneNumber.value && validator.isMobilePhone(draft.phoneNumber.value)) {
        draft.phoneNumber.error = false;
    }

    return draft;
};

module.exports = {
    buildData,
    process,
    updateDraft
};

var moment = require('moment');

const types = [
    'Central University', 'State University', 'Deemed University', 
    'Private University', 'CBSE', 'ICSE', 'State Board', 
    'International Board', 'Private Institute'
];

const regulatoryBody = [
    'UGC', 'AICTE', 'DEC', 'ICAR', 'NCTE', 'NBA', 'BCI', 'MCI', 'NAAC'
];

var isValidDate = (date) => {
    var d = moment(date);
    return d.isValid() ? true : false;
};

var register = (req) => {
    
    try {
        
        req.checkBody("type", "Institute type cannot be blank").notEmpty();
        req.checkBody("type", "Institute type is not valid").isIn(types);
        req.checkBody('code').optional().matches(/^[a-zA-Z0-9]+$/gi);
        req.checkBody("name", "Institute name cannot be blank").notEmpty();
        req.checkBody("address.state", "State name cannot be blank").notEmpty();
        req.checkBody("address.city", "City name cannot be blank").notEmpty();
        req.checkBody('doe', "Date is not valid").optional().custom(isValidDate);
        req.checkBody('requlatory.body', "Regulatory Body is invalid").optional().isIn(regulatoryBody);

        req.checkBody('instituteAdmin.name', 'Intitute Admin is required').notEmpty();
        req.checkBody('instituteAdmin.email', 'Intitute Admin Email ID required').notEmpty();
        req.checkBody('instituteAdmin.email', 'Intitute Admin Email is invalid').isEmail().normalizeEmail();
        req.checkBody('instituteAdmin.phone', 'Please Enter valid Institute Admin Phone No').isMobilePhone('en-IN');
        // TODO Need to validate phone number
        //Phone No, Email and URL Validation Completed....

        req.checkBody('head.email', 'Intitute Head Email is invalid').isEmail().normalizeEmail();
        req.checkBody('head.phoneNumber', 'Please Enter a Valid Head Contact No').optional().isMobilePhone('en-IN');
        req.checkBody('boardLineNumber', 'Please Enter Valid Board Line No').optional().isNumeric();
        req.checkBody('website', 'Please Enter Valid web site').optional().isURL();

        var errors = req.validationErrors();
        
    } catch(e) {
        var errors = [{msg: "Something went wrong!"}];
    }

    return errors;
};



module.exports = {
    register
}
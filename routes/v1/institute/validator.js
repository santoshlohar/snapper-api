
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
    var d = moment(date, 'DD-MM-YYYY').isValid();
    return (d = true) ? true : false;
};

var register = (req) => {

    try {

        // Institute Admin validato
        req.checkBody("instituteAdmin.name", "instituteAdmin name cannot be blank").notEmpty();
        req.checkBody("instituteAdmin.email", "instituteAdmin email cannot be blank").isEmail().normalizeEmail();
        req.checkBody('instituteAdmin.phoneNumber', 'instituteAdmin Phone Number is required').notEmpty();

        //Requester Details
        req.checkBody("requester.name", "Requester name cannot be blank").notEmpty();
        req.checkBody("requester.email", "Requester emailID cannot be blank").isEmail().normalizeEmail();
        req.checkBody('requester.phoneNumber', 'Requester Phone Number is required').notEmpty();

        //Insititute Details
        req.checkBody("type", "Institute type cannot be blank").notEmpty();
        req.checkBody("type", "Institute type is not valid").isIn(types);
        req.checkBody("name", "Institute name cannot be blank").notEmpty();
        req.checkBody("doe", "Date is not valid").notEmpty().custom(isValidDate); 
        //address
        var errors = req.validationErrors();

    } catch (e) {
        var errors = [{ msg: "Something went wrong!" }];

    }

    return errors;

};



module.exports = {
    register
}
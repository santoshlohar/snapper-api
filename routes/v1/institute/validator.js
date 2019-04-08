
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
        //Requester Details
        req.checkBody("requester.name","Requester name cannot be blank").notEmpty();
        req.checkBody("requester.emailid","Requester emailID cannot be blank").isEmail().normalizeEmail();
        req.checkBody('requester.phoneno', 'Requester Phone Number is required').notEmpty();
//Insititute Details

        req.checkBody("type", "Institute type cannot be blank").notEmpty();
        req.checkBody("type", "Institute type is not valid").isIn(types);
        req.checkBody('code').optional().matches(/^[a-zA-Z0-9]+$/gi);
        req.checkBody("name", "Institute name cannot be blank").notEmpty();
        req.checkBody("regid", "Institute regid cannot be blank").notEmpty();
        //req.checkBody("doe", "Date is not valid").optional().custom(isValidDate);
         req.checkBody("boardlinenumber", "boardlinenumber can not be blank").notEmpty();
        req.checkBody("location", "location can not be blank").notEmpty();
        req.checkBody("website", "website in proper format").isFQDN();
        req.checkBody("institution", "institution can not be blank").notEmpty();
        req.checkBody("type", "institution type can not be blank").notEmpty();
        req.checkBody("approvedby", "approvedby can not be blank").notEmpty();
        //address
        req.checkBody("address.address_line_1", "Address1 can not be blank").notEmpty();
        req.checkBody("address.address_line_2", "Address2 can not be blank").notEmpty();
        req.checkBody("address.state", "State name cannot be blank").notEmpty();
        req.checkBody("address.city", "City name cannot be blank").notEmpty();
        req.checkBody("head.name", "Head name cannot be blank").notEmpty();
        req.checkBody("head.email", "Head EmailId cannot be blank").notEmpty();
        req.checkBody("head.phoneNumber", "Head phone number cannot be blank").notEmpty();
        req.checkBody('requlatory.body', "Regulatory Body is invalid").optional().isIn(regulatoryBody);
        req.checkBody('admin.name', 'Intitute Admin is required').notEmpty();
        req.checkBody('admin.email', 'Intitute Admin is required').notEmpty();
        req.checkBody('admin.email', 'Intitute Admin Email is invalid').isEmail().normalizeEmail();
        req.checkBody('admin.phoneNumber', 'Intitute Admin Phone Number is required').notEmpty();
                // TODO Need to validate phone number

        var errors = req.validationErrors();
        
    } catch(e) {
        var errors = [{msg: "Something went wrong!"}];
     
    }

    return errors;
    
};



module.exports = {
    register
}
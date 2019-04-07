
var moment = require('moment');

const types = [
    'Central University', 'State University', 'Deemed University', 
    'Private University', 'CBSE', 'ICSE', 'State Board', 
    'International Board', 'Private Institute'
];

var isValidDate = (date) => {
    var d = moment(date);
    return d.isValid() ? true : false;
};

var register = (req) => {

    var promise = new Promise((resolve, reject) => {

        req.checkBody("type", "Institute type cannot be blank").notEmpty();
        req.checkBody("type", "Institute type is not valid").isIn(types);
        req.checkBody("name", "Institute name cannot be blank").notEmpty();
        req.checkBody("address.state", "State name cannot be blank").notEmpty();
        req.checkBody("address.city", "City name cannot be blank").notEmpty();
        req.checkBody('doe').optional().custom(isValidDate).withMessage("Date is not valid");

        req.getValidationResult().then(function(result) {
            if(!result.isEmpty()) {
                reject(result);
            } else {
                resolve(result);
            }
        })
    });

    return promise;

};



module.exports = {
    register
}
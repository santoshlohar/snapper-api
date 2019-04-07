
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

    var promise = new Promise((resolve, reject) => {

        try {
            
            req.checkBody("type", "Institute type cannot be blank").notEmpty();
            req.checkBody('code').optional().isAlphNum();
            req.checkBody("type", "Institute type is not valid").isIn(types);
            req.checkBody("name", "Institute name cannot be blank").notEmpty();
            req.checkBody("address.state", "State name cannot be blank").notEmpty();
            req.checkBody("address.city", "City name cannot be blank").notEmpty();
            req.checkBody('doe', "Date is not valid").optional().custom(isValidDate);
            req.checkBody('requlatory.body', "Regulatory Body is invalid").optional().isIn(regulatoryBody);

            req.getValidationResult().then(function(result) {
                if(!result.isEmpty()) {
                    reject(result);
                } else {
                    resolve(result);
                }
            });
        } catch(e) {
            reject({});
        }
    });

    return promise;

};



module.exports = {
    register
}
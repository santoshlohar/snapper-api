var moment = require('moment');


var department = (req) => {

    try {

        
        req.checkBody("name", "Institute Name cannot be blank").notEmpty();
        req.checkBody("name", "Institute Name Not a Valid").isLength({ min: 5 });

        req.checkBody("instituteId", "Institute id cannot be blank").notEmpty();
        req.checkBody("instituteId", "Institute id is not valid").isMongoId();

        req.checkBody("address", "Institute Address cannot be blank").notEmpty();
        req.checkBody("address", "Institute Address not Valid ").isLength({min:5});
        
        req.checkBody("isActive", "Department Active Status cannot be blank").notEmpty();
        req.checkBody("isActive", "Department Active Status not Valid").isBoolean();

        req.checkBody("isDeleted", "Department Delete Status cannot be blank").notEmpty();
        req.checkBody("isDeleted", "Department Delete Status Not Valid").isBoolean();


        var errors = req.validationErrors();

    } catch (e) {
        var errors = [{ msg: "Something went wrong!" }];
    }

    return errors;
};



module.exports = {
    department
}




var signin = (req) => {
    try {

        req.checkBody('email', 'Email is required.').notEmpty();
        req.checkBody('email', 'Email is invalid.').isEmail();
        req.checkBody('password', 'Password is required.').notEmpty();
        req.checkBody('password', 'Password length should be minimum 4 characters.').isLength({ min: 4 });
        
        var errors = req.validationErrors();

    } catch(e) {
        var errors = [{msg: "Something went wrong!"}];
    } 
    return errors;
};

var forgotPassword = (req) => {
    try {

        req.checkBody('email', 'Email is required.').notEmpty();
        req.checkBody('email', 'Email is invalid.').isEmail();
        
        var errors = req.validationErrors();

    } catch(e) {
        var errors = [{msg: "Something went wrong!"}];
    } 
    return errors;
};

var resetPassword = (req) => {
    try {
        req.checkBody('email', 'Email is required.').notEmpty();
        req.checkBody('email', 'Email is invalid.').isEmail();
        req.checkBody('password', 'Password is required.').notEmpty();
        req.checkBody('password', 'Password length should be minimum 4 characters.').isLength({ min: 4 });
        req.checkBody('confirmPassword', "password and confirm password should be equal").custom( password => {
            if(req.body.confirmPassword && (password  === req.body.confirmPassword)) {
                return true;
            }
            return false;
        });
        req.checkBody('code', 'OTP code is required.').notEmpty();
        
        var errors = req.validationErrors();

    } catch(e) {
        var errors = [{msg: "Something went wrong!"}];
    } 
    return errors;
};

var create = (req) => {
    try {

        req.checkBody("email", "Email ID is required.").notEmpty();
        req.checkBody("email", "Email ID is invalid.").isEmail();
        req.checkBody("firstName", "First name is required.").notEmpty();
        req.checkBody("lastName", "Last name is required.").notEmpty();
        req.checkBody("phoneNumber", "Phone number is required.").notEmpty();
        req.checkBody("role", "User role is required.").notEmpty();
        req.checkBody("entity", "User entity is required.").notEmpty();
        req.checkBody("instituteId", "Institute ID is required.").notEmpty();

        var role = req.body.role;
        var entity = req.body.entity;

        if(entity == 'affiliate') {
            req.checkBody("role", "User role is invalid.").isIn(['manager', 'reviewer', 'approver']);
            req.checkBody("departmentId", "Department ID is required!").notEmpty();
            req.checkBody("affiliateId", "Affiliate Institute ID is required!").notEmpty();
        }

        if(entity == 'institute') {
            req.checkBody("role", "User role is invalid.").isIn(['manager', 'reviewer', 'certifier']);
            req.checkBody("departmentId", "Department ID is required!").notEmpty();
        }
        
        var errors = req.validationErrors();

    } catch(e) {
        var errors = [{msg: "Something went wrong!"}];
    }
    return errors;
};

module.exports = {
    forgotPassword,
    resetPassword,
    create
}
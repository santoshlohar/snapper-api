

var signin = (req) => {
    try {

        req.checkBody('email', 'Email is required.').notEmpty();
        req.checkBody('email', 'Email is invalid.').isEmail().normalizeEmail();
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
        req.checkBody('email', 'Email is invalid.').isEmail().normalizeEmail();
        
        var errors = req.validationErrors();

    } catch(e) {
        var errors = [{msg: "Something went wrong!"}];
    } 
    return errors;
};

var resetPassword = (req) => {
    try {
        req.checkBody('email', 'Email is required.').notEmpty();
        req.checkBody('email', 'Email is invalid.').isEmail().normalizeEmail();
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

var resetPassword = (req) => {
    try {

        req.checkBody('email', 'Email is required.').notEmpty();
        req.checkBody('email', 'Email is invalid.').isEmail().normalizeEmail();
        req.checkBody('password', 'Password is required.').notEmpty();
        req.checkBody('confirmPassword', 'Confirm Password is required.').notEmpty();
        req.checkBody('code', 'OTP is required.').notEmpty();
        var errors = req.validationErrors();

    } catch(e) {
        var errors = [{msg: "Something went wrong!"}];
    } 
    return errors;
};


module.exports = {
    forgotPassword,
    resetPassword
}
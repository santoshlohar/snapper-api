
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


module.exports = {
    forgotPassword
}
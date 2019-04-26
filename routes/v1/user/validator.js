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

var user = (req) => {
    try {

        req.checkBody("email", "Email ID is required.").notEmpty();
        req.checkBody("email", "Email ID is invalid.").isEmail().normalizeEmail();
        req.checkBody("firstName", "First name is required.").notEmpty();
        req.checkBody("lastName", "Last name is required.").notEmpty();
        req.checkBody("phoneNumber", "Phone number is required.").notEmpty();
        req.checkBody("role", "User role is required.").notEmpty();
        req.checkBody("instituteId", "Institute ID is required.").notEmpty();

        var role = req.body.role;

        if(role && role == ("affl_inst_data_manager" || "affl_inst_reviewer" || "aff_inst_approver")) {
            req.checkBody("departmentId", "Department ID is required!").notEmpty();
            req.checkBody("affiliateId", "Affiliate Institute ID is required!").notEmpty();
        } else if( role && role == ("inst_reviewer" || "inst_certifier")) {
            req.checkBody("departmentId", "Department ID is required!").notEmpty();
        }
        
        var errors = req.validationErrors();

    } catch(e) {
        var errors = [{msg: "Something went wrong!"}];
    }
    return errors;
}

var list = (req) => {
    try {
        req.checkQuery("instituteId", "Institute ID cannot be blank").exists();
        req.checkQuery("skip", "Skip cannot be blank").exists();
        req.checkQuery("limit", "limit cannot be blank").exists();

        var errors = req.validationErrors();

    } catch(e) {
        var errors = [{msg: "Something went wrong!"}];
    }
    return errors;
}


module.exports = {
    forgotPassword,
    user,
    list
}
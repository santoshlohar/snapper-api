
var create = req => {
    try {
        req.checkBody("name", "Department name cannot be blank").notEmpty();
        req.checkBody("instituteId", "instituteId cannot be blank").notEmpty();
        // req
        //     .checkBody("code")
        //     .optional()
        //     .matches(/^[a-zA-Z0-9]+$/gi);

        var errors = req.validationErrors();
    } catch (e) {
        var errors = [{ msg: "Something went wrong!" }];
    }

    return errors;
};

var list = req => {
    try {
        req.checkQuery("instituteId", "instituteId cannot be blank").notEmpty();
        req.checkQuery("skip", "skip param cannot be blank").notEmpty();
        req.checkQuery("limit", "limit param cannot be blank").notEmpty();

        var errors = req.validationErrors();

    } catch (e) {
        var errors = [{ msg: "Something went wrong!" }];
    }

    return errors;
};

module.exports = {
    create,
    list
}
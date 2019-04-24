
var create = (req) => {

    try {

        // Institute Admin validato
        req.checkBody("name", "Department name cannot be blank").notEmpty();
        req.checkBody("instituteId", "instituteId cannot be blank").notEmpty();
        req.checkBody('code').optional().matches(/^[a-zA-Z0-9]+$/gi);

        var errors = req.validationErrors();

    } catch (e) {
        var errors = [{ msg: "Something went wrong!" }];

    }

    return errors;

};

module.exports = {
    create
}
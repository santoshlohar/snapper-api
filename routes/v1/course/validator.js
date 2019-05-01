const types = [
    'School Board', 'Graduation Degree', 'Masters Degree', 'Doctorate', 'Diploma', 'Certification Program'
];

const certificateGenerate = [
    'Auto', 'Manual'
];

const unit = [
    'Month', 'Year'
];

const termType = [
    'Semester', 'Trisemester', 'Annual', 'None'
];

var create = (req) => {
    try {   

        req.checkBody("instituteId", "Institute ID is required!").notEmpty();
        req.checkBody("departmentId", "Department ID is required!").notEmpty();
        req.checkBody("type", "Course Type is required!").notEmpty().isIn(types);
        req.checkBody("name", "Course Name is required!").notEmpty();
        req.checkBody("certificateGenerate", "Certificate Generate is invalid!").optional().isIn(certificateGenerate);
        req.checkBody("certificatePrint", "Certificate Print is required!").notEmpty();
        req.checkBody("gpaCalculated", "GPA is required!").notEmpty();
        req.checkBody("subjectCredits", "Subject Credits are required!").notEmpty().isIn(["Equal", "Defined"]);
        req.checkBody("duration", "Course Duration is required!").notEmpty();
        req.checkBody("durationUnit", "Duration Unit is required!").notEmpty().isIn(unit);
        req.checkBody("termType", "Term type is invalid!").optional().isIn(termType);
        req.checkBody("noOfTerms", "Number of Terms is invalid!").optional().isInt();


        var errors = req.validationErrors();
    } catch (error) {
        var errors = [{ msg: "Something went wrong!" }];
    }

    return errors;
};

var update = (req) => {
    try {

        req.checkBody("name", "Course Name is required!").notEmpty();
        req.checkBody("certificateGenerate", "Certificate Generate is invalid!").optional().isIn(certificateGenerate);
        req.checkBody("certificatePrint", "Certificate Print is required!").notEmpty();
        req.checkBody("gpaCalculated", "GPA is required!").notEmpty();
        req.checkBody("subjectCredits", "Subject Credits are required!").notEmpty().isIn(["Equal", "Defined"]);
        req.checkBody("duration", "Course Duration is required!").notEmpty();
        req.checkBody("durationUnit", "Duration Unit is required!").notEmpty().isIn(unit);
        req.checkBody("termType", "Term type is invalid!").optional().isIn(termType);
        req.checkBody("noOfTerms", "Number of Terms is invalid!").optional().isInt();


        var errors = req.validationErrors();
    } catch (error) {
        var errors = [{ msg: "Something went wrong!" }];
    }

    return errors;
};

module.exports = {
    create,
    update
}
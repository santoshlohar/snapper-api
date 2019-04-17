const courseType = [
    'School Board', 'Graduation Degree', 'Masters Degree', 'Doctorate', 'Diploma', 'Certification Program'
];

const certificateGenerate = [
    'Auto', 'Manual'
];

var course = (req) => {
    try {

        req.checkBody("departmentId", "Department ID is required!").notEmpty();
        req.checkBody("courseType", "Course Type is required!").notEmpty().isIn(courseType);
        req.checkBody("courseName", "Course Name is required!").notEmpty();
        req.checkBody("certificateGenerate", "Certificate Generate is invalid!").optional().isIn(certificateGenerate);
        req.checkBody("certificatePrint", "Certificate Print is required!").notEmpty();
        req.checkBody("gpaCalculated", "GPA is required!").notEmpty();
        req.checkBody("subjectCredits", "Subject Credits are required!").notEmpty();
        req.checkBody("courseDuration", "Course Duration is required!").notEmpty();
        req.checkBody("durationUnit", "Duration Unit is required!").notEmpty();

        var errors = req.validationErrors();
    } catch (error) {
        var errors = [{ msg: "Something went wrong!" }];
    }

    return errors;
};

module.exports = {
    course
}
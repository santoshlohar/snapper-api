var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    instituteId: {
        type: String
    },
    departmentId: {
        type: String
    },
    courseType: {
        type: String
    },
    courseId: {
        type: mongoose.Types.ObjectId
    },
    courseName: {
        type: String
    },
    specialization: {
        type: String
    },
    certificateGenerate: {
        type: String
    },
    certificatePrint: {
        type: Boolean,
        default: true
    },
    gpaCalculated: {
        type: Boolean,
        default: true
    },
    subjectCredits: {
        type: String
    },
    courseDuration: {
        type: Number
    },
    durationUnit: {
        type: String
    },
    termType: {
        type: String
    },
    noOfTerms: {
        type: Number
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('course', schema);
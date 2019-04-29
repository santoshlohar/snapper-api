var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    instituteId: {
        type: mongoose.Types.ObjectId
    },
    departmentId: {
        type: mongoose.Types.ObjectId
    },
    courseType: {
        type: String
    },
    code: {
        type: String
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
        type: Boolean,
        default: true
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
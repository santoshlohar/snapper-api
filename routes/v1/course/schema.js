var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    instituteId: {
        type: mongoose.Types.ObjectId,
        ref: 'institute'
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: 'department'
    },
    type: {
        type: String
    },
    code: {
        type: String
    },
    name: {
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
    duration: {
        type: Number
    },
    durationUnit: {
        type: String
    },
    termType: {
        type: String
    },
    noOfTerms: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('course', schema);
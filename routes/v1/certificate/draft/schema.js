var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    instituteId: {
        type: Schema.Types.ObjectId,
		ref: 'institutes'
    },
    departmentId: {
        type: Schema.Types.ObjectId,
		ref: 'departments'
    },
    affiliateId: {
        type: Schema.Types.ObjectId,
        ref: 'affiliates'
    },
    batchId: {
        type: Schema.Types.ObjectId,
        ref: 'batches'
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'courses'
    },
    studentId: {
        type: Object
    },
    code: {
        type: Object
    },
    specialization: {
        type: Object
    },
    scoreEarned: {
        type: Object
    },
    totalScore: {
        type: Object
    },
    cgpa: {
        type: Object
    },
    creditsEarned: {
        type: Object
    },
    completionDate: {
        type: Object
    },
    status: {
        type: String,
        default: "new"
    }
},{
    timestamps: true
})

module.exports = mongoose.model('certificaterafts', schema);
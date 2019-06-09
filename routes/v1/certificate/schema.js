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
    courseId: {
        type: Schema.Types.ObjectId,
        ref: 'courses'
    },
    batchId: {
        type: Schema.Types.ObjectId,
        ref: 'batches'
    },
    studentId: {
        type: String
    },
    certificateId: {
        type: String
    },
    specialization: {
        type: String
    },
    scoreEarned: {
        type: String
    },
    totalScore: {
        type: String
    },
    cgpa: {
        type: String
    },
    creditsEarned: {
        type: String
    },
    completionDate: {
        type: Date
    },
    hash: {
        type: String
    },
    status: {
        type: String,
        default: "new"
    },
    reviewers: {
		type: Schema.Types.Mixed,
		default: {}
    },
    certifiers: {
		type: Schema.Types.Mixed,
		default: {}
	}	
},{
    timestamps: true
})

module.exports = mongoose.model('certificates', schema);
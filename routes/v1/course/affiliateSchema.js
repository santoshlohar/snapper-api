var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	courseId: {
		type: mongoose.Types.ObjectId,
        ref: 'course'
	},
	instituteId: {
		type: mongoose.Types.ObjectId,
        ref: 'institute'
	},
	departmentId: {
		type: mongoose.Types.ObjectId,
        ref: 'department'
	},
	affiliateId: {
		type: mongoose.Types.ObjectId,
        ref: 'affiliate'
	},
	isActive: {
		type: Boolean,
		default: true
	}
},{
    timestamps: true
});

module.exports = mongoose.model('affiliateCourses', schema);
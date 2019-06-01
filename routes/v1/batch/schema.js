var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	instituteId: {
		type: mongoose.Types.ObjectId,
        ref: 'institute'
	},
	affiliateId: {
		type: mongoose.Types.ObjectId,
		ref: 'affiliate'
	},
	courseId: {
		type: mongoose.Types.ObjectId,
		ref: 'course'
	},
	code: {
		type: String
	},
	year: {
		type: String
	},
	start: {
		type: String
	},
	end: {
		type: String
	},
	minCredits: {
		type: Number
	},
	minCgpa: {
		type: Number
	},
	totalCgpa: {
		type: Number
	},
	minScore: {
		type: Number
	},
	totalScore: {
		type: Number
	},
	isDeleted: {
		type: Boolean,
		default: false
	}
},{
    timestamps: true
});

module.exports = mongoose.model('batches', schema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	userId: {
		type: mongoose.Types.ObjectId
	},
	instituteId: {
		type: mongoose.Types.ObjectId
	},
	departmentId: {
		type: mongoose.Types.ObjectId
	},
	affiliateId: {
		type: mongoose.Types.ObjectId
	}
});

module.exports = mongoose.model('userRef', schema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var defaultId = new mongoose.Types.ObjectId('111111111111111111111111');

var schema = new Schema({
	userId: {
		type: mongoose.Types.ObjectId,
		ref: "user"
	},
	instituteId: {
		type: mongoose.Types.ObjectId,
		ref: "institute",
		default: defaultId
	},
	departmentId: {
		type: mongoose.Types.ObjectId,
		ref: "department",
		default: defaultId
	},
	affiliateId: {
		type: mongoose.Types.ObjectId,
		ref: "affiliate",
		default: defaultId
	},
	entity: {
		type: String
	},
	role: {
		type: String
	}
});

module.exports = mongoose.model('userReference', schema);
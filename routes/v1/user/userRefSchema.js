var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var defaultId = new mongoose.mongo.ObjectId('111111111111111111111111');

var schema = new Schema({
	userId: {
		type: Schema.Types.ObjectId,
		ref: "user"
	},
	instituteId: {
		type: Schema.Types.ObjectId,
		ref: "institute",
		default: defaultId
	},
	departmentId: {
		type: Schema.Types.ObjectId,
		ref: "department",
		default: defaultId
	},
	affiliateId: {
		type: Schema.Types.ObjectId,
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
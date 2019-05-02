var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var defaultId = new mongoose.mongo.ObjectId('111111111111111111111111');

var schema = new Schema({
	userId: {
		type: Schema.ObjectId,
		ref: "user"
	},
	instituteId: {
		type: Schema.ObjectId,
		ref: "institute",
		default: defaultId
	},
	departmentId: {
		type: Schema.ObjectId,
		ref: "department",
		default: defaultId
	},
	affiliateId: {
		type: Schema.ObjectId,
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
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	batchId: {
		type: mongoose.Types.ObjectId,
		ref: 'batches'
	},
	affiliateId: {
		type: mongoose.Types.ObjectId,
		ref: 'affiliates'
	},
	code: {
		type: String
	},
	name: {
		type: String
	},
	father: {
		type: String
	},
	dob: {
		type: String
	},
	aadhar: {
		type: String
	},
	email: {
		type: String
	},
	phoneNumber: {
		type: String
	},
	isActive: {
		type: String,
		default: true
	},
	status: {
        type: String,
        default: "new"
    },
	date: {
		type : String, 
		default : Date.now
	}	
},{
    timestamps: true
});

module.exports = mongoose.model('students', schema);

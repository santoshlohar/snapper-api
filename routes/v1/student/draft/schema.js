var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
	batchId: {
		type: Schema.Types.ObjectId,
		ref: 'batches'
	},
	affiliateId: {
		type: Schema.Types.ObjectId,
		ref: 'affiliates'
	},
	code: {
		type: Object
	},
	name: {
		type: Object
	},
	father: {
		type: Object
	},
	dob: {
		type: Object
	},
	aadhar: {
		type: Object
	},
	email: {
		type: Object
	},
	phoneNumber: {
		type: Object
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

module.exports = mongoose.model('studentdrafts', schema);

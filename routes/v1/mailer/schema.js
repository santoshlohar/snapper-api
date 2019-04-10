var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    email: {
        type: String,
    },
    otp: {
        type: String,
    },
    createdDate: {
        type: Date,
    },
    validTime: {
        type: Date,
    },
    refId:{
        type:String,
    }
}, {
    timestamps: true
});
module.exports = mongoose.model('OTPLogs', schema);
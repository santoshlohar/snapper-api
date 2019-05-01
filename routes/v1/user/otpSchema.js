var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    email: {
        type: String,
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'user'
    },
    code: {
        type: String
    },
    expiry: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('otp', schema);
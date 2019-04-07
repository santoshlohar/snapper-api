var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    email: {
        type: String,
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    password: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    role: {
        type: String
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

module.exports = mongoose.model('users', schema);
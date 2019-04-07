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
    is_active: {
        type: Boolean
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('users', schema);
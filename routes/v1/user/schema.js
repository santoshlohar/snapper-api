var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var generatePassword = (text) => {

    if(!text) {
        text = new mongoose.Types.ObjectId;
    }
    //TODO: Need to logic to generate secured hash using bcrypt
    return text;
};

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
        type: String,
        default: generatePassword()
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
    },
    instituteId: {
        type: mongoose.Types.ObjectId
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('users', schema);
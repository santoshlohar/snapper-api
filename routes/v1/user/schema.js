var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

var generatePassword = (text ) => {
    var salt = bcrypt.genSaltSync(10);
    text="santosh"
    var hash;
    if(!text ) {
        hash = new mongoose.Types.ObjectId;
    }
    else
    {
         hash = bcrypt.hashSync(text, salt);
    };
    //TODO: Need to logic to generate secured hash using bcrypt
    return hash;
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
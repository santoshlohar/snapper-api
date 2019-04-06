var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    type: {
        type: String,
    },
    code: {
        type: String,
    },
    name: {
        type: String,
    },
    doe: {
        type: String
    },
    address: {
        address_line_1: {
            type: String
        },
        address_line_2: {
            type: String
        },
        state: {
            type: String
        },
        city: {
            type: String
        }
    },
    head: {
        name: {
            type: String
        },
        email: {
            type: String
        },
        phoneNumber: {
            type: String
        }
    },
    admin: {
        name: {
            type: String
        },
        email: {
            type: String
        },
        phoneNumber: {
            type: String
        }
    },
    boardLineNumber: {
        type: String
    },
    location: {
        type: String
    },
    website: {
        type: String
    },
    requlatory: {
        name: {
            type: String
        },
        body: {
            type: String
        }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('institutes', schema);
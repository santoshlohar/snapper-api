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
        type: Date
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
    requester: {
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        phoneNumber: {
            type: String,
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
    administrator: {
        name: {
            type: String
        },
        email: {
            type: String
        },
        phoneNumber: {
            type: String
        },
        landineNumber: {
            type: String
        }
    },
    location: {
        type: String
    },
    website: {
        type: String
    },
    affiliateInstitute: {
        name: {
            type: String
        },
        type: {
            type: String
        },
        approvedBy: {
            type: String
        },
        requlatoryBody: {
            type: String
        }
    },
    isActive: {
        type: Boolean
    },
    status: {
        type: String,
        default: "new"
    }
}, {
        timestamps: true
    });

module.exports = mongoose.model('institutes', schema);
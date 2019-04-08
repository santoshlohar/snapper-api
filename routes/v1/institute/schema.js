var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    requester:{
        name :{
            type:String,},
        emailid :{
            type:String,},
        phoneno :{
            type:String,}
    },
    
    
    type: {
        type: String,
    },
    code: {
        type: String,
    },
    name: {
        type: String,
    },
    regid: {
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
    boardlinenumber: {
        type: String
    },
    location: {
        type: String
    },
    website: {
        type: String
    },
    institution: {
       name: {
        type: String
    },
    type: {
        type: String
    }},
    approvedby: {
        type: String
    },
    requlatory: {
        name: {
            type: String
        },
        body: {
            type: String
        }
    },
    isActive: {
        type: Boolean
    },
    status: {
        type: String,
        default: "pending"
    },
    
}, 

{
    timestamps: true
});

module.exports = mongoose.model('institutes', schema);
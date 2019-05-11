var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
    },
    instituteId: {
        type: mongoose.Types.ObjectId,
        ref: "institute"
    },
    departmentId: {
        type: mongoose.Types.ObjectId,
        ref: "department"
    },
    code: {
        type: String,
    },
    address: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('affiliate', schema);
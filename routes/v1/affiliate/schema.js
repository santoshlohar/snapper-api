var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
    },
    instituteId: {
        type: mongoose.Types.ObjectId
    },
    departmentId: {
        type: String
    },
    address: {
        type: String
    },
    isActive: {
        type: Boolean
    },
    isDeleted: {
        type: Boolean
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('affiliate', schema);
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name: {
        type: String,
    },
    instituteId: {
        type: mongoose.Types.ObjectId,
        ref: 'institute'
    },
    code: {
        type: String,
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


module.exports = mongoose.model('department', schema);
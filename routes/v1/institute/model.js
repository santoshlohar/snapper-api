var schema = require('./schema');

var create = (institute, cb) => {
    var document = new schema(institute);
    document.save().then(function(result) {
        cb(null, result);
    }).catch(function(err) {
        cb(err, null);
    });
};

module.exports = {
    create
};

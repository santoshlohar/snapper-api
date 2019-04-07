var schema = require('./schema');

var create = (institute) => {

    var promise = new Promise((resolve, reject) => {
        var document = new schema(institute);
        document.save().then(function(result) {
            var response = {error: null, institute: result};
            resolve(response);
        }).catch(function(err) {
            var response = {error: err, institute: {}};
            resolve(response);
        });
    });

    return promise;
    
};

module.exports = {
    create
};

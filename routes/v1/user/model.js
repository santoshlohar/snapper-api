var schema = require('./schema');

var create = (user) => {
    var promise = new Promise((resolve, reject) => {
        var document = new schema(user);
        document.save().then(function(result) {
            var response = {error: null, user: result};
            resolve(response);
        }).catch(function(err) {
            var response = {error: err, user: {}};
            resolve(response);
        });
    });

    return promise;
};

module.exports = {
    create
};
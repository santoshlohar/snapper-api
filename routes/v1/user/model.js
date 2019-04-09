var schema = require('./schema');
var bcrypt = require('bcrypt');

var generatePassword = (text) => {
    var promise = new Promise((resolve, reject) => {
        bcrypt.hash(text, 10, function(err, hash) {
            console.log(err);
            console.log(text + " ==== hash is === "+hash);
            if(!err) {
                resolve(hash);
            } else {
                resolve("");
            }
        });
    });
    
    return promise;
};


var create = (user) => {
    var promise = new Promise((resolve, reject) => {

        var text = Date.now() + Math.random();
        text = text.toString();

        generatePassword(text).then((hash) => {
            user.password = hash;
            var document = new schema(user);
            document.save().then(function(result) {
                var response = {error: null, user: result};
                resolve(response);
            }).catch((err) => {
                var response = {error: err, user: {}};
                resolve(response);
            });
        }).catch((err) => {
            var response = {error: true, user: {}};
            resolve(response);
        });
        
    });

    return promise;
};

module.exports = {
    create
};
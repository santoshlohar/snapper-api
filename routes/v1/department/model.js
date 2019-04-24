var schema = require('./schema');



var create = (department) => {

    var promise = new Promise((resolve, reject) => {
        var document = new schema(department);
        document.save().then(function (result) {
            var response = { isError: false, department: result, errors: [] };
            resolve(response);
        }).catch((err) => {
            var response = { isError: true, department: {}, errors: [] };
            resolve(response);
        });
    })

    return promise;
    
};


module.exports = {
    create
};
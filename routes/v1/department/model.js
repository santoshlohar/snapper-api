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
    });

    return promise;
};

var list = (data) => {
    var promise = new Promise((resolve, reject) => {

        var queryParams = {
            instituteId: data.instituteId
        };
        
        var options = {
            skip: parseInt(data.skip),
            limit: parseInt(data.limit)
        };

        schema.find(queryParams, null, options, (err, departments) => {
            if(err) {
                var response = { isError: true, departments: [], errors: [] };
                resolve(response);
            } else {
                var response = { isError: false, departments: departments, errors: [] };
                resolve(response);
            }
        });
    });

    return promise;
};

var findById = (id) => {
    var promise = new Promise((resolve, reject) => {
		var data = {
            _id: id
        };
		schema.findOne(data, (err, result) => {
			if(!err && result && result._id) {
                var response = {isError: false, department: result, errors: []};
                resolve(response);
            } else {
                var response = {isError: true, department: {}, errors: [{param: "id", msg: "Invalid department id"}]};
                resolve(response);
            }
		});
	});

	return promise;
};

var update = (department) => {

    var promise = new Promise((resolve, reject) => {
        department.save().then((result) => {
            var response = { isError: false, department: result, errors: [] };
            resolve(response);
        }).catch((err) => {
            var response = { isError: false, department: {}, errors: [{"msg": "Failed to update department!"}] };
            resolve(response);
        })
    });

    return promise;
};

module.exports = {
    create,
    list,
    findById,
    update
};
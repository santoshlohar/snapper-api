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
		schema.findOne(data, (err, resObj) => {
			if(!err) {
                var response = {error: false, department: resObj};
                resolve(response);
            } else {
                var response = {error: true, department: {}};
                resolve(response);
            }
		});
	});

	return promise;
};

var update = (department) => {

	var promise = new Promise((resolve, reject) => {
		department.save().then((result) => {
			var response = {error: null, department: result};
			resolve(response);
		}).catch((err) => {
			var response = {error: err, department: {}};
			resolve(response);
			})
	});

		return promise;
}

module.exports = {
    create,
    list,
    findById,
    update
};
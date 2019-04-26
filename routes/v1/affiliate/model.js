var schema = require('./schema');

var create = (affiliate) => {
	console.log("sush")
	var promise = new Promise((resolve, reject) => {
        var document = new schema(affiliate);
        document.save().then(function (result) {
			console.log("create",result)
            var response = { isError: false, affiliate: result, errors: [] };
            resolve(response);
        }).catch((err) => {
            var response = { isError: true, affiliate: {}, errors: [] };
            resolve(response);
        });
    });

	return promise;
}

var findById = (id) => {
	var promise = new Promise((resolve, reject) => {
		var data = {
            _id: id
        };
		schema.findOne(data, (err, afflObj) => {
			if(!err) {
                var response = {error: false, affiliate: afflObj};
                resolve(response);
            } else {
                var response = {error: true, affiliate: {}};
                resolve(response);
            }
		});
	});

	return promise;
}

var getList = (data) => {
	var promise = new Promise((resolve, reject) => {		
		schema.find({instituteId: data.instituteId}).then((result) => {
			var response = {isError: false, affiliates: result, errors: [] };
			resolve(response);
		}).catch((err) => {
			var response = { isError: true, affiliates: {}, errors: [] };
			resolve(response);
		});
	});

	return promise;
}

var update = (affiliate) => {

	var promise = new Promise((resolve, reject) => {
		affiliate.save().then((result) => {
			console.log(result);
			var response = {error: null, affiliate: result};
			resolve(response);
		}).catch((err) => {
			var response = {error: err, affiliate: {}};
			resolve(response);
		})
	});

	return promise;
}

module.exports = {
	create,
	findById,
	getList,
	update
}
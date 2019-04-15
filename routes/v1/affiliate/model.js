var schema = require('./schema');

var create = (affiliate) => {
	var promise = new Promise((resolve, reject) => {
		var document = new schema(affiliate);
		document.save().then((result) => {
			var response = {error: null, affiliate: result};
            resolve(response);
		}).catch((err) => {
			var response = {error: err, affiliate: {}};
            resolve(response);
		});
	});

	return promise;
}

var getList = (data) => {
	var promise = new Promise((resolve, reject) => {		
		schema.find({instituteId: data.instituteId}).then((result) => {
			var response = {error: null, affiliates: result};
			resolve(response);
		}).catch((err) => {
			var response = {error: err, data: []};
			resolve(response);
		});
	});

	return promise;
}

module.exports = {
	create,
	getList
}
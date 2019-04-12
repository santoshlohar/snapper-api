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
		console.log("2222")
		schema.find().then((result) => {
			console.log("113")
			console.log(result);
			var response = {error: null, affiliates: result};
			resolve(response);
		}).catch((err) => {
			console.log("2223")
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
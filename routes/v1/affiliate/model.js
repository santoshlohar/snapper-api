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

module.exports = {
	create
}
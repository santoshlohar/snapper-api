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
                var response = {error: true, afflObj: {}};
                resolve(response);
            }
		});
	});

	return promise;
}

module.exports = {
	create,
	findById
}
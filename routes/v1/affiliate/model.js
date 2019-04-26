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
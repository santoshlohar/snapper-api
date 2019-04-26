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

module.exports = {
	create
}
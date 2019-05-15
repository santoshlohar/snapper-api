var schema = require('./schema');

var create = (affiliate) => {
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
		schema.findOne(data, (err, affiliate) => {
			if(!err && (affiliate && affiliate._id) ) {
                var response = {isError: false, affiliate: affiliate, errors: []};
                resolve(response);
            } else {
                var response = {isError: true, affiliate: {}, errors: [{msg: "Invalid Affilate ID"}]};
                resolve(response);
            }
		});
	});

	return promise;
}

var list = (data) => {
	var promise = new Promise((resolve, reject) => {	
		var obj = {
			instituteId: data.instituteId
		};
		if(data.departmentId) {
			obj.departmentId = data.departmentId
		}
		schema.find(obj).then((result) => {
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
			var response = {isError: false, affiliate: result, errors: []};
			resolve(response);
		}).catch((err) => {
			var response = {isError: true, affiliate: {}, errors:[{msg: "Failed to Update Affilite Institute ss"}]};
			resolve(response);
		})
	});

	return promise;
}

module.exports = {
	create,
	findById,
	list,
	update
}
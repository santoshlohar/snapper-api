var schema = require('./schema');
var mongoose = require('mongoose');

var create = (affiliate) => {
	var promise = new Promise((resolve, reject) => {
        var document = new schema(affiliate);
        document.save().then(function (result) {
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

var list1 = (data) => {
	var promise = new Promise((resolve, reject) => {	
		
		var queryParams = {
			instituteId: data.instituteId
		};
		
		if(data.departmentId) {
			queryParams.departmentId = data.departmentId
		}
        
        var options = {
            skip: parseInt(data.skip),
            limit: parseInt(data.limit)
        };

        schema.find(queryParams, null, options, (err, affiliates) => {
            if(err) {
                var response = { isError: true, affiliates: [], errors: [] };
                resolve(response);
            } else {
                var response = { isError: false, affiliates: affiliates, errors: [] };
                resolve(response);
            }
        });
	});

	return promise;
}

var list = (obj) => {
	var promise = new Promise((resolve, reject) => {
        var filter = [];

        var matchQuery = {
			instituteId: mongoose.Types.ObjectId(obj.instituteId),
		};
		
		if(obj.departmentId) {
			matchQuery.departmentId = mongoose.Types.ObjectId(obj.departmentId)
		}

        filter.push({ $match: matchQuery });

        filter.push({
            $lookup: {
                from: "departments",
                localField: "departmentId",
                foreignField: "_id",
                as: "department"
            }
        });

        
        filter.push({
            $unwind: {
                "path": "$department",
                "preserveNullAndEmptyArrays": true
            }
		});

        var query = schema.aggregate(filter);

        query.exec((err, records) => {

            if (!err || records) {
                var affiliates = [];
                for(var i=0; i < records.length; i++) {
                    var record = records[i];
                    if(record) {
                        var affiliate = record;
                        affiliate.department = record.department;
                        affiliates.push(affiliate);
                    }
                }
                var response = { isError: false, affiliates: affiliates };
                resolve(response);
            } else {
                var response = { isError: true, affiliates: [] };
                resolve(response);
            }
        })
    });

    return promise;
};

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
};

var findByCode = (obj) => {
    var promise = new Promise((resolve, reject) => {
        var data = {
            instituteId: obj.instituteId,
            departmentId: obj.departmentId,
            code: obj.code
        };

        schema.find(data, (err, result) => {
			if(!err && result && result.length) {
				var response = { isError: false, errors: [{msg: "Affiliate ID already available!"}], affiliates: result};
            	resolve(response);
			} else {
				var response = { isError: false, errors: [{msg: "Affiliate ID not available"}], affiliates: [] };
            	resolve(response);
			}
		});
    });
    return promise; 
};

module.exports = {
	create,
	findById,
	list,
    update,
    findByCode
}
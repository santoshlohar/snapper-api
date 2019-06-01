var schema = require('./schema');
var mongoose = require('mongoose');

var create = (batch) => {
	var promise = new Promise((resolve, reject) => {
		var document = new schema(batch);
		document.save().then(function(result) {
			var response = { isError: false, batch: result, errors: [] };
            resolve(response);
		}).catch((err) => {
            var response = { isError: true, batch: {}, errors: [] };
            resolve(response);
        });
	})
	return promise;
};

var update = (id, batch) => {
	var promise = new Promise((resolve, reject) => {
		schema.findOneAndUpdate({ '_id': id }, { $set : batch }, { new : true }, (error, result) =>{
			if(error) {
				var response = { isError: true, batch: {}, errors: [{"msg": "Failed to update batch!"}] };
            	resolve(response);
			} else {
				var response = { isError: false, batch: result, errors: [] };
            	resolve(response);
			}
		})
	});
	return promise;
};

var deleteMany = (ids) => {
	var promise = new Promise((resolve, reject) => {
		schema.deleteMany({ '_id' : { $in : ids }}).then((result) => {
			var response = { isError: false, batches: result, errors: [] };
            resolve(response);
		}).catch((err) => {
            var response = { isError: true, batches: {}, errors: [] };
            resolve(response);
        });	
	});
	return promise;
};

var list = (obj) => {
    var promise = new Promise((resolve, reject) => {
        var filter = [];

        var matchQuery = {
            affiliateId: mongoose.Types.ObjectId(obj.affiliateId)
        };

        filter.push({ $match: matchQuery });

        filter.push({
            $lookup: {
                from: "affiliates",
                localField: "affiliateId",
                foreignField: "_id",
                as: "affiliate"
            }
        });

        
        filter.push({
            $unwind: {
                "path": "$affiliate",
                "preserveNullAndEmptyArrays": true
            }
        });

        filter.push({
            $lookup: {
                from: "institutes",
                localField: "instituteId",
                foreignField: "_id",
                as: "institute"
            }
        });

        filter.push({
            $unwind: {
                "path": "$institute",
                "preserveNullAndEmptyArrays": true
            }
        });

        filter.push({
            $lookup: {
                from: "courses",
                localField: "courseId",
                foreignField: "_id",
                as: "course"
            }
        });

        filter.push({
            $unwind: {
                "path": "$course",
                "preserveNullAndEmptyArrays": true
            }
        });

        var query = schema.aggregate(filter);

        query.exec((err, records) => {

            if (!err || records) {
                var batches = [];
                for(var i=0; i < records.length; i++) {
                    var record = records[i];
                    if(record) {
                        var batch = record;
                        batch.institute = record.institute;
                        batch.affiliate = record.affiliate;
                        batch.course = record.course;
                        batches.push(batch);
                    }
                }
                var response = { isError: false, batches: batches };
                resolve(response);
            } else {
                var response = { isError: true, batches: [] };
                resolve(response);
            }
        })
    });

    return promise;
}

var findById = (id) => {
    var promise = new Promise((resolve, reject) => {
		var data = {
            _id: id
        };
		schema.findOne(data, (err, result) => {
			if(!err && result && result._id) {
                var response = {isError: false, batch: result, errors: []};
                resolve(response);
            } else {
                var response = {isError: true, batch: {}, errors: [{param: "id", msg: "Invalid batch id"}]};
                resolve(response);
            }
		});
	});

	return promise;
};

module.exports = {
	create,
	update,
	deleteMany,
	list,
	findById
}
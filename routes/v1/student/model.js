var schema = require('./schema');
var mongoose = require('mongoose');

var findById = (id) => {
    var promise = new Promise((resolve, reject) => {
        var data = {
            _id: id
        };
		schema.findOne(data, (err, result) => {
			if(!err && result && result._id) {
                var response = {isError: false, student: result, errors: []};
                resolve(response);
            } else {
                var response = {isError: true, student: {}, errors: [{param: "id", msg: "Invalid student id"}]};
                resolve(response);
            }
		});
    });

    return promise;
};

var create = (student) => {
	var promise = new Promise((resolve, reject) => {
		var document = new schema(student);
		document.save().then(function(result) {
			var response = { isError: false, student: result, errors: [] };
            resolve(response);
		}).catch((err) => {
            var response = { isError: true, student: {}, errors: [] };
            resolve(response);
        });
	})
	return promise;
};

var insertMany = (students) => {
	var promise = new Promise((resolve, reject) => {
		schema.insertMany(students, function(err, result) {
			console.log("error", err);
			if(!err) {
				var response = { isError: false, students: result, errors: [] };
            	resolve(response);
			} else {
				var response = { isError: true, students: {}, errors: [] };
            	resolve(response);
			}
		})
	})
	return promise;
};

var list = (obj) => {
	var promise = new Promise((resolve, reject) => {
		var filter = [];

        var matchQuery = {
			affiliateId: mongoose.Types.ObjectId(obj.affiliateId),
		};
		
		if(obj.batchId) {
			matchQuery.batchId = mongoose.Types.ObjectId(obj.batchId)
		}

		filter.push({ $match: matchQuery });

		filter.push({
            $lookup: {
                from: "batches",
                localField: "batchId",
                foreignField: "_id",
                as: "batch"
            }
        });

        
        filter.push({
            $unwind: {
                "path": "$batch",
                "preserveNullAndEmptyArrays": true
            }
        });

		var query = schema.aggregate(filter);
		
		query.exec((err, students) => {
			if (!err || students) {
                var response = { isError: false, students: students };
                resolve(response);
			} else {
                var response = { isError: true, students: [] };
                resolve(response);
            }
		});
	});
	return promise;
};

var update1 = (id, student) => {
	var promise = new Promise((resolve, reject) => {
		draftSchema.findOneAndUpdate({ '_id': id }, { $set : student }, { new : true }, (error, result) =>{
			if(error) {
				var response = { isError: true, student: {}, errors: [{"msg": "Failed to update student!"}] };
            	resolve(response);
			} else {
				var response = { isError: false, student: result, errors: [] };
            	resolve(response);
			}
		});
	});
	return promise;
};

var changeStatus = (data) => {
	var promise = new Promise((resolve, reject) => {
		schema.updateMany({ _id: data.studentId}, { $set : { status : data.status, reviewers: data.reviewers}}, (err, result) => {
			if(!err) {
				var response = { isError: false, errors: [] };
            	resolve(response);
			}else {
				var response = { isError: true, errors: [{msg: "failed to update the draft status"}] };
            	resolve(response);
			}
		});
	});
	return promise;
};

var findByCodes = (codes, batchId) => {
	var promise = new Promise((resolve, reject) => {

		var filter = {};
		if(batchId) {
			filter.batchId = mongoose.Types.ObjectId(batchId);
		}
		filter.code = { $in: codes };
		filter.status = { $ne: 'rejected'};

		schema.find(filter, (err, result) => {
			if(!err && result && result.length) {
				var response = { isError: false, students: result, errors: []};
            	resolve(response);
			} else {
				var response = { isError: false, errors: [{msg: "Invalid Students"}], students: [] };
            	resolve(response);
			}
		})
	})
	return promise;
};

var findByStatus = (data) => {
	var promise = new Promise((resolve, reject) => {
		var filter = {};

		filter.affiliateId = data.affiliateId;
		filter.batchId = data.batchId;
		filter.status = 'reviewed';

		schema.find(filter, (err, result) => {
			if(!err && result && result.length) {
				var response = { isError: false, errors: [], students: result};
            	resolve(response);
			} else {
				var response = { isError: false, errors: [{msg: "Can't update batch data!"}], students: [] };
            	resolve(response);
			}
		});
	});
	return promise;
};

var update = (id, data) => {
	var promise = new Promise((resolve, reject) => {
		schema.update({ _id: id}, { $set : data}, (err, result) => {
            if(!err) {
				var response = { isError: false, errors: [] };
            	resolve(response);
			}else {
				console.log("error", err);
				var response = { isError: true, errors: [{msg: "failed to update the student status"}] };
            	resolve(response);
			}
		});
	});
	return promise;
};

module.exports = {
	create,
	insertMany,
	list,
	update,
	findById,
	changeStatus,
	findByCodes,
	findByStatus
};
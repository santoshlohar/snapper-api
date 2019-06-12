var schema = require('./schema');
var mongoose = require('mongoose');

var insertMany = (certificates) => {
	var promise = new Promise((resolve, reject) => {
        
		schema.insertMany(certificates, function(err, result) {
			if(!err) {
				var response = { isError: false, certificates: result, errors: [] };
            	resolve(response);
			} else {
				var response = { isError: true, certificates: {}, errors: [] };
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
            instituteId: mongoose.Types.ObjectId(obj.instituteId),
            affiliateId: mongoose.Types.ObjectId(obj.affiliateId),
            batchId: mongoose.Types.ObjectId(obj.batchId),
            status: obj.status
        };

        filter.push({ $match: matchQuery });

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
                var drafts = [];
                for(var i=0; i < records.length; i++) {
                    var record = records[i];
                    if(record) {
                        var draft = record;
                        draft.batch = record.batch;
                        drafts.push(draft);
                    }
                }
                var response = { isError: false, drafts: drafts };
                resolve(response);
            } else {
                var response = { isError: true, drafts: [] };
                resolve(response);
            }
        })
    }); 
    return promise;
};

var findById = (id) => {
    var promise = new Promise((resolve, reject) => {
        var data = {
            _id: id
        };
		schema.findOne(data, (err, result) => {
			if(!err && result && result._id) {
                var response = {isError: false, draft: result, errors: []};
                resolve(response);
            } else {
                var response = {isError: true, draft: {}, errors: [{param: "id", msg: "Invalid draft id"}]};
                resolve(response);
            }
		});
    });

    return promise;
};

var update = (id, draft) => {
	var promise = new Promise((resolve, reject) => {
		schema.findOneAndUpdate({ '_id': id }, { $set : draft }, { new : true }, (error, result) =>{
			if(error) {
				var response = { isError: true, draft: {}, errors: [{"msg": "Failed to update draft!"}] };
            	resolve(response);
			} else {
				var response = { isError: false, draft: result, errors: [] };
            	resolve(response);
			}
		})
	});
	return promise;
};

var deleteMany = (ids) => {
	var promise = new Promise((resolve, reject) => {
		schema.deleteMany({ '_id' : { $in : ids }}).then((result) => {
			var response = { isError: false, drafts: result, errors: [] };
            resolve(response);
		}).catch((err) => {
            var response = { isError: true, drafts: {}, errors: [] };
            resolve(response);
        });	
	});
	return promise;
};

var findDraftByIds = (ids, departmentId) => {
    var promise = new Promise((resolve, reject) => {

        for(var i=0; i < ids.length; i++) {
            ids[i] = mongoose.Types.ObjectId(ids[i]);
        }

        var data = {
            _id: { "$in" : ids }
        };

        if(departmentId) {
            data.departmentId = mongoose.Types.ObjectId(departmentId);
        }

        schema.find(data, (err, result) => {
			if(!err && result && result.length) {
                var response = {isError: false, drafts: result, errors: []};
                resolve(response);
            } else {
                var response = {isError: true, drafts: [], errors: [{msg: "Invalid draft ids"}]};
                resolve(response);
            }
		});
    });

    return promise;
};

var changeStatus = (ids, status) => {
	var promise = new Promise((resolve, reject) => {
		schema.updateMany({ _id: { $in: ids }}, { $set : { status : status}}, (err, result) => {
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


module.exports = {
    insertMany,
    list,
    findById,
    update,
    deleteMany,
    findDraftByIds,
    changeStatus
};
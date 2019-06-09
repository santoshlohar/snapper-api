var schema = require('./schema');
var mongoose = require('mongoose');

var insertMany = (certificates) => {
	var promise = new Promise((resolve, reject) => {
		schema.insertMany(certificates, function(err, result) {
			console.log("certificates", certificates);
			console.log("certificates result", result);
			console.log("certificates err", err);
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

var findByMultipleIds = (obj) => {
    var promise = new Promise((resolve, reject) => {
        var filter = [];

        var matchQuery = {
            _id: mongoose.Types.ObjectId(obj.id),
            instituteId: mongoose.Types.ObjectId(obj.instituteId),
			departmentId: mongoose.Types.ObjectId(obj.departmentId)
        };

        if(obj.affiliateId) {
            matchQuery.affiliateId = mongoose.Types.ObjectId(obj.affiliateId);
        };

        if(obj.batchId) {
            matchQuery.batchId = mongoose.Types.ObjectId(obj.batchId);
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

        var query = schema.aggregate(filter);

        query.exec((err, record) => {
            if(!err || record) {
                var certificate = record[0];
                var response = {isError: false, certificate: certificate, errors: []};
                resolve(response);
            }else {
                var response = {isError: true, certificate: {}, errors: [{param: "id", msg: "Invalid certificate id"}]};
                resolve(response);
            }
        });
    });

    return promise;
};

var findById = (id, fetchReferences = false) => {
    var promise = new Promise((resolve, reject) => {

        var filter = [];

        var matchQuery = {
            _id: mongoose.Types.ObjectId(id)
        };

        filter.push({ $match: matchQuery });

        if(fetchReferences) {

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
        }

        var query = schema.aggregate(filter);

        query.exec((err, record) => {
            if(!err || record.length) {
                var certificate = record[0];
                var response = {isError: false, certificate: certificate, errors: []};
                resolve(response);
            }else {
                var response = {isError: true, certificate: {}, errors: [{param: "id", msg: "Invalid certificate id"}]};
                resolve(response);
            }
        });


    });

    return promise;
};

var list = (obj) => {
    var promise = new Promise((resolve, reject) => {
        var filter = [];

        var matchQuery = {
			instituteId: mongoose.Types.ObjectId(obj.instituteId),
			departmentId: mongoose.Types.ObjectId(obj.departmentId),
            affiliateId: mongoose.Types.ObjectId(obj.affiliateId),
            batchId: mongoose.Types.ObjectId(obj.batchId)
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
			console.log("records", records);
            if (!err || records) {
                var certificates = [];
                for(var i=0; i < records.length; i++) {
                    var record = records[i];
                    if(record) {
                        var certificate = record;
                        certificate.batch = record.batch;
                        certificates.push(certificate);
                    }
                }
                var response = { isError: false, certificates: certificates };
                resolve(response);
            } else {
                var response = { isError: true, certificates: [] };
                resolve(response);
            }
        })
    }); 
    return promise;
};

var findByHashIds = (hashIds) => {
    var promise = new Promise((resolve, reject) => {
		schema.find({ 'hash': { $in: hashIds }}, (err, result) => {
			if(!err && result) {
				var response = { isError: false, certificates: result, errors: []};
            	resolve(response);
			} else {
				var response = { isError: true, certificates: [], errors: [{msg: "Invalid Certificates"}] };
            	resolve(response);
			}
		})
	})
	return promise;
};

var changeStatus = (obj, action) => {
    var promise = new Promise((resolve, reject) => {

        var data = {
            status: obj.status
        };

        if(action == 'review') {
            data.reviewers = obj.reviewers;
        } else if(action == 'certify') {
            data.certifiers = obj.certifiers;
        }

		schema.updateMany({ _id: obj.certificateId}, { $set : data}, (err, result) => {
            if(!err) {
				var response = { isError: false, errors: [] };
            	resolve(response);
			}else {
				var response = { isError: true, errors: [{msg: "failed to update the certificate status"}] };
            	resolve(response);
			}
		});
	});
	return promise;
};

module.exports = {
    insertMany,
    findByMultipleIds,
    findById,
    list,
    findByHashIds,
    changeStatus,
}
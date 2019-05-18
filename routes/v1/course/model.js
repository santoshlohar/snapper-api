var schema = require('./schema');
var affiliateCourses = require('./affiliateSchema');
var mongoose = require('mongoose');


var create = (course) => {
    var promise = new Promise((resolve, reject) => {
        var document = new schema(course);
        document.save().then((result) => {
            var response = { isError: false, course: result, errors: [] };
            resolve(response);
        }).catch((error) => {
            var response = { isError: true, course: {}, errors: [] };
            resolve(response);
        });
    });

    return promise;
}

var list = (data) => {
    var promise = new Promise((resolve, reject) => {

        var filter = [];

        var matchQuery = {
            instituteId: mongoose.Types.ObjectId(data.instituteId),
            departmentId: mongoose.Types.ObjectId(data.departmentId)
        };

        filter.push({ $match: matchQuery });

        filter.push({
            "$lookup": {
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
            "$lookup": {
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
                var courses = [];
                for(var i=0; i < records.length; i++) {
                    var record = records[i];
                    if(record) {
                        var course = record;
                        course.institute = record.institute;
                        course.department = record.department;

                        courses.push(course);
                    }
                }
                var response = { isError: false, courses: courses };
                resolve(response);
            } else {
                var response = { isError: true, courses: [] };
                resolve(response);
            }
        });
    });

    return promise;
};


var getAffiliateCourses = (data) => {

    var promise = new Promise((resolve, reject) => {

        var filter = [];

        var matchQuery = {
            instituteId: mongoose.Types.ObjectId(data.instituteId),
            departmentId: mongoose.Types.ObjectId(data.departmentId)
        };
    
        if(data.affiliateId) {
            matchQuery.affiliateId = mongoose.Types.ObjectId(data.affiliateId);
        }


        filter.push({ $match: matchQuery });

        filter.push({
            "$lookup": {
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

        filter.push({
            "$lookup": {
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
            "$lookup": {
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

        if(data.affiliateId) {
            filter.push({
                "$lookup": {
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
        }

        var query = affiliateCourses.aggregate(filter);

        query.exec((err, records) => {
            if (!err || records) {
                var courses = [];
                for(var i=0; i < records.length; i++) {
                    var record = records[i];
                    if(record) {
                        courses.push(record);
                    }
                }

                var response = { isError: false, courses: courses };
                resolve(response);
            } else {
                console.log(err);
                var response = { isError: true, courses: [] };
                resolve(response);
            }
        });

    });

    return promise;
}

var findById = (id) => {
    var promise = new Promise((resolve, reject) => {
        var data = {
            _id: id
        };
        schema.findOne(data, (err, course) => {
            if(!err && (course && course._id) ){
                var response = {isError: false, course: course, errors: []};
                resolve(response);
            } else {
                var response = {isError: true, course: {}, errors: [{msg: "Invalid Course ID"}]};
                resolve(response);
            }
        });
    });

    return promise;
}

var update = (course) => {

    var promise = new Promise((resolve, reject) => {
        course.save().then((result) => {
            var response = { error: null, course: result };
            resolve(response);
        }).catch((error) => {
            var response = { error: error, course: {} };
            resolve(response);
        });
    });

    return promise;
}

var linkAffiliates = (courses,affiliateId) => {

    var saveCourse = (link) => {

        var promise = new Promise((resolve, reject) => {
            var document = new affiliateCourses(link);
            document.save().then((result) => {
                resolve(result);
            });
        });

        return promise;
    };

    var promise = new Promise((resolve, reject) => {

        var promises = [];
        for(var i=0; i < courses.length; i++) {
            var course = courses[i];

            var data = {
                courseId : course._id,
                instituteId: course.instituteId,
                departmentId: course.departmentId,
                affiliateId: affiliateId
            };
            promises.push(saveCourse(data));
        }

        Promise.all(promises).then((results) => {
            if(results.length == courses.length) {
                var response = { isError: false, courses: courses };
                resolve(response);
            }
        }).catch((error) => {
            var response = { isError: true, courses: [] };
            resolve(response);
        });
    });
    return promise;
}

var affiliateCourseUpdate = (id, course) => {
    var promise = new Promise((resolve, reject) => {
		affiliateCourses.findOneAndUpdate({ '_id': id }, { $set : course }, { new : true }, (error, result) =>{
			if(error) {
				var response = { isError: false, course: {}, errors: [{"msg": "Failed to update course status!"}] };
            	resolve(response);
			} else {
				var response = { isError: false, course: result, errors: [] };
            	resolve(response);
			}
		})
	});
	return promise;
}

module.exports = {
    create,
    findById,
    list,
    update,
    linkAffiliates,
    getAffiliateCourses,
    affiliateCourseUpdate
}
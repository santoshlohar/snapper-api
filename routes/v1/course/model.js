var schema = require('./schema');
var affiliateCourses = require('./affiliateSchema');

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
        schema.find({ instituteId: data.instituteId, departmentId: data.departmentId }).then((result) => {
            var response = {isError: false, courses: result, errors: [] };
            resolve(response);
        }).catch((error) => {
            var response = { isError: true, courses: {}, errors: [] };
            resolve(response);
        });
    });

    return promise;
}

var affiliateList = (data) => {
    var promise = new Promise((resolve, reject) => {

        var reqObj = {
            instituteId: data.instituteId,
            departmentId: data.departmentId
        };

        if(data.affiliateId) {
            reqObj.affiliateId = data.affiliateId;
        }

        affiliateCourses.find(reqObj).then((result) => {
            var response = {isError: false, courses: result, errors: [] };
            resolve(response);
        }).catch((error) => {
            var response = { isError: true, courses: {}, errors: [] };
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

module.exports = {
    create,
    findById,
    list,
    update,
    linkAffiliates,
    affiliateList
}
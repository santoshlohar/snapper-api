var schema = require('./schema');

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

module.exports = {
    create,
    findById,
    list,
    update
}
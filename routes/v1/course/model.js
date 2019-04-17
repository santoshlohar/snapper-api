var schema = require('./schema');

var create = (course) => {
    var promise = new Promise((resolve, reject) => {
        var document = new schema(course);
        document.save().then((result) => {
            var response = { error: null, course: result };
            resolve(response);
        }).catch((error) => {
            var response = { error: error, course: {} };
            resolve(response);
        });
    });

    return promise;
}

var getList = (data) => {
    var promise = new Promise((resolve, reject) => {
        schema.find({ instituteId: data.instituteId, departmentId: data.departmentId }).then((result) => {
            var response = { error: null, courses: result };
            resolve(response);
        }).catch((error) => {
            var response = { error: error, courses: {} };
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

        schema.findOne(data, (error, courseObj) => {
            if (!error) {
                var response = { error: null, course: courseObj };
                resolve(response);
            } else {
                var response = { error: true, course: {} };
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
    getList,
    update
}
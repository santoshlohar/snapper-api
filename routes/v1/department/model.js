var schema = require('./schema');


var GetDepartmentList = (req, res) => {
    console.log(req);
    schema.find().toArray((err, items) => {
        res.send(items);
    });

};


var findDeptByInstituteID = (instituteId) => {

    var promise = new Promise((resolve, reject) => {


        var data = {
            instituteId: instituteId.instituteId,
            name: instituteId.name
        };
        schema.findOne(data, (err, user) => {
            if (user != null) {
                console.log(user.instituteId);
                var response = { error: "0", user: {} };
                resolve(response);
            }

             else {

                var response = { error: "1", user: {}};
                resolve(response);
            }
       });
    });
    return promise;
};


var create = (department) => {

    var promise = new Promise((resolve, reject) => {
        var document = new schema(department);
        document.save().then(function (result) {
            var response = { error: null, institute: result };
            resolve(response);
        }).catch(function (err) {
            var response = { error: err, department: {} };
            resolve(response);
        });
    });

    return promise;

};

module.exports = {
    create,
    findDeptByInstituteID
};

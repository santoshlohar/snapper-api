var schema = require('./schema');
var bcrypt = require('bcrypt');
var otpSchema = require('./otpSchema');
var userSchema = require('./userSchema');

var generatePassword = (text) => {
    var promise = new Promise((resolve, reject) => {
        bcrypt.hash(text, 10, function(err, hash) {
            console.log(err);
            console.log(text + " ==== hash is === "+hash);
            if(!err) {
                resolve(hash);
            } else {
                resolve("");
            }
        });
    });
    
    return promise;
};


var create = (user) => {
    var promise = new Promise((resolve, reject) => {

        var text = Date.now() + Math.random();
        text = text.toString();

        generatePassword(text).then((hash) => {
            user.password = hash;
            var document = new schema(user);
            document.save().then(function(result) {
                var response = {error: null, user: result};
                resolve(response);
            }).catch((err) => {
                var response = {error: err, user: {}};
                resolve(response);
            });
        }).catch((err) => {
            var response = {error: true, user: {}};
            resolve(response);
        });
        
    });

    return promise;
};

var findByEmail = (email) => {

    var promise = new Promise((resolve, reject) => {

        var data = {
            email: email
        };
        console.log(data);

        schema.findOne(data, (err, user) => {
            console.log(err);
            console.log(user);
            if(!err) {
                var response = {error: false, user: user};
                resolve(response);
            } else {
                var response = {error: true, user: {}};
                resolve(response);
            }
        });
    });

    return promise;
};

var createOtp = (data) => {

    var promise = new Promise((resolve, reject) => {
        

        data.expiry = Date.now() + (15 * 60 * 1000);
        //generateOtp
        otp.code = "";

        var document = new otpSchema(data);
        document.save().then((otp) => {
            if(otp._id) {
                //send email
                sendEmail();
                resolve({error: false, otp: otp});
            }
        }).catch((err) => {
            console.log(err);
            resolve({error: true, otp: {}});
        });


    });

    return promise;
};

var sendEmail = () => {

};

var userDetails = (user) => {
    var promise = new Promise((resolve, reject) => {
        var document = new userSchema(user);
        document.save().then(function(result) {
            var response = {error: null, user: result};
            resolve(response);
        }).catch((err) => {
            var response = {error: err, user: {}};
            resolve(response);
        });
    });

    return promise;
}

module.exports = {
    create,
    findByEmail,
    createOtp,
    userDetails
};
var schema = require('./schema');
var bcrypt = require('bcrypt');
var otpSchema = require('./otpSchema');
var otpGenerator = require('otp-generator');
var sendMail = require('node-email-sender');
var mongo = require('mongoose');
var moment = require('moment');

var generatePassword = (text) => {
    var promise = new Promise((resolve, reject) => {
        bcrypt.hash(text, 10, function (err, hash) {
            if (!err) {
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
            document.save().then(function (result) {
                var response = { error: null, user: result };
                resolve(response);
            }).catch((err) => {
                var response = { error: err, user: {} };
                resolve(response);
            });
        }).catch((err) => {
            var response = { error: true, user: {} };
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

        schema.findOne(data, (err, user) => {
            if (!err) {
                var response = { error: false, user: user };
                resolve(response);
            } else {
                var response = { error: true, user: {} };
                resolve(response);
            }
        });
    });

    return promise;
};

var findOtp = (params) => {

    var promise = new Promise((resolve, reject) => {

        var data = {
            email: params.email,
            code: params.code
        };

        otpSchema.findOne(data, (err, otp) => {
            if (!err && otp && otp._id && otp.isActive && !otp.isVerified) {
                var isOtpExpired = checkOtpExpiry(otp.expiry);
                if(isOtpExpired) {
                    var response = { isError: true, otp: {}, errors: [{param: 'code', msg: 'OTP is expired'}]};
                } else {
                    var response = { isError: false, otp: otp, errors: []};
                }
            } else {
                var response = { isError: true, otp: {}, errors: [{param: 'code', msg: 'OTP is invalid'}]};
            }
            resolve(response);
        });
    });

    return promise;
};


var checkOtpExpiry = (expiry) => {
    if(moment() > moment(expiry)) {
        
        return true;
    }
    return false;
};

var updatePassword = (user) => {

    var promise = new Promise((resolve, reject) => {
        generatePassword(user.password).then((hash) => {
            if(hash) {
                schema.findOneAndUpdate({ "_id": user.userId }, { $set: { "password": hash } }, () => {
                    var response = {isError: false, user: {_id: user.userId}, errors: []};
                    resolve(response);
                });
            } else {
                var response = {isError: true, user: {}, errors: [{param: 'password', msg :'Password update failed'}]};
            }
        });
    });

    return promise;
};

var updateOtp = (id) => {
    var promise = new Promise((resolve, reject) => {
        otpSchema.findOneAndUpdate({ "_id": id }, { $set: { "isActive": false, "isVerified": true } }, () => {
            var response = {isError: false, user: {_id: id}, errors: []};
            resolve(response);
        });
    });
    return promise;
};

var createOtp = (data) => {
    var promise = new Promise((resolve, reject) => {

        data.expiry = Date.now() + (15 * 60 * 1000);
        data.code = otpGenerator.generate(8, { upperCase: true, specialChars: false });

        var document = new otpSchema(data);
        document.save().then((otp) => {
            if (otp._id) {
                sendEmail(otp);
            }
            resolve({ isError: false, otp: otp });
        }).catch((err) => {
            resolve({ isError: true, otp: {} });
        });


    });

    return promise;
};

var sendEmail = (data) => {

    let emailConfig = {
        emailFrom: 'santosh.lohar@snapperfuturetech.com',
        transporterConfig: {
            service: 'gmail',
            auth: {
                user: 'santosh.lohar@snapperfuturetech.com',
                pass: 'Soham@2015'
            }
        }
    }
    var response = sendMail.sendMail({
        emailConfig: emailConfig,
        to: data.email,
        subject: 'OTP For reset password',
        content: 'Please Check following OTP for Reset Password request.' + data.code,
    });

};

module.exports = {
    create,
    findByEmail,
    createOtp,
    findOtp,
    updatePassword,
    updateOtp
};
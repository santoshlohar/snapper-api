var schema = require('./schema');
var sessionSchema = require('./sessionSchema');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var uuid4 = require('uuid4');
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
                var response = { isError: false, user: user };
                resolve(response);
            } else {
                var response = { isError: true, user: {} };
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

var genearetToken = (user, sessionId) => {
    var jwtSecret = 'gadiaagebadikinahi';
    var expire = Date.now() + (1 * 60 * 60 * 1000);
    var payload = { 
        userId: user.id, 
        role: user.role,
        instituteId: user.instituteId, 
        sessionId: sessionId, 
        expire: expire 
    };
    const token = jwt.sign(payload, jwtSecret);
    return token;
};

var createSession = (user) => {
    var promise = new Promise((resolve, reject) => {
        user = JSON.parse(JSON.stringify(user));
        user.id = user._id;
        delete user._id;
        delete user.password;
        user.refreshToken = uuid4();

        var document = new sessionSchema({
            userId: user._id,
            refreshToken: user.refreshToken
        });
        document.save(function(err, session) {
            if(err || !(session && session._id)) {
                var response = { isError: true, user: {} };
                resolve(response);
            } else {
                var sessionId = session._id;
                var token = genearetToken(user, sessionId);
                user.accessToken = token;
                var response = { isError: false, user: user };
                resolve(response);
            }
        });
    });

    return promise;
}

var verifyPassword = (user, password) => {
    var promise = new Promise((resolve, reject) => {

        bcrypt.compare(password, user.password, function(isError, result) {

            if (isError || !result) {
                var response = {isError: true, user: {}};
                resolve(response);
            } else {
                var response = {isError: false, user: user};
                resolve(response);
            }
        });
    });

    return promise;
}

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

var setNewPassword =   (userid) => {
        // console.log(userid);
        // console.log("User ID" + userid.userId);
        // console.log("User Password" + userid.password);
        var newPassword ="";
        generatePassword(userid.password).then((hash) => {
            newPassword=hash;
            });
       
        schema.findOneAndUpdate({"_id": userid.userId},{$set:{"password":newPassword}});
};
var createOtp = (data) => {
    var promise = new Promise((resolve, reject) => {
        data.expiry = Date.now() + (15 * 60 * 1000);
                //generateOtp
                data.code =otpGenerator.generate(8, { upperCase: true, specialChars: false });
                //console.log(otpGenerator.generate(6, { upperCase: true, specialChars: false }));
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
        to: "santosh.lohar@snapperfuturetech.com",
        subject: 'OTP For reset password',
        content: 'Please Check following OTP for Reset Password requees.' + data.code,
    });
     
                    //  console.log(response);
                    //console.log("Get Email and OTP Details :- " + data._id + "  "+ data.code)  
};

module.exports = {
    create,
    findByEmail,
    createOtp,
    findOtp,
    updatePassword,
    updateOtp,
    createSession,
    verifyPassword
};
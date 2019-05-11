var schema = require('./schema');
var sessionSchema = require('./sessionSchema');
var userRefSchema = require('./userRefSchema');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var uuid4 = require('uuid4');
var otpSchema = require('./otpSchema');
var otpGenerator = require('otp-generator');
var sendMail = require('node-email-sender');
var mongoose = require('mongoose');
var moment = require('moment');
var departmentSchema = require('./../department/schema');
var affiliateSchema = require('./../affiliate/schema');

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
                result = JSON.parse(JSON.stringify(result));
                result.role = user.role;
                result.entity = user.entity;
                result.instituteId = user.instituteId;

                if(user.departmentId) {
                    result.departmentId = user.departmentId;
                }
                if(user.affiliateId) {
                    result.affiliateId = user.affiliateId;
                }

                saveUserReferences(result).then((data) => {
                    if(data.isError || !(data.reference && data.reference._id)) {
                        var response = { isError: true, user: {} };
                        resolve(response);
                    } else {
                        result.referenceId = data.reference._id;
                        var response = { isError: false, user: result };
                        resolve(response);
                    }
                });
               
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

        var filter = [];

        var matchQuery = {
            email: email,
            isActive: true
        };

        filter.push({ $match: matchQuery});

        filter.push({
            "$lookup": {
                from: "userreferences",
                localField: "_id",
                foreignField: "userId",
                as: "reference"
            }
        });

        filter.push({
            $unwind: "$reference"
        });

        // filter.push({
        //     "$project": {
        //         "refrence.instituteId" : 1,
        //         "reference.role": 1,
        //     }
        // })

        var query = schema.aggregate(filter);

        //var query = schema.findOne({email: email});
        
        query.exec((err, users) => {
            console.log(users);
            if (!err || users.length) {
                var response = { isError: false, user: users[0] };
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

var generateToken = (user, sessionId) => {
    var jwtSecret = 'gadiaagebadikinahi';
    var expire = Date.now() + (1 * 60 * 60 * 1000);
    var payload = { 
        userId: user._id, 
        role: user.reference.role,
        entity: user.reference.entity,
        instituteId: user.reference.instituteId, 
        sessionId: sessionId, 
        expire: expire 
    };

    if(user.departmentId) {
        payload.departmentId = user.departmentId;
    }

    if(user.affiliateId) {
        payload.affiliateId = user.affiliateId;
    }

    if(user.referenceId) {
        payload.referenceId = user.referenceId;
    }

    const token = jwt.sign(payload, jwtSecret);
    return token;
};

var createSession = (user) => {
    var promise = new Promise((resolve, reject) => {
        user = JSON.parse(JSON.stringify(user));
        delete user.password;
        user.refreshToken = uuid4();
        var data = JSON.stringify(user);

        var document = new sessionSchema({
            userId: user._id,
            refreshToken: user.refreshToken,
            data: data
        });
        document.save(function(err, session) {
            if(err || !(session && session._id)) {
                var response = { isError: true, user: {} };
                resolve(response);
            } else {
                var sessionId = session._id;
                var token = generateToken(user, sessionId);
                user.accessToken = token;
                var response = { isError: false, user: user };
                resolve(response);
            }
        });
    });

    return promise;
};

var updateSession = (user) => {
};

var verifyPassword = (user, password) => {
    console.log(password);
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

        var document = new otpSchema(data);
        document.save().then((otp) => {
            if (otp._id) {
                sendEmail(otp);
            }
            resolve({ isError: false, otp: otp });
        }).catch((err) => {
            console.log(err);
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

var saveUserReferences = (user) => {
    var promise = new Promise((resolve, reject) => {

        var data = {
            userId: user._id,
            instituteId: user.instituteId,
            departmentId: user.departmentId,
            affiliateId: user.affiliateId,
            role: user.role,
            entity: user.entity
        };

        var document = new userRefSchema(data);
        document.save().then(function(result) {
            console.log(result);
            var response = {isError: false, reference: result};
            resolve(response);
        }).catch((err) => {
            console.log(err);
            var response = {isError: true, reference: {}};
            resolve(response);
        });
    });

    return promise;
}; 

var getUserRefrences = (obj) => {
    var promise = new Promise((resolve, reject) => {
        userRefSchema.find(obj).then((result) => {
            console.log(result);
            var response = {isError: false, references: result, errors: [] };
            resolve(response);
        }).catch((err) => {
            console.log(err);
            var response = { isError: true, references: {}, errors: [] };
            resolve(response);
        });
    });
    return promise;
};

var list = (obj) => {
    var promise = new Promise((resolve, reject) => {


        var filter = [];

        var matchQuery = {
            instituteId: mongoose.Types.ObjectId(obj.instituteId)
        };

        if(obj.departmentId) {
            matchQuery.departmentId = mongoose.Types.ObjectId(obj.departmentId);
        } 
    
        if(obj.affiliateId) {
            matchQuery.affiliateId = mongoose.Types.ObjectId(obj.affiliateId);
        }

        if(obj.entity && obj.entity.length) {
            matchQuery.entity = {"$in" : obj.entity};
        }

        if(obj.roles && obj.roles.length) {
            matchQuery.role = {"$in" : obj.roles};
        }

        filter.push({ $match: matchQuery });

        filter.push({
            "$lookup": {
                from: "institute",
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
                from: "users",
                localField: "userId",
                foreignField: "_id",
                as: "user"
            }
        });

        if(!obj.departmentId) {
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
        }

        if(!obj.affiliateId) {
            filter.push({
                "$lookup": {
                    from: "affiliate",
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

        var query = userRefSchema.aggregate(filter);

        query.exec((err, references) => {
            if (!err || references) {
                var users = [];
                for(var i=0; i < references.length; i++) {
                    var reference = references[i];
                    if(reference.user) {
                        var user = reference.user[0];
                        delete user.password;
                        user.institute = reference.institute;
                        user.department = {};
                        user.affiliate = {};

                        if(reference.department) {
                            user.department = reference.department;
                        }

                        if(reference.affiliate) {
                            user.affiliate = reference.affiliate;
                        }

                        user.reference = {
                            role: reference.role,
                            entity: reference.entity,
                            affiliateId: reference.affiliateId,
                            departmentId: reference.departmentId,
                            instituteId: reference.instituteId
                        };

                        users.push(user);
                    }
                }

                var response = { isError: false, users: users };
                resolve(response);
            } else {
                console.log(err);
                var response = { isError: true, users: [] };
                resolve(response);
            }
        });




    });

    return promise;
};

module.exports = {
    create,
    findByEmail,
    createOtp,
    findOtp,
    updatePassword,
    updateOtp,
    createSession,
    verifyPassword,
    updateSession,
    list
};
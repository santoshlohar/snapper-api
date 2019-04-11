var schema = require('./schema');
var bcrypt = require('bcrypt');
var otpSchema = require('./otpSchema');
var otpGenerator = require('otp-generator');
var sendMail = require('node-email-sender');
 
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
       

        schema.findOne(data, (err, user) => {
           // console.log( "Email Finding Error   " + err);
          //  console.log(user);
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

var findOtpDetails = (email) => {

    var promise = new Promise((resolve, reject) => {

        var data = {
            email: email
        };
        otpSchema.findOne(data, (err, user) => {
       //    console.log ("Find OTP By EMail -"+ user);
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


var resetNewPassword = (userid) => {

    var promise = new Promise((resolve, reject) => {

        // var data = {
        //     _id: _id,
        //     password: password
        // };
        // console.log(resolve);
       console.log(userid);
        console.log("User ID" + userid.userId);
        console.log("User Password" + userid.password);

        schema.findOneAndUpdate({"_id":ObjectId(userid.userId)},{$set:{"password":userid.password}});
    });

    return promise;
};


var createOtp = (data) => {
    var promise = new Promise((resolve, reject) => {
        data.expiry = Date.now() + (15 * 60 * 1000);
                //generateOtp
                data.code =otpGenerator.generate(8, { upperCase: true, specialChars: false });
                //console.log(otpGenerator.generate(6, { upperCase: true, specialChars: false }));
        var document = new otpSchema(data);
        document.save().then((otp) => {
            if(otp._id) {
                
                //send email
                sendEmail(otp);
                
                resolve({error: false, otp: otp});
            }
        }).catch((err) => {
          //  console.log( "Error in Create OTP" + err);
            resolve({error: true, otp: {}});
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
    findOtpDetails,
    resetNewPassword
};
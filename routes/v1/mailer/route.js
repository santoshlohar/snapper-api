var express = require('express');
var router = express.Router();
var schema = require('./schema');
var model = require('./model');
var usermodel = require('../user/schema');
//var userModel = require('../user/model');
var nodemailer = require('nodemailer');
router.get('/sendmail', function(req, res) {
    var onError = (errors, statusCode) => {
        if (!(Array.isArray(errors) && errors.length)) {
            errors = [{
                "msg": "Failed to Sending OTP Email."
            }];
        }
        req.app.responseHelper.send(res, false, {}, errors, statusCode);
    };
    
    usermodel.findOne({ email:req.body.email}   )
            .exec(function (err, collections) {
//          res.send(collections);
        if (collections._id !="")
        {
                

            var OTPLogs = collections._id
            console.log(OTPLogs);
            //res.send(OTPLogs);
            model.create(OTPLogs).then((data) => {
            //OTPLogs.email= OTPLogs.email;   
            //OTPLogs.refId= OTPLogs._id;
            if(data.error) {
                     // onError([], 500);
                    console.log(data);
                } else {
                    console.log(" Table Creatin in Process" + OTPLogs);
                    req.app.responseHelper.send(res, true, OTPLogs, [], 200);
                }
            }).catch((err) => {
               // onError([], 500);
            });
            var transporter = nodemailer.createTransport(
                        {
                                service: 'gmail',
                                auth: 
                                {
                                user: 'santosh.lohar@snapperfuturetech.com',
                                pass: 'Soham@2015'
                                }               
                        });
            var mailOptions = {
                            from: 'santosh.lohar@snapperfuturetech.com',
                            to: 'santosh.lohar@snapperfuturetech.com',
                            subject: 'Sending Email using Node.js',
                            text:   "This is Test Line By Santosh  -    " + collections._id + '< /p>'
                                    + "New Line2"
                              };
            transporter.sendMail(mailOptions, function(error, info)
                    {
                    if (error) {
                    //console.log(error);
                    } else {
                    //console.log('Email sent: ' + info.response);
                    }
                    });
        }
        else
        {
            console.log("User Not Found")x`;
        }
    
    });

});
module.exports = router;

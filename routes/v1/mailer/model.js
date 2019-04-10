var schema = require('./schema');

var create = (OTPLogs) => {
    var promise = new Promise((resolve, reject) => {
        
        var add_minutes =  function (dt, minutes) {
            return new Date(dt.getTime() + minutes*60000);
        }
        OTPLogs.refId=OTPLogs._id,
        OTPLogs.email=OTPLogs.email,
        OTPLogs.otp="123456",
        OTPLogs.createdDate=Date.now(),
        OTPLogs.validTime=add_minutes(new Date(Date.now()), 5).toString();

      var document = new schema(OTPLogs);
            document.save().then(function(result) {
                var response = {error: null, OTPLogs: result};
                resolve(response);
            }).catch((err) => {
                var response = {error: err, OTPLogs: {}};
                resolve(response);
            });
    });
    return promise;
};

module.exports = {
    create
};
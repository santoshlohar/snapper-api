var schema = require('./schema');


var create = (uploadfiles) => {
    var document = new schema(uploadfiles);
    var MongoClient = require('mongodb').MongoClient;
    var url =  "mongodb://localhost:27017/";

    MongoClient.connect(url, { useNewUrlParser: true }, function (err, db) {
        if (err) throw err;
        var dbo = db.db("testingDB");
        var myobj = 
            uploadfiles
       ;
        dbo.collection("products").insertMany(myobj, function (err, res) {
            if (err) throw err;
            console.log(myobj);
            db.close();
        });
    });
};

module.exports = {
    create
};

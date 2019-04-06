var config = {
	"PORT" : 27017,
 	"MONGODB_USERNAME": encodeURIComponent("monuser"),
 	"MONGODB_PASSWORD": encodeURIComponent("ayavamas"),
 	"MONGODB_DBNAME": "syntro_mon"
};

config.MONGODB_URI = `mongodb://${config.MONGODB_USERNAME}:${config.MONGODB_PASSWORD}@localhost/${config.MONGODB_DBNAME}` 

module.exports = config;
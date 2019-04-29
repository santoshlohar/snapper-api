var config = {
	"PORT" : 27017,
 	"MONGODB_USERNAME": encodeURIComponent("monuser"),
 	"MONGODB_PASSWORD": encodeURIComponent("ayavamas"),
	"MONGODB_DBNAME": "certificate_db",
	"PRIVATE_KEY": "gadiaagebadikinahi"
};

config.MONGODB_URI = `mongodb://localhost/${config.MONGODB_DBNAME}`

module.exports = config;
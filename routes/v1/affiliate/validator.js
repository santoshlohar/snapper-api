var affiliate = (req) => {

	try {

		req.checkBody("name", "Affiliated Institute name is required!").notEmpty();
		req.checkBody("instituteId", "Institute ID is required!").notEmpty();
		req.checkBody("departmentId", "Department ID is required!").notEmpty();
		req.checkBody("address", "Address is required!").notEmpty();

		var errors = req.validationErrors();

	} catch(e) {
		var errors = [{msg: "Something went wrong!"}];
	}

	return errors;

}

var checkId = (req) => {

	req.checkParams("id", "Not Integer" ).toInt();
	req.checkQuery("limit", "Limit cannot be blank").exists();
    req.checkQuery("offset", "Offset cannot be blank").exists();
}

module.exports = {
	affiliate,
	checkId
}
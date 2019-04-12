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

module.exports = {
    affiliate
}
var batch = (req) => {
	try {
		req.checkBody("instituteId", "Institute ID is required!").notEmpty();
		req.checkBody("affiliateId", "Affiliate ID is required!").notEmpty();
		req.checkBody("courseId", "Course ID is required!").notEmpty();
		req.checkBody("code", "Batch ID is required!").notEmpty();
		req.checkBody("year", "Batch year is required!").notEmpty();
		req.checkBody("start", "Batch start year is required!").notEmpty();
		req.checkBody("end", "Batch end year is required!").notEmpty();
		req.checkBody("minScore", "Min Score is required!").notEmpty();
		req.checkBody("totalScore", "Total Score is required!").notEmpty();

		var errors = req.validationErrors();
	}catch(e) {
		var errors = [{msg: "Something went wrong!"}];
	}

	return errors;
}

module.exports = {
    batch
}
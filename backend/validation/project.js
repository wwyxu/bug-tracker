const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProjectInput(data) {
  let errors = {};

  data.projectname = !isEmpty(data.projectname) ? data.projectname : "";
  data.projectdescription = !isEmpty(data.projectdescription)
    ? data.projectdescription
    : "";

  if (Validator.isEmpty(data.projectname)) {
    errors.projectname = "Project name is required";
  }

  if (!Validator.isLength(data.projectname, { min: 5, max: 30 })) {
    errors.projectname = "Project name must be between 5 and 30 characters";
  }

  if (Validator.isEmpty(data.projectdescription)) {
    errors.projectdescription = "Project description is required";
  }

  if (!Validator.isLength(data.projectdescription, { min: 5, max: 100 })) {
    errors.projectdescription =
      "Project description must be between 5 and 100 characters";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

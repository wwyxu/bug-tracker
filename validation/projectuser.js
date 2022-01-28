const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProjectUserInput(data) {
  let errors = {};

  data.user = !isEmpty(data.role) ? data.user : "";

  if (Validator.isEmpty(data.role)) {
    errors.role = "Role is required";
  }

  if (!Validator.isLength(data.role, { max: 15 })) {
    errors.role = "Role cannot exceed 15 characters in length";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

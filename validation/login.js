const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateLoginInput(data) {
  let errors = {};

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!Validator.isEmail(data.email)) {
    errors.emaillogin = "Email is invalid";
  }

  if (Validator.isEmpty(data.email)) {
    errors.emaillogin = "Email field is required";
  }

  if (Validator.isEmpty(data.password)) {
    errors.passwordlogin = "Password field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};

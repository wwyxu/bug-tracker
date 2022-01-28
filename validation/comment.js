const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentInput(data) {
  let errors = {};

  data.comment = !isEmpty(data.comment) ? data.comment : "";

  if (Validator.isEmpty(data.comment)) {
    errors.comment = "Comment is required";
  }

  if (!Validator.isLength(data.comment, { max: 100 })) {
    errors.comment = "Comment must be 100 characters or less";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateTicketInput(data) {
  let errors = {};

  data.ticketname = !isEmpty(data.ticketname) ? data.ticketname : "";
  data.ticketdescription = !isEmpty(data.ticketdescription)
    ? data.ticketdescription
    : "";
  data.priority = !isEmpty(data.priority) ? data.priority : "";

  if (!Validator.isLength(data.ticketname, { max: 30 })) {
    errors.ticketname = "Ticket cannot exceed 30 characters in length";
  }

  if (Validator.isEmpty(data.ticketname)) {
    errors.ticketname = "Ticket name is required";
  }

  if (!Validator.isLength(data.ticketdescription, { max: 100 })) {
    errors.ticketdescription =
      "Description cannot exceed 100 characters in length";
  }

  if (Validator.isEmpty(data.ticketdescription)) {
    errors.ticketdescription = "Ticket Description is required";
  }

  if (Validator.isEmpty(data.priority)) {
    errors.priority = "Ticket priority is required";
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

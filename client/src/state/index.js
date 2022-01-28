import { combineReducers } from "redux";
import authState from "./auth";
import errorState from "./error";
import profileState from "./profile";
import projectState from "./project";
import ticketState from "./ticket";
import userState from "./user";

export default combineReducers({
  auth: authState,
  errors: errorState,
  profile: profileState,
  project: projectState,
  ticket: ticketState,
  user: userState,
});

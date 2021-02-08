import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import profileReducer from "./profileReducer";
import projectReducer from "./projectReducer";
import ticketReducer from "./ticketReducer";
import userReducer from "./userReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  profile: profileReducer,
  project: projectReducer,
  ticket: ticketReducer,
  user: userReducer,
});

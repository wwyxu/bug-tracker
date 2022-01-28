import axios from "axios";
import setAuthToken from "../../../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  CLEAR_ERRORS,
  AUTH_LOADING,
  REGISTER_SUCCESS,
  CLEAR_SUCCESS,
  CLEAR_LOADING,
} from "../../../ops";

export const registerUser = (userData) => (dispatch) => {
  dispatch(authLoading());
  dispatch(clearSuccess());
  axios
    .post("/api/users/register", userData)
    .then((res) => {
      dispatch(clearErrors());
      dispatch(registerSuccess());
      dispatch(clearLoading());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      dispatch(clearLoading());
    });
};

export const loginUser = (userData) => (dispatch) => {
  dispatch(clearErrors());
  dispatch(authLoading());
  dispatch(clearSuccess());
  axios
    .post("/api/users/login", userData)
    .then((res) => {
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      setAuthToken(token);
      const decoded = jwt_decode(token);
      dispatch(setCurrentUser(decoded));
      dispatch(clearLoading());
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
      dispatch(clearLoading());
    });
};

export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("jwtToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

export const authLoading = () => {
  return {
    type: AUTH_LOADING,
  };
};

export const clearLoading = () => {
  return {
    type: CLEAR_LOADING,
  };
};

export const clearSuccess = () => {
  return {
    type: CLEAR_SUCCESS,
  };
};

export const registerSuccess = () => {
  return {
    type: REGISTER_SUCCESS,
  };
};

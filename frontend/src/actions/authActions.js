import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  CLEAR_ERRORS,
  AUTH_LOADING,
  REGISTER_SUCCESS,
  CLEAR_LOADING,
  CLEAR_SUCCESS,
} from "./types";

// Register User
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

// Login - Get User Token
export const loginUser = (userData) => (dispatch) => {
  dispatch(clearErrors());
  dispatch(authLoading());
  dispatch(clearSuccess());
  axios
    .post("/api/users/login", userData)
    .then((res) => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to ls
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
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

// Set logged in user
export const setCurrentUser = (decoded) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
  };
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
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

import axios from "axios";

import { GET_USER, USER_LOADING } from "./types";

// Get User by ID
export const getUserById = (userId) => (dispatch) => {
  dispatch(setUserLoading());
  axios
    .get(`/api/users/getuser/${userId}`)
    .then((res) =>
      dispatch({
        type: GET_USER,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_USER,
        payload: null,
      })
    );
};

// Profile loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

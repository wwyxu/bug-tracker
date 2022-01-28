import axios from "axios";

import { GET_USER, USER_LOADING } from "../../../ops";

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

export const setUserLoading = () => {
  return {
    type: USER_LOADING,
  };
};

import isEmpty from "../../utils/is-empty";

import {
  SET_CURRENT_USER,
  AUTH_LOADING,
  CLEAR_LOADING,
  REGISTER_SUCCESS,
  CLEAR_SUCCESS,
} from "../../ops";

const initialState = {
  isAuthenticated: false,
  loading: false,
  success: false,
  user: {},
};

export default function (state = initialState, action) {
  switch (action.type) {
    case AUTH_LOADING:
      return {
        ...state,
        loading: true,
        success: false,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
      };
    case CLEAR_LOADING:
      return {
        ...state,
        loading: false,
      };
    case CLEAR_SUCCESS:
      return {
        ...state,
        success: false,
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.payload),
        user: action.payload,
        loading: false,
        success: false,
      };
    default:
      return state;
  }
}

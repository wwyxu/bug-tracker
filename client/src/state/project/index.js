import {
  ADD_PROJECT,
  GET_PROJECTS,
  GET_PROJECT,
  DELETE_PROJECT,
  PROJECT_LOADING,
} from "../../ops";

const initialState = {
  projects: [],
  project: {},
  loading: false,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case PROJECT_LOADING:
      return {
        ...state,
        loading: true,
      };
    case GET_PROJECTS:
      return {
        ...state,
        projects: action.payload,
        loading: false,
      };
    case GET_PROJECT:
      return {
        ...state,
        project: action.payload,
        loading: false,
      };
    case ADD_PROJECT:
      return {
        ...state,
        projects: [action.payload, ...state.projects],
      };
    case DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(
          (project) => project._id !== action.payload
        ),
      };
    default:
      return state;
  }
}

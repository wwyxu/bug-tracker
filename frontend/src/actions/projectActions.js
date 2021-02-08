import axios from "axios";

import {
  ADD_PROJECT,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_PROJECTS,
  GET_PROJECT,
  PROJECT_LOADING,
  DELETE_PROJECT,
} from "./types";

// Create Project
export const createProject = (projectData, history) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .post("/api/projects", projectData)
    .then((res) =>
      dispatch({
        type: ADD_PROJECT,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Edit Project
export const editProject = (id, projectData, history) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .post(`/api/projects/edit-project/${id}`, projectData)
    .then((res) => history.push(`/project/${id}`))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Get All Projects
export const getProjects = () => (dispatch) => {
  dispatch(setProjectLoading());
  axios
    .get("/api/projects")
    .then((res) =>
      dispatch({
        type: GET_PROJECTS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROJECTS,
        payload: null,
      })
    );
};

// Get Project
export const getProject = (id, pg) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .get(`/api/projects/${id}/${pg}`)
    .then((res) =>
      dispatch({
        type: GET_PROJECT,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROJECT,
        payload: null,
      })
    );
};

// Get Project
export const getLoadingProject = (id, pg) => (dispatch) => {
  dispatch(clearErrors());
  dispatch(setProjectLoading());
  axios
    .get(`/api/projects/${id}/${pg}`)
    .then((res) =>
      dispatch({
        type: GET_PROJECT,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROJECT,
        payload: null,
      })
    );
};

// Delete Ticket From Project
export const deleteProjectTicket = (projectId, ticketId, pg) => (dispatch) => {
  axios
    .delete(`/api/projects/tickets/${projectId}/${ticketId}/${pg}`)
    .then((res) => dispatch(getProject(projectId, pg)))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Edit User
export const editUser = (projectId, userId, userData, history) => (
  dispatch
) => {
  dispatch(clearErrors());
  axios
    .post(`/api/projects/edit-user/${projectId}/${userId}`, userData)
    .then((res) => history.push(`/project/${projectId}`))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Delete User
export const removeUser = (projectId, userId, pg) => (dispatch) => {
  axios
    .delete(`/api/projects/removeuser/${projectId}/${userId}`)
    .then((res) => dispatch(getProject(projectId, pg)))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Delete Project
export const deleteProject = (id) => (dispatch) => {
  if (window.confirm("Are you sure? This can not be undone!")) {
    axios
      .delete(`/api/projects/${id}`)
      .then((res) =>
        dispatch({
          type: DELETE_PROJECT,
          payload: id,
        })
      )
      .catch((err) =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
      );
  }
};

// Set loading state
export const setProjectLoading = () => {
  return {
    type: PROJECT_LOADING,
  };
};

// Clear errors
export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

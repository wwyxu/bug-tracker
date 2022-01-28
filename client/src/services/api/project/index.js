import axios from "axios";

import {
  ADD_PROJECT,
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_PROJECTS,
  GET_PROJECT,
  PROJECT_LOADING,
  DELETE_PROJECT,
} from "../../../ops";

export const createProject = (projectData) => (dispatch) => {
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

export const getProject = (id, pg, noLoading) => (dispatch) => {
  dispatch(clearErrors());
  if (!noLoading) {
    dispatch(setProjectLoading());
  }
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

export const setProjectLoading = () => {
  return {
    type: PROJECT_LOADING,
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

import axios from "axios";

import {
  GET_PROFILE,
  GET_PROFILES,
  GET_PROJECTPROFILES,
  PROFILE_LOADING,
  CLEAR_CURRENT_PROFILE,
  GET_ERRORS,
  SET_CURRENT_USER,
} from "./types";

// Get current profile
export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/myprofile")
    .then((res) => {
      let requests = res.data.requests.length;
      localStorage.setItem("requests", requests);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_PROFILE,
        payload: {},
      })
    );
};

export const getCurrentProfileNoLoad = () => (dispatch) => {
  axios
    .get("/api/profile/myprofile")
    .then((res) => {
      let requests = res.data.requests.length;
      localStorage.setItem("requests", requests);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_PROFILE,
        payload: {},
      })
    );
};

// Get profile by ID
export const getProfileById = (userId) => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/user/${userId}`)
    .then((res) =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROFILE,
        payload: null,
      })
    );
};

// Create Profile
export const createProfile = (profileData, history) => (dispatch) => {
  axios
    .post("/api/profile", profileData)
    .then((res) => history.push("/"))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Get all profiles
export const getProfiles = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get("/api/profile/all")
    .then((res) =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROFILES,
        payload: null,
      })
    );
};

// Get Uninvited Profiles
export const getUninvitedProfiles = (id) => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .all([
      axios.get(`/api/profile/uninvitedprofiles/${id}`),
      axios.get(`/api/projects/${id}`),
    ])
    .then(
      axios.spread((profileData, projectData) => {
        dispatch({
          type: GET_PROJECTPROFILES,
          payload: profileData.data,
          payload2: projectData.data,
        });
      })
    )
    .catch((err) => {
      dispatch({
        type: GET_PROJECTPROFILES,
        payload: null,
        payload2: null,
      });
    });
};

// Get Uninvited Profiles
export const getUninvitedProfilesWithoutLoading = (id) => (dispatch) => {
  axios
    .all([
      axios.get(`/api/profile/uninvitedprofiles/${id}`),
      axios.get(`/api/projects/${id}`),
    ])
    .then(
      axios.spread((profileData, projectData) => {
        dispatch({
          type: GET_PROJECTPROFILES,
          payload: profileData.data,
          payload2: projectData.data,
        });
      })
    )
    .catch((err) => {
      dispatch({
        type: GET_PROJECTPROFILES,
        payload: null,
        payload2: null,
      });
    });
};

// Invite User to Project
export const inviteUser = (userId, projectData, projectId) => (dispatch) => {
  axios
    .post(`/api/profile/invite/${userId}`, projectData)
    .then((res) => dispatch(getUninvitedProfilesWithoutLoading(projectId)))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Get Pending Profiles
export const getPendingProfiles = (id) => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get(`/api/profile/pendingprofiles/${id}`)
    .then((res) =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROFILES,
        payload: null,
      })
    );
};

// Get Pending Profiles
export const getPendingProfilesWithoutLoading = (id) => (dispatch) => {
  axios
    .get(`/api/profile/pendingprofiles/${id}`)
    .then((res) =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_PROFILES,
        payload: null,
      })
    );
};

// Cancel Request
export const cancelRequest = (userId, projectId) => (dispatch) => {
  axios
    .delete(`/api/profile/cancelrequest/${projectId}/${userId}`)
    .then((res) => dispatch(getPendingProfilesWithoutLoading(projectId)))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Delete account & profile
export const deleteAccount = () => (dispatch) => {
  if (window.confirm("Are you sure? This can NOT be undone!")) {
    axios
      .delete("/api/profile")
      .then((res) => {
        localStorage.removeItem("jwtToken");
        dispatch({
          type: SET_CURRENT_USER,
          payload: {},
        });
      })
      .catch((err) => console.log(err));
  }
};

// Accept Project Invitation
export const acceptRequest = (id, acceptData) => (dispatch) => {
  axios
    .post(`/api/profile/acceptrequest/${id}`, acceptData)
    .then((res) => dispatch(deleteRequest(id)))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Decline Project Invitation
export const deleteRequest = (id) => (dispatch) => {
  axios
    .delete(`/api/profile/requests/${id}`)
    .then((res) => dispatch(getCurrentProfileNoLoad()))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Delete Accepted Project
export const deleteProject = (projectId) => (dispatch) => {
  axios.all([
    axios.delete(`/api/project/assigned/${projectId}`),
    axios
      .delete(`/api/profile/assigned/${projectId}`)
      .then((res) =>
        dispatch({
          type: GET_PROFILE,
          payload: res.data,
        })
      )
      .catch((err) =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
      ),
  ]);
};

// Profile loading
export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING,
  };
};

// Clear profile
export const clearCurrentProfile = () => {
  return {
    type: CLEAR_CURRENT_PROFILE,
  };
};

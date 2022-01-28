import axios from "axios";

import {
  GET_ERRORS,
  CLEAR_ERRORS,
  GET_TICKET,
  GET_TICKETS,
  TICKET_LOADING,
  DELETE_TICKET,
} from "../../../ops";

import { getProject } from "../project";

export const addTicket = (id, ticketData, pg) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .post("/api/tickets", ticketData)
    .then((res) => dispatch(getProject(id, pg, true)))
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

export const getTickets = () => (dispatch) => {
  dispatch(setTicketLoading());
  axios
    .get(`/api/tickets`)
    .then((res) =>
      dispatch({
        type: GET_TICKETS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_TICKETS,
        payload: null,
        payload2: null,
      })
    );
};

export const getAssignedTickets = () => (dispatch) => {
  dispatch(setTicketLoading());
  axios
    .get(`/api/tickets/assignedtickets`)
    .then((res) =>
      dispatch({
        type: GET_TICKETS,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_TICKETS,
        payload: null,
        payload2: null,
      })
    );
};

export const getAllTickets = () => (dispatch) => {
  dispatch(setTicketLoading());
  axios
    .all([
      axios.get(`/api/tickets/pastyeartickets`),
      axios.get(`/api/tickets/pastyearassignedtickets`),
    ])
    .then(
      axios.spread((ticketData, assignedTicketData) => {
        dispatch({
          type: GET_TICKETS,
          payload: ticketData.data,
          payload2: assignedTicketData.data,
        });
      })
    )
    .catch((err) => {
      dispatch({
        type: GET_TICKETS,
        payload: null,
        payload2: null,
      });
    });
};

export const getTicket = (id) => (dispatch) => {
  dispatch(setTicketLoading());
  axios
    .get(`/api/tickets/${id}`)
    .then((res) =>
      dispatch({
        type: GET_TICKET,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_TICKET,
        payload: null,
      })
    );
};

export const editTicket = (projectId, ticketId, ticketData, history) => (
  dispatch
) => {
  dispatch(clearErrors());
  axios
    .post(`/api/tickets/edit/${projectId}/${ticketId}`, ticketData)
    .then((res) => history.goBack())
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

export const deleteTicket = (projectId, ticketId) => (dispatch) => {
  axios
    .delete(`/api/projects/tickets/${projectId}/${ticketId}`)
    .then((res) =>
      dispatch({
        type: DELETE_TICKET,
        payload: ticketId,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

export const addComment = (ticketId, commentData) => (dispatch) => {
  dispatch(clearErrors());
  axios
    .post(`/api/tickets/comment/${ticketId}`, commentData)
    .then((res) =>
      dispatch({
        type: GET_TICKET,
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

export const deleteComment = (ticketId, commentId) => (dispatch) => {
  axios
    .delete(`/api/tickets/comment/${ticketId}/${commentId}`)
    .then((res) =>
      dispatch({
        type: GET_TICKET,
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

export const setTicketLoading = () => {
  return {
    type: TICKET_LOADING,
  };
};

export const clearErrors = () => {
  return {
    type: CLEAR_ERRORS,
  };
};

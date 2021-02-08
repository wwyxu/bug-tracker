import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { deleteTicket } from "../../actions/ticketActions";

class AssignedTicketItem extends Component {
  onDeleteClick(projectId, ticketId) {
    this.props.deleteTicket(projectId, ticketId);
  }

  render() {
    const { ticket, auth } = this.props;

    const tickets = ticket.map((ticket) => (
      <tr key={ticket._id._id}>
        <td>
          {ticket.complete === "Closed" ? (
            <Link className="text-dark" to={`/ticket/${ticket._id}`}>
              <del> {ticket.ticketname} </del>
            </Link>
          ) : (
            <Link className="text" to={`/ticket/${ticket._id}`}>
              {ticket.ticketname}
            </Link>
          )}
        </td>
        <td>{ticket.ticketdescription}</td>
        <td>
          <span className="d-lg-none">{ticket.priority}</span>
          <div className="d-none d-lg-block">
            {ticket.priority === "Low" ? (
              <span className="badge badge-secondary larger_badge yellow_badge">
                Low
              </span>
            ) : null}
            {ticket.priority === "Medium" ? (
              <span className="badge badge-secondary larger_badge orange_badge">
                Medium
              </span>
            ) : null}
            {ticket.priority === "High" ? (
              <span className="badge badge-secondary larger_badge red_badge">
                High
              </span>
            ) : null}
          </div>
        </td>
        <td>
          <Link className="text" to={`/project/${ticket.project}?page=1`}>
            {ticket.projectname}
          </Link>
        </td>
        <td>
          <Link className="text" to={`/profile/${ticket.user}`}>
            {ticket.name}
          </Link>
        </td>
        <td>
          <Moment format="DD/MM/YYYY">{ticket.date}</Moment>
        </td>
        <td>
          {ticket._id.duedate ? (
            <Moment format="DD/MM/YYYY">{ticket.duedate}</Moment>
          ) : null}
        </td>
        <td>
          <span className="d-lg-none">{ticket.complete}</span>
          <div className="d-none d-lg-block">
            {ticket.complete === "Open" ? (
              <span className="badge badge-secondary larger_badge blue_badge">
                Open
              </span>
            ) : null}
            {ticket.complete === "In Progress" ? (
              <span className="badge badge-secondary larger_badge dyellow_badge">
                In Progress
              </span>
            ) : null}
            {ticket.complete === "To Be Tested" ? (
              <span className="badge badge-secondary larger_badge green_badge">
                To Be Tested
              </span>
            ) : null}
            {ticket.complete === "Closed" ? (
              <span className="badge badge-secondary larger_badge grey_badge">
                Closed
              </span>
            ) : null}
          </div>
        </td>
        <td>
          <Link to={`/ticket/${ticket._id}`}>{ticket.comments.length}</Link>
          {ticket.user === auth.user.id ? (
            <div className="dropdown float-right dropleft">
              <button
                className="btn btn-secondary dropdown-toggle float-right"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              ></button>
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <Link
                  className="dropdown-item"
                  to={`/edit-ticket/${ticket._id}`}
                >
                  Edit Ticket
                </Link>
                <div className="dropdown-divider"></div>

                <a
                  className="dropdown-item text-danger"
                  type="button"
                  onClick={this.onDeleteClick.bind(
                    this,
                    ticket.project,
                    ticket._id
                  )}
                >
                  Delete
                </a>
              </div>
            </div>
          ) : null}
        </td>
      </tr>
    ));

    return (
      <div>
        <div className="col-md-12">
          <table className="table bg-white">
            <thead className="thead">
              <tr>
                <th>Ticket</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Created</th>
                <th>Due</th>
                <th>Status</th>
                <th>Comments</th>
              </tr>
              {tickets}
            </thead>
          </table>
        </div>
      </div>
    );
  }
}

AssignedTicketItem.propTypes = {
  deleteTicket: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteTicket })(AssignedTicketItem);

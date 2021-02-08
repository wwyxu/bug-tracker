import PropTypes from "prop-types";
import React, { Component } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProjectTicket } from "../../actions/projectActions";
import { addTicket } from "../../actions/ticketActions";
import SelectListGroup from "../common/SelectListGroup";
import SelectUserGroup from "../common/SelectUserGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";

class TicketItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketname: "",
      ticketdescription: "",
      priority: "",
      duedate: "",
      assignedname: "",
      assigneduser: "",
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.errors) {
      this.setState({ errors: newProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const pageQueryParam = params.get("page");

    const { user } = this.props.auth;
    const { projectname, projectId } = this.props;

    const newTicket = {
      projectname: projectname,
      project: projectId,
      user: user.id,
      name: user.name,
      avatar: user.avatar,
      ticketname: this.state.ticketname,
      ticketdescription: this.state.ticketdescription,
      priority: this.state.priority,
      duedate: this.state.duedate,
      assigneduser: this.state.assigneduser,
      assignedname: this.state.assignedname,
    };

    this.props.addTicket(projectId, newTicket, pageQueryParam);
    this.setState({
      ticketname: "",
      ticketdescription: "",
      priority: "",
      duedate: "",
      assigneduser: "",
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  onDeleteClick(projectId, ticketId) {
    const params = new URLSearchParams(window.location.search);
    const pageQueryParam = params.get("page");
    this.props.deleteProjectTicket(projectId, ticketId, pageQueryParam);
  }

  render() {
    const { errors } = this.state;
    const { assigned, projectId, ticket, auth } = this.props;

    const userArray = assigned;

    let assignedList;
    let arrayList;

    if (userArray && userArray.length > 0) {
      arrayList = [{ name: "Assign To", value: 0 }];
      assignedList = arrayList.concat(userArray);
    } else {
      assignedList = [{ name: "Assign To", value: 0 }];
    }

    // Select options for priority status
    const options = [
      { label: "Select Priority", value: 0 },
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" },
    ];

    const tickets = ticket.map((ticket) => (
      <tr key={ticket._id._id}>
        <td>
          {ticket._id.complete === "Closed" ? (
            <Link className="text-dark" to={`/ticket/${ticket._id._id}`}>
              <del> {ticket._id.ticketname} </del>
            </Link>
          ) : (
            <Link className="text" to={`/ticket/${ticket._id._id}`}>
              {ticket._id.ticketname}
            </Link>
          )}
        </td>
        <td>{ticket._id.ticketdescription}</td>
        <td>
          <span className="d-lg-none">{ticket._id.priority}</span>
          <div className="d-none d-lg-block">
            {ticket._id.priority === "Low" ? (
              <span className="badge badge-secondary larger_badge yellow_badge">
                Low
              </span>
            ) : null}
            {ticket._id.priority === "Medium" ? (
              <span className="badge badge-secondary larger_badge orange_badge">
                Medium
              </span>
            ) : null}
            {ticket._id.priority === "High" ? (
              <span className="badge badge-secondary larger_badge red_badge">
                High
              </span>
            ) : null}
          </div>
        </td>
        <td>
          <Link className="text" to={`/profile/${ticket._id.user}`}>
            {ticket._id.name}
          </Link>
        </td>
        <td>
          <Link className="text" to={`/profile/${ticket._id.assigneduser}`}>
            {ticket._id.assignedname}
          </Link>
        </td>
        <td>
          <Moment format="DD/MM/YYYY">{ticket._id.date}</Moment>
        </td>
        <td>
          {ticket._id.duedate ? (
            <Moment format="DD/MM/YYYY">{ticket._id.duedate}</Moment>
          ) : null}
        </td>
        <td>
          <span className="d-lg-none">{ticket._id.complete}</span>
          <div className="d-none d-lg-block">
            {ticket._id.complete === "Open" ? (
              <span className="badge badge-secondary larger_badge blue_badge">
                Open
              </span>
            ) : null}
            {ticket._id.complete === "In Progress" ? (
              <span className="badge badge-secondary larger_badge dyellow_badge">
                In Progress
              </span>
            ) : null}
            {ticket._id.complete === "To Be Tested" ? (
              <span className="badge badge-secondary larger_badge green_badge">
                To Be Tested
              </span>
            ) : null}
            {ticket._id.complete === "Closed" ? (
              <span className="badge badge-secondary larger_badge grey_badge">
                Closed
              </span>
            ) : null}
          </div>
        </td>
        <td>
          <Link to={`/ticket/${ticket._id._id}`}>
            {ticket._id.comments.length}
          </Link>
          {ticket._id.user === auth.user.id ? (
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
                  to={`/edit-ticket/${ticket._id._id}`}
                >
                  Edit Ticket
                </Link>
                <div className="dropdown-divider"></div>

                <a
                  className="dropdown-item text-danger"
                  type="button"
                  onClick={this.onDeleteClick.bind(
                    this,
                    projectId,
                    ticket._id._id
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
        <div className="col-12 p-0">
          <table className="table bg-white">
            <thead className="thead">
              <tr>
                <th
                  className="btn-link text-info font-weight-bold"
                  data-toggle="modal"
                  data-target="#createTicket"
                >
                  Ticket +
                </th>
                <th>Description</th>
                <th>Priority</th>
                <th>Assignee</th>
                <th>Assigned</th>
                <th>Created</th>
                <th>Due</th>
                <th>Status</th>
                <th>Comments</th>
              </tr>
              {tickets}
            </thead>
          </table>
          <div
            className="modal fade"
            id="createTicket"
            tabindex="-1"
            role="dialog"
            aria-labelledby="createTicketModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="createTicketModalLabel">
                    Create a Ticket
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={this.onSubmit}>
                    <TextFieldGroup
                      placeholder="Ticket Name"
                      name="ticketname"
                      value={this.state.ticketname}
                      onChange={this.onChange}
                      error={errors.ticketname}
                    />
                    <TextAreaFieldGroup
                      placeholder="Ticket Description"
                      name="ticketdescription"
                      value={this.state.ticketdescription}
                      onChange={this.onChange}
                      error={errors.ticketdescription}
                    />
                    <SelectListGroup
                      placeholder="Priority"
                      name="priority"
                      value={this.state.priority}
                      onChange={this.onChange}
                      options={options}
                      error={errors.priority}
                    />
                    <SelectUserGroup
                      placeholder="Assign To"
                      name="assigneduser"
                      value={this.state.assigneduser}
                      onChange={this.onChange}
                      options={assignedList}
                      error={errors.name}
                    />
                    <h6>Due Date</h6>
                    <TextFieldGroup
                      name="duedate"
                      type="date"
                      value={this.state.duedate}
                      onChange={this.onChange}
                      error={errors.duedate}
                    />
                    <input
                      type="submit"
                      value="Submit"
                      className="btn btn-info btn-block mt-4"
                    />
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

TicketItem.propTypes = {
  addTicket: PropTypes.func.isRequired,
  deleteProjectTicket: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  errors: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  auth: state.auth,
});

export default connect(mapStateToProps, { addTicket, deleteProjectTicket })(
  TicketItem
);

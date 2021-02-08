import React, { Component } from "react";
import PropTypes from "prop-types";
import SelectListGroup from "../common/SelectListGroup";
import SelectUserGroup from "../common/SelectUserGroup";
import TextFieldGroup from "../common/TextFieldGroup";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { editTicket, getTicket } from "../../actions/ticketActions";
import isEmpty from "../../validation/is-empty";

class EditTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticketname: "",
      ticketdescription: "",
      priority: "",
      duedate: "",
      complete: "",
      assignedname: "",
      assigneduser: "",
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getTicket(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.ticket.ticket) {
      const ticket = nextProps.ticket.ticket;

      ticket.ticketname = !isEmpty(ticket.ticketname) ? ticket.ticketname : "";
      ticket.ticketdescription = !isEmpty(ticket.ticketdescription)
        ? ticket.ticketdescription
        : "";
      ticket.priority = !isEmpty(ticket.priority) ? ticket.priority : "";
      ticket.duedate = !isEmpty(ticket.duedate) ? ticket.duedate : "";
      ticket.complete = !isEmpty(ticket.complete) ? ticket.complete : "";
      ticket.assigneduser = !isEmpty(ticket.assigneduser)
        ? ticket.assigneduser
        : "";
      ticket.assignedname = !isEmpty(ticket.assignedname)
        ? ticket.assignedname
        : "";

      // Set component fields state
      this.setState({
        ticketname: ticket.ticketname,
        ticketdescription: ticket.ticketdescription,
        priority: ticket.priority,
        duedate: ticket.duedate,
        complete: ticket.complete,
        assigneduser: ticket.assigneduser,
        assignedname: ticket.assignedname,
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { user } = this.props.auth;
    const { ticket } = this.props.ticket;

    let projectId;
    projectId = ticket.project;

    const updatedTicket = {
      user: user.id,
      name: user.name,
      avatar: user.avatar,
      ticketname: this.state.ticketname,
      ticketdescription: this.state.ticketdescription,
      priority: this.state.priority,
      duedate: this.state.duedate,
      complete: this.state.complete,
      assigneduser: this.state.assigneduser,
      assignedname: this.state.assignedname,
    };

    this.props.editTicket(
      projectId,
      this.props.match.params.id,
      updatedTicket,
      this.props.history
    );
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const { ticket } = this.props.ticket;

    // Select options for priority status
    const priooptions = [
      { label: "Select Priority", value: 0 },
      { label: "Low", value: "Low" },
      { label: "Medium", value: "Medium" },
      { label: "High", value: "High" },
    ];

    // Select options for completion status
    const options = [
      { label: "Select Status", value: 0 },
      { label: "Open", value: "Open" },
      { label: "In Progress", value: "In Progress" },
      { label: "To Be Tested", value: "To Be Tested" },
      { label: "Closed", value: "Closed" },
    ];

    let assignedList = [{ name: "Assign To", value: 0 }];
    let arrayList;

    // Avoid type error if redux returns null
    try {
      if (ticket.project.assigned) {
        arrayList = [{ name: "Assign To", value: 0 }];
        assignedList = arrayList.concat(ticket.project.assigned);
      }
    } catch (err) {
      console.log(err);
    }

    return (
      <div className="container pt-4">
        <div className="row">
          <div className="col-md-2"></div>
          <div className="col-md-8">
            <div className="card p-4">
              <h5 className="display-4 mb-4 text-center text-dark">
                Edit Ticket
              </h5>
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
                  options={priooptions}
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
                <SelectListGroup
                  placeholder="Ticket Status"
                  name="complete"
                  value={this.state.complete}
                  onChange={this.onChange}
                  options={options}
                  error={errors.complete}
                />
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-4"
                />
              </form>
            </div>
          </div>
          <div className="col-md-2"></div>
        </div>
      </div>
    );
  }
}

EditTicket.propTypes = {
  getTicket: PropTypes.func.isRequired,
  editTicket: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  ticket: state.ticket,
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { editTicket, getTicket })(
  withRouter(EditTicket)
);

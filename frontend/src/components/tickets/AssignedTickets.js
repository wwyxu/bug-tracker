import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getAssignedTickets } from "../../actions/ticketActions";
import Spinner from "../common/Spinner";
import AssignedTicketItem from "./AssignedTicketItem";

class AssignedTickets extends Component {
  componentDidMount() {
    this.props.getAssignedTickets();
  }

  render() {
    const { tickets, loading } = this.props.ticket;
    let ticketContent;

    if (tickets === null || loading) {
      ticketContent = <Spinner />;
    } else {
      if (tickets.length > 0) {
        ticketContent = <AssignedTicketItem ticket={tickets} />;
      } else {
        ticketContent = (
          <div>
            <p></p>
            <h4 className="text-center">No Tickets To Display</h4>
          </div>
        );
      }
    }
    return (
      <div>
        <div style={{ marginBottom: "8px" }} />
        <div className="container-fluid">
          <div className="col-xl-10 offset-xl-1 p-0">{ticketContent}</div>
        </div>
      </div>
    );
  }
}

AssignedTickets.propTypes = {
  getAssignedTickets: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  ticket: state.ticket,
});

export default connect(mapStateToProps, { getAssignedTickets })(
  AssignedTickets
);

import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getAssignedTickets } from "../../services/api/ticket";
import Spinner from "../common/spinner";
import AssignedTicketItem from "./assigned-ticket";

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
            <h4 className="text-center mt-3">No Tickets To Display</h4>
        );
      }
    }
    return (
      <div>
        <div className="container-fluid mt-2">
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

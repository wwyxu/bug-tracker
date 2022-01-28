import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../common/spinner";
import { getTickets } from "../../services/api/ticket";
import TicketItem from "./ticket";

class Tickets extends Component {
  componentDidMount() {
    this.props.getTickets();
  }

  render() {
    const { tickets, loading } = this.props.ticket;
    let ticketContent;

    if (tickets === null || loading) {
      ticketContent = <Spinner />;
    } else {
      if (tickets.length > 0) {
        ticketContent = <TicketItem ticket={tickets} />;
      } else {
        ticketContent = (
            <h4 className="text-center mt-3">No Tickets To Display</h4>
        );
      }
    }
    return (
        <div className="container-fluid mt-2">
          <div className="col-xl-10 offset-xl-1 p-0">{ticketContent}</div>
        </div>
    );
  }
}

Tickets.propTypes = {
  getTickets: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  ticket: state.ticket,
});

export default connect(mapStateToProps, { getTickets })(Tickets);

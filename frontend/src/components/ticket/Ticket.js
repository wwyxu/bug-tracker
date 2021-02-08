import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../common/Spinner";
import { getTicket } from "../../actions/ticketActions";
import TicketItem from "./TicketItem";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

class Ticket extends Component {
  componentDidMount() {
    if (this.props.match.params.id) {
      this.props.getTicket(this.props.match.params.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.ticket.ticket === null && this.props.ticket.loading) {
      this.props.history.push("/not-found");
    }
  }

  render() {
    const { auth } = this.props;
    const { ticket, loading } = this.props.ticket;

    let ticketContent;
    let commentList;

    const commentArray = ticket.comments;
    // Avoid Typescript Error if null
    if (commentArray) {
      commentList = commentArray.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          ticketId={ticket._id}
        />
      ));
    }

    if (ticket === null || loading) {
      ticketContent = <Spinner />;
    } else {
      ticketContent = (
        <div>
          <TicketItem ticket={ticket} />
          <CommentForm ticketId={ticket._id} />
          {commentList}
        </div>
      );
    }

    let ticketUser;
    try {
      if (ticket.user) {
        ticketUser = ticket.user;
      }
    } catch (err) {
      console.log(err);
    }

    return (
      <div className="container">
        <div className="row no-gutters">
          <div className="col-md-2">
            {(ticketUser === auth.user.id) & !loading ? (
              <Link
                to={`/edit-ticket/${ticket._id}`}
                style={{ marginRight: "8px", marginBottom: "8px" }}
                className="btn btn-info float-right"
              >
                {" "}
                Edit
              </Link>
            ) : null}
          </div>
          <div className="col-md-8">{ticketContent}</div>
          <div className="col-md-2"></div>
        </div>
      </div>
    );
  }
}

Ticket.propTypes = {
  getTicket: PropTypes.func.isRequired,
  ticket: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  ticket: state.ticket,
  auth: state.auth,
});

export default connect(mapStateToProps, { getTicket })(Ticket);

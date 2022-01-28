import moment from "moment";
import React, { Component } from "react";
import { Link } from "react-router-dom";

class TicketItem extends Component {
  render() {
    const { ticket } = this.props;
    let projectid;

    try {
      if (ticket.project._id) {
        projectid = ticket.project._id;
      }
    } catch (err) {
      console.log(err);
    }

    return (
      <div className="card card-body mb-2">
        <div className="row">
          <div className="col-3 border-right">
            <div className="row justify-content-center">
              <Link to={`/profile/${ticket.user}`}>
                <img
                  className="rounded-circle d-none d-md-block"
                  src={ticket.avatar}
                  style={{ width: "100px" }}
                  alt=""
                />
                <p className="text-center">{ticket.name}</p>
              </Link>
            </div>
          </div>
          <div className="col-6 border-right small_column">
            <h3>{ticket.ticketname} </h3>
            <p className="text-muted">
              Assigned to:{" "}
              <Link to={`/profile/${ticket.assigneduser}`}>
                {ticket.assignedname}
              </Link>
            </p>
            <a>{ticket.ticketdescription}</a>
          </div>
          <div className="col-3 small_column">
            <div>
              <Link to={`/project/${projectid}?page=1`}>
                <small className="text-muted">
                  {ticket.projectname}
                  {"  "}
                  <i className="fas fa-external-link-alt floatright" />
                </small>
              </Link>
              <p>
                <small className="text-muted">Status: {ticket.complete}</small>
              </p>
              <p>
                <small className="text-muted">
                  Created:{"  "}
                  {moment(ticket.date).format("DD/MM/YYYY")}
                </small>
              </p>
              {ticket.duedate ? (
                <p>
                  <small className="text-muted">
                    Due:{"  "}
                    {moment(ticket.duedate).format("DD/MM/YYYY")}
                  </small>
                </p>
              ) : null}
              <p>
                <small className="text-muted">
                  Priority: {ticket.priority}
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TicketItem;

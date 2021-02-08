import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Moment from "react-moment";
import { acceptRequest, deleteRequest } from "../../actions/profileActions";

class RequestItem extends Component {
  onDeleteClick(id) {
    this.props.deleteRequest(id);
  }

  onAcceptClick(id) {
    const { user } = this.props.auth;

    const User = {
      name: user.name,
      avatar: user.avatar,
    };

    this.props.acceptRequest(id, User);
  }

  render() {
    const requests = this.props.request.map((req) => (
      <tr key={req._id}>
        <td>{req.projectname}</td>
        <td>{req.projectdescription}</td>
        <td>
          <Link to={`/profile/${req.user}`}>{req.name}</Link>
        </td>
        <td>
          <Moment format="YYYY/MM/DD">{req.date}</Moment>
        </td>
        <td>
          <Moment format="YYYY/MM/DD">{req.received}</Moment>
        </td>
        <td>
          <button
            onClick={this.onAcceptClick.bind(this, req._id)}
            className="btn btn-info"
          >
            <i className="fas fa-check" />
          </button>
          <button
            onClick={this.onDeleteClick.bind(this, req._id)}
            className="btn btn-danger"
            style={{ marginLeft: "6px" }}
          >
            <i className="fas fa-times" />
          </button>
        </td>
      </tr>
    ));

    return (
      <table className="table bg-white">
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Description</th>
            <th>Project Owner</th>
            <th>Date Created</th>
            <th>Date Received</th>
            <th>Accept/Decline</th>
          </tr>
          {requests}
        </thead>
      </table>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

RequestItem.propTypes = {};

export default connect(mapStateToProps, {
  deleteRequest,
  acceptRequest,
})(RequestItem);

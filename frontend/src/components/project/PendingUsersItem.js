import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { cancelRequest } from "../../actions/profileActions";

class PendingUsersItem extends Component {
  constructor() {
    super();
    this.state = {
      addedProfiles: [],
    };
  }

  onCancelClick(userId, ProjectId) {
    this.setState({
      addedProfiles: [...this.state.addedProfiles, userId],
    });

    this.props.cancelRequest(userId, ProjectId);
  }

  render() {
    const { profile, projectId } = this.props;

    return (
      <div className="card card-body bg-light mb-2">
        <div className="row">
          <div className="col-5 border-right">
            <div className="row justify-content-center">
              <img
                className="rounded-circle "
                src={profile.user.avatar}
                style={{ width: "100px" }}
                alt=""
              />
            </div>
          </div>
          <div className="col-7">
            <Link to={`/profile/${profile.user._id}`} className="lead">
              <h3 className="text-info mt-2" style={{ marginLeft: "27px" }}>
                {profile.user.name}
              </h3>
            </Link>
            <button
              onClick={this.onCancelClick.bind(
                this,
                profile.user._id,
                projectId
              )}
              style={{ marginLeft: "27px" }}
              type="button"
              className="btn btn-danger"
              disabled={
                this.state.addedProfiles.indexOf(profile.user._id) !== -1
              }
            >
              {this.state.addedProfiles.indexOf(profile.user._id) !== -1
                ? "Pending..."
                : "Cancel"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

PendingUsersItem.propTypes = {
  cancelRequest: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { cancelRequest })(PendingUsersItem);

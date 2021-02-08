import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { inviteUser } from "../../actions/profileActions";

class InviteUsersItem extends Component {
  constructor() {
    super();
    this.state = {
      addedProfiles: [],
    };
  }

  onInviteClick(userId, currentProject, projectID) {
    this.setState({
      addedProfiles: [...this.state.addedProfiles, userId],
    });

    this.props.inviteUser(userId, currentProject, projectID);
  }

  render() {
    const { profile } = this.props;
    const currentProject = this.props.project;
    const projectID = this.props.project._id;

    return (
      <div className="card card-body bg-light mb-2">
        <div className="row">
          <div className="col-5 border-right">
            <div className="row justify-content-center">
              <img
                className="rounded-circle"
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
              onClick={this.onInviteClick.bind(
                this,
                profile.user._id,
                currentProject,
                projectID
              )}
              type="button"
              className="btn btn-secondary"
              style={{ marginLeft: "27px" }}
              disabled={
                this.state.addedProfiles.indexOf(profile.user._id) !== -1
              }
            >
              {this.state.addedProfiles.indexOf(profile.user._id) !== -1
                ? "Pending..."
                : "Invite"}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

InviteUsersItem.propTypes = {
  inviteUser: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { inviteUser })(InviteUsersItem);

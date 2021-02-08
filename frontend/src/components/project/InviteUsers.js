import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getUninvitedProfiles } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import InviteUsersItem from "./InviteUsersItem";

class InviteUsers extends Component {
  componentDidMount() {
    this.props.getUninvitedProfiles(this.props.match.params.id);
  }

  render() {
    const { profiles, project, loading } = this.props.profile;

    console.log(this.props);

    let currentproject;

    currentproject = project;

    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (project === null || loading) {
        profileItems = <Spinner />;
      } else {
        if (profiles.length > 0) {
          profileItems = profiles.map((profile) => (
            <InviteUsersItem
              key={profile._id}
              profile={profile}
              project={currentproject}
            />
          ));
        } else {
          profileItems = (
            <div className="text-center">
              <p></p>
              <h4>No profiles found</h4>
            </div>
          );
        }
      }
    }

    return (
      <div className="profiles">
        <div className="container">
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-md-6">{profileItems}</div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </div>
    );
  }
}

InviteUsers.propTypes = {
  getUninvitedProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  project: state.project,
});

export default connect(mapStateToProps, { getUninvitedProfiles })(InviteUsers);

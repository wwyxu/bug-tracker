import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getUninvitedProfiles } from "../../../services/api/profile";
import Spinner from "../../common/spinner";
import InviteUsersItem from "./invite-user";

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
              <h4 className="text-center mt-3">No profiles found</h4>
          );
        }
      }
    }

    return (
        <div className="container">
          <div className="row">
            <div className="col-md-6 offset-md-3">{profileItems}</div>
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

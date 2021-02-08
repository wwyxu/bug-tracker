import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getPendingProfiles } from "../../actions/profileActions";
import Spinner from "../common/Spinner";
import PendingUsersItem from "./PendingUsersItem";

class PendingUsers extends Component {
  componentDidMount() {
    this.props.getPendingProfiles(this.props.match.params.id);
  }

  render() {
    const { profiles, loading } = this.props.profile;

    let profileItems;

    if (profiles === null || loading) {
      profileItems = <Spinner />;
    } else {
      if (profiles.length > 0) {
        profileItems = profiles.map((profile) => (
          <PendingUsersItem
            key={profile._id}
            profile={profile}
            projectId={this.props.match.params.id}
          />
        ));
      } else {
        profileItems = (
          <div className="text-center">
            <p></p>
            <h4>No Pending Users</h4>
          </div>
        );
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

PendingUsers.propTypes = {
  getPendingProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getPendingProfiles })(PendingUsers);

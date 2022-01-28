import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getPendingProfiles } from "../../../services/api/profile";
import Spinner from "../../common/spinner";
import PendingUsersItem from "./pending-user";

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
            <h4 className="text-center mt-3">No Pending Users</h4>
        );
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

PendingUsers.propTypes = {
  getPendingProfiles: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getPendingProfiles })(PendingUsers);

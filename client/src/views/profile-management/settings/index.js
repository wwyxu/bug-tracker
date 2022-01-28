import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getCurrentProfile, deleteAccount } from "../../../services/api/profile";
import Spinner from "../../common/spinner";

class Settings extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onDeleteClick(e) {
    this.props.deleteAccount();
  }

  render() {
    const { user } = this.props.auth;
    const { profile, loading } = this.props.profile;
    const { auth } = this.props;

    let settingsContent;

    if (profile === null || loading) {
      settingsContent = <Spinner />;
    } else {
      if (Object.keys(profile).length > 0) {
        settingsContent = (
          <div>
            <p className="lead text-muted">
              <Link to={`/profile/${auth.user.id}`}>My Profile</Link>
            </p>
            <div className="btn-group mb-4" role="group">
              <Link to="/edit-profile" className="btn btn-sm btn-light">
                <i className="fas fa-user-circle text-info mr-1" /> Edit Profile
              </Link>
            </div>
            <p>
            <button
              onClick={this.onDeleteClick.bind(this)}
              className="btn btn-sm btn-danger"
            >
              Delete My Account
            </button>
            </p>
          </div>
        );
      } else {
        settingsContent = (
          <div>
            <p className="lead text-muted">Welcome {user.name}</p>
            <Link to="/create-profile" className="btn btn-lg btn-info">
              Create Profile
            </Link>
          </div>
        );
      }
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <h1 className="display-4">Settings</h1>
            {settingsContent}
          </div>
        </div>
      </div>
    );
  }
}

Settings.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  deleteAccount: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  auth: state.auth,
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(
  Settings
);

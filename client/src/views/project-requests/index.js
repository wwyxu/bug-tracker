import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import RequestItem from "./request";
import Spinner from "../common/spinner";
import { getCurrentProfile } from "../../services/api/profile";

class Requests extends Component {
  componentDidMount() {
    this.props.getCurrentProfile();
  }

  render() {
    const { profile, loading } = this.props.profile;

    let requestContent;
    let currentprofile;

    if (profile) {
      currentprofile = profile;
    }

    if (profile === null || loading) {
      requestContent = <Spinner />;
    } else {
      if (Object.keys(profile).length > 0) {
        requestContent = (
          <div>
            <RequestItem request={currentprofile.requests} />
          </div>
        );
      }
    }

    return (
      <div className="container-fluid">
        <div className="col-xl-10 offset-xl-1 p-0">{requestContent}</div>
      </div>
    );
  }
}

Requests.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getCurrentProfile })(Requests);

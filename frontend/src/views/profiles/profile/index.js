import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import isEmpty from "../../../utils/is-empty";

class ProfileItem extends Component {
  render() {
    const { profile } = this.props;

    return (
      <div className="container">
        <div className="card card-body bg-light mb-2">
          <div className="row">
            <div className="col-5 border-right">
              <div className="row justify-content-center">
                <img
                  src={profile.user.avatar}
                  alt=""
                  style={{ width: "100px" }}
                  className="rounded-circle"
                />
              </div>
            </div>
            <div className="col-7">
              <Link to={`/profile/${profile.user._id}`}>
                <h3 className="text mt-3" style={{ marginLeft: "27px" }}>
                  {profile.user.name}
                </h3>
              </Link>
              <p>
                {isEmpty(profile.location) ? null : (
                  <span style={{ marginLeft: "27px" }}>{profile.location}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileItem.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default ProfileItem;

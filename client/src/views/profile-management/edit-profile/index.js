import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createProfile, getCurrentProfile } from "../../../services/api/profile";
import isEmpty from "../../../utils/is-empty";
import TextAreaFieldGroup from "../../common/text-area-field-group";
import TextFieldGroup from "../../common/text-field-group";

class CreateProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      bio: "",
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;

      profile.bio = !isEmpty(profile.bio) ? profile.bio : "";
      profile.location = !isEmpty(profile.location) ? profile.location : "";

      this.setState({
        location: profile.location,
        bio: profile.bio,
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const profileData = {
      location: this.state.location,
      bio: this.state.bio,
    };

    this.props.createProfile(profileData, this.props.history);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    return (
      <div className="container pt-4">
        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="card p-3">
              <h1 className="display-4 mb-3 text-center text-dark">
                Edit Profile
              </h1>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="Location"
                  name="location"
                  value={this.state.location}
                  onChange={this.onChange}
                  error={errors.location}
                />
                <TextAreaFieldGroup
                  placeholder="Biography"
                  name="bio"
                  value={this.state.bio}
                  onChange={this.onChange}
                  error={errors.bio}
                />
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-sm btn-info btn-block mt-3"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
  errors: state.errors,
});

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(
  withRouter(CreateProfile)
);

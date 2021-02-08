import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { registerUser } from "../../actions/authActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Register extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      email: "",
      password: "",
      password2: "",
      errors: {},
    };
  }
  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();

    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2,
    };

    this.props.registerUser(newUser, this.props.history);
  };

  render() {
    const { errors } = this.state;
    const { isAuthenticated, loading, success } = this.props.auth;

    const guestPage = (
      <div className="container">
        <div className="register_container">
          <h5 className="display-4 mb-4 text-center text-dark">Bug Tracker</h5>
          <h6 className="mb-4 text-center text-muted">
            Bug Tracker is a software defect tool which helps you keep track of
            issues during the developement process.
          </h6>
          <div className="row">
            <div className="col-xs-6 col-sm-8 col-md-6 col-lg-4 m-auto">
              {loading ? (
                <div className="bar">
                  <div></div>
                </div>
              ) : (
                <div>
                  <div></div>
                </div>
              )}
              <div className="card card-body mb-3 register">
                <div className="text-center mb-4 text-muted">
                  Sign up to continue
                </div>
                <form noValidate onSubmit={this.onSubmit}>
                  <TextFieldGroup
                    placeholder="Name"
                    name="name"
                    value={this.state.name}
                    onChange={this.onChange}
                    error={errors.name}
                  />
                  <TextFieldGroup
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={this.state.email}
                    onChange={this.onChange}
                    error={errors.email}
                  />
                  <TextFieldGroup
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={this.state.password}
                    onChange={this.onChange}
                    error={errors.password}
                  />
                  <TextFieldGroup
                    placeholder="Confirm Password"
                    name="password2"
                    type="password"
                    value={this.state.password2}
                    onChange={this.onChange}
                    error={errors.password2}
                  />
                  <div className="divider"></div>
                  <hr />
                  {loading ? (
                    <button
                      type="submit"
                      className="btn btn-primary text-white btn-block mt-3"
                      disabled
                    >
                      Register
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="btn btn-primary text-white btn-block mt-3"
                    >
                      Register
                    </button>
                  )}
                </form>
              </div>
              {success ? (
                <p className="text-center">
                  Success! Please log in to Continue
                </p>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </div>
    );

    const authPage = (
      <div className="container">
        <p></p>
        <h1 className="display-3 mb-4 text-center font-weight-bold logo">
          Bug Tracker
        </h1>
      </div>
    );

    return (
      <div className="container-fluid landing_page">
        {isAuthenticated ? authPage : guestPage}
        <footer className="footer text-center bg-light">
          <p>
            <a>{"  "}Bug Tracker</a> | &copy; 2021
          </p>
        </footer>
      </div>
    );
  }
}

Register.propTypes = {
  auth: PropTypes.object.isRequired,
  registerUser: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser })(withRouter(Register));

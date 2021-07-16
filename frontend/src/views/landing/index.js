import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { registerUser } from "../../services/api/auth";
import TextFieldGroup from "../common/text-field-group";

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
      <div>
        <div className="header_container py-2">
          <h4 className="display-3 landing_heading text-center text-dark bold mb-2">
            Dorah
          </h4>
          <h6 className="text-center text-muted mb-2">
            Dorah is a secure, easy-to-use bug tracking application designed for teams.  <br />{" "} 
            Easily manage your projects and focus on what matters
          </h6>
        </div>
        <div className="container">
          <div className="register_container container">
            <div className="row">
              <div className="col-xs-6 col-sm-8 col-md-6 col-lg-4 m-auto">
                {loading ? (
                  <div className="bar">
                    <div />
                  </div>
                ) : (
                  <div />
                )}
                <div className="card card-body mb-3 register">
                  <div className="text-center mb-4 text-muted">
                    Sign up for free to get started
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
                        className="btn btn-sm btn-primary text-white btn-block mt-3"
                        disabled
                      >
                        Register
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-sm btn-primary text-white btn-block mt-3"
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
      </div>
    );

    const authPage = (
      <div className="container">
        <h1 className="display-3 mt-3 mb-4 text-center font-weight-bold">
          Dorah
        </h1>
      </div>
    );

    return (
      <div className="container-fluid landing_page">
        {isAuthenticated ? authPage : guestPage}
        <footer className="footer text-center bg-light">
          <p className="footer_text text-muted">
            {"  "}Dorah | &copy; 2021
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

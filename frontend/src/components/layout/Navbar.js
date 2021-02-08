import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { loginUser, logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";
import TextFieldGroup from "../common/TextFieldGroup";

class Navbar extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      errors: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit = (e) => {
    e.preventDefault();

    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    this.props.loginUser(userData);
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  onHandleClick(e) {
    e.stopPropagation();
  }

  render() {
    const { errors } = this.state;
    const { isAuthenticated, user, loading } = this.props.auth;

    let requestItem;
    let lsrequests = localStorage.getItem("requests");

    requestItem = (
      <span className="badge badge-secondary larger_badge blue_badge">
        {lsrequests !== 0 ? lsrequests : null}
      </span>
    );

    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/tickets">
            My Tickets
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/assignedtickets">
            Assigned Tickets
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/projects">
            Projects
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/requests">
            Project Invitations{"  "} {requestItem}
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profiles">
            Profiles
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <div className="dropdown">
            <a
              data-toggle="dropdown"
              className="btn nav-link dropdown-toggle user-action"
              type="button"
            >
              <img
                className="rounded-circle"
                alt="user"
                src={user.avatar}
                style={{
                  width: "25px",
                  marginRight: "8px",
                  float: "left",
                }}
                title="Please have Gravatar connected to your email to display an image"
              />
              <div
                style={{
                  float: "left",
                }}
              >
                {user.name}
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-right">
              <li className="nav-item">
                <Link className="nav-link" to={`/profile/${user.id}`}>
                  <img
                    className="rounded-circle"
                    alt="user"
                    src={user.avatar}
                    style={{
                      width: "25px",
                      marginRight: "10px",
                      marginLeft: "8px",
                    }}
                  />
                  My Profile
                </Link>
              </li>
              <div className="dropdown-divider "></div>
              <li className="nav-item">
                <Link
                  to="/edit-profile"
                  style={{
                    marginLeft: "8px",
                  }}
                  className="nav-link"
                >
                  Edit Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  style={{
                    marginLeft: "8px",
                  }}
                  className="nav-link"
                  to="/settings"
                >
                  Settings
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  to="/"
                  onClick={this.onLogoutClick.bind(this)}
                  style={{
                    marginLeft: "8px",
                  }}
                  className="nav-link text-danger"
                >
                  Log Out
                </Link>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    );

    const guestLinks = (
      <div className="nav-item ml-auto">
        <div className="dropdown">
          <a
            data-toggle="dropdown"
            className="btn border nav-link dropdown-toggle"
            type="button"
          >
            Log In
          </a>
          <ul
            className="dropdown-menu dropdown-menu-right p-3"
            style={{
              width: "250px",
            }}
            onClick={this.onHandleClick.bind(this)}
          >
            <form onSubmit={this.onSubmit}>
              <li>
                <TextFieldGroup
                  placeholder="Email"
                  name="email"
                  type="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.emaillogin}
                />
              </li>
              <li>
                <TextFieldGroup
                  placeholder="Password"
                  name="password"
                  type="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.passwordlogin}
                />
              </li>
              <li>
                {loading ? (
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mt-3"
                    disabled
                  >
                    Log In
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mt-3"
                  >
                    Log In
                  </button>
                )}
              </li>
            </form>
          </ul>
        </div>
      </div>
    );

    return (
      <nav
        className={
          isAuthenticated
            ? "navbar navbar-expand-lg navbar-light bg-white mb-2 py-1"
            : "navbar navbar-expand-lg navbar-light bg-white py-1"
        }
      >
        <i
          className="fas fa-bug logo"
          style={{
            width: "25px",
          }}
        />
        <div className="logo">
          <a className="navbar-brand mr-auto font-weight-bold-50" to="/">
            Bug Tracker
          </a>
        </div>
        {isAuthenticated ? (
          <button
            className="navbar-toggler ml-auto"
            type="button"
            data-toggle="collapse"
            data-target="#mobile-nav"
          >
            <span className="navbar-toggler-icon" />
          </button>
        ) : (
          ""
        )}
        {isAuthenticated ? (
          <div className="collapse navbar-collapse" id="mobile-nav">
            <ul className="navbar-nav mr-auto"></ul>
            {isAuthenticated ? authLinks : ""}
          </div>
        ) : (
          ""
        )}
        {isAuthenticated ? "" : guestLinks}
      </nav>
    );
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  profile: state.profile,
});

export default connect(mapStateToProps, {
  loginUser,
  logoutUser,
  clearCurrentProfile,
})(Navbar);

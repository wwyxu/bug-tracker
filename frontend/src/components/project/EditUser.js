import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { editUser, getProject } from "../../actions/projectActions";
import { getUserById } from "../../actions/userActions";
import TextFieldGroup from "../common/TextFieldGroup";

class EditUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: "",
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getProject(this.props.match.params.id);
    this.props.getUserById(this.props.match.params.userid);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { user } = this.props.user;

    const userData = {
      role: this.state.role,
      user: user.user._id,
      name: user.user.name,
      avatar: user.user.avatar,
    };

    this.props.editUser(
      this.props.match.params.id,
      this.props.match.params.userid,
      userData,
      this.props.history
    );
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;
    const { user } = this.props.user;

    let usersname;

    if (user) {
      usersname = user.user.name;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-3"></div>
          <div className="col-md-6">
            <h1 className="display-4 text-center">Edit Role For {usersname}</h1>
            <form onSubmit={this.onSubmit}>
              <TextFieldGroup
                placeholder="User Role"
                name="role"
                value={this.state.role}
                onChange={this.onChange}
                error={errors.role}
              />
              <div className="col-6 offset-3">
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-info btn-block mt-1"
                />
              </div>
            </form>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    );
  }
}

EditUser.propTypes = {
  getUserById: PropTypes.func.isRequired,
  getProject: PropTypes.func.isRequired,
  editUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  project: state.project,
  user: state.user,
  errors: state.errors,
});

export default connect(mapStateToProps, { getUserById, getProject, editUser })(
  withRouter(EditUser)
);

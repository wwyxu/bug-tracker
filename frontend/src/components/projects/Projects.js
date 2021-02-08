import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import ProjectFeed from "./ProjectFeed";
import Spinner from "../common/Spinner";
import { getProjects } from "../../actions/projectActions";
import TextFieldGroup from "../common/TextFieldGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import { createProject } from "../../actions/projectActions";

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectname: "",
      projectdescription: "",
      duedate: "",
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getProjects();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const { user } = this.props.auth;

    const projectData = {
      name: user.name,
      projectname: this.state.projectname,
      projectdescription: this.state.projectdescription,
      duedate: this.state.duedate,
    };

    this.props.createProject(projectData, this.props.history);
    this.setState({ projectname: "", projectdescription: "", duedate: "" });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { projects, loading } = this.props.project;
    let projectContent;
    const { errors } = this.state;

    if (projects === null || loading) {
      projectContent = <Spinner />;
    } else {
      if (projects.length > 0) {
        projectContent = <ProjectFeed projects={projects} />;
      } else {
        projectContent = (
          <div className="row">
            <div className="col-12">
              <p></p>
              <h4 className="text-center"> No projects to show</h4>
            </div>
          </div>
        );
      }
    }

    return (
      <div>
        <div className="col-sm-8 col-12"></div>
        <div style={{ marginBottom: "8px" }} />
        <div className="container">
          <div className="row no-gutters">
            <div className="col-md-3">
              {loading ? (
                ""
              ) : (
                <button
                  type="button"
                  data-toggle="modal"
                  data-target="#createProject"
                  to="/create-Project"
                  style={{ marginRight: "8px", marginBottom: "8px" }}
                  className="btn btn-info float-right"
                >
                  <i
                    className="fas fa-folder-plus"
                    style={{
                      width: "25px",
                      color: "white",
                    }}
                  />
                </button>
              )}
              <div
                className="modal fade"
                id="createProject"
                tabindex="-1"
                role="dialog"
                aria-labelledby="createProjectModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title" id="createProjectModalLabel">
                        Create a Project
                      </h5>
                      <button
                        type="button"
                        className="close"
                        data-dismiss="modal"
                        aria-label="Close"
                      >
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </div>
                    <div className="modal-body">
                      <form onSubmit={this.onSubmit}>
                        <TextFieldGroup
                          placeholder="Project Name"
                          name="projectname"
                          value={this.state.projectname}
                          onChange={this.onChange}
                          error={errors.projectname}
                        />
                        <TextAreaFieldGroup
                          placeholder="Project Description"
                          name="projectdescription"
                          value={this.state.projectdescription}
                          onChange={this.onChange}
                          error={errors.projectdescription}
                        />
                        <h6>Due Date</h6>
                        <TextFieldGroup
                          name="duedate"
                          type="date"
                          value={this.state.duedate}
                          onChange={this.onChange}
                          error={errors.duedate}
                        />
                        <input
                          type="submit"
                          value="Submit"
                          className="btn btn-info btn-block mt-4"
                        />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">{projectContent}</div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </div>
    );
  }
}

Projects.propTypes = {
  getProjects: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  createProject: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  project: state.project,
});

export default connect(mapStateToProps, { createProject, getProjects })(
  Projects
);

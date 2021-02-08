import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { editProject, getProject } from "../../actions/projectActions";
import isEmpty from "../../validation/is-empty";
import SelectListGroup from "../common/SelectListGroup";
import TextAreaFieldGroup from "../common/TextAreaFieldGroup";
import TextFieldGroup from "../common/TextFieldGroup";

class EditProject extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectname: "",
      projectdescription: "",
      duedate: "",
      complete: "",
      errors: {},
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.getProject(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    if (nextProps.project.project) {
      const project = nextProps.project.project;

      project.projectname = !isEmpty(project.projectname)
        ? project.projectname
        : "";
      project.projectdescription = !isEmpty(project.projectdescription)
        ? project.projectdescription
        : "";
      project.duedate = !isEmpty(project.duedate) ? project.duedate : "";
      project.complete = !isEmpty(project.complete) ? project.complete : "";

      // Set component fields state
      this.setState({
        projectname: project.projectname,
        projectdescription: project.projectdescription,
        duedate: project.duedate,
        complete: project.complete,
      });
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const projectData = {
      projectname: this.state.projectname,
      projectdescription: this.state.projectdescription,
      duedate: this.state.duedate,
      complete: this.state.complete,
    };

    this.props.editProject(
      this.props.match.params.id,
      projectData,
      this.props.history
    );
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors } = this.state;

    // Select options for completion status
    const options = [
      { label: "Select Status", value: 0 },
      { label: "In Progress", value: "In Progress" },
      { label: "Debugging", value: "Debugging" },
      { label: "In Testing", value: "In Testing" },
      { label: "Complete", value: "Complete" },
    ];

    return (
      <div className="container">
        <div className="row">
          <div className="col-md-8 m-auto">
            <div className="card p-4">
              <h1 className="display-4 mb-4 text-center text-dark">
                Edit Project
              </h1>
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
                <SelectListGroup
                  placeholder="Project Status"
                  name="complete"
                  value={this.state.complete}
                  onChange={this.onChange}
                  options={options}
                  error={errors.complete}
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
    );
  }
}

EditProject.propTypes = {
  getProject: PropTypes.func.isRequired,
  editProject: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  project: state.project,
  errors: state.errors,
});

export default connect(mapStateToProps, { editProject, getProject })(
  withRouter(EditProject)
);

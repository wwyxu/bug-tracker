import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { deleteProject } from "../../../../services/api/project";

class ProjectItem extends Component {
  onDeleteClick(projectId) {
    this.props.deleteProject(projectId);
  }

  render() {
    const { project, auth } = this.props;

    const trimtext = project.projectdescription.replace(
      /(^.{100}).*$/,
      "$1..."
    );

    return (
      <div className="card card-body bg-light mb-2">
        <div className="row">
          <div className="col-8 border-right small_column">
            <Link to={`/project/${project._id}?page=1`}>
              <h3 style={{ margin: "0px" }}> {project.projectname}</h3>
            </Link>
            <p style={{ margin: "0" }}>
              <small className="text-muted text-right">
                Owner: {project.name}
              </small>
            </p>
            <p>{trimtext}</p>
            {project.user === auth.user.id ? (
              <button
                onClick={this.onDeleteClick.bind(this, project._id)}
                type="button"
                className="btn btn-danger mt-1"
              >
                Delete Project {"  "}
                <i className="fas fa-times" />
              </button>
            ) : (
              <button
                onClick={this.onDeleteClick.bind(this, project._id)}
                type="button"
                className="btn btn-warning text-white mt-1"
              >
                Leave Project {"  "}
                <i className="fas fa-times" />
              </button>
            )}
          </div>
          <div className="col-4 small_column">
            <p>
              <small className="text-muted">{project.complete}</small>
            </p>
            <p>
              <small className="text-muted">
                Created:{"  "}
                {moment(project.date).format("DD/MM/YYYY")}
              </small>
            </p>
            {project.duedate ? (
              <p>
                <small className="text-muted">
                  Due:{"  "} {moment(project.duedate).format("DD/MM/YYYY")}
                </small>
              </p>
            ) : null}
            <p>
              <small className="text-muted">
                Users: {project.assigned.length}
              </small>
            </p>
            <p>
              <small className="text-muted">
                Tickets: {project.tickets.length}
              </small>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

ProjectItem.propTypes = {
  deleteProject: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteProject })(ProjectItem);

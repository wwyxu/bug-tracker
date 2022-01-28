import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { getProject } from "../../../services/api/project";
import Spinner from "../../common/spinner";
import AssignedItem from "./assigned-users";
import TicketItem from "./ticket";

class Project extends Component {
  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    const pageQueryParam = params.get("page");
    if (!pageQueryParam) {
      window.history.pushState({ page: 1 }, "?page=1");
    }
    this.props.getProject(
      this.props.match.params.id,
      pageQueryParam,
      false
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.project.project === null && this.props.project.loading) {
      this.props.history.push("/not-found");
    }
  }

  onPaginateClick(page) {
    this.props.getProject(this.props.match.params.id, page, true);
  }

  render() {
    const { project, loading } = this.props.project;
    const { auth } = this.props;

    const userArray = project.assigned;
    const ticketArray = project.tickets;
    const params = new URLSearchParams(window.location.search);
    const pageQueryParam = params.get("page");
    const currPage = parseInt(pageQueryParam, 10);

    let projectContent;
    let ticketContent;
    let assignedList;
    let ticketList;

    if (userArray) {
      assignedList = userArray.map((user) => (
        <AssignedItem
          key={user._id}
          assign={user}
          projectId={this.props.match.params.id}
          ownerId={project.user}
        />
      ));
    }

    if (ticketArray) {
      ticketList = (
        <TicketItem
          assigned={project.assigned}
          projectname={project.projectname}
          ticket={project.tickets}
          projectId={this.props.match.params.id}
        />
      );
    }

    if (project === null || loading) {
      ticketContent = <Spinner />;
    } else {
      ticketContent = <div className="container-fluid">{ticketList}</div>;
    }

    if (project === null || loading) {
      projectContent = <Spinner />;
    } else {
      projectContent = (
        <div className="container-fluid">
          <div
            className="card grey_bg"
            style={{
              marginRight: "8px",
              marginLeft: "8px",
            }}
          >
            <div className="container-fluid">
              <div className="row">
                <div className="col-7 small_column">
                  {project.date ? (
                    <p
                      style={{
                        marginLeft: "6px",
                      }}
                    >
                      <small className="text-justify">
                        Created: {moment(project.date).format("DD/MM/YYYY")}
                      </small>
                    </p>
                  ) : null}
                  {project.duedate ? (
                    <p
                      style={{
                        marginLeft: "6px",
                      }}
                    >
                      <small>
                        Due: {moment(project.duedate).format("DD/MM/YYYY")}
                      </small>
                    </p>
                  ) : null}
                </div>
                <div className="col-5 small_column">
                  <p>
                    <small
                      className="float-right"
                      style={{
                        marginRight: "6px",
                        marginTop: "2px",
                      }}
                    >
                      {project.complete}
                    </small>
                  </p>
                </div>
              </div>
              <div>
                <h3 className="text-center mt-2">{project.projectname}</h3>
                <p className="text-center">
                  {project.projectdescription}
                </p>
              </div>
            </div>
          </div>
          {project.user === auth.user.id ? (
            <div className="container-fluid text-center">
              <div
                className="row no-gutters"
                style={{
                  marginRight: "8px",
                  marginLeft: "8px",
                }}
              >
                <div className="col-4">
                  <Link
                    className="btn btn-block btn-light text-dark border"
                    to={`/invite-users/${project._id}`}
                  >
                    Invite
                  </Link>
                </div>
                <div className="col-4">
                  <Link
                    className="btn btn-block btn-light text-dark border"
                    to={`/pending-users/${project._id}`}
                  >
                    Pending
                  </Link>
                </div>
                <div className="col-4">
                  <Link
                    className="btn btn-block btn-light text-dark border"
                    to={`/edit-project/${project._id}`}
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
          <div
            className="assigned_container"
            style={{
              marginRight: "8px",
              marginLeft: "8px",
            }}
          >
            <div
              style={{
                marginTop: "6px",
              }}
            >
              {assignedList}{" "}
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="container-fluid">
        <div className="row no-gutters">
          <div className="col-xl-2 border-right">{projectContent}</div>
          <div className="col-xl-10">
            {ticketContent}
            <div className="container-fluid pb-2 pt-2">
              {project.pages && project.pages.length && !loading && (
                <ul className="pagination justify-content-center">
                  <li
                    className={`page-item first-item ${
                      currPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <Link
                      to={`/project/${this.props.match.params.id}?page=1`}
                      className="page-link"
                      onClick={this.onPaginateClick.bind(this, 1)}
                    >
                      First
                    </Link>
                  </li>

                  {project.pages.map((page) => (
                    <li
                      key={page}
                      className={`page-item number-item ${
                        currPage === page ? "active" : ""
                      }`}
                    >
                      <Link
                        to={`/project/${this.props.match.params.id}?page=${page}`}
                        className="page-link"
                        onClick={this.onPaginateClick.bind(this, page)}
                      >
                        {page}
                      </Link>
                    </li>
                  ))}
                  <li
                    className={`page-item last-item ${
                      currPage === project.totalPages ? "disabled" : ""
                    }`}
                  >
                    <Link
                      onClick={this.onPaginateClick.bind(
                        this,
                        project.totalPages
                      )}
                      to={`/project/${this.props.match.params.id}?page=${project.totalPages}`}
                      className="page-link"
                    >
                      Last
                    </Link>
                  </li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Project.propTypes = {
  getProject: PropTypes.func.isRequired,
  project: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  project: state.project,
  auth: state.auth,
});

export default connect(mapStateToProps, { getProject })(Project);

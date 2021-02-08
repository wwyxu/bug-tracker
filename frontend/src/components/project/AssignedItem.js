import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { removeUser } from "../../actions/projectActions";

class AssignedItem extends Component {
  onDeleteClick(projectId, userId) {
    const params = new URLSearchParams(window.location.search);
    const pageQueryParam = params.get("page");
    this.props.removeUser(projectId, userId, pageQueryParam);
  }

  render() {
    const { assign, projectId, ownerId, auth } = this.props;

    return (
      <div className="card" style={{ marginBottom: "6px" }}>
        <div className="row no-gutters" style={{ marginTop: "15px" }}>
          <div className="col-6 pl-3">
            <Link to={`/profile/${assign.user}`}>
              <p className="text">{assign.name}</p>
            </Link>
          </div>
          <div className="col-6">
            {auth.user.id === ownerId ? (
              <div className="dropdown float-right">
                <button
                  className="btn btn-white dropdown-toggle float-right"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {assign.role}
                </button>
                <div
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <Link
                    className="dropdown-item"
                    to={`/project/${projectId}/edit-user/${assign.user}`}
                  >
                    Edit User
                  </Link>
                  {assign.user === ownerId ? null : (
                    <div className="dropdown-divider"></div>
                  )}
                  {assign.user === ownerId ? null : (
                    <a
                      className="dropdown-item text-danger"
                      onClick={this.onDeleteClick.bind(
                        this,
                        projectId,
                        assign.user
                      )}
                      type="button"
                    >
                      Remove User
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <p className="float-right" style={{ marginRight: "15px" }}>
                {assign.role}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
}

AssignedItem.propTypes = {
  removeUser: PropTypes.func.isRequired,
  assign: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { removeUser })(AssignedItem);

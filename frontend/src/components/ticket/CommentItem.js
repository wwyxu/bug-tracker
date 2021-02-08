import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { deleteComment } from "../../actions/ticketActions";

class CommentItem extends Component {
  onDeleteClick(ticketId, commentId) {
    this.props.deleteComment(ticketId, commentId);
  }

  render() {
    const { comment, ticketId, auth } = this.props;

    return (
      <div className="card card-body mb-2 d-flex">
        <div className="row">
          <div className="col-md-3 border-right">
            <p className="text-center">
              <Link to={`/profile/${comment.user}`}>
                <p className="text-center">{comment.name}</p>
              </Link>
            </p>
          </div>
          <div className="col-md-8">
            <p className="text">{comment.comment}</p>
          </div>
          <div className="col-md-1">
            {comment.user === auth.user.id ? (
              <button
                onClick={this.onDeleteClick.bind(this, ticketId, comment._id)}
                type="button"
                className="btn btn-danger mr-1"
              >
                <i className="fas fa-times" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

CommentItem.propTypes = {
  deleteComment: PropTypes.func.isRequired,
  comment: PropTypes.object.isRequired,
  ticketId: PropTypes.string.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { deleteComment })(CommentItem);

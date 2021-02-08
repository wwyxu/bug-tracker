import PropTypes from "prop-types";
import React, { Component } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { getAllTickets } from "../../actions/ticketActions";
import Spinner from "../common/Spinner";

class Dashboard extends Component {
  componentDidMount() {
    this.props.getAllTickets();
  }

  render() {
    const { user } = this.props.auth;
    const { assignedtickets, tickets, loading } = this.props.ticket;

    let dashboardContent;
    let assignedstate;
    let assignedprioritystate;
    let myticketstate;
    let myticketprioritystate;

    if (!assignedtickets || assignedtickets === null || loading) {
      assignedstate = {};
    } else {
      assignedstate = {
        labels: ["Open", "In Progress", "To Be Tested", "Closed", "No Status"],
        datasets: [
          {
            label: "Assigned Ticket Status",
            backgroundColor: [
              "rgb(27, 75, 163)",
              "rgb(206, 195, 44)",
              "rgb(50, 134, 28)",
              "rgb(117, 117, 117)",
              "#6800B4",
            ],
            hoverBackgroundColor: [
              "rgb(7, 55, 143)",
              "rgb(186, 175, 24)",
              "rgb(30, 114, 8)",
              "rgb(97, 97, 97)",
              "#35014F",
            ],
            data: [
              assignedtickets.filter(function (ticket) {
                return ticket.complete === "Open";
              }).length,
              assignedtickets.filter(function (ticket) {
                return ticket.complete === "In Progress";
              }).length,
              assignedtickets.filter(function (ticket) {
                return ticket.complete === "To Be Tested";
              }).length,
              assignedtickets.filter(function (ticket) {
                return ticket.complete === "Closed";
              }).length,
              assignedtickets.filter(function (ticket) {
                return ticket.complete === "0";
              }).length,
            ],
          },
        ],
      };
    }

    if (!assignedtickets || assignedtickets === null || loading) {
      assignedprioritystate = {};
    } else {
      assignedprioritystate = {
        labels: ["Low", "Medium", "High", "No Status"],
        datasets: [
          {
            label: "Assigned Ticket Priority",
            backgroundColor: [
              "rgb(235, 223, 63)",
              "rgb(219, 118, 60)",
              "rgb(224, 57, 35)",
              "rgb(117, 117, 117)",
            ],
            hoverBackgroundColor: [
              "rgb(215, 203, 43)",
              "rgb(199, 98, 40)",
              "rgb(204, 37, 15)",
              "rgb(97, 97, 97)",
            ],
            data: [
              assignedtickets.filter(function (ticket) {
                return ticket.priority === "Low";
              }).length,
              assignedtickets.filter(function (ticket) {
                return ticket.priority === "Medium";
              }).length,
              assignedtickets.filter(function (ticket) {
                return ticket.priority === "High";
              }).length,
              assignedtickets.filter(function (ticket) {
                return ticket.priority === "0";
              }).length,
            ],
          },
        ],
      };
    }

    if (!tickets || tickets === null || loading) {
      myticketstate = {};
    } else {
      myticketstate = {
        labels: ["Open", "In Progress", "To Be Tested", "Closed", "No Status"],
        datasets: [
          {
            label: "Assigned Ticket Status",
            backgroundColor: [
              "rgb(27, 75, 163)",
              "rgb(206, 195, 44)",
              "rgb(50, 134, 28)",
              "rgb(117, 117, 117)",
              "#6800B4",
            ],
            hoverBackgroundColor: [
              "rgb(7, 55, 143)",
              "rgb(186, 175, 24)",
              "rgb(30, 114, 8)",
              "rgb(97, 97, 97)",
              "#35014F",
            ],
            data: [
              tickets.filter(function (ticket) {
                return ticket.complete === "Open";
              }).length,
              tickets.filter(function (ticket) {
                return ticket.complete === "In Progress";
              }).length,
              tickets.filter(function (ticket) {
                return ticket.complete === "To Be Tested";
              }).length,
              tickets.filter(function (ticket) {
                return ticket.complete === "Closed";
              }).length,
              tickets.filter(function (ticket) {
                return ticket.complete === "0";
              }).length,
            ],
          },
        ],
      };
    }

    if (!tickets || tickets === null || loading) {
      myticketprioritystate = {};
    } else {
      myticketprioritystate = {
        labels: ["Low", "Medium", "High", "No Status"],
        datasets: [
          {
            label: "Assigned Ticket Priority",
            backgroundColor: [
              "rgb(235, 223, 63)",
              "rgb(219, 118, 60)",
              "rgb(224, 57, 35)",
              "rgb(117, 117, 117)",
            ],
            hoverBackgroundColor: [
              "rgb(215, 203, 43)",
              "rgb(199, 98, 40)",
              "rgb(204, 37, 15)",
              "rgb(97, 97, 97)",
            ],
            data: [
              tickets.filter(function (ticket) {
                return ticket.priority === "Low";
              }).length,
              tickets.filter(function (ticket) {
                return ticket.priority === "Medium";
              }).length,
              tickets.filter(function (ticket) {
                return ticket.priority === "High";
              }).length,
              tickets.filter(function (ticket) {
                return ticket.priority === "0";
              }).length,
            ],
          },
        ],
      };
    }

    const Month1 = new Date();
    const Month2 = new Date();
    const Month3 = new Date();
    const Month4 = new Date();
    const Month5 = new Date();
    const Month6 = new Date();

    Month1.setMonth(Month1.getMonth());
    const month = Month1.toLocaleString("default", { month: "long" });

    Month2.setMonth(Month2.getMonth() - 1);
    const month2 = Month2.toLocaleString("default", { month: "long" });

    Month3.setMonth(Month3.getMonth() - 2);
    const month3 = Month3.toLocaleString("default", { month: "long" });

    Month4.setMonth(Month4.getMonth() - 3);
    const month4 = Month4.toLocaleString("default", { month: "long" });

    Month5.setMonth(Month5.getMonth() - 4);
    const month5 = Month5.toLocaleString("default", { month: "long" });

    Month6.setMonth(Month6.getMonth() - 5);
    const month6 = Month6.toLocaleString("default", { month: "long" });

    const ticketBarData = {
      labels: [month6, month5, month4, month3, month2, month],
      datasets: [
        {
          label: "Open Tickets",
          backgroundColor: "rgb(27, 75, 163)",
          borderColor: "rgb(7, 55, 143)",
          borderWidth: 1,
          hoverBackgroundColor: "rgb(7, 55, 143)",
          hoverBorderColor: "rgb(7, 55, 143)",
          data: [
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month6.getMonth() + 1
              );
            }).length,
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month5.getMonth() + 1
              );
            }).length,
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month4.getMonth() + 1
              );
            }).length,
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month3.getMonth() + 1
              );
            }).length,
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month2.getMonth() + 1
              );
            }).length,
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month1.getMonth() + 1
              );
            }).length,
          ],
        },
        {
          label: "Closed Tickets",
          backgroundColor: "rgb(117, 117, 117)",
          borderColor: "rgb(57, 57, 57)",
          borderWidth: 1,
          hoverBackgroundColor: "rgb(97, 97, 97)",
          hoverBorderColor: "rgb(97, 97, 97)",
          data: [
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month6.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month5.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month4.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month3.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month2.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
            tickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month1.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
          ],
        },
      ],
    };

    const assignedticketBarData = {
      labels: [month6, month5, month4, month3, month2, month],
      datasets: [
        {
          label: "Open Tickets",
          backgroundColor: "rgb(27, 75, 163)",
          borderColor: "rgb(7, 55, 143)",
          borderWidth: 1,
          hoverBackgroundColor: "rgb(7, 55, 143)",
          hoverBorderColor: "rgb(7, 55, 143)",
          data: [
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month6.getMonth() + 1
              );
            }).length,
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month5.getMonth() + 1
              );
            }).length,
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month4.getMonth() + 1
              );
            }).length,
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month3.getMonth() + 1
              );
            }).length,
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month2.getMonth() + 1
              );
            }).length,
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month1.getMonth() + 1
              );
            }).length,
          ],
        },
        {
          label: "Closed Tickets",
          backgroundColor: "rgb(117, 117, 117)",
          borderColor: "rgb(57, 57, 57)",
          borderWidth: 1,
          hoverBackgroundColor: "rgb(97, 97, 97)",
          hoverBorderColor: "rgb(97, 97, 97)",
          data: [
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month6.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month5.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month4.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month3.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month2.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
            assignedtickets.filter(function (ticket) {
              return (
                new Date(ticket.date).getMonth() + 1 == Month1.getMonth() + 1 &&
                ticket.complete == "Closed"
              );
            }).length,
          ],
        },
      ],
    };

    if (assignedtickets === null || loading) {
      dashboardContent = <Spinner />;
    } else {
      dashboardContent = (
        <div className="px-5 pt-2">
          <p>
            Welcome <Link to={`/profile/${user.id}`}>{user.name}</Link>
          </p>
          <p></p>
          <div className="container-fluid">
            <div className="row">
              <div className="col-xl-3 col-lg-6">
                <div className="card mb-2 pb-2">
                  <Pie
                    data={assignedstate}
                    options={{
                      title: {
                        display: true,
                        text: "Assigned tickets by status",
                        fontSize: 20,
                      },
                      legend: {
                        display: true,
                        position: "top",
                      },
                    }}
                  />
                </div>
              </div>
              <div className="col-xl-3 col-lg-6">
                <div className="card mb-2 pb-2">
                  <Pie
                    data={assignedprioritystate}
                    options={{
                      title: {
                        display: true,
                        text: "Assigned tickets by priority",
                        fontSize: 20,
                      },
                      legend: {
                        display: true,
                        position: "top",
                      },
                    }}
                  />
                </div>
              </div>
              <div className="col-xl-3 col-lg-6">
                <div className="card mb-2 pb-2">
                  <Pie
                    data={myticketstate}
                    options={{
                      title: {
                        display: true,
                        text: "Tickets by status",
                        fontSize: 20,
                      },
                      legend: {
                        display: true,
                        position: "top",
                      },
                    }}
                  />
                </div>
              </div>
              <div className="col-xl-3 col-lg-6">
                <div className="card mb-2 pb-2">
                  <Pie
                    data={myticketprioritystate}
                    options={{
                      title: {
                        display: true,
                        text: "Tickets by priority",
                        fontSize: 20,
                      },
                      legend: {
                        display: true,
                        position: "top",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6 mt-2">
                <Bar
                  data={ticketBarData}
                  width={null}
                  height={null}
                  options={{
                    title: {
                      display: true,
                      text: "Tickets: Past 6 Months",
                      fontSize: 20,
                    },
                    legend: {
                      display: true,
                      position: "top",
                    },
                    responsive: true,
                    type: "bar",
                  }}
                />
              </div>
              <div className="col-lg-6 mt-2">
                <Bar
                  data={assignedticketBarData}
                  width={null}
                  height={null}
                  options={{
                    title: {
                      display: true,
                      text: "Assigned Tickets: Past 6 Months",
                      fontSize: 20,
                    },
                    legend: {
                      display: true,
                      position: "top",
                    },
                    responsive: true,
                    type: "bar",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <div className="container-fluid">{dashboardContent}</div>;
  }
}

Dashboard.propTypes = {
  auth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  getAllTickets: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
  ticket: state.ticket,
});

export default connect(mapStateToProps, {
  getAllTickets,
})(withRouter(Dashboard));

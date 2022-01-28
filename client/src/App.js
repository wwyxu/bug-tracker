import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { logoutUser, setCurrentUser } from "./services/api/auth";
import { clearCurrentProfile } from "./services/api/profile";
import store from "./store";
import "./styles.css";
import setAuthToken from "./utils/setAuthToken";
import LoginToContinue from "./views/common/login-to-continue";
import NotFound from "./views/common/not-found";
import PrivateRoute from "./views/common/private-route";
import Dashboard from "./views/dashboard/index";
import Landing from "./views/landing";
import Navbar from "./views/navbar";
import Profile from "./views/profile";
import CreateProfile from "./views/profile-management/create-profile";
import EditProfile from "./views/profile-management/edit-profile";
import Settings from "./views/profile-management/settings";
import Profiles from "./views/profiles";
import Requests from "./views/project-requests";
import EditProject from "./views/project/edit-project";
import EditUser from "./views/project/edit-user";
import InviteUsers from "./views/project/invite-users";
import PendingUsers from "./views/project/pending-users";
import Project from "./views/project/project";
import Projects from "./views/projects";
import EditTicket from "./views/ticket/edit";
import Ticket from "./views/ticket/ticket";
import Tickets from "./views/tickets";
import AssignedTickets from "./views/tickets-assigned";

if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  store.dispatch(setCurrentUser(decoded));

  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    store.dispatch(clearCurrentProfile());
    store.dispatch(logoutUser());
    window.location.reload();
    window.location.href = "/";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing} />
            <Switch>
              <PrivateRoute exact path="/profiles" component={Profiles} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/profile/:id" component={Profile} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/settings" component={Settings} />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/projects" component={Projects} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/project/:id" component={Project} />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/edit-project/:id"
                component={EditProject}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/invite-users/:id"
                component={InviteUsers}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/pending-users/:id"
                component={PendingUsers}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/project/:id/edit-user/:userid"
                component={EditUser}
              />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/edit-ticket/:id"
                component={EditTicket}
              />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/tickets" component={Tickets} />
            </Switch>
            <Switch>
              <PrivateRoute
                exact
                path="/assignedtickets"
                component={AssignedTickets}
              />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/ticket/:id" component={Ticket} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/requests" component={Requests} />
            </Switch>
            <Route exact path="/not-found" component={NotFound} />
            <Route exact path="/logintocontinue" component={LoginToContinue} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

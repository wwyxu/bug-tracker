import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { logoutUser, setCurrentUser } from "./actions/authActions";
import { clearCurrentProfile } from "./actions/profileActions";
import "./App.css";
import NotFound from "./components/common/NotFound";
import PrivateRoute from "./components/common/PrivateRoute";
import Dashboard from "./components/layout/Dashboard";
import Landing from "./components/layout/Landing";
import Navbar from "./components/layout/Navbar";
import CreateProfile from "./components/profile-management/CreateProfile";
import EditProfile from "./components/profile-management/EditProfile";
import LoginToContinue from "./components/profile-management/LoginToContinue";
import Settings from "./components/profile-management/Settings";
import Profile from "./components/profile/Profile";
import Profiles from "./components/profiles/Profiles";
import Requests from "./components/project-requests/Requests";
import EditProject from "./components/project/EditProject";
import EditUser from "./components/project/EditUser";
import InviteUsers from "./components/project/InviteUsers";
import PendingUsers from "./components/project/PendingUsers";
import Project from "./components/project/Project";
import Projects from "./components/projects/Projects";
import EditTicket from "./components/ticket/EditTicket";
import Ticket from "./components/ticket/Ticket";
import AssignedTickets from "./components/tickets/AssignedTickets";
import Tickets from "./components/tickets/Tickets";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Clear current Profile
    store.dispatch(clearCurrentProfile());
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to home
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

import React from "react";
import Signup from "./Signup";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./ForgotPassword";
import UpdateProfile from "./UpdateProfile";
import About from "./About";
import AddPointOfInterest from "./AddPointOfInterest";
import AddTour from "./AddTour";
import AddTourGuide from "./AddTourGuide";
import AddVehicle from "./AddVehicle";
import PointOfInterest from "./PointOfInterest";
import Profile from "./Profile";
import RentRequests from "./RentRequests";
import Settings from "./Settings";
import Tours from "./Tours";
import TourRequest from "./TourRequest";
import Vehicles from "./Vehicles";
import ViewRequests from "./ViewRequests"
import ToursForGuide from "./ToursForGuide"
import ViewRequestsGuide from "./ViewRequestsGuide"
import DashboardGuide from "./DashboardGuide"

function App() {
  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="appStyles">
        <div>
          <Router>
            <AuthProvider>
              <Switch>
                <PrivateRoute exact path="/" component={Dashboard} />
                <PrivateRoute exact path="/DashboardGuide" component={DashboardGuide} />

                <PrivateRoute
                  path="/update-profile"
                  component={UpdateProfile}
                />

                <PrivateRoute path="/About" component={About} />




                <PrivateRoute path="/Profile" component={Profile} />
                <PrivateRoute path="/Settings" component={Settings} />
                <PrivateRoute path="/TourRequest" component={TourRequest} />
                <PrivateRoute path="/Tours" component={Tours} />

                <PrivateRoute path="/ViewRequests" component={ViewRequests} />


                <PrivateRoute path="/ToursForGuide" component={ToursForGuide} />
                <PrivateRoute path="/ViewRequestsGuide" component={ViewRequestsGuide} />
      

                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/forgot-password" component={ForgotPassword} />
              </Switch>
            </AuthProvider>
          </Router>
        </div>
      </div>
    </Container>
  );
}

export default App;

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
import TourGuides from "./TourGuides";
import Vehicles from "./Vehicles";

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
                <PrivateRoute
                  path="/update-profile"
                  component={UpdateProfile}
                />

                <PrivateRoute path="/About" component={About} />
                <PrivateRoute
                  path="/AddPointOfInterest"
                  component={AddPointOfInterest}
                />
                <PrivateRoute path="/AddTour" component={AddTour} />
                <PrivateRoute path="/AddTourGuide" component={AddTourGuide} />
                <PrivateRoute path="/AddVehicle" component={AddVehicle} />
                <PrivateRoute
                  path="/PointOfInterest"
                  component={PointOfInterest}
                />
                <PrivateRoute path="/Profile" component={Profile} />
                <PrivateRoute path="/RentRequests" component={RentRequests} />
                <PrivateRoute path="/Settings" component={Settings} />
                <PrivateRoute path="/TourGuides" component={TourGuides} />
                <PrivateRoute path="/Tours" component={Tours} />
                <PrivateRoute path="/Vehicles" component={Vehicles} />

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

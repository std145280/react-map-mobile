import React, { useState } from "react";
import { Card, Button, Alert, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import Profile from "./Profile";
import logo from "../images/logo-64x128.png";

export default function NavigationBar() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Failed to log out");
    }
  }

  return (

    <div className="admin-panel-container">
      <Navbar fixed="top" collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Brand href="#home"  onClick={() => history.push("/")}> <img src={logo} alt="Logo" width={96} height={48}/> </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">

            <NavDropdown title="Vehicles" id="collasible-nav-dropdown">
              <NavDropdown.Item 
                href="#all_vehicles"
                onClick={() => history.push("/Vehicles")}
              >
                All Vehicles
              </NavDropdown.Item>
            
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="#add_vehicle"
                onClick={() => history.push("/AddVehicle")}
              >
                Add Vehicle
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Tour Guides" id="collasible-nav-dropdown">
              <NavDropdown.Item
                href="#all_tour_guides"
                onClick={() => history.push("/TourGuides")}
              >
                All Tour Guides
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="#add_tour_guide"
                onClick={() => history.push("/AddTourGuide")}
              >
                Add Tour Guide
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Points Of Interest" id="collasible-nav-dropdown">
              <NavDropdown.Item
                href="#all_points_of_interest"
                onClick={() => history.push("/PointOfInterest")}
              >
                All Points Of Interest
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="#add_point_of_interest"
                onClick={() => history.push("/AddPointOfInterest")}
              >
                Add Point of Interest
              </NavDropdown.Item>

            </NavDropdown>
            <NavDropdown title="Tours" id="collasible-nav-dropdown">
              <NavDropdown.Item
                href="#all_tours"
                onClick={() => history.push("/Tours")}
              >
                All Tours
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="#add_tour"
                onClick={() => history.push("/AddTour")}
              >
                Add Tour
              </NavDropdown.Item>
            </NavDropdown>
            
          </Nav>
          <Nav>
            <Nav.Link
              href="#rent_requests"
              onClick={() => history.push("/RentRequests")}
            >
              Rent Requests
            </Nav.Link>
            <NavDropdown title="Settings" id="collasible-nav-dropdown">
              <NavDropdown.Item
                href="#settings"
                onClick={() => history.push("/Settings")}
              >
                System Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="#profile"
                onClick={() => history.push("/Profile")}
              >
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="#about"
                onClick={() => history.push("/About")}
              >
                About
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#log_out" onClick={handleLogout}>
              Log Out{" "}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
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

    window.ga("send", {
      hitType: "event",
      eventCategory: "NavBar",
      eventAction: "touch",
      eventLabel: Date().toLocaleString() + " - LogOut",
    });

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
        <Navbar.Brand
          href="#home"
          onClick={() => {
            history.push("/");

            window.ga("send", {
              hitType: "event",
              eventCategory: "NavBar",
              eventAction: "touch",
              eventLabel: Date().toLocaleString() + " - Go to Dashboard",
            });
          }}
        >
          {" "}
          <img src={logo} alt="Logo" width={96} height={48} />{" "}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {/*
          <Nav.Link
              href="#rent_requests"
              onClick={() => history.push("/RentRequests")}
            >
              Rent Requests
</Nav.Link> */}
          </Nav>
          <Nav>
            <NavDropdown title="Settings" id="collasible-nav-dropdown">
              <NavDropdown.Item
                href="#settings"
                onClick={() => {
                  history.push("/Settings");

                  window.ga("send", {
                    hitType: "event",
                    eventCategory: "NavBar",
                    eventAction: "touch",
                    eventLabel: Date().toLocaleString() + " - Go to Settings",
                  });
                }}
              >
                System Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="#profile"
                onClick={() => {
                  history.push("/Profile");

                  window.ga("send", {
                    hitType: "event",
                    eventCategory: "NavBar",
                    eventAction: "touch",
                    eventLabel: Date().toLocaleString() + " - Go to Profile",
                  });
                }}
              >
                Profile
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item
                href="#about"
                onClick={() => {
                  history.push("/About");

                  window.ga("send", {
                    hitType: "event",
                    eventCategory: "NavBar",
                    eventAction: "touch",
                    eventLabel: Date().toLocaleString() + " - Go to About",
                  });
                }}
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

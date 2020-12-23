import React, { useState } from "react";
import { Card, Table } from "react-bootstrap";
import firebase from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";

export default function RentRequestList({ request }) {
  const { currentUser, updatePassword, updateEmail } = useAuth();

  const assign = () => {
    const rentReqRef = firebase.database().ref("rentRequest").child(request.id);
    rentReqRef.update({
      isAccepted: true,
    });
  };

  const unassign = () => {
    const rentReqRef = firebase.database().ref("rentRequest").child(request.id);
    rentReqRef.update({
      isAccepted: false,
    });
  };

  const startTour = () => {

    
  }

  const goToNavigation = () => {
    if (request.status === "Ready")
      return (
        <button
          className="btn btn-success btn-lg rounded-0 w-100"
          type="submit"
          onClick={startTour}
        >
          {`START  `}
          <i class="fas fa-route"></i>
        </button>
      );
    else {
      return (
        <button
          className="btn btn-success btn-lg rounded-0 w-100"
          type="submit"
          //onClick={startTour}
          disabled
        >
          {`START  `}
          <i class="fas fa-route"></i>
        </button>
      );
    }
  };

  const viewUsersRequests = () => {
    if (currentUser.email === request.user) {
      return (
        <div>
            <br />
          <Card className="cardAsItems" style={{ flex: 1 }}>
            <Card.Body>
              <Table striped bordered hover>
                <thead></thead>
                <tbody>
                  <tr>
                    <td colSpan="2">
                      <b>
                        <center>
                          <b>Request Id:</b> {request.id}
                        </center>
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <Card.Title>
                        <center>
                          <b>Tour: </b> {request.selectedTourTitle}
                        </center>
                      </Card.Title>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <center>
                        <b>Car:</b> {request.selectedCarTitle}
                      </center>
                    </td>
                    <td>
                      <center>
                        <b>Total Cost: </b> {request.totalCost}
                      </center>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <center>
                        <b>Start Location: </b> {request.startLocationName}
                      </center>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <center>
                        <b>Finish Location: </b> {request.finishLocationName}
                      </center>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Status: </b> {request.status}
                    </td>

                    <td>
                      <b>Assigned to: </b> {request.assignedTourGuide}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <center>
                        {request.isAccepted ? (
                          <b style={{ color: "green" }}>Assigned</b>
                        ) : (
                          <b style={{ color: "red" }}>Unassigned</b>
                        )}{" "}
                      </center>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
              <center>
                {goToNavigation()}
              </center>
            </Card.Footer>
          </Card>
          <br />
        </div>
      );
    }
  };

  return <>{viewUsersRequests()}</>;
}

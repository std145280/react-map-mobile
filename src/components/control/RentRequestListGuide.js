import React, { useState, useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import firebase from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import Map from "./LeafletMapTourOn";
import PopupMap from "./PopupMap";

import PopupMsg from "./PopupMsg";

export default function RentRequestListGuide({ request }) {
  const [tourList, setTourList] = useState();

  const [tour, setTour] = useState();

  useEffect(() => {
    const tourRef = firebase.database().ref("tour");
    tourRef.on("value", (snapshot) => {
      const tours = snapshot.val();
      const tourList = [];
      for (let id in tours) {
        tourList.push({ id, ...tours[id] });
      }
      setTourList(tourList);
    });
  }, []);

  const { currentUser, updatePassword, updateEmail } = useAuth();

  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const toggleVerificationPopupMsg = (e) => {
    e.preventDefault();
    setIsVerificationOpen(!isVerificationOpen);
  };

  const [isUnassignOpen, setIsUnassignOpen] = useState(false);
  const toggleUnassignPopupMsg = (e) => {
    e.preventDefault();
    setIsUnassignOpen(!isUnassignOpen);
  };

  const [isOpen, setIsOpen] = useState(false);

  const togglePopupMsg = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const assign = () => {
    const rentReqRef = firebase.database().ref("rentRequest").child(request.id);
    rentReqRef.update({
      isAccepted: true,
      assignedTourGuide: currentUser.email,
      status: "Accepted",
    });
    setIsVerificationOpen(!isVerificationOpen);
  };

  const unassign = () => {
    const rentReqRef = firebase.database().ref("rentRequest").child(request.id);
    rentReqRef.update({
      isAccepted: false,
      assignedTourGuide: "",
      status: "Open",
    });
    setIsUnassignOpen(!isUnassignOpen);
  };

  const startTour = () => {
    for (let i in tourList) {
      if (tourList[i].id === request.selectedTourID) {
        setTour(tourList[i]);
        setIsOpen(!isOpen);
      }
    }
  };

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

  const acceptAssigment = () => {
    if (request.status === "Open")
      return (
        <button
          className="btn btn-warning btn-lg rounded-0 w-100"
          type="submit"
          onClick={toggleVerificationPopupMsg}
        >
          {`ACCEPT ASSIGNMENT  `}
          <i class="fas fa-vote-yea"></i>
        </button>
      );
    //if status is ready then tourguide shound be able to unassign
    else if (request.status !== "Ready") {
      return (
        <button
          className="btn btn-danger btn-lg rounded-0 w-100"
          type="submit"
          onClick={toggleUnassignPopupMsg}
        >
          {`UN-ASSIGN  `}
          <i class="far fa-calendar-times"></i>
        </button>
      );
    } else {
      return (
        <button
          className="btn btn-danger btn-lg rounded-0 w-100"
          type="submit"
          disabled
        >
          {`UN-ASSIGN  `}
          <i class="far fa-calendar-times"></i>
        </button>
      );
    }
  };

  const viewUsersRequests = () => {
    if (
      currentUser.email === request.assignedTourGuide ||
      request.status === "Open"
    ) {
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
              <center>{acceptAssigment()}</center>
              <br />
              <center>{goToNavigation()}</center>
            </Card.Footer>
          </Card>
          <br />

          {isUnassignOpen && (
            <PopupMsg
              content={
                <>
                  <center>
                    <h3> Do you want to drop this assignment? </h3>
                  </center>
                  <div></div>
                  <br />
                  <center>
                    {" "}
                    <button
                      className="btn btn-warning btn-lg"
                      type="submit"
                      onClick={toggleUnassignPopupMsg}
                    >
                      {" "}
                      No{" "}
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                      className="btn btn-success btn-lg"
                      onClick={unassign}
                    >
                      <i class="fas fa-check"></i>
                    </button>
                  </center>
                </>
              }
            />
          )}

          {isOpen && (
            <PopupMap
              content={
                <>
                  <center>
                    <h3> Tours Points Of Interest </h3>
                  </center>
                  <div>
                    <Map.LeafletMapTourOn
                      tour={tour}
                      startLatlng={[request.startGeoLat, request.startGeoLong]}
                      finishLatlng={[
                        request.finishGeoLat,
                        request.finishGeoLong,
                      ]}
                    />
                  </div>
                  <br />
                  <center>
                    {" "}
                    <button
                      className="btn btn-success btn-lg"
                      type="submit"
                      onClick={togglePopupMsg}
                    >
                      {" "}
                      Done{" "}
                    </button>
                  </center>
                </>
              }
            />
          )}

          {isVerificationOpen && (
            <PopupMsg
              content={
                <>
                  <center>
                    <h3> Do you want to accept this assignment? </h3>
                  </center>
                  <div></div>
                  <br />
                  <center>
                    {" "}
                    <button
                      className="btn btn-warning btn-lg"
                      type="submit"
                      onClick={toggleVerificationPopupMsg}
                    >
                      {" "}
                      No{" "}
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button className="btn btn-success btn-lg" onClick={assign}>
                      <i class="fas fa-check"></i>
                    </button>
                  </center>
                </>
              }
            />
          )}
        </div>
      );
    }
  };

  return <>{viewUsersRequests()}</>;
}

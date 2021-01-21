import React, { useState, useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import firebase from "../../firebase";
import { useAuth } from "../../contexts/AuthContext";
import Map from "./LeafletMapTourOn";
import PopupMap from "./PopupMap";

export default function RentRequestList({ request }) {
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

  const [isOpen, setIsOpen] = useState(false);

  const togglePopupMsg = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);

    if (isOpen){
      window.ga("send", {
        hitType: "event",
        eventCategory: "ViewRequests",
        eventAction: "touch",
        eventLabel: Date().toLocaleString() + " - Close Tour Navigator",
      });
    }

  };


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
    for (let i in tourList) {
      if (tourList[i].id === request.selectedTourID) {
        setTour(tourList[i]);
        setIsOpen(!isOpen);
      }
    }

    window.ga("send", {
      hitType: "event",
      eventCategory: "ViewRequests",
      eventAction: "touch",
      eventLabel: Date().toLocaleString() + " - Start Tour Navigator",
    });
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
              <center>{goToNavigation()}</center>
            </Card.Footer>
          </Card>
          <br />
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
                  finishLatlng={[request.finishGeoLat, request.finishGeoLong]}
                  
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
        </div>
        
      );
    }

  };

  return <>{viewUsersRequests()}</>;
}

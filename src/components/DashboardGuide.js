import React, { useState, useEffect } from "react";
import { CardDeck, Card, Carousel, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import NavigationBarGuide from "./NavigationBarGuide";
import firebase from "../firebase";
import PopupMsg from "./control/PopupMsg";
import PopupMap from "./control/PopupMap";
import { useAuth } from "../contexts/AuthContext";

import Map from "./control/LeafletMap";
import "leaflet/dist/leaflet.css";
import PopupCards from "./control/PopupForCards";

export default function DashboardGuide() {
  const history = useHistory();
  const { currentUser, updatePassword, updateEmail } = useAuth();

  const [reqList, setReqList] = useState();
  useEffect(() => {
    const rentRequest = firebase.database().ref("rentRequest");
    rentRequest.on("value", (snapshot) => {
      const reqs = snapshot.val();
      const reqList = [];
      for (let id in reqs) {
        reqList.push({ id, ...reqs[id] });
      }
      setReqList(reqList);
    });
  }, []);

  return (
    <>
      <NavigationBarGuide />

      <Card className="cardAsItems" border="secondary">
        <Card.Header>
          <b>Browse Tours and Points of Interest</b>
        </Card.Header>
        <Card.Body>
          {/*<Card.Title>Browse all available tours</Card.Title>*/}
          <Card.Text>View Tours and Points of Interest</Card.Text>
          <button
            className="btn btn-primary btn-lg w-100"
            onClick={() => {
              history.push("/ToursForGuide");

              window.ga("send", {
                hitType: "event",
                eventCategory: "Tours&PoIs (G)",
                eventAction: "touch",
                eventLabel: Date().toLocaleString() + " - Open Tours&PoIs (G)",
              });
            }}
          >
            GO
          </button>
        </Card.Body>
      </Card>

      <Card className="cardAsItems" border="secondary">
        <Card.Header>
          <b>View Requests</b>
        </Card.Header>
        <Card.Body>
          {/*<Card.Title>Browse all available tours</Card.Title>*/}
          <Card.Text>
            View unassigned and assigned to you requests and their progress.
          </Card.Text>
          <button
            className="btn btn-primary btn-lg w-100"
            onClick={() => {
              history.push("/ViewRequestsGuide");

              window.ga("send", {
                hitType: "event",
                eventCategory: "ViewRequests (G)",
                eventAction: "touch",
                eventLabel:
                  Date().toLocaleString() + " - Open View Requests (G)",
              });
            }}
          >
            GO
          </button>
        </Card.Body>
      </Card>
    </>
  );
}

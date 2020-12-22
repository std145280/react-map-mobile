import React, { useState, useEffect } from "react";
import { CardDeck, Card, Carousel, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import NavigationBar from "./NavigationBar";
import firebase from "../firebase";
import PopupMsg from "./control/PopupMsg";
import PopupMap from "./control/PopupMap";
import { useAuth } from "../contexts/AuthContext"

import Map from "./control/LeafletMap";
import "leaflet/dist/leaflet.css";
import PopupCards from "./control/PopupForCards";

export default function Dashboard() {
  const history = useHistory();
  const { currentUser, updatePassword, updateEmail } = useAuth()

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
      <NavigationBar />

      <Card className="startCards" border="secondary">
        <Card.Header>
          <b>Browse all available tours</b>
        </Card.Header>
        <Card.Body>
          {/*<Card.Title>Browse all available tours</Card.Title>*/}
          <Card.Text>We offer tour packets....</Card.Text>
          <Button onClick={() => history.push("/Tours")}>GO</Button>
        </Card.Body>
      </Card>


      <Card className="startCards" border="secondary">
        <Card.Header>
          <b>Book your tour</b>
        </Card.Header>
        <Card.Body>
          {/*<Card.Title>Browse all available tours</Card.Title>*/}
          <Card.Text>Book your tour now....</Card.Text>
          <Button onClick={() => history.push("/TourRequest")}>GO</Button>
        </Card.Body>
      </Card>

      <Card className="startCards" border="secondary">
        <Card.Header>
          <b>View Your Requests</b>
        </Card.Header>
        <Card.Body>
          {/*<Card.Title>Browse all available tours</Card.Title>*/}
          <Card.Text>View the progress of your tour requests.</Card.Text>
          <Button onClick={() => history.push("/ViewRequests")}>GO</Button>
        </Card.Body>
      </Card>

    </>
  );
}

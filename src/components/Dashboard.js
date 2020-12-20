import React, { useState, useEffect } from "react";
import { CardDeck, Card, Carousel, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import NavigationBar from "./NavigationBar";
import firebase from "../firebase";
import PopupMsg from "./control/PopupMsg";
import PopupMap from "./control/PopupMap";

import Map from "./control/LeafletMap";
import "leaflet/dist/leaflet.css";
import PopupCards from "./control/PopupForCards";

export default function Dashboard() {
  const history = useHistory();

  return (
    <>
      <NavigationBar />

      <Card
        className="startCards"
        border="secondary"

      >
        <Card.Header><b>Browse all available tours</b></Card.Header>
        <Card.Body>
          {/*<Card.Title>Browse all available tours</Card.Title>*/}
          <Card.Text>We offer tour packets....</Card.Text>
          <Button onClick={() => history.push("/Tours")}>GO</Button>
        </Card.Body>
      </Card>
      <Card
        className="startCards"
        border="secondary"

      >
        <Card.Header><b>Book your tour</b></Card.Header>
        <Card.Body>
          {/*<Card.Title>Browse all available tours</Card.Title>*/}
          <Card.Text>Book your tour now....</Card.Text>
          <Button onClick={() => history.push("/TourRequest")}>GO</Button>
        </Card.Body>
      </Card>
    </>
  );
}

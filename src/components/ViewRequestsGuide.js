import React, { useState, useEffect } from "react";
import { CardDeck, Card, Carousel, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import NavigationBar from "./NavigationBar";
import firebase from "../firebase";
import PopupMsg from "./control/PopupMsg";
import PopupMap from "./control/PopupMap";
import { useAuth } from "../contexts/AuthContext";
import RentRequestListGuide from "./control/RentRequestListGuide";
import Map from "./control/LeafletMap";
import "leaflet/dist/leaflet.css";
import PopupCards from "./control/PopupForCards";

export default function ViewRequestsGuide() {
  const history = useHistory();
  const [rentRequestList, setRentRequestList] = useState();

  useEffect(() => {
    const rentReqRef = firebase.database().ref("rentRequest");
    rentReqRef.on("value", (snapshot) => {
      const request = snapshot.val();
      const rentRequestList = [];
      for (let id in request) {
        rentRequestList.push({ id, ...request[id] });
      }
      setRentRequestList(rentRequestList);
    });
  }, []);

return (
  <>
    <NavigationBar />
    <div>
      <br />
      <b>Rent Requests</b>
      <br /><br />
        <Card className="cardAsItems" border="secondary">
                <button
                  className="btn btn-secondary btn-lg rounded-0"
                  type="submit"
                  onClick={() => history.push("/")}
                >
                  <i className="fas fa-chevron-left">{`   BACK`}</i>
                </button>
              </Card>

      <CardDeck>
        {rentRequestList
          ? rentRequestList.map((request, index) => (
              <RentRequestListGuide request={request} key={index} />
            ))
          : ""}
      </CardDeck>
    </div>
  </>
);
}

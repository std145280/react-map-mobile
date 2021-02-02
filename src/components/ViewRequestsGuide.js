import React, { useState, useEffect } from "react";
import { CardDeck, Card, Carousel, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import NavigationBarGuide from "./NavigationBarGuide";
import firebase from "../firebase";
import PopupMsg from "./control/PopupMsg";
import PopupMap from "./control/PopupMap";
import { useAuth } from "../contexts/AuthContext";
import RentRequestListGuide from "./control/RentRequestListGuide";
import Map from "./control/LeafletMap";
import "leaflet/dist/leaflet.css";
import PopupCards from "./control/PopupForCards";

var stringStartTime;
var tsStart;

export default function ViewRequestsGuide() {
  //starts with 1 because there is the event of entering this page
  const [clickCounter, setClickCounter] = useState(1);
  const history = useHistory();
  const [rentRequestList, setRentRequestList] = useState();

  useEffect(() => {
    setClickCounter(clickCounter => clickCounter + 1);
  }, []);
  

  //initialization
  useEffect(() => {
    stringStartTime = Date().toLocaleString();
    tsStart = Math. round((new Date()). getTime() / 1000);
  }, []);

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
    <NavigationBarGuide />
    <div>
      <br />
      <b>Rent Requests</b>
      <br /><br />
        <Card className="cardAsItems" border="secondary">
                <button
                  className="btn btn-secondary btn-lg rounded-0"
                  type="submit"
                  onClick={() => {history.push("/DashboardGuide")
                
                  window.ga("send", {
                    hitType: "event",
                    eventCategory: "ViewRequests (G)",
                    eventAction: "touch",
                    eventLabel: Date().toLocaleString() + " - Back to Dashboard (G)",
                  });

                  setClickCounter(clickCounter => clickCounter + 1);

                  var tsFinish = Math. round((new Date()). getTime() / 1000);
                  //using UNIX timestamp for calculating the total time in seconds
                  var totalSeconds = tsFinish - tsStart;

                  window.ga("send", {
                    hitType: "event",
                    eventCategory: "View/Accept Assigment@ " + stringStartTime + " - a: " + clickCounter + " ,s:" + totalSeconds,
                    eventAction: "touch",
                    eventLabel: Date().toLocaleString() + " - Total clicks: " + clickCounter,
                  });

                }}
                >
                  <i className="fas fa-chevron-left">{`   BACK`}</i>
                </button>
              </Card>

      <CardDeck>
        {rentRequestList
          ? rentRequestList.map((request, index) => (
              <RentRequestListGuide request={request} key={index} clickCounter={clickCounter} setClickCounter={setClickCounter} />
            ))
          : ""}
      </CardDeck>
    </div>
  </>
);
}

import React, { useState, useEffect } from "react";
import { Card, CardDeck } from "react-bootstrap";
import NavigationBarGuide from "./NavigationBarGuide";
import TourViewListGuide from "./control/TourViewListGuide";
import firebase from "../firebase";
import { Link, useHistory } from "react-router-dom";

var stringStartTime;

export default function ToursForGuide() {
  //starts with 1 because there is the event of entering this page
  const [clickCounter, setClickCounter] = useState(1);

  //initialization
  useEffect(() => {
    stringStartTime = Date().toLocaleString();
  }, []);

  const [tourList, setTourList] = useState();
  const history = useHistory();
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

  return (
    <>
      <NavigationBarGuide />
      <div>
        <br />
        <b>Tours {`>`} All Tours </b>
        <br />
        <br />
        <Card className="cardAsItems" border="secondary">
          <button
            className="btn btn-secondary btn-lg rounded-0"
            type="submit"
            onClick={() => {
              history.push("/DashboardGuide");
              //we dont use clickCounter++ because we already counted this click at the closing of the popup
              //setClickCounter(clickCounter => clickCounter + 1);
              window.ga("send", {
                hitType: "event",
                eventCategory: "Tours&PoIs (G)",
                eventAction: "touch",
                eventLabel: Date().toLocaleString() + " - Back to Dashboard",
              });

              window.ga("send", {
                hitType: "event",
                eventCategory: "Tours&PoIs (G) @ " + stringStartTime,
                eventAction: "click",
                eventLabel:
                  Date().toLocaleString() + " - Total clicks: " + clickCounter,
              });
            }}
          >
            <i className="fas fa-chevron-left">{`   BACK`}</i>
          </button>
        </Card>
        <CardDeck>
          {tourList
            ? tourList.map((tour, index) => (
                <TourViewListGuide tour={tour} key={index} />
              ))
            : ""}
        </CardDeck>
      </div>
    </>
  );
}

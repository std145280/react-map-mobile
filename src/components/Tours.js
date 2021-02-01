import React, { useState, useEffect } from "react";
import { Card, CardDeck } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import TourViewList from "./control/TourViewList";
import firebase from "../firebase";
import { Link, useHistory } from "react-router-dom";

var stringStartTime;
var tsStart;

export default function Tours() {

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
      <NavigationBar />
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
              history.push("/");
              //we dont use clickCounter++ because we already counted this click at the closing of the popup
              //setClickCounter(clickCounter => clickCounter + 1);
              window.ga("send", {
                hitType: "event",
                eventCategory: "Tours&PoIs",
                eventAction: "touch",
                eventLabel: Date().toLocaleString() + " - Back to Dashboard",
              });

              var tsFinish = Math. round((new Date()). getTime() / 1000);
              //using UNIX timestamp for calculating the total time in seconds
              var totalSeconds = tsFinish - tsStart;

              window.ga("send", {
                hitType: "event",
                eventCategory: "Tours&PoIs @ " + stringStartTime  + " - a: " + clickCounter + " ,s:" + totalSeconds,
                eventAction: "touch",
                eventLabel: Date().toLocaleString() + " - Total clicks: " + clickCounter,
              });

            }}
          >
            <i className="fas fa-chevron-left">{`   BACK`}</i>
          </button>
        </Card>
        <CardDeck>
          {tourList
            ? tourList.map((tour, index) => (
                <TourViewList tour={tour} key={index} setClickCounter={setClickCounter} clickCounter={clickCounter} />
              ))
            : ""}
        </CardDeck>
      </div>
    </>
  );
}

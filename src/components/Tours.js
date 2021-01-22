import React, { useState, useEffect } from "react";
import { Card, CardDeck } from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import TourViewList from "./control/TourViewList";
import firebase from "../firebase";
import { Link, useHistory } from "react-router-dom";

export default function Tours() {
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

              window.ga("send", {
                hitType: "event",
                eventCategory: "Tours&PoIs",
                eventAction: "touch",
                eventLabel: Date().toLocaleString() + " - Back to Dashboard",
              });
            }}
          >
            <i className="fas fa-chevron-left">{`   BACK`}</i>
          </button>
        </Card>
        <CardDeck>
          {tourList
            ? tourList.map((tour, index) => (
                <TourViewList tour={tour} key={index} />
              ))
            : ""}
        </CardDeck>
      </div>
    </>
  );
}

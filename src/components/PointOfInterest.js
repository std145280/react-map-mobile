import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import firebase from "../firebase";
import PointOfInterestList from "./control/PointOfInterestList";
import { CardDeck } from "react-bootstrap";

export default function PointOfInterest() {
  const [pointOfInterestList, setPointOfInterestList] = useState();

  useEffect(() => {
    const pointOfInterestRef = firebase.database().ref("poi");
    pointOfInterestRef.on("value", (snapshot) => {
      const pointOfInterest = snapshot.val();
      const pointOfInterestList = [];
      for (let id in pointOfInterest) {
        pointOfInterestList.push({ id, ...pointOfInterest[id] });
      }
      setPointOfInterestList(pointOfInterestList);
    });
  }, []);

  return (
    <>
      <NavigationBar />
      <div>
        <br />
        <b>Points Of Interest {`>`} All Points Of Interest </b>
        <CardDeck>
          {pointOfInterestList
            ? pointOfInterestList.map((poi, index) => (
                <PointOfInterestList poi={poi} key={index} />
              ))
            : ""}
        </CardDeck>
      </div>
    </>
  );
}

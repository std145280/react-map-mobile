import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import firebase from "../firebase";
import TourGuideList from "./control/TourGuideList";
import { CardDeck } from "react-bootstrap";

export default function TourGuides() {
  const [tourGuideList, setTourGuideList] = useState();

  useEffect(() => {
    const tourGuideRef = firebase.database().ref("tourGuide");
    tourGuideRef.on("value", (snapshot) => {
      const tourGuide = snapshot.val();
      const tourGuideList = [];
      for (let id in tourGuide) {
        tourGuideList.push({ id, ...tourGuide[id] });
      }
      setTourGuideList(tourGuideList);
    });
  }, []);

  return (
    <>
      <NavigationBar />
      <div>
        <br />
        <b>Tour Guides {`>`} All Tour Guides </b>

        <CardDeck>
          {tourGuideList
            ? tourGuideList.map((tourGuide, index) => (
                <TourGuideList tourGuide={tourGuide} key={index} />
              ))
            : ""}
        </CardDeck>
      </div>
    </>
  );
}

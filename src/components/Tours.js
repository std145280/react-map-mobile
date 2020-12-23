import React, { useState, useEffect } from "react";
import { CardDeck} from "react-bootstrap";
import NavigationBar from "./NavigationBar";
import TourViewList from "./control/TourViewList";
import firebase from "../firebase";


export default function Tours() {
  const [tourList, setTourList] = useState();

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
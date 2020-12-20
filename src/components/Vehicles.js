import React, { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import firebase from "../firebase";
import VehicleList from "./control/VehicleList";
import { CardDeck } from "react-bootstrap";

export default function Vehicles() {
  const [vehicleList, setVehicleList] = useState();

  useEffect(() => {
    const vehicleRef = firebase.database().ref("vehicle");
    vehicleRef.on("value", (snapshot) => {
      const vehicle = snapshot.val();
      const vehicleList = [];
      for (let id in vehicle) {
        vehicleList.push({ id, ...vehicle[id] });
      }
      setVehicleList(vehicleList);
    });
  }, []);

  return (
    <>
      <NavigationBar />
      <div>
        <br />
        <b>Vehicles {`>`} All Vehicles </b>

        <CardDeck>
          {vehicleList
            ? vehicleList.map((vehicle, index) => (
                <VehicleList vehicle={vehicle} key={index} />
              ))
            : ""}
        </CardDeck>
      </div>
    </>
  );
}

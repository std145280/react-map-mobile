import React, { useState, useEffect } from "react";
import { CardDeck, Card, Carousel, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { v4 as uuid } from "uuid";
import NavigationBar from "./NavigationBar";
import firebase from "../firebase";
import PopupMsg from "./control/PopupMsg";
import PopupMap from "./control/PopupMap";
import { useAuth } from "../contexts/AuthContext";

import Map from "./control/LeafletMap";
import "leaflet/dist/leaflet.css";
import PopupCards from "./control/PopupForCards";

export default function ViewRents() {
  const { currentUser, updatePassword, updateEmail } = useAuth();
  const [reqList, setReqList] = useState();

  useEffect(() => {
    const rentRequest = firebase.database().ref("rentRequest");
    rentRequest.on("value", (snapshot) => {
      const reqs = snapshot.val();
      const reqList = [];
      for (let id in reqs) {
        reqList.push({ id, ...reqs[id] });
      }
      setReqList(reqList);
    });
  }, []);

  const DisplayRentRequest = (reqList) => {
    for (let i in reqList) {
      if ((currentUser.email === reqList[i].user))
        return <h4>{currentUser.email}</h4>;
    }
  };

  return <div>{DisplayRentRequest(reqList)}</div>;
}

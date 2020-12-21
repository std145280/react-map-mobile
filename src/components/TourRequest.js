import React, { useState, useEffect } from "react";
import { CardDeck, Card, Carousel, Button } from "react-bootstrap";
import { v4 as uuid } from "uuid";
import NavigationBar from "./NavigationBar";
import firebase from "../firebase";
import PopupMsg from "./control/PopupMsg";
import PopupMap from "./control/PopupMap";

import Map from "./control/LeafletMap";
import "leaflet/dist/leaflet.css";
import PopupCards from "./control/PopupForCards";
import { Link, useHistory } from "react-router-dom";

export default function TourRequest() {
  useEffect(() => {
    const rentRef = firebase.database().ref("tour");
    rentRef.on("value", (snapshot) => {
      const tour = snapshot.val();
      const tourList = [];
      for (let id in tour) {
        tourList.push({ id, ...tour[id] });
      }
      settourList(tourList);
      console.log(tourList);
    });
  }, []);

  const history = useHistory();

  const [startLatlng, setStartLatlng] = useState({ latitude: 0, longitude: 0 });
  const setStartLocationLatlng = (newLatlng) => {
    setStartLatlng(newLatlng);
  };

  const [finishLatlng, setFinishLatlng] = useState({
    latitude: 0,
    longitude: 0,
  });
  const setFinishLocationLatlng = (newLatlng) => {
    setFinishLatlng(newLatlng);
  };

  const [radius, setRadius] = useState("");
  const handleOnChangeRadius = (e) => {
    setRadius(e.target.value);
  };

  const [startLocation, setStartLocation] = useState(
    "Click the 'Map' button to add the general area of the tour."
  );
  const setStartLocationName = (newName) => {
    setStartLocation(newName);
  };

  const [finishLocation, setFinishLocation] = useState(
    "Click the 'Map' button to add the general area of the tour."
  );
  const setFinishLocationName = (newName) => {
    setFinishLocation(newName);
  };

  const [isFinishMapOpen, setIsFinishMapOpen] = useState(false);
  const toggleMapPopupFINISH = (e) => {
    e.preventDefault();
    setIsFinishMapOpen(!isFinishMapOpen);
  };

  const [isStartMapOpen, setIsStartMapOpen] = useState(false);
  const toggleMapPopupSTART = (e) => {
    e.preventDefault();
    setIsStartMapOpen(!isStartMapOpen);
  };

  const [isPointSelectorOpen, setIsPointSelectorOpen] = useState(false);
  const togglePointSelectorPopup = (e) => {
    e.preventDefault();
    setIsPointSelectorOpen(!isPointSelectorOpen);
  };

  const [isOpen, setIsOpen] = useState(false);
  const togglePopupMsg = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const [isPoiPopupOpen, setIsPoiPopupOpen] = useState(false);
  const togglePoiPopup = (e) => {
    e.preventDefault();
    setIsPoiPopupOpen(!isPoiPopupOpen);
  };

  const [tourTime, setTourTime] = useState("");
  const handleAvailableTourTime = (e) => {
    setTourTime(e.target.value);
  };

  const addToPoi = (el) => {
    let addIt = true;
    for (let i = 0; i < poi.length; i++) {
      if (poi[i].id === el.id) addIt = false;
    }
    if (addIt) setPoi([...poi, el]);
  };

  const [tourList, settourList] = useState();
  const [poi, setPoi] = useState([]);

  const removeFromPoi = (el) => {
    let hardCopy = [...poi];
    hardCopy = hardCopy.filter((poiItem) => poiItem.id !== el.id);
    setPoi(hardCopy);
  };

  const poiItems = poi.map((poi) => (
    <div key={poi.id}>
      {`${poi.name}: $${poi.geoLat}`}
      <input type="submit" value="remove" onClick={() => removeFromPoi(poi)} />
    </div>
  ));

  const [imageUrl, setImageUrl] = useState([]);
  const readImages = async (e) => {
    const file = e.target.files[0];
    const id = uuid();
    const storageRef = firebase.storage().ref("image").child(id);
    const imageRef = firebase.database().ref("image").child("temp").child(id);
    await storageRef.put(file);
    storageRef.getDownloadURL().then((url) => {
      imageRef.set(url);
      const newState = [...imageUrl, { id, url }];
      setImageUrl(newState);
    });
  };

  const tempRentRequest = () => {
    var tempRentRef = firebase.database().ref("tempRentRequest");

    var rentRequest = {
      availableTime: parseInt(tourTime),
      startGeoLat: startLatlng.lat,
      startGeoLong: startLatlng.lng,
      finishGeoLat: finishLatlng.lat,
      finishGeoLong: finishLatlng.lng,
    };
    tempRentRef.push(rentRequest);
  };

  const diplayAddOrDeleteButton = (el) => {
    let showAddButton = true;
    for (let i = 0; i < poi.length; i++) {
      if (poi[i].id === el.id) showAddButton = false;
    }
    if (showAddButton) {
      return (
        <input
          className="btn btn-primary"
          type="submit"
          value="Add to tour"
          onClick={() => addToPoi(el)}
        />
      );
    } else {
      return (
        <input
          className="btn btn-warning"
          type="submit"
          value="remove from tour"
          onClick={() => removeFromPoi(el)}
        />
      );
    }
  };

  ////////Calculates distance between two points///////////
  ////////////and return distance in meters////////////////
  const getDistance = (origin, destination) => {
    var lon1 = toRadian(origin[1]),
      lat1 = toRadian(origin[0]),
      lon2 = toRadian(destination[1]),
      lat2 = toRadian(destination[0]);
    var deltaLat = lat2 - lat1;
    var deltaLon = lon2 - lon1;

    var a =
      Math.pow(Math.sin(deltaLat / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(deltaLon / 2), 2);
    var c = 2 * Math.asin(Math.sqrt(a));
    var EARTH_RADIUS = 6371;
    return c * EARTH_RADIUS * 1000;
  };

  const toRadian = (degree) => {
    return (degree * Math.PI) / 180;
  };
  /////////////////////////////////////////////////////////////


  var item = 0;
  
  const startFinishTime = () => {

   
    return (
      <form>
        <div className="form-group">
          <center>
            <br />
            <Card className="cardAsItems" border="secondary">
              <button
                className="btn btn-secondary btn-lg rounded-0"
                type="submit"
                onClick={() => history.push("/")}
              >
                <i className="fas fa-chevron-left">{`   BACK`}</i>
              </button>
            </Card>

            <Card className="cardAsItems" border="secondary">
              <Card.Header>
                <b></b>
              </Card.Header>

              <button
                className="btn btn-primary btn-lg rounded-0"
                type="submit"
                onClick={toggleMapPopupSTART}
              >
                <i className="fas fa-map-marked-alt">{`  START`}</i>
              </button>
              <Card.Footer>
                <div className="form-group">
                  <textarea
                    type="text"
                    className="form-control"
                    value={startLocation}
                    placeholder="Click the 'START' button to select where you want to start your tour."
                    rows="3"
                  />{" "}
                </div>
              </Card.Footer>
            </Card>

            <Card className="cardAsItems" border="secondary">
              <Card.Header>
                <b></b>
              </Card.Header>

              <button
                className="btn btn-primary btn-lg rounded-0"
                type="submit"
                onClick={toggleMapPopupFINISH}
              >
                <i className="fas fa-map-marked-alt">{`  FINISH`}</i>
              </button>
              <Card.Footer>
                {" "}
                <div className="form-group">
                  <textarea
                    type="text"
                    className="form-control"
                    value={finishLocation}
                    placeholder="Click the 'FINISH' button to select where you want to finish your tour."
                    rows="3"
                  />{" "}
                </div>
              </Card.Footer>
            </Card>

            <Card className="cardAsItems" border="secondary">
              <Card.Header>
                <br />
                <h4>
                  Time available for your tour <i class="far fa-clock"></i>
                </h4>
              </Card.Header>
              <Card.Body>
                <div className="form-group">
                  <input
                    type="number"
                    className="form-control"
                    onChange={handleAvailableTourTime}
                    value={tourTime}
                    placeholder="Available time for your tour.*"
                  />
                  <small class="form-text text-primary">
                    *Please insert the available time in minutes.
                  </small>
                </div>
              </Card.Body>

              <Card.Footer></Card.Footer>
            </Card>

            <Card className="cardAsItems" border="secondary">
              <button
                className="btn btn-success btn-lg rounded-0"
                type="submit"
                onClick={tempRentRequest}
              >
                {`NEXT   `}
                <i className="fas fa-chevron-right"></i>
              </button>
            </Card>
          </center>
        </div>

        {isStartMapOpen && (
          <PopupMap
            content={
              <>
                <h3> Insert Place </h3>
                <div>
                  <Map.LeafletMap
                    setLocationLatlng={setStartLocationLatlng}
                    setLocationName={setStartLocationName}
                  />
                </div>
                <br />
                <center>
                  {" "}
                  <button
                    className="btn btn-success btn-lg"
                    type="submit"
                    onClick={toggleMapPopupSTART}
                  >
                    {" "}
                    Done{" "}
                  </button>
                </center>
              </>
            }
          />
        )}

        {isFinishMapOpen && (
          <PopupMap
            content={
              <>
                <h3> Insert Place </h3>
                <div>
                  <Map.LeafletMap
                    setLocationLatlng={setFinishLocationLatlng}
                    setLocationName={setFinishLocationName}
                  />
                </div>
                <br />
                <center>
                  {" "}
                  <button
                    className="btn btn-success btn-lg"
                    type="submit"
                    onClick={toggleMapPopupFINISH}
                  >
                    {" "}
                    Done{" "}
                  </button>
                </center>
              </>
            }
          />
        )}
      </form>
    );

    

  };

  return (
    <>
      <NavigationBar />
      {startFinishTime()}
    </>
  );
}

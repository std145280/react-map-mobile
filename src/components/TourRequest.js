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

import PointSelectorMap from "./control/PointSelectorMap";

import L from "leaflet";
import "leaflet-routing-machine";
import "lrm-google";
import { withLeaflet } from "react-leaflet";
import VehicleList from "./control/VehicleList";
import TourList from "./control/TourList";

export default function TourRequest(uuid) {
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

  const history = useHistory();

  const [hasStart, setHasStart] = useState(false);
  const [hasFinish, setHasFinish] = useState(false);
  const [hasTime, setHasTime] = useState(false);
  const [next1, setNext1] = useState(false);

  const [startLatlng, setStartLatlng] = useState();
  const setStartLocationLatlng = (newLatlng) => {
    setStartLatlng(newLatlng);
    setHasStart(true);
  };

  const [finishLatlng, setFinishLatlng] = useState();
  const setFinishLocationLatlng = (newLatlng) => {
    setFinishLatlng(newLatlng);
    setHasFinish(true);
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
    setHasTime(true);
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

  const enableNext1Button = () => {
    if (hasStart && hasFinish && hasTime)
      return (
        <button
          className="btn btn-success btn-lg rounded-0"
          type="submit"
          onClick={tempRentRequest}
        >
          {`NEXT   `}
          <i className="fas fa-chevron-right"></i>
        </button>
      );
    else {
      return (
        <button
          className="btn btn-success btn-lg rounded-0"
          type="submit"
          disabled
        >
          {`NEXT   `}
          <i className="fas fa-chevron-right"></i>
        </button>
      );
    }
  };

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
    setNext1(true);
  };

  var carTitle;
  var tourTitle;
  var carCost;

  const createRentRequest = () => {
    var rentReqRef = firebase.database().ref("rentRequest");

    var rentRequest = {
      availableTime: (parseInt(tourTime)),
      startGeoLat: startLatlng.lat,
      startGeoLong: startLatlng.lng,
      finishGeoLat: finishLatlng.lat,
      finishGeoLong: finishLatlng.lng,

      startLocationName: startLocation,
      finishLocationName: finishLocation,

      selectedCarID: selectedCarID,
      selectedTourID: selectedTourID,
      selectedCarTitle: carTitle,
      selectedTourTitle: tourTitle,

      isAccepted: false,
    };
    rentReqRef.push(rentRequest);
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

  var routeControl = L.Routing.control({
    waypoints: [
      L.latLng(37.99869678317832, 23.656674973851633),
      L.latLng(37.975128641985066, 23.826645460073326),
    ],
  });


  const [isFinishOpen, setIsFinishOpen] = useState(false);
  const togglePopupFinishMsg = (e) => {
    e.preventDefault();
    setIsFinishOpen(!isFinishOpen);
  };



  const testerFunction = () => {
    setStartLatlng([37.99869678317832, 23.656674973851633]);
    setFinishLatlng([37.975128641985066, 23.826645460073326]);
    setTourTime(300);
    setStartLocation("ATHENS START");
    setFinishLocation("ATHENS FINISH");
    setHasFinish(true);
    setHasStart(true);
    setHasTime(true);
    setNext1(true);
  };

  const backToFirstSelector = (e) => {
    e.preventDefault();
    setNext1(false);
  };

  const backToSecondSelector = (e) => {
    e.preventDefault();
    setNext2(false);
  };

  const backToThirdSelector = (e) => {
    e.preventDefault();
    setNext3(false);
  };

  const [selectedTourID, setSelectedTourID] = useState([]);
  const [selectedCarID, setSelectedCarID] = useState([]);

  const [next2, setNext2] = useState(false);
  const [next3, setNext3] = useState(false);

  const [totalTimeForTour, setTotalTimeForTour] = useState([]);

  const toggleSubmitRequest = () => {
    tempRentRequest();
  };

  var tourCost;
  var totalCost;
  const selectedItemDisplay = () => {
    for (let i = 0; i < TourList.length; i++) {
      if (tourList[i].id === selectedTourID) {
        tourTitle = tourList[i].title;
        tourCost = parseInt(tourList[i].tourCost);
      }
    }
    for (let i = 0; i < vehicleList.length; i++) {
      if (vehicleList[i].id === selectedCarID) {
        carTitle = vehicleList[i].title;
        carCost = (
          parseFloat(vehicleList[i].cph) *
          (totalTimeForTour / 60)
        ).toFixed(2);
      }
    }
    totalCost = (parseFloat(carCost) + parseFloat(tourCost)).toFixed(2);
    return (
      <>
        <div>
          <h4>
            <b>Tour: </b>
            {tourTitle}
          </h4>
        </div>
        <div>
          <h4>
            <b>Vehicle: </b>
            {carTitle}
          </h4>
        </div>
      </>
    );
  };

  const requestWizard = () => {
    if (hasStart && hasFinish && hasTime && next1 && next2 && next3) {
      return (
        <>
          <CardDeck>
            <center>
              <Card className="cardAsItems" border="secondary">
                <button
                  className="btn btn-secondary btn-lg rounded-0"
                  type="submit"
                  onClick={backToThirdSelector}
                >
                  <i className="fas fa-chevron-left">{`   BACK`}</i>
                </button>
              </Card>

              <Card className="cardAsItems" border="secondary">
                <Card.Header>
                  <h2>Tour Request Details</h2>
                </Card.Header>
                <Card.Body>
                  {selectedItemDisplay()}
                  <br />
                  <h5>
                    <b>Start Location: </b>
                    {startLocation}
                  </h5>
                  <h5>
                    <b>Finish Location: </b>
                    {finishLocation}
                  </h5>
                  <br />
                  <h4>
                    <b>Cost</b>
                  </h4>
                  <h5>
                    <b>Cost for Vehicle: {carCost}€</b>
                  </h5>
                  <h5>
                    <b>Cost for Tour: {tourCost}€</b>
                  </h5>
                  <br />
                  <h5>
                    <b>Total: {totalCost}€ </b>
                  </h5>
                </Card.Body>

                <Card.Footer>
        

                </Card.Footer>
              </Card>
              <Card className="cardAsItems" border="secondary">
                <button
                  className="btn btn-success btn-lg rounded-0"
                  type="submit"
                  onClick={togglePopupFinishMsg}
                >
                  {`SENT REQUEST    `}
                  <i class="fa fa-upload" aria-hidden="true"></i>
                </button>
              </Card>
            </center>
          </CardDeck>
          {isFinishOpen && (
                    <PopupMsg
                      content={
                        <>
                          <b>Question</b>
                          <p>Are you sure you want to sent request for this tour?</p>
                          <center>
                            <Link
                              to="/"
                              className="btn btn-success btn-lg"
                              onClick={createRentRequest}
                            >
                              Yes{" "}
                            </Link>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button
                              className="btn btn-warning btn-lg"
                              type="submit"
                              onClick={togglePopupFinishMsg}
                            >
                              {" "}
                              No{" "}
                            </button>
                          </center>
                        </>
                      }
                    />
                  )}
        </>
        
      );
    } else if (hasStart && hasFinish && hasTime && next1 && next2) {
      return (
        <>
        <br/>
          <CardDeck>
            <Card className="cardAsItems" border="secondary">
              <button
                className="btn btn-secondary btn-lg rounded-0"
                type="submit"
                onClick={backToSecondSelector}
              >
                <i className="fas fa-chevron-left">{`   BACK`}</i>
              </button>
            </Card>

            {vehicleList
              ? vehicleList.map((vehicle, index) => (
                  <VehicleList
                    vehicle={vehicle}
                    key={index}
                    setSelectedCarID={setSelectedCarID}
                    setNext3={setNext3}
                    startLatlng={startLatlng}
                  />
                ))
              : ""}
          </CardDeck>
        </>
      );
    } else if (hasStart && hasFinish && hasTime && next1) {
      return (
        <>
        <br/>
          <CardDeck>
            <Card className="cardAsItems" border="secondary">
              <button
                className="btn btn-secondary btn-lg rounded-0"
                type="submit"
                onClick={backToFirstSelector}
              >
                <i className="fas fa-chevron-left">{`   BACK`}</i>
              </button>
            </Card>
            {tourList
              ? tourList.map((tour, index) => (
                  <TourList
                    tour={tour}
                    startLatlng={startLatlng}
                    finishLatlng={finishLatlng}
                    tourTime={tourTime}
                    setSelectedTourID={setSelectedTourID}
                    setNext2={setNext2}
                    setTotalTimeForTour={setTotalTimeForTour}
                  />
                ))
              : ""}
          </CardDeck>
        </>
      );
    } else {
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
                {enableNext1Button()}
              </Card>
            </center>
          </div>

          {isStartMapOpen && (
            <PopupMap
              content={
                <>
                  <h3> Insert Place </h3>
                  <div>
                    <PointSelectorMap.PointSelectorMap
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
                    <PointSelectorMap.PointSelectorMap
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
    }
  };

  return (
    <>
      <NavigationBar />

      {requestWizard()}
    </>
  );
}

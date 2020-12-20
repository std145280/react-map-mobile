import React, { useState, useEffect } from "react";
import { CardDeck, Card, Carousel, Button } from "react-bootstrap";
import { v4 as uuid } from "uuid";
import NavigationBar from "./NavigationBar";
import firebase from "../firebase";
import PopupMsg from "./control/PopupMsg";
import PopupMap from "./control/PopupMap";
import { Link } from "react-router-dom";
import Map from "./control/LeafletMap";
import "leaflet/dist/leaflet.css";
import PopupCards from "./control/PopupForCards";

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

  const [latlng, setLatlng] = useState({ latitude: 0, longitude: 0 });
  const setLocationLatlng = (newLatlng) => {
    setLatlng(newLatlng);
  };

  const [radius, setRadius] = useState("");
  const handleOnChangeRadius = (e) => {
    setRadius(e.target.value);
  };

  const [location, setLocation] = useState(
    "Click the 'Map' button to add the general area of the tour."
  );
  const setLocationName = (newName) => {
    setLocation(newName);
  };

  const [isMapOpen, setIsMapOpen] = useState(false);
  const toggleMapPopup = (e) => {
    e.preventDefault();
    setIsMapOpen(!isMapOpen);
  };

  const [isMapFinishOpen, setIsFinishMapOpen] = useState(false);
  const toggleMapPopupSTART = (e) => {
    e.preventDefault();
    setIsMapOpen(!isMapFinishOpen);
  };

  const [isStartMapOpen, setIsStartMapOpen] = useState(false);
  const toggleMapPopupFINISH = (e) => {
    e.preventDefault();
    setIsMapOpen(!isStartMapOpen);
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

  const createRentRequest = () => {
    var rentRef = firebase.database().ref("rentRequest");

    var totalCost = 0;
    var totalTime = 0;

    var rentRequest = {
      name: "tourname",

      tourCost: parseFloat(totalCost).toFixed(2),
      time: parseInt(totalTime),
      startGeoLat: latlng.lat,
      finishGeoLong: latlng.lng,
      tour: "",
    };
    rentRef.push(rentRequest);
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

  const oneCard = (el) => {
    var distance = getDistance(
      [latlng.lat, latlng.lng],
      [el.geoLat, el.geoLng]
    );
    if (distance < radius * 1000)
      return (
        <>
          <Card className="card-PoIforTourOnPopup" style={{ flex: 1 }}>
            <Card.Body>
              <div key={el.id}>
                <Card.Title>
                  <center>
                    <h4>{`${el.name}`}</h4>
                  </center>
                </Card.Title>
                <Carousel>
                  {el.imageUrl
                    ? el.imageUrl.map(({ id, url }) => {
                        return (
                          <Carousel.Item interval={500}>
                            <div key={id}>
                              <img
                                className="d-block w-100"
                                src={url}
                                alt=""
                                width={320}
                                height={225}
                              />
                            </div>
                          </Carousel.Item>
                        );
                      })
                    : ""}
                </Carousel>
                <br />
                {`City: ${el.city}`} <br />
                {` type: ${el.type}`} <br />
                {`  decription: ${el.decription}`} <br />
                {`  location: ${el.location}`} <br />
              </div>
            </Card.Body>
            <Card.Footer>
              <center>{diplayAddOrDeleteButton(el)}</center>
            </Card.Footer>
          </Card>
        </>
      );
  };

  const displayCard = () => {
    return (
      <CardDeck>{tourList ? tourList.map((el) => oneCard(el)) : ""}</CardDeck>
    );
  };

  const enableAddPoisButton = () => {
    if (latlng.lat !== undefined)
      return (
        <button
          className="btn btn-primary btn-lg"
          type="submit"
          onClick={togglePoiPopup}
        >
          {" "}
          Add PoIs{" "}
        </button>
      );
    else {
      return (
        <button className="btn btn-primary btn-lg" disabled>
          {" "}
          Add PoIs{" "}
        </button>
      );
    }
  };

  return (
    <>
      <NavigationBar />
      <div>
        <form>
          <h2 className="text-center">New Tour Request</h2>

    

          <div className="form-group">
            <center>
              <br />
              <Card className="cardAsItems" border="secondary">
                <Card.Header>
                  <b>Select Starting Place</b>
                </Card.Header>

                <button
                  className="btn btn-primary btn-lg"
                  type="submit"
                  onClick={toggleMapPopupSTART}
                >
                  <i className="fas fa-map-marked-alt">{`  Map`}</i>
                </button>
                <Card.Footer>
                  <div className="form-group">
                    <textarea
                      type="text"
                      className="form-control"
                      value={location}
                      placeholder="Click the 'Map' button to add the general area of the tour."
                      rows="3"
                    />{" "}
                  </div>
                </Card.Footer>
              </Card>

              <Card className="cardAsItems" border="secondary">
                <Card.Header>
                  <b>Select Starting Place</b>
                </Card.Header>
                <Card.Body></Card.Body>

                <Card.Footer></Card.Footer>
              </Card>

              <Card className="cardAsItems" border="secondary">
                <Card.Header>
                  <b>Select Starting Place</b>
                </Card.Header>

                <button
                  className="btn btn-primary btn-lg"
                  type="submit"
                  onClick={toggleMapPopupFINISH}
                >
                  <i className="fas fa-map-marked-alt">{`  Map`}</i>
                </button>
                <Card.Footer>                  <div className="form-group">
                    <textarea
                      type="text"
                      className="form-control"
                      value={location}
                      placeholder="Click the 'Map' button to add the general area of the tour."
                      rows="3"
                    />{" "}
                  </div></Card.Footer>
              </Card>
            </center>
          </div>

          <div>
            <br />

            <tr>
              {" "}
              <div className="form-group">
                <button
                  className="btn btn-success btn-lg"
                  type="submit"
                  onClick={togglePopupMsg}
                >
                  {" "}
                  Submit{" "}
                </button>
                {isOpen && (
                  <PopupMsg
                    content={
                      <>
                        <b>Question</b>
                        <p>Are you sure you want to request this tour?</p>
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
                            onClick={togglePopupMsg}
                          >
                            {" "}
                            No{" "}
                          </button>
                        </center>
                      </>
                    }
                  />
                )}

                {isMapOpen && (
                  <PopupMap
                    content={
                      <>
                        <h3> Insert Place </h3>
                        <div>
                          <Map.LeafletMap
                            setLocationLatlng={setLocationLatlng}
                            setLocationName={setLocationName}
                          />
                        </div>
                        <br />
                        <center>
                          {" "}
                          <button
                            className="btn btn-success btn-lg"
                            type="submit"
                            onClick={toggleMapPopup}
                          >
                            {" "}
                            Done{" "}
                          </button>
                        </center>
                      </>
                    }
                  />
                )}
              </div>
            </tr>
          </div>
        </form>
      </div>
    </>
  );
}

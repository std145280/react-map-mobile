import React, { useState, useEffect } from "react";
import { CardDeck, Card, Carousel} from "react-bootstrap";
import { v4 as uuid } from "uuid";
import NavigationBar from "./NavigationBar";
import firebase from "../firebase";
import PopupMsg from "./control/PopupMsg";
import PopupMap from "./control/PopupMap";
import { Link } from "react-router-dom";
import Map from "./control/LeafletMap";
import "leaflet/dist/leaflet.css";
import PopupCards from "./control/PopupForCards";

export default function AddTour() {
  useEffect(() => {
    const pointOfInterestRef = firebase.database().ref("poi");
    pointOfInterestRef.on("value", (snapshot) => {
      const pointOfInterest = snapshot.val();
      const pointOfInterestList = [];
      for (let id in pointOfInterest) {
        pointOfInterestList.push({ id, ...pointOfInterest[id] });
      }
      setPointOfInterestList(pointOfInterestList);
      console.log(pointOfInterestList);
    });
  }, []);

  const [title, setTitle] = useState("");
  const handleOnChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const [descForCustomer, setDescForCustomer] = useState("");
  const handleOnChangeDescForCustomer = (e) => {
    setDescForCustomer(e.target.value);
  };

  const [descForGuide, setDescForGuide] = useState("");
  const handleOnChangeDescForGuide = (e) => {
    setDescForGuide(e.target.value);
  };

  const [tourCost, setTourCost] = useState("");
  const handleOnChangeTourCost = (e) => {
    setTourCost(e.target.value);
  };

  const [additionalTime, setAdditionalTime] = useState("");
  const handleOnChangeAdditionalTime = (e) => {
    setAdditionalTime(e.target.value);
  };

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

  const [pointOfInterestList, setPointOfInterestList] = useState();
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

  const createTour = () => {
    var tourRef = firebase.database().ref("tour");

    var totalCost = 0;
    var totalTime = 0;

    for (let i = 0; i < poi.length; i++) {
      totalCost = totalCost + parseFloat(poi[i].ticketCost);
      totalTime = totalTime + parseFloat(poi[i].time);
    }
    totalCost = totalCost + parseFloat(tourCost);
    totalTime = totalTime + parseFloat(additionalTime);
    


    var tour = {
      title,
      descForCustomer,
      descForGuide,
      tourCost : parseFloat(totalCost).toFixed(2),
      time : parseInt(totalTime),
      imageUrl,
      geoLat: latlng.lat,
      geoLong: latlng.lng,
      poi,
    };
    tourRef.push(tour);
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
      <CardDeck>
        {pointOfInterestList
          ? pointOfInterestList.map((el) => oneCard(el))
          : ""}
      </CardDeck>
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
          <h2 className="text-center">Create New Tour</h2>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              onChange={handleOnChangeTitle}
              value={title}
              placeholder="Title"
            />
          </div>
          <div className="form-group">
            <textarea
              type="text"
              className="form-control"
              onChange={handleOnChangeDescForCustomer}
              value={descForCustomer}
              placeholder="Description for customer."
              rows="3"
            />
          </div>
          <div className="form-group">
            <textarea
              type="text"
              className="form-control"
              onChange={handleOnChangeDescForGuide}
              value={descForGuide}
              placeholder="Description for guide."
              rows="3"
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              className="form-control"
              onChange={handleOnChangeTourCost}
              value={tourCost}
              placeholder="Tour Cost*"
            />
            <small class="form-text text-primary">
              *do not include cost of car, tour guide or tickets.
            </small>
          </div>
          <div className="form-group">
            <input
              type="number"
              className="form-control"
              onChange={handleOnChangeAdditionalTime}
              value={additionalTime}
              placeholder="Additional time*"
            />
            <small class="form-text text-primary">
              *do not include time that will be spend for points of interests.
            </small>
          </div>
          <div className="form-group">
            <textarea
              type="text"
              className="form-control"
              value={location}
              placeholder="Click the 'Map' button to add the general area of the tour."
              rows="3"
            />{" "}
            <center>
              <br />
              <button
                className="btn btn-primary btn-lg"
                type="submit"
                onClick={toggleMapPopup}
              >
                <i className="fas fa-map-marked-alt">{`  Map`}</i>
              </button>
            </center>
            <small class="form-text text-info">
              Tip: Zooming out helps for selecting a general location name of
              your tour.
            </small>
          </div>

          <div>
            <br />
          </div>

          <center>{enableAddPoisButton()}</center>
          <div>
            <br />
            <table>
              <tr>
                <td>
                  {" "}
                  <h6>Upload Image</h6>{" "}
                </td>
                <td>
                  <input type="file" accept="image/*" onChange={readImages} />
                  {imageUrl
                    ? imageUrl.map(({ id, url }) => {
                        return (
                          <div key={id}>
                            <img src={url} alt="" />
                          </div>
                        );
                      })
                    : ""}
                </td>
              </tr>
              <tr></tr>
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
                          <p>Are you sure you want to create this tour?</p>
                          <center>
                            <Link
                              to="/Tours"
                              className="btn btn-success btn-lg"
                              onClick={createTour}
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

                  {isPoiPopupOpen && (
                    <PopupCards
                      content={
                        <>
                          <h4>Add Points of interest to the Tour</h4>
                          <div className="form-group">
                            <input
                              type="number"
                              className="form-control"
                              onChange={handleOnChangeRadius}
                              value={radius}
                              placeholder="Radius for displaying PoIs*"
                            />
                            <small class="form-text text-primary">
                              *Ex. Write 20 for displaying PoIs in 20km radius
                              around the area you set for the tour.
                            </small>
                          </div>
                          <center>
                            <div>
                              <center>{displayCard()}</center>
                            </div>
                            <br />{" "}
                            <button
                              className="btn btn-success btn-lg"
                              type="submit"
                              onClick={togglePoiPopup}
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
            </table>
          </div>
        </form>
      </div>
    </>
  );
}

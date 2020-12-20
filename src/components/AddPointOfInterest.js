import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import NavigationBar from "./NavigationBar";
import db from "../firebase";
import PopupMsg from "./control/PopupMsg";
import PopupMap from "./control/PopupMap";
import { Link } from "react-router-dom";
import Map from "./control/LeafletMap";
import "leaflet/dist/leaflet.css";

export default function AddPOI() {
  const [latlng, setLatlng] = useState({ latitude: 0, longitude: 0 });
  const setLocationLatlng = (newLatlng) => {
    setLatlng(newLatlng);
  };

  const [location, setLocation] = useState(
    "Click 'Map' to set Point of Interest location."
  );
  const setLocationName = (newName) => {
    setLocation(newName);
  };

  const [name, setName] = useState("");
  const handleOnChangeNAME = (e) => {
    setName(e.target.value);
  };

  const [description, setDescription] = useState("");
  const handleOnChangeDESCRIPTION = (e) => {
    setDescription(e.target.value);
  };

  const [type, setType] = useState("");
  const handleOnChangeTYPE = (e) => {
    setType(e.target.value);
  };

  const [city, setCity] = useState("");
  const handleOnChangeCITY = (e) => {
    setCity(e.target.value);
  };

  const [time, setTime] = useState("");
  const handleOnChangeTime = (e) => {
    setTime(e.target.value);
  };

  const [ticketCost, setTicketCost] = useState("");
  const handleOnChangeTicketCost = (e) => {
    setTicketCost(e.target.value);
  };

  const [isMapOpen, setIsMapOpen] = useState(false);
  const toggleMapPopup = (e) => {
    e.preventDefault();
    setIsMapOpen(!isMapOpen);
  };

  const [imageUrl, setImageUrl] = useState([]);
  const readImages = async (e) => {
    const file = e.target.files[0];
    const id = uuid();
    const storageRef = db.storage().ref("images").child(id);
    const imageRef = db.database().ref("images").child("daily").child(id);
    await storageRef.put(file);
    storageRef.getDownloadURL().then((url) => {
      imageRef.set(url);
      const newState = [...imageUrl, { id, url }];
      setImageUrl(newState);
    });
  };

  const [isOpen, setIsOpen] = useState(false);
  const togglePopupMsg = (e) => {
    e.preventDefault();

    setIsOpen(!isOpen);
  };

  const createPOI = () => {
    var poiRef = db.database().ref("poi");
    var poi = {
      name,
      description,
      geoLat: latlng.lat,
      geoLng: latlng.lng,
      type,
      city,
      time,
      ticketCost,
      imageUrl,
      location: location,
    };

    poiRef.push(poi);
  };

  return (
    <>
      <NavigationBar />
      <div className="formStyle">
        <form>
          <h2 className="text-center">Import New POI</h2>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              onChange={handleOnChangeNAME}
              value={name}
              placeholder="Name"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              onChange={handleOnChangeDESCRIPTION}
              value={description}
              placeholder="Description"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              onChange={handleOnChangeTYPE}
              value={type}
              placeholder="Type"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              onChange={handleOnChangeCITY}
              value={city}
              placeholder="City"
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              className="form-control"
              onChange={handleOnChangeTicketCost}
              value={ticketCost}
              placeholder="Ticket Cost, write 0 if there is no cost."
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              className="form-control"
              onChange={handleOnChangeTime}
              value={time}
              placeholder="Time needed*"
            />{" "}
            <small class="form-text text-primary">
              *insert time in minutes e.x. write 20 for 20 minutes time.
            </small>
          </div>

          <br />

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={latlng.lat}
              placeholder="Latitude**"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              value={latlng.lng}
              placeholder="Longitude**"
            />
          </div>

          <div className="form-group">
            <textarea
              type="text"
              className="form-control"
              value={location}
              placeholder="Click the 'Map' button to add vehicle's place."
              rows="3"
            />
          </div>
          <center>
            <button
              className="btn btn-primary btn-lg"
              type="submit"
              onClick={toggleMapPopup}
            >
              <i className="fas fa-map-marked-alt">{`  Map`}</i>
            </button>
          </center>

          <small class="form-text text-primary">
            **Langitude and longitude will be inserted automaticaly when you
            choose the location from the map.
          </small>
          <br />
          <div>
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
                          <p>
                            Are you sure you want to import the Point Of
                            Interest?
                          </p>
                          <center>
                            <Link
                              to="/PointOfInterest"
                              className="btn btn-success btn-lg"
                              onClick={createPOI}
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
                      handleClose={togglePopupMsg}
                    />
                  )}
                  {isMapOpen && (
                    <PopupMap
                      content={
                        <>
                          <center>
                            <h3> Insert Point of Interest's location </h3>
                          </center>
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
                      handleClose={toggleMapPopup}
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

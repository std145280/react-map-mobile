import React, { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import NavigationBar from "./NavigationBar";
import db from "../firebase";
import PopupMsg from "./control/PopupMsg";
import PopupMap from "./control/PopupMap";
import { Link } from "react-router-dom";
import Map from "./control/LeafletMap";
import "leaflet/dist/leaflet.css";

export default function AddVehicles() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [passengers, setPassengers] = useState("");
  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState("");
  const [cph, setCPH] = useState("");
  const [wiFi, setWiFi] = useState("");
  const [imageUrl, setImageUrl] = useState([]);
  const [isOpen, setIsOpen] = useState(false);





  const [latlng, setLatlng] = useState({ latitude: 0, longitude: 0 });
  const setLocationLatlng = (newLatlng) => {
    setLatlng(newLatlng);
  };

  const [location, setLocation] = useState(
    "Click 'Map' to set vehicle's location."
  );
  const setLocationName = (newName) => {
    setLocation(newName);
  };

  const handleOnChangeTITLE = (e) => {
    setTitle(e.target.value);
  };
  const handleOnChangeTYPE = (e) => {
    setType(e.target.value);
  };
  const handleOnChangePASSENGERS = (e) => {
    setPassengers(e.target.value);
  };
  const handleOnChangeFUEL = (e) => {
    setFuel(e.target.value);
  };
  const handleOnChangeYEAR = (e) => {
    setYear(e.target.value);
  };
  const handleOnChangeCPH = (e) => {
    setCPH(e.target.value);
  };

  const handleOnChangeWIFI = (e) => {
    setWiFi(e.target.value);
  };



  const togglePopupMsg = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const readImages = async (e) => {
    const file = e.target.files[0];
    const id = uuid();
    const storageRef = db.storage().ref("image").child(id);
    const imageRef = db.database().ref("image").child("temp").child(id);
    await storageRef.put(file);
    storageRef.getDownloadURL().then((url) => {
      imageRef.set(url);
      const newState = [...imageUrl, { id, url }];
      setImageUrl(newState);
    });
  };

  const getImageUrl = () => {
    const imageRef = db.database().ref("image").child("temp");
    imageRef.on("value", (snapshot) => {
      const imageUrls = snapshot.val();
      const urls = [];
      for (let id in imageUrls) {
        urls.push({ id, url: imageUrls[id] });
      }
      const newState = [...imageUrl, ...urls];
      setImageUrl(newState);
    });
  };

  const deleteImage = (id) => {
    const storageRef = db.storage().ref("image").child(id);
    const imageRef = db.database().ref("image").child("temp").child(id);
    imageRef.remove().then(() => {
    storageRef.delete();
    });
  };

  useEffect(() => {
    getImageUrl();
  }, []);

  const createVehicle = () => {
    var vehicleRef = db.database().ref("vehicle");
    var vehicle = {
      title,
      type,
      passengers,
      fuel,
      year,
      cph,
      wiFi,
      location: location,
      availableForRent: true,
      imageUrl,
      geoLat: latlng.lat,
      geoLong: latlng.lng,
    };
    vehicleRef.push(vehicle);
    const imageRef = db.database().ref("image");
    imageRef.remove();
  };

  return (
    <>
      <NavigationBar />
     
    </>
  );
}

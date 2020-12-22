import React, { useState } from "react";
import PopupMsg from "./PopupMsg";
import PopupMap from "./PopupMap";
import { Carousel, Card, Table } from "react-bootstrap";
import firebase from "../../firebase";
import Map from "./LeafletMap";

export default function VehicleList({
  vehicle,
  setSelectedCarID,
  setNext3,
  startLatlng,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopupMsg = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const vehicleSelectedHandle = () => {
    setSelectedCarID(vehicle.id);
    setNext3(true);
  }




  var vehicleLatlng = [vehicle.geoLat, vehicle.geoLong];

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

  const cardFilter = () => {
console.log(startLatlng);
    var distance = getDistance(
      [startLatlng.lat, startLatlng.lng],
      [vehicle.geoLat, vehicle.geoLong]
    );

    if (vehicle.availableForRent && distance < 500000)
      return (
        <div>
          <h4 className={vehicle.complete ? "availableForRent" : ""}></h4>

          <Card className="cardAsItems" style={{ flex: 1 }}>
            <Card.Body>
              <Table striped bordered hover>
                <thead></thead>
                <tbody>
                  <tr>
                    <td colSpan="2">
                      <b>
                        <center>
                          <Carousel>
                            {vehicle.imageUrl
                              ? vehicle.imageUrl.map(({ id, url }) => {
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
                        </center>
                      </b>
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <Card.Title>
                        <center>
                          <h4>{vehicle.title}</h4>
                        </center>
                      </Card.Title>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Type:</b> {vehicle.type}
                    </td>
                    <td>
                      <b>Passengers #:</b> {vehicle.passengers}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Fuel:</b> {vehicle.fuel}
                    </td>
                    <td>
                      <b>Year:</b> {vehicle.year}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Cost/h:</b> {vehicle.cph}
                    </td>
                    <td>
                      <b>WiFi:</b> {vehicle.wiFi}
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2">
                      <b>Location:</b> {vehicle.location}
                    </td>
                  </tr>
                  <tr>
                  
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
            <Card.Footer>
              <center>
                <button
                  className="btn btn-secondary btn-lg"
                  onClick={togglePopupMsg}
                >
                  <i class="fas fa-map-marked-alt"></i>
                </button>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <button
                  className="btn btn-success btn-lg"
                  onClick={vehicleSelectedHandle}
                >
                  <i class="fas fa-arrow-right"></i>
                </button>
              </center>
            </Card.Footer>
          </Card>
          {isOpen && (
            <PopupMap
              content={
                <>
                  <center>
                    <h3> Cars </h3>
                  </center>
                  <div>
                    <Map.LeafletMap
                      startLatlng={startLatlng}
                      vehicleLatlng={vehicleLatlng}
                    />
                  </div>
                  <br />
                  <center>
                    {" "}
                    <button
                      className="btn btn-success btn-lg"
                      type="submit"
                      onClick={togglePopupMsg}
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
      );
  };

  return <>{cardFilter()}</>;
}

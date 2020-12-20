import React, { useState } from "react";
import PopupMsg from "./PopupMsg";
import { Carousel, Card, Table } from "react-bootstrap";
import firebase from "../../firebase";

export default function VehicleList({ vehicle }) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopupMsg = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const deleteVehicle = () => {
    const vehicleRef = firebase.database().ref("vehicle").child(vehicle.id);
    vehicleRef.remove();
    setIsOpen(!isOpen);
  };
  const changeAvailability = () => {
    const vehicleRef = firebase.database().ref("vehicle").child(vehicle.id);
    vehicleRef.update({
      availableForRent: !vehicle.availableForRent,
    });
  };

  return (
    <div>
      <h4 className={vehicle.complete ? "availableForRent" : ""}></h4>

      <Card className="cardItem" style={{ flex: 1 }}>
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
                <td colSpan="2">
                  <center>
                    {vehicle.availableForRent ? (
                      <b style={{ color: "green" }}>Available</b>
                    ) : (
                      <b style={{ color: "red" }}>Not available</b>
                    )}{" "}
                  </center>
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer>
          <center>
            <button className="btn btn-danger" onClick={togglePopupMsg}>
              <i className="fa fa-trash-alt"></i>
            </button>
            <button className="btn btn-dark" onClick={changeAvailability}>
              <b>toggle availability</b>
            </button>
          </center>
        </Card.Footer>
      </Card>
      {isOpen && (
        <PopupMsg
          content={
            <>
              <b>Question</b>
              <p>Are you sure you want to delete this vehicle?</p>
              <center>
                <button
                  className="btn btn-danger btn-lg"
                  type="submit"
                  onClick={deleteVehicle}
                >
                  {" "}
                  Yes{" "}
                </button>
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
    </div>
  );
}

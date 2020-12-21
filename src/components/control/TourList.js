import React, { useState } from "react";
import { Card, Carousel, Table } from "react-bootstrap";
import PopupMsg from "./PopupMsg";
import firebase from "../../firebase";

import Map from "./LeafletMap";
import PopupMap from "./PopupMap";

export default function TourList({ tour }) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopupMsg = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const deleteTour = () => {
    const tourRef = firebase.database().ref("tour").child(tour.id);
    tourRef.remove();
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <Card className="mobileTourCard" style={{ flex: 1 }}>
        <Card.Body>
          <Table striped bordered hover>
            <thead></thead>
            <tbody>
              <tr>
                <td colSpan="2">
                  <b>
                    <center>
                      <Carousel>
                        {tour.imageUrl
                          ? tour.imageUrl.map(({ id, url }) => {
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

                        {tour.poi
                          ? tour.poi.map(
                              ({
                                city,
                                decription,
                                geoLat,
                                geoLng,
                                id,
                                imageUrl,
                                name,
                                ticketCost,
                                time,
                                type,
                              }) => {
                                return (
                                  <Carousel.Item interval={500}>
                                    <div key={imageUrl[0].id}>
                                      <img
                                        className="d-block w-100"
                                        src={imageUrl[0].url}
                                        alt=""
                                        width={320}
                                        height={225}
                                      />
                                    </div>
                                    <Carousel.Caption>
                                      <p className="borderText">{name}</p>
                                    </Carousel.Caption>
                                  </Carousel.Item>
                                );
                              }
                            )
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
                      <h4>{tour.title}</h4>
                    </center>
                  </Card.Title>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <b>Description Customer:</b> {tour.descForCustomer}
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <b>Description Guide:</b> {tour.descForGuide}
                </td>
              </tr>
              <tr>
                <td>
                  <b>Tour Cost:</b> {tour.tourCost} €
                </td>
                <td>
                  <b>Time:</b> {tour.time}'
                </td>
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
          </center>
        </Card.Footer>
      </Card>
      {isOpen && (
        <PopupMap
          content={
            <>
              <center>
                <h3> Insert Point of Interest's location </h3>
              </center>
              <div>
                <Map.LeafletMap />
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
}

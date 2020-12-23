import React, { useState } from "react";
import { Card, Carousel, Table } from "react-bootstrap";
import PopupMap from "./PopupMap";
import firebase from "../../firebase";
import Map from "./TourMapPreview"

export default function TourViewList({ tour }) {
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
          <br/>  <br/>
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
            <button className="btn btn-secondary btn-lg" onClick={togglePopupMsg}><p>{`View Points on Map - `}
            <i class="fa fa-map-marker-alt" aria-hidden="true"></i></p>

            </button>
          </center>
        </Card.Footer>
      </Card>
      {isOpen && (
        <PopupMap
          content={
            <>
              <b>Points of Interests</b>
              <div>
                {console.log(tour.poi)}
                <Map.TourMapPreview tour={tour} />
              </div>
              <br/>
              <center>
                <button
                  className="btn btn-warning btn-lg"
                  type="submit"
                  onClick={togglePopupMsg}
                >
                   
                  {" "}
                  OK{" "}
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

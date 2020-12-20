import React, { useState } from "react";
import PopupMsg from "./PopupMsg";
import { Carousel, Card, Table } from "react-bootstrap";
import firebase from "../../firebase";

export default function PointOfInterestList({ poi }) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopupMsg = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const deletePOI = () => {
    const poiRef = firebase.database().ref("poi").child(poi.id);
    poiRef.remove();
    setIsOpen(!isOpen);
  };

  return (
    <div>
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
                        {poi.imageUrl
                          ? poi.imageUrl.map(({ id, url }) => {
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
                  <b>
                    <Card.Title>
                      <center>
                        {" "}
                        <h2>{poi.name}</h2>
                      </center>
                    </Card.Title>
                  </b>
                </td>
              </tr>
              <tr>
                <td colSpan="2">
                  <b>Description:</b> {poi.description}
                </td>
              </tr>
              <tr>
                <td>
                  <b>City:</b>
                  <br /> {poi.city}
                </td>

                <td>
                  <b>Type:</b>
                  <br /> {poi.type}
                </td>
              </tr>

              <tr>
                <td colSpan="2">
                  <b>Location:</b> {poi.location}
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
          </center>
        </Card.Footer>
      </Card>
      {isOpen && (
        <PopupMsg
          content={
            <>
              <b>Question</b>
              <p>Are you sure you want to delete this POI?</p>
              <center>
                <button
                  className="btn btn-danger btn-lg"
                  type="submit"
                  onClick={deletePOI}
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

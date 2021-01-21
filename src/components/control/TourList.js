import React, { useState } from "react";
import { Card, Carousel, Table } from "react-bootstrap";
import PopupMsg from "./PopupMsg";
import firebase from "../../firebase";
import L from "leaflet";
import Map from "./LeafletMapTour";


import PopupMap from "./PopupMap";

export default function TourList({
  tour,
  startLatlng,
  finishLatlng,
  tourTime,
  setSelectedTourID,
  setNext2,
  setTotalTimeForTour,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const togglePopupMsg = (e) => {
    e.preventDefault();

    if (isOpen){
      window.ga("send", {
        hitType: "event",
        eventCategory: "TourRequest",
        eventAction: "touch",
        eventLabel: Date().toLocaleString() + " - Close Map Popup",
      });
    }else {
      window.ga("send", {
        hitType: "event",
        eventCategory: "TourRequest",
        eventAction: "touch",
        eventLabel: Date().toLocaleString() + " - Open Map Popup",
      });
    }

    setIsOpen(!isOpen);
  };

  const [driveTime, setDriveTime] = useState();

  const deleteTour = () => {
    const tourRef = firebase.database().ref("tour").child(tour.id);
    tourRef.remove();
    setIsOpen(!isOpen);
  };

 
  const tourSelectedHandle = () => {
    setSelectedTourID(tour.id);
    setNext2(true);
    setTotalTimeForTour((driveTime+tour.time));

    window.ga("send", {
      hitType: "event",
      eventCategory: "TourRequest",
      eventAction: "touch",
      eventLabel: Date().toLocaleString() + " - Go To Screen 2",
    });

  }



  const displayCard = () => {
    var markerArray = [];
    markerArray.push(L.latLng(startLatlng));

    for (let i = 0; i < tour.poi.length; i++) {
      markerArray.push(L.latLng(tour.poi[i].geoLat, tour.poi[i].geoLng));
    }
  
    markerArray.push(L.latLng(finishLatlng));
    var routeControl = L.Routing.control({
      waypoints: markerArray,
    });
  
    routeControl.route();
    routeControl.on("routesfound", function (e) {
      var routes = e.routes;
      var summary = routes[0].summary;
      // alert time and distance in km and minutes
  
      setDriveTime(summary.totalTime / 60);
  
      console.log(driveTime);
    });

    if (tourTime >= driveTime + tour.time){
      return (
        <div>
          <center>
          <br />
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
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                <button
                  className="btn btn-success btn-lg"
                  onClick={tourSelectedHandle}
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
                    <h3> Tours Points Of Interest </h3>
                  </center>
                  <div>
                    {console.log(tour.poi)}
                    <Map.LeafletMapTour
                      tour={tour}
                      startLatlng={startLatlng}
                      finishLatlng={finishLatlng}
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
          </center>
        </div>
        
      );
    }

  }

return(
<>{displayCard()}</>

);

  
}

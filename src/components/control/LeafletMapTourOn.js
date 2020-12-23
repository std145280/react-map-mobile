import React from "react";
import L, { marker } from "leaflet";
import { markerIcon, startIcon, finishIcon, carMarkerIcon } from "./Icons";




  ////////Calculates distance between two points///////////
  ////////////and return distance in meters////////////////
  function getDistance (origin, destination) {
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



class LeafletMapTourOn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  center = { lat: this.props.lonitude, lng: this.props.langitude };

  componentDidMount() {
    const geocoder = L.Control.Geocoder.nominatim();
    var map = L.map("map", {
      zoom: 10,
    });
    var markerArray = [];
    markerArray.push(L.latLng(this.props.startLatlng));
    for (let i = 0; i < this.props.tour.poi.length; i++) {
      markerArray.push(
        L.latLng(this.props.tour.poi[i].geoLat, this.props.tour.poi[i].geoLng)
      );
    }
    markerArray.push(L.latLng(this.props.finishLatlng));
    map.setView([this.props.tour.geoLat, this.props.tour.geoLong], 10);
    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const checkDistance = () =>{
      for (let i=1 ; markerArray.length ; i++){
        if ( getDistance (markerArray[i].getLatLng, markerArray[0].getLatLng)<500){
          markerArray[i].remove();
        }
      }
    }

    var routeControl = L.Routing.control({
      waypoints: markerArray,
      createMarker: function (i, wp, nWps) {
        if (i === 0 ) {
          return L.marker(wp.latLng, {
            icon: carMarkerIcon,
            draggable: true
          });
        } else if( i === nWps - 1) {          return L.marker(wp.latLng, {
          icon: finishIcon,
        });}
        else {
          return L.marker(wp.latLng, {
            icon: markerIcon,
          });
        }
      },
    }).addTo(map);
    routeControl.route();
  }

  render() {
    return (
      <>
        <div id="map">L.map('leafletmap')</div>



      </>
    );
  }
}

export default { LeafletMapTourOn };

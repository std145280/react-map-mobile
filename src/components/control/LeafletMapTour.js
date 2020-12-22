import React from "react";
import {
  Map,
  Marker,
  Popup,
  TileLayer,
  ZoomControl,
  ScaleControl,
} from "react-leaflet";
import L from "leaflet";
import { markerIcon, startIcon, finishIcon, carMarkerIcon } from "./Icons";

const height = { height: "100vh" };
var center = { lat: 37.9838, lng: 23.7275 };

var geoLatlng;
var locationString;

class LeafletMapTour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  center = { lat: this.props.lonitude, lng: this.props.langitude };

  componentDidMount() {
    //const map = this.leafletMap.leafletElement;
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

    var routeControl = L.Routing.control({
      waypoints: markerArray,

      createMarker: function (i, wp, nWps) {
        if (i === 0 ) {
          return L.marker(wp.latLng, {
            icon: startIcon,
            draggable: true,
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

    routeControl.on("routesfound", function (e) {
      var routes = e.routes;
      var summary = routes[0].summary;
      // alert time and distance in km and minutes
      alert(
        "Total distance is " +
          summary.totalDistance / 1000 +
          " km and total time is " +
          summary.totalTime / 60 +
          " minutes"
      );
      //  map.removeControl();
    });
  }

  render() {
    return (
      <>
        <h3>hi</h3>
      </>
    );
  }
}

export default { LeafletMapTour };

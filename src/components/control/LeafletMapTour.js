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
import { markerIcon, startIcon, finishIcon } from "./Icons";


const height = { height: "100vh" };
var center = { lat: 37.9838, lng: 23.7275 };

var geoLatlng;
var locationString;

class LeafletMapTour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [[51.505, -0.09]],
    };
  }

  center = { lat: this.props.lonitude, lng: this.props.langitude };

  componentDidMount() {
    //const map = this.leafletMap.leafletElement;
    const geocoder = L.Control.Geocoder.nominatim();

    var map = L.map("map");

    L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const makeMarkers = () => {
      for (let i = 0; i < this.props.tour.poi.length; i++) {}
    };

    var markerArray = [];

    markerArray.push([L.latLng(this.props.startLatlng)]);
    markerArray.push([L.latLng(this.props.finishLatlng)]);

    console.log("marker Array: " + markerArray);
    console.log("marker Array: " + L.latLng(this.props.finishLatlng));

    const constMarker = markerArray;

    var routeControl = L.Routing.control({
      waypoints: [
        L.latLng(this.props.startLatlng),
        L.latLng(this.props.finishLatlng),
        L.latLng([this.props.tour.geoLat, this.props.tour.geoLong]),
      ],
    }).addTo(map);

    routeControl.on("routesfound", function (e) {
      var routes = e.routes;
      var summary = routes[0].summary;
      // alert time and distance in km and minutes
      alert(
        "Total distance is " +
          summary.totalDistance / 1000 +
          " km and total time is " +
          summary.totalTime/60 +
          " minutes"
      );
    });
  }

  render() {
    return <div id="map">L.map('leafletmap')</div>;
  }
}

export default { LeafletMapTour };

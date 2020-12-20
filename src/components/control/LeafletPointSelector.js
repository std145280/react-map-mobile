import React from "react";
import { Map, TileLayer } from "react-leaflet";
import L from "leaflet";
import { markerIcon } from "./Icons";
import firebase from "../../firebase";

const height = { height: "100vh" };
const center = { lat: 15.558, lng: 23.7275 };

var geoLatlng;
var locationString;

var locationsRef = firebase.database().ref("poi");
var data;





class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
  }

  center = { lat: this.props.lonitude, lng: this.props.langitude };

  componentDidMount() {
    const map = this.leafletMap.leafletElement;
    locationsRef.on("child_added", function (snapshot) {

      let marker;
      var lat = parseFloat(snapshot.val().geoLat);
      var lng = parseFloat(snapshot.val().geoLng);
      marker = new L.marker([lat,lng],{ icon: markerIcon } )
      .bindPopup(snapshot.val().name)
      .addTo(map);
    });

  }

  render() {
    return (
      <Map
        style={height}
        center={center}
        zoom={5}
        ref={(m) => {
          this.leafletMap = m;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
      </Map>
    );
  }
}

export default { LeafletMap, geoLatlng, locationString };

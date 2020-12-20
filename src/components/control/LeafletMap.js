import React from "react";
import { Map, TileLayer } from "react-leaflet";
import L from "leaflet";
import { markerIcon } from "./Icons";

const height = { height: "100vh" };
const center = { lat: 37.9838, lng: 23.7275 };

var geoLatlng;
var locationString;

class LeafletMap extends React.Component {
  constructor(props) {
    super(props);
  }

  center = { lat: this.props.lonitude, lng: this.props.langitude };

  componentDidMount() {
    const map = this.leafletMap.leafletElement;
    const geocoder = L.Control.Geocoder.nominatim();
    let marker;
    map.on("click", (e) => {
      this.props.setLocationLatlng(e.latlng);
      geocoder.reverse(
        e.latlng,
        map.options.crs.scale(map.getZoom()),
        (results) => {
          var r = results[0];
          if (r) {
            if (marker) {
              marker
                .setLatLng(r.center, { icon: markerIcon })
                .setPopupContent(r.html || r.name)
                .openPopup();
              this.props.setLocationName(r.name);
            } else {
              marker = L.marker(r.center, { icon: markerIcon })
                .bindPopup(r.name)
                .addTo(map)
                .openPopup();
              this.props.setLocationName(r.name);
            }
          }
        }
      );
    });
  }

  render() {
    return (
      <Map
        style={height}
        center={center}
        zoom={12}
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

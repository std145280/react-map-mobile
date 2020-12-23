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
import { markerIcon } from "./Icons";

const height = { height: "100vh" };
var center = { lat: 37.9838, lng: 23.7275 };

var geoLatlng;
var locationString;


class TourMapPreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      markers: [[51.505, -0.09]],
    };
  }

  center = { lat: this.props.lonitude, lng: this.props.langitude };

  componentDidMount() {
    const map = this.leafletMap.leafletElement;
    const geocoder = L.Control.Geocoder.nominatim();
  }

  addMarker = (e) => {
    for (let i = 0; i < this.props.tour.poi.length; i++) {
      var marker = L.marker([
        this.props.tour.poi[i].geoLat,
        this.props.tour.poi[i].geoLng,
      ]).addTo(this.refs.map);
    }
  };

  addMarker = (e) => {
    const { markers } = this.state;
    markers.push(e.latlng);
    this.setState({ markers });
  };


  render() {
    {
      center = { lat: this.props.tour.geoLat, lng: this.props.tour.geoLong };
    }
    {
      console.log(this.props.tour);
    }
    return (
        <>
      <Map
        style={height}
        center={center}
        zoom={10}
        ref={(m) => {
          this.leafletMap = m;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

        {this.props.tour.poi
          ? this.props.tour.poi.map(
              ({
                city,
                descForCustomer,
                descForGuide,
                name,
                geoLat,
                geoLng,
                imageUrl,
              }) => {
                return (
                  <Marker
                    key={city}
                    position={[geoLat, geoLng]}
                    icon={markerIcon}
                  >
                    <Popup>
                      <span>
                        <img className="w-100 h-100" src={imageUrl[0].url} />
                        <b>
                          Title:</b> {name} <br/>
                          {descForCustomer}
                        
                      </span>
                    </Popup>
                   
                  </Marker>
                );
              }
            )
          : ""}
      </Map>



      </>
    );
  }
}

export default { TourMapPreview, geoLatlng, locationString };
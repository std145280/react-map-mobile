import L from 'leaflet';
import simpleMarker from "../../images/marker-icon.png"
import carIcon from "../../images/car-icon.png"

const markerIcon = L.icon({
    iconUrl: simpleMarker,
    iconAnchor: [5, 25],
    popupAnchor: [5, -20],
    iconSize: [25, 25],
  });

  const carMarkerIcon = L.icon({
    iconUrl: carIcon,
    iconAnchor: [5, 25],
    popupAnchor: [5, -20],
    iconSize: [25, 25],
  });

  export { markerIcon, carMarkerIcon };
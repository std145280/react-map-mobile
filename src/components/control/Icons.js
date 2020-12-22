import L from 'leaflet';
import simpleMarker from "../../images/marker-icon.png"
import carIcon from "../../images/car-icon.png"

import start from "../../images/startIcon.png"
import finish from "../../images/finishIcon.png"


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

  const startIcon = L.icon({
    iconUrl: start,
    iconAnchor: [5, 25],
    popupAnchor: [5, -20],
    iconSize: [25, 25],
  });


  const finishIcon = L.icon({
    iconUrl: finish,
    iconAnchor: [5, 25],
    popupAnchor: [5, -20],
    iconSize: [25, 25],
  });

  export { markerIcon, carMarkerIcon, finishIcon, startIcon };
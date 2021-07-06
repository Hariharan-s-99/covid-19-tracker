import { MapContainer, useMapEvents } from "react-leaflet";
import { TileLayer, useMap } from "react-leaflet";
import "./Map.css";
import { showDataOnMap } from "./HelperFunctions";
function ChangeMap({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}
function MyComponent() {
  const map = useMapEvents({
    mouseout: (e) => {
      map.closePopup();
    },
  });
  return null;
}

function Maps({ center, zoom, countries, caseType }) {
  return (
    <div className="map">
      <MapContainer>
        <ChangeMap center={center} zoom={zoom} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {showDataOnMap(countries, caseType, center)}
        <MyComponent />
      </MapContainer>
    </div>
  );
}

export default Maps;

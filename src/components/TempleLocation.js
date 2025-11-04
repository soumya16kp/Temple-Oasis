import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "./TempleLocation.css";

// Fix default marker icon
const defaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
L.Marker.prototype.options.icon = defaultIcon;

// Resize fix for tiles
function ResizeFix() {
  const map = useMap();
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [map]);
  return null;
}

const TempleLocation = () => {
  // Kashi Vishwanath Temple coords
  const position = [25.3109, 83.0095];

  return (
    <section className="temple-location">
      <div className="temple-card">
        <h2 className="temple-title">Temple Location</h2>
        <p className="temple-address">
          Shri Kashi Vishwanath Temple <br />
          Varanasi, Uttar Pradesh, India
        </p>

        <div className="map-container">
          <MapContainer center={position} zoom={16} className="map">
            <ResizeFix />
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              tileSize={256}
              zoomOffset={0}
            />
            <Marker position={position}>
              <Popup>
                Shri Kashi Vishwanath Temple <br /> Varanasi, India
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default TempleLocation;

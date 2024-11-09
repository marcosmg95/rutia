

'use client';

import { useMenuContext } from "@/context/menuContext";
import { Icon } from "leaflet";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import UpdateCenter from "./updateCenter";

export default function Mapa() {
  const { center, markers } = useMenuContext();


  const icon = new Icon({
    iconUrl: './pin.png',
    iconSize: [35, 35], // size of the icon
    // iconAnchor: [22, 94],
    // iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    // popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
  })

  return (
    <MapContainer center={center} zoom={13} scrollWheelZoom={true} className="map">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers?.map(({ nom, localitzacio }) => (
        <Marker key={nom} position={localitzacio} icon={icon}>
          {/* <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup> */}
        </Marker>
      ))}
      <UpdateCenter />
    </MapContainer>
  )
}
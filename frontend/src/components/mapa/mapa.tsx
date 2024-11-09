

'use client';

import { Marcador, ResultatAPI } from "@/context/domain";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";

export default function Mapa() {
  const center = { lat: 41.40252955, lng: 2.188065206 };
  const [markers, setMarkers] = useState<Marcador[]>();

  const icon = new Icon({
    iconUrl: './pin.png',
    iconSize: [35, 35], // size of the icon
    iconAnchor: [22, 94],
    // iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    // popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
  })

  const getMarkers = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL || ''}field/history?latitude=41.40252955&longitude=2.188065206`

    fetch(url, {
      method: 'GET',
      headers: {
        mode: 'no-cors',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      }
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error("Something went wrong on API server!");
        }
      })
      .then((response) => {
        // console.debug('debug', response);

        const marcadors: Marcador[] = response.map((r: ResultatAPI) => {
          console.log(r)
          return {
            nom: r.title,
            localitzacio: {
              lat: r.location?.latitude,
              lng: r.location?.longitude,
            }
          }
        })
        setMarkers(marcadors);
      })
      .catch((error) => {
        console.error('error', error);
      });
  };

  useEffect(() => {
    getMarkers();
  }, [])

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

    </MapContainer>
  )
}
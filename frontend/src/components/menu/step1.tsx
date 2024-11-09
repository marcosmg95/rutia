import { Coordenades, Marcador, ResultatAPI } from "@/context/domain";
import { useMenuContext } from "@/context/menuContext";
import { useState } from "react";

export default function Step1() {
  const { data, setData, nextStep, ambits, setMarkers, center, setCenter, setFirstResults } = useMenuContext();
  const [useCurrentPosition, setUseCurrentPosition] = useState<boolean>(false);
  const today = new Date().toISOString().substring(0, 10);

  const updateCoordinates = (pos: GeolocationPosition) => {
    setCenter({ c: { lat: pos.coords.latitude, lng: pos.coords.longitude }, pin: false });
    console.log("update coords", { lat: pos.coords.latitude, lng: pos.coords.longitude });
  };

  const showError = (err: GeolocationPositionError) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  const getCoordinates = () => {
    if (!useCurrentPosition) {
      setUseCurrentPosition(!useCurrentPosition);

      const options = {
        enableHighAccuracy: true,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(updateCoordinates, showError, options);
    }
  };

  const getCityCoordinates = async (): Promise<Coordenades | null> => {
    const url = `https://nominatim.openstreetmap.org/search?city=${data.ciutat}&state=Catalunya&country=Espanya&format=jsonv2`
    const result = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', }
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Something went wrong on nominatim API server!");
      }
    }).then((response) => {
      // console.debug('debug', response);
      const coords = {
        lat: parseFloat(response[0]["lat"]),
        lng: parseFloat(response[0]["lon"]),
      };
      setCenter({ c: coords, pin: false });
      return coords;
    }).catch((error) => {
      console.error('error', error);
      return null;
    });

    return result;
  };

  const getFirstResults = async (coords: Coordenades) => {
    const fields = Object.keys(data.tipus).map((key) => `${key}=${data.tipus[key] ? '1' : '0'}`).join('&')
    const url = `${process.env.NEXT_PUBLIC_API_URL || ''}field?${fields}&latitude=${coords.lat}&longitude=${coords.lng}&date=${data.dia}`

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
      }
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error("Something went wrong on API server!");
      }
    }).then((response) => {
      // console.debug('debug', response);
      setFirstResults(response);
      const marcadors: Marcador[] = response.map((r: ResultatAPI) => {
        return {
          nom: r.title,
          localitzacio: {
            lat: r.location?.latitude,
            lng: r.location?.longitude,
          }
        }
      })
      setMarkers(marcadors);
    }).catch((error) => {
      console.error('error', error);
    });
  };

  const handleSelect = (key: string) => {
    setData({
      ...data,
      tipus: {
        ...data.tipus,
        [key]: !data.tipus[key]
      }
    })
  };

  const clickContinue = async () => {
    if (useCurrentPosition) {
      await getFirstResults(center.c);
    } else if (data.ciutat !== '') {
      await getCityCoordinates().then((coords) => {
        if (coords)
          getFirstResults(coords);
      });
    }
    nextStep();
  };

  return (
    <>
      <div className="form-group mb-5">
        <label className="px-4 py-3">Tria un dia:</label>
        <input
          type="date"
          name="dia"
          className="px-4 py-3 grow"
          value={data?.dia}
          min={today}
          onChange={(e) => setData({ ...data, dia: e.target.value })}
        />
      </div>

      <div className="flex flex-col items-center mb-3">
        <div className="form-group w-full">
          <label className="px-4 py-3">Tria una ciutat:</label>
          <input
            type="text"
            name="ciutat"
            placeholder="Barcelona"
            className="px-4 py-3 grow"
            value={data?.ciutat}
            onChange={(e) => setData({ ...data, ciutat: e.target.value })}
          />
        </div>
        <span className="mt-1 mb-2">o</span>
        <button
          className={`btn check w-full ${useCurrentPosition ? 'active' : ''}`}
          onClick={getCoordinates}
        >
          Utilitza la meva localització
        </button>
      </div>

      <label className="mt-3 mb-2">Tria els àmbits:</label>
      <div className="flex gap-3 mb-6">
        {Object.keys(data.tipus).map((key) => (
          <button
            key={key}
            className={`btn check py-1 grow ${data.tipus[key] ? 'active' : ''}`}
            onClick={() => handleSelect(key)}
          >
            {ambits[key]}
          </button>
        ))}
      </div>

      <button
        className="primary uppercase px-7 self-center mt-auto text-lg"
        onClick={clickContinue}
      >
        Continua
      </button>
    </>
  )
}
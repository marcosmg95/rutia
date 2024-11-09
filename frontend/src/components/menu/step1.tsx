import { useMenuContext } from "@/context/menuContext";
import { useState } from "react";

export default function Step1() {
  const { data, setData, nextStep, ambits } = useMenuContext();
  const [useCurrentPosition, setUseCurrentPosition] = useState<boolean>(false);
  // const today = new Date().toISOString().substring(0, 10);

  const updateCoordinates = (pos: GeolocationPosition) => {
    setData({ ...data, localitzacio: { lat: pos.coords.latitude, lng: pos.coords.longitude } })
  };

  const showError = (err: GeolocationPositionError) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  const getCoordinates = async () => {
    if (!useCurrentPosition && !(data.localitzacio && data.localitzacio.lat && data.localitzacio.lng)) {
      const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      };

      await navigator.geolocation.getCurrentPosition(updateCoordinates, showError, options);
    }
    setUseCurrentPosition(!useCurrentPosition);
  };

  const getCityCoordinates = async () => {
    const url = `https://nominatim.openstreetmap.org/search?city=${data.ciutat}&format=jsonv2`
    fetch(url, {
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
      const newData = { ...data };
      newData.localitzacio = {
        lat: parseFloat(response[0]["lat"]),
        lng: parseFloat(response[0]["lon"]),
      }
      setData(newData);
      console.log(newData)
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
    nextStep();
    if (data.ciutat !== '') {
      await getCityCoordinates();
    }
  };

  return (
    <>
      {/* <div className="form-group mb-5">
        <label className="px-4 py-3">Tria un dia:</label>
        <input
          type="date"
          name="dia"
          className="px-4 py-3 grow"
          value={data?.dia}
          min={today}
          onChange={(e) => setData({ ...data, dia: e.target.value })}
        />
      </div> */}

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
          Usa la meva localització
        </button>
      </div>

      <label className="mt-3 mb-2">Tria els àmbits:</label>
      <div className="flex gap-3 mb-2">
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
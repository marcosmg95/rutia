import { useMenuContext } from "@/context/menuContext";

export default function Step1() {
  const { data, setData } = useMenuContext();

  const today = new Date().toISOString().substring(0, 10);

  const updateCoordinates = (pos: GeolocationPosition) => {
    setData({ ...data, localitzacio: { lat: pos.coords.latitude, lng: pos.coords.longitude } })
  };

  const showError = (err: GeolocationPositionError) => {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  };

  const getCoordinates = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      updateCoordinates, showError, options);
  };
  return (
    <>
      <div className="form-group mb-3">
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

      <div className="form-group">
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

      <div>

        <span>o</span>

        <button className="m-3 p-1" onClick={getCoordinates}>
          Usa la meva localització
        </button>
      </div>
    </>
  )
}
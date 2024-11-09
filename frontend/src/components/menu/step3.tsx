import { useMenuContext } from "@/context/menuContext"
import Loading from "../layout/loading";
import { useEffect } from "react";

export default function Step3() {
  const { markers, setMarkers, setCenter, finishLoading } = useMenuContext();

  const getAddress = async (lat: number, lng: number): Promise<string | null> => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=jsonv2`
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

      return response["display_name"];
    }).catch((error) => {
      console.error('error', error);
      return null;
    });

    return result;
  };

  const loadAddresses = async () => {
    if (finishLoading) {

      const promises = markers.map((m) => {
        if (m.localitzacio) {
          return getAddress(m.localitzacio.lat, m.localitzacio.lng).then((text) => {
            return { ...m, adreca: text || '' }
          });
        } else {
          return null;
        }
      })

      Promise.all(promises).then((newMarkers) => setMarkers(newMarkers.filter((x) => x !== null)))

    }
  }

  useEffect(() => {
    loadAddresses();
  }, [finishLoading]);

  return (
    <>
      {finishLoading
        ? markers.map((marker) => (
          <div key={marker.code} className="flex flex-col card py-2">
            <p className="text-lg font-bold">{marker.nom}</p>
            <p>{marker.descripcio}</p>
            <p className="soft-text mb-2 text-sm capitalize">{marker.adreca}</p>
            {marker.ambit && <div className="ambit self-start py-0.5 px-2.5 text-sm">{marker.ambit}</div>}
            <button
              className="btn primary self-end text-sm mb-0.5"
              onClick={() => setCenter({ c: marker.localitzacio, pin: true })}>
              Veure en el mapa
            </button>
          </div>
        ))
        : <Loading />
      }
    </>
  )
}
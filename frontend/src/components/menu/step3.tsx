import { useMenuContext } from "@/context/menuContext"
import Loading from "../layout/loading";
import { useEffect } from "react";
import Image from "next/image";

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
          <div key={marker.code} className="flex flex-col card py-2 h-full">
            <p className="text-lg font-bold">{marker.nom}</p>
            <p>{marker.descripcio}</p>
            <p className="soft-text mb-2 text-sm capitalize">{marker.adreca}</p>
            <div className="flex gap-2 mb-3">
              {(marker.inici && marker.fi) && (
                <div className="calendar self-start py-0.5 px-2.5 ps-2 text-sm flex">
                  <Image src={'/events.svg'} width={16} height={16} alt="Calendar event icon" />
                  <span className="ms-2">{marker.inici !== marker.fi ? `${marker.inici} -  ${marker.fi}` : marker.inici}</span>

                </div>
              )}
              {marker.ambit && <div className="ambit self-start py-0.5 px-2.5 text-sm">{marker.ambit}</div>}
            </div>
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
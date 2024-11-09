import { Coordenades, Marcador, ResultatAPI } from "@/context/domain";
import { useMenuContext } from "@/context/menuContext";
import { AudioRecorder } from "@/audio/audioRecorder";

export default function Step2() {
  const { data, setData, nextStep, setMarkers, firstResults } = useMenuContext();

  const getLastMarkers = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL || ''}customization`
    const body = {
      context: data.context,
      locations: firstResults,
    };
    fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
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
      console.debug('debug', response);

      // const marcadors: Marcador[] = response.map((r: ResultatAPI) => {
      //   return {
      //     nom: r.title,
      //     localitzacio: {
      //       lat: r.location?.latitude,
      //       lng: r.location?.longitude,
      //     }
      //   }
      // })
      // setMarkers(marcadors);
    }).catch((error) => {
      console.error('error', error);
    });
  };

  const clickGenerar = () => {
    getLastMarkers();
    nextStep();
  }

  return (
    <>
      <div className="form-group mb-3">
        <label className="px-4 py-3">Xateja amb rutIA per descobrir experiències fetes a mida per a tu: </label>
        <textarea
          rows={6}
          className="w-full px-4 py-3"
          placeholder=""
          value={data.context}
          onChange={(e) => setData({ ...data, context: e.target.value })}
        />
      </div>
<<<<<<< HEAD
      <AudioRecorder />
      <button
        className="primary uppercase px-7 self-center mt-auto text-lg"
        onClick={nextStep}
=======
      <button
        className="primary uppercase px-7 self-center mt-auto text-lg"
        onClick={clickGenerar}
>>>>>>> bd0b49376261da77682c8ee9b8b5926a40ff66f7
      >
        Generar ruta
      </button>
    </>
  )
}
import { Marcador, ResultatAPI } from "@/context/domain";
import { useMenuContext } from "@/context/menuContext";
import { AudioRecorder } from "@/audio/audioRecorder";

export default function Step2() {
  const { data, setData, nextStep, setMarkers, firstResults, ambits } = useMenuContext();

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


  const getLastMarkers = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL || ''}customization`
    const body = {
      context: data.context,
      locations: firstResults,
    };
    console.log('before request');
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        mode: 'no-cors',
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

      const marcadors: Marcador[] = response.map(async (r: ResultatAPI) => {
        let address = null;
        let field = null;
        if (r.location?.latitude && r.location?.longitude) {
          address = await getAddress(r.location?.latitude, r.location?.longitude);
        }

        if (r.field === "Ciència") field = ambits.science;
        if (r.field === "Arts visuals") field = ambits.art;
        if (r.field === "Història i memòria") field = ambits.history;

        return {
          code: r.code,
          nom: r.title,
          adreca: address,
          descripcio: r.description,
          ambit: field,
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


  const clickGenerar = () => {
    getLastMarkers();
    nextStep();
  }

  const handleRecordingComplete = async (audioBlob: Blob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch('http://35.204.96.165:8200/upload_audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setData({ ...data, context: result.text.text });
        console.log('Audio sent successfully!');
      } else {
        console.error('Failed to send audio');
      }
    } catch (error) {
      console.error('Error sending audio:', error);
    }
  };

  return (
    <>
      <div className="form-group">
        <label className="px-4 py-3 w-full">Xateja amb rutIA per descobrir experiències fetes a mida per a tu: </label>
        <textarea
          rows={6}
          className="w-full px-4 py-3"
          placeholder="Escriu aquí..."
          value={data.context}
          onChange={(e) => setData({ ...data, context: e.target.value })}
        />
      </div>
      <span className="mt-1 mb-2 self-center">o</span>
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      <button
        className="primary uppercase px-7 self-center mt-auto text-lg"
        onClick={clickGenerar}
      >
        Generar ruta
      </button>
    </>
  )
}
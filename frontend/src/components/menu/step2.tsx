import { Marcador, ResultatAPI } from "@/context/domain";
import { useMenuContext } from "@/context/menuContext";
import { AudioRecorder } from "@/audio/audioRecorder";

export default function Step2() {
  const { data, setData, nextStep, setMarkers, firstResults, ambits, setFinishLoading } = useMenuContext();

  const getLastMarkers = async () => {
    const url = `${process.env.NEXT_PUBLIC_API_URL || ''}customization?clean_key=${Date.now()}`
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

      if (!response.locations || response.locations.length === 0) {
        throw new Error("Something went wrong on API server!");
      }

      const titles = Object.keys(response.locations).map((key) => response.locations[key].title);
      const lastResults = firstResults?.filter((x) => titles.includes(x.title))

      if (lastResults) {

        const marcadors: Marcador[] = lastResults.map((r: ResultatAPI) => {
          let field;

          if (r.field === "Events") field = ambits.events;
          if (r.field === "Ciència") field = ambits.science;
          if (r.field === "Arts visuals") field = ambits.art;
          if (r.field === "Història i memòria") field = ambits.history;
          let inici;
          let fi;
          const fake = "1337-11-03T00:00:00+00:00";
          console.log(' fake')

          if (r.start_date != fake && r.end_date != fake) {
            console.log('not fake')
            inici = r.start_date.substring(0, 10);
            fi = r.end_date.substring(0, 10);
          }

          return {
            code: r.code,
            nom: r.title,
            adreca: '',
            descripcio: r.description,
            ambit: field || '',
            inici: inici,
            fi: fi,
            localitzacio: {
              lat: r.location?.latitude,
              lng: r.location?.longitude,
            }
          }
        })
        setMarkers(marcadors);
        setFinishLoading(true);
      }
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}upload_audio`, {
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
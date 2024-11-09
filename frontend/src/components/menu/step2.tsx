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

  const handleRecordingComplete = async (audioBlob) => {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      const response = await fetch('http://35.204.96.165:8200/upload_audio', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setData({ ...data, context: result.text });
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
      <div className="form-textarea">
        <label>Xateja amb rutIA per descobrir experiències fetes a mida per a tu</label>
        <textarea
          rows={6}
          className="w-full"
          placeholder=""
          value={data.context}
          onChange={(e) => setData({ ...data, context: e.target.value })}
        />
      </div>
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
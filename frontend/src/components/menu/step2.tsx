import { useMenuContext } from "@/context/menuContext";
import { AudioRecorder } from "@/audio/audioRecorder";

export default function Step2() {
  const { nextStep } = useMenuContext();


  return (
    <>
      <div className="form-textarea">
        <label>Xateja amb rutIA per descobrir experiències fetes a mida per a tu</label>
        <textarea
          rows={6}
          className="w-full"
          placeholder=""
        />
      </div>
      <AudioRecorder />
      <button
        className="primary uppercase px-7 self-center mt-auto text-lg"
        onClick={nextStep}
      >
        Generar ruta
      </button>
    </>
  )
}
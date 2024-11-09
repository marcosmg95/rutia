import { useMenuContext } from "@/context/menuContext";

export default function Step2() {
  const { nextStep } = useMenuContext();


  return (

    <>
      <button className="primary uppercase px-7 self-center mt-auto text-lg" onClick={nextStep}>Generar ruta</button>
    </>
  )
}
import { useMenuContext } from "@/context/menuContext";
import axios from "axios";

export default function Step2() {
  const { data } = useMenuContext();
  const getCityCoordinates = async () => {
    const url = `https://nominatim.openstreetmap.org/search.php?city=${data.ciutat}&format=jsonv2`
    await axios.get(url).then((result) => {
      console.log(result)
    })
  };

  return (
    <>
      <button className="primary m-3 font-bold text-lg">
        Generar ruta
      </button>
    </>
  )
}
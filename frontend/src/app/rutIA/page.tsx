// import ProvinciesCatalunya from "@/components/mapa/provinciesCatalunya";

import MapaInteractiu from "@/components/mapa/mapaInteractiu";

export default function RutIA() {
  return (
    <main
    // className="h-screen w-screen overflow-autp"
    >
      <div
      // className="w-full h-full overflow-auto map-container"
      >
        {/* <ProvinciesCatalunya /> */}
        <MapaInteractiu />
      </div>
    </main>
  )
}
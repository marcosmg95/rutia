/* import Image from "next/image"; */
// import Link from "next/link";

import Mapa from "@/components/mapa/mapa";
import Menu from "@/components/menu/menu";
import { MenuProvider } from "@/context/menuContext";

export default function Home() {
  return (
    <main className="main-container">
      <MenuProvider>
        <Mapa />
        <Menu />
      </MenuProvider>
    </main>
  )
}

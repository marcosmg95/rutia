import dynamic from "next/dynamic";
import Menu from "@/components/menu/menu";
import { MenuProvider } from "@/context/menuContext";

export default function Home() {
  const Mapa = dynamic(() => import("@/components/mapa/mapa"), { ssr: false });

  return (
    <main className="main-container">
      <MenuProvider>
        <Mapa />
        <Menu />
      </MenuProvider>
    </main>
  )
}

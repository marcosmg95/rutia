import ProvinciesCatalunya from "@/components/mapa/provinciesCatalunya";

export default function RutIA() {
    return (
        <main className="h-screen w-screen overflow-hidden">
            <div className="w-full h-full overflow-auto map-container">
                <ProvinciesCatalunya />
            </div>
        </main>
    )
}
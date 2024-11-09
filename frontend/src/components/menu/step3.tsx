import { useMenuContext } from "@/context/menuContext"

export default function Step3() {
  const { markers, setCenter } = useMenuContext();

  return (
    <>
      {markers.map((marker) => (
        <div key={marker.code} className="flex flex-col card py-2">
          <p className="text-lg">{marker.nom}</p>
          <p>{marker.descripcio}</p>
          <p className="soft-text mb-2">{marker.adreca}</p>
          {marker.ambit && <div className="ambit self-start py-0.5 px-2.5 text-sm">{marker.ambit}</div>}
          <button
            className="btn primary self-end text-sm"
            onClick={() => setCenter({ c: marker.localitzacio, pin: true })}>
            Veure en el mapa
          </button>
        </div>
      ))}
      <div className="flex flex-col card py-2">
        <p className="text-lg">{'marker.nom'}</p>
        <p>{'marker.descripcio'}</p>
        <p className="soft-text mb-2">{'marker.adreca'}</p>
        <div className="ambit self-start py-0.5 px-2.5 text-sm">art</div>
        <button className="btn primary self-end text-sm">Veure en mapa</button>

      </div>
    </>
  )
}
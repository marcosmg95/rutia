'use client';

import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

export default function MapaInteractiu() {
	const geoUrl = 'provincies-cat.geojson';

	return (
		<ComposableMap>
			<ZoomableGroup zoom={2} center={[41.38736,2.1671155]} maxZoom={2000}>
				<Geographies geography={geoUrl}>
					{({ geographies }) =>
						geographies.map((geo) => (
							<Geography key={geo.rsmKey} geography={geo} />
						))
					}
				</Geographies>
			</ZoomableGroup>
		</ComposableMap>
	)
}
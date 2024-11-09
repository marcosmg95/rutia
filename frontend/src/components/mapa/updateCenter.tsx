import { useMenuContext } from "@/context/menuContext";
import { useEffect } from "react";
import { useMap } from "react-leaflet"

export default function UpdateCenter() {
	const { center } = useMenuContext();
	const map = useMap();

	useEffect(() => {
		map.setView(center, map.getZoom());
	}, [center, map]);

	return null;
}
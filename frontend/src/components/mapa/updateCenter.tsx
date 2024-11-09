import { useMenuContext } from "@/context/menuContext";
import { useEffect } from "react";
import { useMap } from "react-leaflet"

export default function UpdateCenter() {
	const { center } = useMenuContext();
	const map = useMap();

	useEffect(() => {
		map.setView(center.c, (center.pin ? 20 : 13));
	}, [center, map]);

	return null;
}
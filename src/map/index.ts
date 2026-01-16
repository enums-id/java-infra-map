import { bootStrap } from "../appMain.svelte";
import { appState } from "../appState.svelte";
import mapboxgl from "mapbox-gl";

export function loadFunction(map: mapboxgl.Map) {
  return () => {
    appState.ready.mapLoad = true;
    const onMove = () => {
      const [z, x, y] = [
        map.getZoom(),
        map.getCenter().lng,
        map.getCenter().lat,
      ];

      appState.mapzoom = [z, x, y];
    };
    appState.map?.on("move", onMove);
    onMove();
    map.flyTo({
      zoom: 7.25,
    });
    if (appState.map) bootStrap(appState.map);
  };
}

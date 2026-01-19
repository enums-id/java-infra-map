import mapboxgl, { type MapEventOf, type MapEventType } from "mapbox-gl";
import type { Listener$1 } from "./types";
import { toast } from "svelte-sonner";
import { appState } from "../appState.svelte";
import { bootStrap } from "../appMain.svelte";
import { layers } from "./layers";

export function mapActionsInvoke(map: mapboxgl.Map) {
  return () => {
    for (const [mapEvent, listener] of Object.entries(mapActions)) {
      map.on(mapEvent, listener);
    }
  };
}

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

    initPosition(map);
    if (appState.map) bootStrap(appState.map);
  };
}

function initPosition(map: mapboxgl.Map): [number, number, number] {
  const x = Number(localStorage.getItem("x_"));
  const y = Number(localStorage.getItem("y_"));
  const zoom = Number(localStorage.getItem("z_"));

  const all = [x, y, zoom].every((f) => Number.isFinite(f));

  if (all) {
    map.flyTo({
      center: [x, y],
      zoom,
      animate: false,
    });
  }

  return [0, 0, 0];
}

const mapActions: {
  [K in MapEventType]?: Listener$1<Extract<K, MapEventType>>;
} = {
  mousemove: (e) => {
    const map = appState.map;
    if (!map) return;

    const [feature] = map.queryRenderedFeatures(e.point, {
      layers: layers.map((d) => d.id),
    });

    if (!feature) {
      appState.featureHighlight = null;
      return;
    }

    appState.featureHighlight = feature;
  },
  load: (e) => {},
  move: (e) => {
    const map = appState.map;
    if (!map) return;
    const c = map.getCenter();
    const [x, y, z] = [c.lng, c.lat, map.getZoom()];

    localStorage.setItem("x_", x.toFixed(8));
    localStorage.setItem("y_", y.toFixed(8));
    localStorage.setItem("z_", z.toFixed(2));
  },
  contextmenu: (e) => {
    toast("Coordinate:", {
      description: [e.lngLat.lng, e.lngLat.lat]
        .map((f) => f.toFixed(8))
        .join(","),
      action: {
        label: "Ok",
        onClick: () => {},
      },
    });
  },
};

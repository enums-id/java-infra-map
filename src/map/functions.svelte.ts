import mapboxgl, { type MapEventOf, type MapEventType } from "mapbox-gl";
import type { Listener$1 } from "./types";
import { toast } from "svelte-sonner";
import { appState } from "../appState.svelte";
import { bootStrap, layerButtonClick } from "../appMain.svelte";
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
    map.getCanvas().style.cursor = "default";
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

    if (appState.map) bootStrap(appState.map);
  };
}

const mapActions: {
  [K in MapEventType]?: Listener$1<Extract<K, MapEventType>>;
} = {
  mousemove: (e) => {
    const map = appState.map;
    if (!map) return;

    const ids = appState.geojsonList
      .map((g) => {
        const ids = g.layers.map((f) => f.id);
        return ids;
      })
      .flat();

    const [feature] = map.queryRenderedFeatures(e.point, {
      layers: [...layers.map((d) => d.id), ...ids],
    });

    if (!feature) {
      appState.featureHighlight = null;
      map.getCanvas().style.cursor = "default";
      return;
    }

    appState.featureHighlight = feature;
    map.getCanvas().style.cursor = "pointer";
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
  click: (e) => {
    const map = appState.map;
    if (!map) return;

    const ids = appState.geojsonList
      .map((g) => {
        const ids = g.layers.map((f) => f.id);
        return ids;
      })
      .flat();

    const [feature] = map.queryRenderedFeatures(e.point, {
      layers: [...layers.map((d) => d.id), ...ids],
    });

    if (!feature) {
      appState.featureClicked = null;
      return;
    }

    appState.featureClicked = feature;

    if (feature.layer && ids.includes(feature.layer.id)) {
      const [oName] = appState.geojsonList.filter((p) => {
        const idInLayer = p.layers.map((p) => p.id);
        return feature.layer && idInLayer.includes(feature.layer.id);
      });
      console.log("oName", $state.snapshot(oName));
      if (oName) layerButtonClick(oName)();
    }
  },
  mousedown: (e) => {
    if (!appState.map) return;
    appState.map.getCanvas().style.cursor = "grabbing";
  },
  mouseup: (e) => {
    if (!appState.map) return;
    appState.map.getCanvas().style.cursor = "default";
  },
};

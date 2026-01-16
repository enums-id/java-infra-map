import mapboxgl, { type MapEventOf, type MapEventType } from "mapbox-gl";
import type { Listener$1 } from "./types";

export function mapActionsInvoke(map: mapboxgl.Map) {
  return () => {
    for (const [mapEvent, listener] of Object.entries(mapActions)) {
      map.on(mapEvent, listener);
    }
  };
}

const mapActions: {
  [K in MapEventType]?: Listener$1<Extract<K, MapEventType>>;
} = {};

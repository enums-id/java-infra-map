import mapboxgl, { type MapEventOf, type MapEventType } from "mapbox-gl";
import type { Listener$1 } from "./types";
import { toast } from "svelte-sonner";

export function mapActionsInvoke(map: mapboxgl.Map) {
  return () => {
    for (const [mapEvent, listener] of Object.entries(mapActions)) {
      map.on(mapEvent, listener);
    }
  };
}

const mapActions: {
  [K in MapEventType]?: Listener$1<Extract<K, MapEventType>>;
} = {
  mousemove: (e) => {
    e.lngLat;
  },
  contextmenu: (e) => {
    toast("Event has been created", {
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

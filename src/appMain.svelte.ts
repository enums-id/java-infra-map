import { appState } from "./appState.svelte";
import mapboxgl from "mapbox-gl";

export function bootStrap(map: mapboxgl.Map) {
  if (!appState.ready.data || !appState.ready.mapLoad)
    return console.log(
      "not ready",
      appState.ready.data,
      appState.ready.mapLoad
    );
  registerBaseMap(map);
  registerData(map);
  registerLayer(map);
}

const sources: Record<string, mapboxgl.SourceSpecification> = {
  industry: {
    type: "vector",
    tiles: [
      `${import.meta.env.VITE_PROTOCOL}://${
        import.meta.env.VITE_HOST
      }/xyz/industry/{z}/{x}/{y}.pbf`,
    ],
  },
  pelabuhan: {
    type: "vector",
    tiles: [
      `${import.meta.env.VITE_PROTOCOL}://${
        import.meta.env.VITE_HOST
      }/xyz/pelabuhan_xyz/{z}/{x}/{y}.pbf`,
    ],
  },
  "jaringan-listrik": {
    type: "vector",
    tiles: [
      `${import.meta.env.VITE_PROTOCOL}://${
        import.meta.env.VITE_HOST
      }/xyz/listrik/jaringan/{z}/{x}/{y}.pbf`,
    ],
  },
};

function registerBaseMap(map: mapboxgl.Map) {
  for (const [key, value] of Object.entries(sources)) {
    map.addSource(key, value);
  }
  map.addLayer({
    id: "industry",
    type: "fill",
    source: "industry",
    "source-layer": "industry2",
    paint: {
      "fill-color": "#9009de",
      "fill-opacity": 0.85,
    },
  });

  map.addLayer({
    id: "jaringan-listrik2",
    type: "line",
    source: "jaringan-listrik",
    "source-layer": "listrik",
    paint: {
      "line-color": [
        "case",
        ["<", ["get", "tegjar"], 60],
        "#006e31",
        ["<", ["get", "tegjar"], 130],
        "#6e4900",
        ["<", ["get", "tegjar"], 160],
        "#6a006e",
        "#99023e",
      ],
      "line-opacity": 0.85,
    },
  });

  map.addLayer({
    id: "pelabuhan",
    type: "circle",
    source: "pelabuhan",
    "source-layer": "pelabuhan",
    filter: [
      "all",
      ["!=", ["get", "hirarki_p"], "Belum Terdefinisi"],
      ["!=", ["get", "hirarki_p"], "Pelabuhan Lokal"],
    ],
    paint: {
      "circle-color": [
        "match",
        ["get", "hirarki_p"],

        "Pelabuhan Utama",
        "#99023e",
        "Pelabuhan Pengumpan Regional",
        "#6a006e",
        "Pelabuhan Pengumpan",
        "#6e4900",

        /* fallback */
        "#cccccc",
      ],

      "circle-radius": [
        "match",
        ["get", "hirarki_p"],

        "Pelabuhan Utama",
        10,
        "Pelabuhan Pengumpan Regional",
        8,
        "Pelabuhan Pengumpan",
        6,

        /* fallback */
        5,
      ],

      "circle-stroke-width": 1,
      "circle-stroke-color": "#ffffff",
    },
  });
}

function registerData(map: mapboxgl.Map) {
  console.log("register data invoked");
  if (!appState.map) return;

  for (const [key, data] of Object.entries(appState.geojsonData)) {
    console.log("registering data:", key);
    appState.map.addSource(key, {
      type: "geojson",
      data,
    });
  }

  appState.ready.dataRegistered = true;
}

function registerLayer(map: mapboxgl.Map) {
  if (!appState.map) return;
  for (const gRecord of appState.geojsonList) {
    let i = 0;
    for (const layer of gRecord.layers) {
      i++;
      const layerToAdd = layer as mapboxgl.LayerSpecification;

      layerToAdd.id = `${gRecord.name}-${i}`;
      layerToAdd.source = gRecord.name;
      appState.map.addLayer(layer);
    }
  }

  appState.ready.layersRegistered = true;
}

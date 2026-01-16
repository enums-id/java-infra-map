import { appState } from "./appState.svelte";
import mapboxgl from "mapbox-gl";
import { sources } from "./map/sources";

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
      "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],

        // Zoomed out
        5,
        [
          "case",
          ["<=", ["get", "tegjar"], 1],
          0.4, // LV
          ["<=", ["get", "tegjar"], 35],
          0.8, // MV
          ["<=", ["get", "tegjar"], 150],
          1.4, // HV / SUTT
          2.2, // EHV / SUTET
        ],

        // Zoomed in
        14,
        [
          "case",
          ["<=", ["get", "tegjar"], 1],
          1.2,
          ["<=", ["get", "tegjar"], 35],
          2.0,
          ["<=", ["get", "tegjar"], 150],
          3.2,
          5.0,
        ],
      ],
      "line-color": [
        "case",

        // Low Voltage (≤ 1 kV)
        ["<=", ["get", "tegjar"], 1],
        "#2ecc71",

        // Medium Voltage (1–35 kV)
        ["<=", ["get", "tegjar"], 35],
        "#2ecc71",

        // High Voltage / SUTT (35–150 kV)
        ["<=", ["get", "tegjar"], 150],
        "#f1c40f",

        // Extra High Voltage / SUTET (>150 kV)
        "#e74c3c",
      ],
      "line-opacity": 0.85,
    },
  });

  map.addLayer({
    id: "Pelabuhan Pengumpan",
    type: "circle",
    source: "pelabuhan",
    "source-layer": "pelabuhan",
    filter: ["all", ["==", ["get", "hirarki_p"], "Pelabuhan Pengumpan"]],
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

  map.addLayer({
    id: "Pelabuhan Pengumpan Regional",
    type: "circle",
    source: "pelabuhan",
    "source-layer": "pelabuhan",
    filter: [
      "all",
      ["==", ["get", "hirarki_p"], "Pelabuhan Pengumpan Regional"],
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
  map.addLayer({
    id: "Pelabuhan Utama",
    type: "circle",
    source: "pelabuhan",
    "source-layer": "pelabuhan",
    filter: ["all", ["==", ["get", "hirarki_p"], "Pelabuhan Utama"]],
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

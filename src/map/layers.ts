import type { AnyLayer } from "./types";

export const layers: AnyLayer[] = [
  // industry
  {
    id: "industry",
    type: "fill",
    source: "industry",
    "source-layer": "industry2",
    paint: {
      "fill-color": "#9009de",
      "fill-opacity": 0.85,
    },
  },

  // jaringan listrik
  ...[20, 30, 70, 150, 275, 500].map((d) => {
    const layer: AnyLayer = {
      id: `jaringan-listrik-${d}`,
      type: "line",
      source: "jaringan-listrik",
      "source-layer": "listrik",
      filter: ["==", ["get", "tegjar"], d],
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
    };
    return layer;
  }),

  // pelabuhan
  ...[
    "Pelabuhan Pengumpan",
    "Pelabuhan Pengumpan Regional",
    "Pelabuhan Utama",
  ].map((f) => {
    const layer: AnyLayer = {
      id: f,
      type: "circle",
      source: "pelabuhan",
      "source-layer": "pelabuhan",
      filter: ["all", ["==", ["get", "hirarki_p"], f]],
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
    };

    const layer2: AnyLayer = {
      id: f,
      type: "symbol",
      source: "pelabuhan",
      "source-layer": "pelabuhan",
      filter: ["all", ["==", ["get", "hirarki_p"], f]],

      layout: {
        "icon-image": "https://cdn.simpleicons.org/codeship",

        // Map circle-radius → icon-size
        "icon-size": [
          "match",
          ["get", "hirarki_p"],

          "Pelabuhan Utama",
          1,
          "Pelabuhan Pengumpan Regional",
          0.65,
          "Pelabuhan Pengumpan",
          0.45,

          /* fallback */
          0.45,
        ],

        "icon-allow-overlap": true,
        "icon-anchor": "center",
      },
    };

    return layer2;
  }), // Pelabuhan
];

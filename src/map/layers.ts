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
  ...["motorway", "trunk", "primary"].map((d) => {
    const layer: AnyLayer = {
      id: `roads-${d}`,
      type: "line",
      source: "roads",
      "source-layer": "roads",

      filter: ["==", ["get", "class"], d],

      layout: {
        "line-join": "round",
        "line-cap": "round",
      },

      paint: {
        "line-color": [
          "match",
          ["get", "class"],
          "motorway",
          "#1f3c88", // deep blue
          "trunk",
          "#3a6ea5", // medium blue
          "primary",
          "#9bb7d4", // light blue-grey
          "#cccccc",
        ],

        "line-width": [
          "match",
          ["get", "class"],
          "motorway",
          4,
          "trunk",
          2,
          "primary",
          1,
          1,
        ],
      },
    };

    return layer;
  }),
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

  // substation
  ...[25, 30, 66, 70, 150, 159, 170, 275, 500]
    .map((d) => {
      if (d < 70) return null;
      let filterLayer: mapboxgl.FilterSpecification = [];
      let layerSuffix = "";
      let cont = false;
      switch (d) {
        case 30:
          filterLayer = ["<=", ["get", "teggi_v"], 30];
          layerSuffix = "30kV";
          cont = true;
          break;
        case 70:
          filterLayer = [
            "all",
            [">=", ["get", "teggi_v"], 66],
            ["<=", ["get", "teggi_v"], 70],
          ];
          layerSuffix = "70kV";
          cont = true;
          break;
        case 170:
          filterLayer = [
            "all",
            [">=", ["get", "teggi_v"], 150],
            ["<=", ["get", "teggi_v"], 170],
          ];
          layerSuffix = "150kV";
          cont = true;
          break;
        case 275:
          filterLayer = ["all", [">=", ["get", "teggi_v"], 275]];
          layerSuffix = "275kV";
          cont = true;
          break;
      }

      if (!cont) return null;
      console.log("SUBSTATION SUFFIX", `substation-${layerSuffix}`);
      const layer: AnyLayer = {
        id: `substation-${layerSuffix}`,
        type: "circle",
        filter: filterLayer,
        source: "substation",
        "source-layer": "substation",
        paint: {
          // Match substation color to power line voltage categories
          "circle-color": [
            "case",

            // Low Voltage (≤ 1 kV)
            ["<=", ["get", "teggi_v"], 1],
            "#2ecc71",

            // Medium Voltage (1–35 kV)
            ["<=", ["get", "teggi_v"], 35],
            "#2ecc71",

            // High Voltage / SUTT (35–150 kV)
            ["<=", ["get", "teggi_v"], 150],
            "#f1c40f",

            // Extra High Voltage / SUTET (>150 kV)
            "#e74c3c",
          ],

          // Radius preserved
          "circle-radius": [
            "match",
            ["get", "teggi_v"],

            500,
            8,
            275,
            7,
            170,
            6,
            159,
            5,
            150,
            4,
            70,
            3,
            66,
            2,
            30,
            1,
            25,
            1,

            /* default */
            1,
          ],

          "circle-opacity": 0.85,
          "circle-stroke-width": 1,
          "circle-stroke-color": "#333333",
        },
      };
      return layer;
    })
    .filter((f) => f !== null),

  //jnspls
  // ...['PLTGU', 'PLTM', 'PLTA', 'PLTD', 'PLTSa', 'PLTMG', 'PLTU', 'PLTG','PLTMH', 'PLTP', 'Pemba', 'Steam', 'PLTBm', 'PLTS', 'PLTBg','PLTB', 'PLTDG', 'PLTBn'].map(r=>{

  // })
  {
    id: "generator",
    type: "symbol",
    source: "generator",
    "source-layer": "generator",
    layout: {
      "icon-image": "bolt", // name used in map.addImage()
      "icon-size": 0.65, // scale factor (adjust as needed)
      "icon-allow-overlap": true, // prevent hiding when close
      "icon-ignore-placement": true,
    },
  },

  {
    id: "airports",
    type: "symbol",
    source: "airport", // change if airports use a different source
    "source-layer": "airport",
    filter: [
      "in",
      ["get", "class"],
      ["literal", ["airport", "regional_airport", "international_airport"]],
    ],
    paint: {
      "icon-color": "blue",
    },
    layout: {
      "icon-image": "paper-plane",
      "icon-size": 0.8,
      "icon-allow-overlap": true,
      "icon-ignore-placement": true,

      // optional: rotate plane by bearing if available
      // "icon-rotate": ["get", "bearing"],
      // "icon-rotation-alignment": "map"
    },
  },

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

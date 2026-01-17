import { appState } from "./appState.svelte";
import mapboxgl from "mapbox-gl";
import { sources } from "./map/sources";
import { layers } from "./map/layers";
import { mapActionsInvoke } from "./map/functions";
import { svgUrls } from "./map/images";
import type { treeType } from "./components/types";

export async function bootStrap(map: mapboxgl.Map) {
  if (!appState.ready.data || !appState.ready.mapLoad)
    return console.log(
      "not ready",
      appState.ready.data,
      appState.ready.mapLoad
    );
  registerBaseMap(map);
  registerData(map);
  await loadImages(map);
  registerLayer(map);
  mapActionsInvoke(map)();

  bootStrapCheckbox();
}

function bootStrapCheckbox() {
  appState.tree = [
    [
      { displayName: "Infrastructure" },
      [
        { displayName: "power", checked: true },
        [
          {
            displayName: "Powerline",
          },

          ...layers
            .filter((f) => f.id.includes("jaringan-listrik"))
            .map((f) => {
              const displayName =
                f.id
                  .split("-")
                  .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
                  .join(" ") + "kV";
              return {
                displayName,
                layerTarget: [f.id],
                checked:
                  localStorage.getItem(`checkbox-${displayName}`) !== "false",
              };
            }),
        ],
        [
          {
            displayName: "Substation",
          },

          ...layers
            .filter((f) => f.id.includes("substation-"))
            .map((f) => {
              return {
                displayName: f.id
                  .split("-")
                  .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
                  .join(" "),
                layerTarget: [f.id],
                checked: localStorage.getItem(`checkbox-${f.id}`) !== "false",
              };
            }),
        ],
        [{ displayName: "generator", layerTarget: [], checked: true }],
      ],
      [
        {
          displayName: "industry",
          layerTarget: ["industry"],
          checked: localStorage.getItem(`checkbox-industry`) !== "false",
        },
      ],
      { displayName: "port", checked: true },
    ],
    [{ displayName: "Projects" }, { displayName: "Projects" }],
  ];

  loadLayer(appState.tree);

  function loadLayer(tree: treeType) {
    if (!appState.map) return;
    for (const elem of tree) {
      const isObject =
        typeof elem === "object" && elem !== null && !Array.isArray(elem);
      const isArray = Array.isArray(elem);

      if (isArray) {
        loadLayer(elem);
      }
      if (isObject) {
        const { displayName, layerTarget, checked } = elem;

        const display =
          localStorage.getItem(`checkbox-${displayName}`) !== "false";
        if (Array.isArray(layerTarget) && layerTarget.length > 0) {
          for (const layer of layerTarget) {
            appState.map.setLayoutProperty(
              layer,
              "visibility",
              display ? "visible" : "none"
            );
          }
        }
      }
    }
  }
}

async function loadImages(map: mapboxgl.Map) {
  async function addSvgIcon(name: string, svgUrl: string, size = 24) {
    const res = await fetch(svgUrl);
    const svgText = await res.text();

    const img = new Image();
    const svg = new Blob([svgText], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svg);

    await new Promise((resolve) => {
      img.onload = resolve;
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    if (!canvas) return;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(img, 0, 0, size, size);

    const finalImg = new Image();
    finalImg.src = canvas.toDataURL("image/png");

    await new Promise((resolve) => {
      finalImg.onload = resolve;
    });

    // Add to Mapbox
    map.addImage(name, finalImg);
    URL.revokeObjectURL(url);
  }

  for (const svgUrl of svgUrls) {
    await addSvgIcon(svgUrl, svgUrl);
    console.log("Adding", svgUrl, " to map");
  }
}

function registerBaseMap(map: mapboxgl.Map) {
  for (const [key, value] of Object.entries(sources)) {
    map.addSource(key, value);
  }

  for (const layer of layers) {
    map.addLayer(layer);
    appState.mapLayers.push(layer);
  }
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

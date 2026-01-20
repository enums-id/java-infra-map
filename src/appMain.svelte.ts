import { appState } from "./appState.svelte";
import mapboxgl from "mapbox-gl";
import { sources } from "./map/sources";
import { layers } from "./map/layers";
import { mapActionsInvoke } from "./map/functions";
import { svgElements, svgUrls } from "./map/images";
import type { treeType } from "./components/types";
import { treeInit } from "./tree";
import type { Component } from "svelte";
import type { Checkbox } from "$lib/components/ui/checkbox";

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

  bootStrapCheckboxAndTree();
  initPosition(map);
}

export const randomHexId6 = (): string =>
  crypto
    .getRandomValues(new Uint8Array(3))
    .reduce((s, b) => s + b.toString(16).padStart(2, "0"), "");

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

function bootStrapCheckboxAndTree() {
  appState.tree = treeInit;
  const baseProjects = [
    "Transport",
    "Rail",
    "Port",
    "Energy",
    "Telecommunication",
  ];

  const toAppend: treeType = [{ displayName: "Projects" }];

  for (const folderName of baseProjects) {
    const subFolder: treeType = [{ displayName: folderName }];
    for (const gRecord of appState.geojsonList) {
      const { name, displayName, description, category, layers } = gRecord;
      if (category !== folderName) continue;
      let layerTarget = [];
      for (const gRecord of appState.geojsonList) {
        let i = 0;
        for (const layer of gRecord.layers) {
          i++;
          const lName = `${gRecord.displayName}-${i}`;
          layerTarget.push(lName);
        }
      }

      const element = {
        displayName,
        layerTarget,
        checked: localStorage.getItem(`checkbox-industry`) !== "false",
      };

      subFolder.push(element);
    }

    toAppend.push(subFolder);
  }

  let [fName, ...elems] = toAppend;

  appState.tree.push([fName, ...elems.filter((f) => f.length > 1)]);

  loadLayer(appState.tree);

  appState.displayCheckbox = true;

  function loadLayer(tree: treeType) {
    if (!appState.map) return;
    for (const elem of tree) {
      const isObject =
        typeof elem === "object" && elem !== null && !Array.isArray(elem);
      const isArray = Array.isArray(elem);
      const map = appState.map;
      if (!map) return;

      if (isArray) {
        loadLayer(elem);
      }
      if (isObject) {
        const { displayName, layerTarget, checked } = elem;

        const display =
          localStorage.getItem(`checkbox-${displayName}`) !== "false";
        if (Array.isArray(layerTarget) && layerTarget.length > 0) {
          for (const layer of layerTarget) {
            const layersIn = layers
              .map((f) => f.id)
              .filter((f) => f.includes(layer));

            layersIn.forEach((q) => {
              map.setLayoutProperty(
                q,
                "visibility",
                display ? "visible" : "none"
              );
            });
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
    map.addImage(name, finalImg, { sdf: true });
    URL.revokeObjectURL(url);
  }

  async function addSvgElement(
    name: string,
    svgContent: string, // <-- raw <svg>...</svg>
    size = 24
  ) {
    // Create SVG blob directly from string
    const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);

    const finalImg = new Image();
    finalImg.src = canvas.toDataURL("image/png");

    await new Promise<void>((resolve, reject) => {
      finalImg.onload = () => resolve();
      finalImg.onerror = reject;
    });

    // Add to Mapbox
    map.addImage(name, finalImg, { sdf: true });

    URL.revokeObjectURL(url);
  }

  for (const svgUrl of svgUrls) {
    try {
      await addSvgIcon(svgUrl, svgUrl);
    } catch (error) {
      console.error(error);
    }
  }

  for (const svgElement of svgElements) {
    try {
      await addSvgElement(svgElement.name, svgElement.element);
    } catch (error) {
      console.log(svgElement.name);
      console.error(error);
    }
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

      layerToAdd.id = `${gRecord.displayName}-${i}`;
      layerToAdd.source = gRecord.name;
      appState.map.addLayer(layer);
    }
  }

  appState.ready.layersRegistered = true;
}

export function switchLayers(
  category: "Power" | "Land Use" | "Port" | "Road" | "Airport" | "Train",
  options?: {
    visible: boolean;
  }
) {
  traverse(appState.tree, category);

  function traverse(
    tree: treeType,
    category: "Power" | "Land Use" | "Port" | "Road" | "Airport" | "Train"
  ) {
    if (!appState.map) return;
    for (const elem of tree) {
      const isObject =
        typeof elem === "object" && elem !== null && !Array.isArray(elem);
      const isArray = Array.isArray(elem);
      const map = appState.map;
      if (!map) return;

      if (isArray) {
        traverse(elem, category);
      }
      if (
        isObject &&
        elem.category == category &&
        elem.layerTarget &&
        elem.layerTarget.length > 0
      ) {
        elem.checked = options ? options.visible : false;
        console.log("EXECUTING", $state.snapshot(elem));
        checkChange(elem, { visible: options ? options.visible : false })();
      }
    }
  }
}

export function checkChange(oName: any, option?: { visible: boolean }) {
  return () => {
    let visibility: "visible" | "none" = oName.checked ? "visible" : "none";
    if (option) {
      if (option.visible) visibility = "visible";
      if (!option.visible) visibility = "none";
    }

    const map = appState.map;
    console.log($state.snapshot(appState.checkboxes));
    if (!map) return;

    oName.layerTarget.forEach((layerName: string) => {
      const layersIn = layers
        .map((f) => f.id)
        .filter((f) => f.includes(layerName));
      layersIn.forEach((layerName) => {
        map.setLayoutProperty(layerName, "visibility", visibility);
      });
      localStorage.setItem(`visibility-${layerName}`, visibility);
    });

    localStorage.setItem(`checkbox-${oName.displayName}`, oName.checked);
  };
}

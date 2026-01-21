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
import * as turf from "@turf/turf";

export async function bootStrap(map: mapboxgl.Map) {
  if (!appState.ready.data || !appState.ready.mapLoad) return;
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
    "Airport",
  ];

  const toAppend: treeType = [{ displayName: "Projects" }];

  for (const folderName of baseProjects) {
    const subFolder: treeType = [{ displayName: folderName }];
    for (const gRecord of appState.geojsonList) {
      const { name, displayName, description, category, layers } = gRecord;
      if (category !== folderName) continue;

      const visible =
        localStorage.getItem(`checkbox-${displayName}`) !== "false";
      let layerTarget = [];
      let i = 0;
      for (const layer of layers) {
        layerTarget.push(layer.id);
        i++;
      }
      const element = {
        displayName,
        layerTarget,
        source: name,
        checked: visible,
      };

      console.log("Check Change", $state.snapshot(element), visible);
      checkChange(element, { visible });

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
                display ? "visible" : "none",
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
    size = 24,
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
  for (const [key, data] of Object.entries(appState.geojsonData)) {
    map.addSource(key, {
      type: "geojson",
      data,
    });

    fetch(`/news/${key.replace(".geojson", ".json")}`).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          appState.news[key] = (data as any[]).sort(
            (a, b) => Number(b.datePublished) - Number(a.datePublished),
          );
        });
      } else {
        appState.news[key] = [];
      }
    });
  }

  appState.ready.dataRegistered = true;
}

function registerLayer(map: mapboxgl.Map) {
  if (!appState.map) return;
  for (const gRecord of appState.geojsonList) {
    const visible =
      localStorage.getItem(`checkbox-${gRecord.displayName}`) !== "false";
    let i = 0;
    for (const layer of gRecord.layers) {
      gRecord.layers[i].id = `${gRecord.displayName}-${i}`;
      gRecord.layers[i].source = gRecord.name;
      gRecord.data = appState.geojsonData[gRecord.name];

      if (gRecord.layers[i]["layout"]) {
        (gRecord.layers[i]["layout"] as Record<string, string>)["visibility"] =
          visible ? "visible" : "none";
      } else {
        gRecord.layers[i]["layout"] = {} as Record<string, string>;
        (gRecord.layers[i]["layout"] as Record<string, string>)["visibility"] =
          visible ? "visible" : "none";
      }

      appState.map.addLayer(gRecord.layers[i]);

      console.log("Adding gRecord Layer", $state.snapshot(gRecord.layers[i]));
      i++;
    }
  }

  appState.ready.layersRegistered = true;
}

export function switchLayers(
  category: "Power" | "Land Use" | "Port" | "Road" | "Airport" | "Train",
  options?: {
    visible: boolean;
  },
) {
  traverse(appState.tree, category);

  function traverse(
    tree: treeType,
    category: "Power" | "Land Use" | "Port" | "Road" | "Airport" | "Train",
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
      if (!elem.category) continue;
      if (
        isObject &&
        elem.category == category &&
        elem.layerTarget &&
        elem.layerTarget.length > 0
      ) {
        elem.checked = options ? options.visible : false;
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

      oName.checked = option.visible;
    }

    const map = appState.map;
    if (!map) return;

    console.log("switching checkChange", $state.snapshot(oName.layerTarget));

    oName.layerTarget.forEach((layerName: string) => {
      const layersIn = layers
        .map((f) => f.id)
        .filter((f) => f.includes(layerName));
      [
        ...layersIn,
        ...appState.geojsonList
          .map((f) => f.layers.map((d) => d.id))
          .flat()
          .filter((k) => k.includes(layerName)),
      ].forEach((layerName) => {
        map.setLayoutProperty(layerName, "visibility", visibility);
      });
      localStorage.setItem(`visibility-${layerName}`, visibility);
    });

    localStorage.setItem(`checkbox-${oName.displayName}`, oName.checked);
  };
}

export function layerButtonClick(oName: any) {
  return () => {
    if (oName.source && appState.news[oName.source as string]) {
      const news = appState.news[oName.source as string];
      appState.activeNews = oName.source;
      appState.activeClick = oName;
      console.log($state.snapshot(oName));
      appState.drawerOpen = true;
      const data = appState.geojsonData[oName.source];
      if (!data) return;
      const bbox = turf.bbox(data);
      appState.bboxLive = bbox;
    }
  };
}

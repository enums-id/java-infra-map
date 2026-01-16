import type { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";
import type { AnyLayer } from "./map/types";

export const appState: {
  geojsonList: gDataRecord[];
  geojsonData: Record<string, FeatureCollection>;
  mapdiv: HTMLDivElement;
  map?: mapboxgl.Map;
  ready: {
    mapLoad: boolean;
    data: boolean;
    dataRegistered: boolean;
    layersRegistered: boolean;
  };
  mapLayers: AnyLayer[];
  mapzoom: [number, number, number];
  layerState: Record<string, boolean>;
  categories: string[];
  tree: string | any[];
} = $state({
  geojsonList: [],
  geojsonData: {},
  mapdiv: document.createElement("div"),
  ready: {
    mapLoad: false,
    data: false,
    dataRegistered: false,
    layersRegistered: false,
  },
  mapLayers: [],
  mapzoom: [0, 0, 0],
  layerState: {},
  categories: [],
  tree: [],
});

export async function populateData() {
  const response = await fetch("/catalog.json");
  const jsonData = await response.json();
  appState.geojsonList = jsonData as gDataRecord[];

  const resp = await fetch("/categories.json");
  appState.categories = await resp.json();
  appState.tree = [
    [
      "base",
      ["power", "powerline", "substation", "generator"],
      ["industry"],
      "port",
    ],
  ];

  return jsonData;
}

export async function populateGeojsonData() {
  let i = 0;
  const totalI = appState.geojsonList.length;
  for (const gData of appState.geojsonList) {
    i++;
    console.log(`loading ${gData.name}... (${i}/${totalI})`);
    const response = await fetch(`/data/${gData.name}`);
    const jsonData = await response.json();
    appState.geojsonData[gData.name] = jsonData;
    appState.mapLayers = [...appState.mapLayers, ...gData.layers];
  }

  console.log("populateGeojsonData", appState.categories, appState.geojsonList);

  for (const category of appState.categories) {
    const baseList: string[] = [category];
    for (const catalog of appState.geojsonList) {
      if (catalog.category !== category) continue;
      baseList.push(catalog.displayName);
    }

    console.log(`base list for ${category}`, baseList);

    if (baseList.length == 1) {
      continue;
    }

    if (Array.isArray(appState.tree)) {
      (appState.tree as any[]).push(baseList);
    }
  }
}

export type gDataRecord = {
  name: string;
  layers: [];
  category: string;
  displayName: string;
  description: string;
};

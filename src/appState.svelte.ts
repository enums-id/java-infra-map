import type { FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
import mapboxgl from "mapbox-gl";
import type { AnyLayer } from "./map/types";
import type { treeType } from "./components/types";
import { layers } from "./map/layers";

export const appState: {
  checkboxes: Record<string, HTMLElement | null>;
  displayCheckbox: boolean;
  geojsonList: gDataRecord[];
  geojsonData: Record<string, FeatureCollection>;
  mapdiv: HTMLDivElement;
  map?: mapboxgl.Map;
  featureHighlight: mapboxgl.GeoJSONFeature | null;
  featureClicked: mapboxgl.GeoJSONFeature | null;
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
  tree: treeType[];
  highlightFeature: boolean;
  activeNews: string;
  news: Record<
    string,
    {
      newsTitle: string;
      datePublished: string;
      summary: string;
      link: string;
    }[]
  >;
  drawerOpen: boolean;
} = $state({
  drawerOpen: false,
  activeNews: "",
  news: {},
  highlightFeature: true,
  featureHighlight: null,
  featureClicked: null,
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
  displayCheckbox: false,
  checkboxes: {},
});

export async function populateData() {
  const response = await fetch("/catalog.json");
  const jsonData = await response.json();
  appState.geojsonList = jsonData as gDataRecord[];

  const resp = await fetch("/categories.json");
  appState.categories = await resp.json();

  return jsonData;
}

export async function populateGeojsonData() {
  let i = 0;
  const totalI = appState.geojsonList.length;
  for (const gData of appState.geojsonList) {
    i++;
    const response = await fetch(`/data/${gData.name}`);
    const jsonData = await response.json();
    appState.geojsonData[gData.name] = jsonData;
    appState.mapLayers = [...appState.mapLayers, ...gData.layers];
  }

  const projectFolder: treeType = [
    {
      displayName: "Projects",
    },
  ];

  for (const category of appState.categories) {
    const baseList: treeType = [
      {
        displayName: category,
        isLayer: false,
      },
    ];

    for (const catalog of appState.geojsonList) {
      if (catalog.category !== category) continue;
      baseList.push({ displayName: catalog.displayName, checked: true });
    }

    if (baseList.length == 1) {
      continue;
    }

    if (Array.isArray(appState.tree)) {
      projectFolder.push(baseList);
    }
  }
  (appState.tree as any[]).push(projectFolder);
}

export type gDataRecord = {
  name: string;
  layers: AnyLayer[];
  category: string;
  displayName: string;
  description: string;
  prompt: string[];
  data?: FeatureCollection<Geometry, GeoJsonProperties>;
};

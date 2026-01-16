import type { FeatureCollection } from "geojson";
import mapboxgl from "mapbox-gl";

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
  mapLayers: mapboxgl.LayerSpecification[];
  mapzoom: [number, number, number];
  layerState: Record<string, boolean>;
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
});

export async function populateData() {
  const response = await fetch("/catalog.json");
  const jsonData = await response.json();
  appState.geojsonList = jsonData as gDataRecord[];
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
    appState.mapLayers = [...gData.layers, ...appState.mapLayers];
  }
}

export type gDataRecord = {
  name: string;
  layers: [];
  displayName: string;
  description: string;
};

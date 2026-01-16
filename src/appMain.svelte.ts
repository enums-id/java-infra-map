import { appState } from "./appState.svelte";
import mapboxgl from "mapbox-gl";
import { sources } from "./map/sources";
import { layers } from "./map/layers";

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

  for (const layer of layers) {
    map.addLayer(layer);
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

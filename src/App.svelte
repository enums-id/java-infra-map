<script lang="ts">
  import { onMount } from "svelte";
  import "mapbox-gl/dist/mapbox-gl.css";
  import Map from "./components/Map.svelte";
  import {
    appState,
    populateData,
    populateGeojsonData,
  } from "./appState.svelte";
  import { bootStrap } from "./appMain.svelte";
  import Panel from "./components/Panel.svelte";

  console.log(import.meta.env.VITE_API_KEY);

  onMount(() => {
    populateData()
      .then((f) => populateGeojsonData())
      .then((f) => {
        console.log("data loaded");
        appState.ready.data = true;
        if (appState.map) bootStrap(appState.map);
      });

    return () => {
      // if (appState.map && appState.map.remove) appState.map.remove();
    };
  });
</script>

<div class="flex flex-col h-screen w-screen relative">
  <Map />
  <div class="z-10 absolute top-0 left-0 m-4 w-1/4">
    <Panel />
  </div>
</div>

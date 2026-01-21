<script lang="ts">
  import mapboxgl from "mapbox-gl";
  import { onMount } from "svelte";
  import { appState } from "../appState.svelte";
  import { bootStrap } from "../appMain.svelte";
  import { loadFunction } from "../map/functions.svelte";

  import { toast } from "svelte-sonner";
  import { Button } from "$lib/components/ui/button/index.js";
  import Theme from "./Theme.svelte";
  import Footer from "./Footer.svelte";

  mapboxgl.accessToken = import.meta.env.VITE_API_KEY;

  onMount(() => {
    appState.map = new mapboxgl.Map({
      container: appState.mapdiv, // container ID
      // style: "mapbox://styles/mapbox/standard",
      style: "mapbox://styles/mapbox/light-v11",
      bounds: [
        [105.01424636448132, -8.841348328927836],
        [114.6549880607514, -5.760634287909397],
      ],
      // maxBounds: [
      //   [103.59791035568088, -10.965774998704077],
      //   [116.20008188853387, -1.6337979184728084],
      // ],
    });
    appState.map.on("load", loadFunction(appState.map));
  });
</script>

<div class="grow" bind:this={appState.mapdiv}></div>

<Footer />

<script lang="ts">
  import { onMount } from "svelte";
  import "mapbox-gl/dist/mapbox-gl.css";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import { ModeWatcher } from "mode-watcher";
  import Map from "./components/Map.svelte";
  import { resetMode, setMode } from "mode-watcher";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  // import AppSidebar from "$lib/components/app-sidebar.svelte";

  import {
    appState,
    populateData,
    populateGeojsonData,
  } from "./appState.svelte";
  import { bootStrap } from "./appMain.svelte";
  import Panel from "./components/Panel.svelte";
  import Tree from "./components/Tree.svelte";

  console.log(import.meta.env.VITE_API_KEY);

  onMount(() => {
    populateData()
      .then((f) => populateGeojsonData())
      .then((f) => {
        console.log("data loaded");
        appState.ready.data = true;
        if (appState.map) bootStrap(appState.map);
      });
    // setMode("light");
    return () => {
      // if (appState.map && appState.map.remove) appState.map.remove();
    };
  });

  let mapWidth = $state();

  $effect(() => {
    if (mapWidth && appState.map) appState.map.resize();
  });
</script>

<ModeWatcher />

<div class="flex flex-col h-screen w-screen relative">
  <Sidebar.Provider class="flex grow relative" onOpenChange={() => {}}>
    <Sidebar.Root collapsible={"offcanvas"}>
      <Sidebar.Header />
      <Sidebar.Content>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Tree
              items={[
                [
                  "lib",
                  ["components", "button.svelte", "card.svelte"],
                  "utils.ts",
                ],
                [
                  "routes",
                  ["hello", "+page.svelte", "+page.ts"],
                  "+page.svelte",
                  "+page.server.ts",
                  "+layout.svelte",
                ],
                ["static", "favicon.ico", "svelte.svg"],
                "eslint.config.js",
                ".gitignore",
                "svelte.config.js",
                "tailwind.config.js",
                "package.json",
                "README.md",
              ]}
            />
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Content>
      <Sidebar.Footer />
    </Sidebar.Root>
    <Sidebar.Trigger />
    <div class="flex flex-col grow relative" bind:clientWidth={mapWidth}>
      <Map />
      <div class="z-10 absolute top-0 left-0 m-4 w-1/4">
        <Panel />
      </div>
    </div>
  </Sidebar.Provider>
</div>
<Toaster />

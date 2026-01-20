<script lang="ts">
  import { onMount } from "svelte";
  import "mapbox-gl/dist/mapbox-gl.css";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import { ModeWatcher } from "mode-watcher";
  import Map from "./components/Map.svelte";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { resetMode, setMode } from "mode-watcher";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  // import AppSidebar from "$lib/components/app-sidebar.svelte";
  import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
  import M from "@lucide/svelte/icons/map";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";

  import {
    appState,
    populateData,
    populateGeojsonData,
  } from "./appState.svelte";
  import { bootStrap } from "./appMain.svelte";
  import Panel from "./components/Panel.svelte";
  import Tree from "./components/Tree.svelte";
  import FileExplorer from "./components/FileExplorer.svelte";
  import FeatureHighlight from "./components/FeatureHighlight.svelte";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import FeatureClicked from "./components/FeatureClicked.svelte";
  import Tools from "./components/Tools.svelte";
  import { Button } from "$lib/components/ui/button";

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

  const name = "name";
</script>

<ModeWatcher />

<div class="flex flex-col h-screen w-screen relative">
  <Sidebar.Provider
    class="flex grow relative"
    style="--sidebar-width: 20rem; --sidebar-width-mobile: 20rem;"
    onOpenChange={() => {}}
  >
    <Sidebar.Root collapsible={"offcanvas"}>
      <Sidebar.Header>
        <Sidebar.Menu>
          <Sidebar.MenuItem>
            <Sidebar.MenuButton size="lg">
              {#snippet child({ props })}
                <a href="##" {...props}>
                  <div
                    class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                  >
                    <M class="size-4" />
                  </div>
                  <div class="flex flex-col gap-0.5 leading-none">
                    <span class="font-medium">Java Infra Map</span>
                    <span class="">v1.0.0</span>
                  </div>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Header>
      <Sidebar.Content>
        <Collapsible.Root open class="group/collapsible" disabled>
          <Sidebar.Group>
            <Sidebar.GroupLabel>
              {#snippet child({ props })}
                <Collapsible.Trigger {...props}>Layers</Collapsible.Trigger>
              {/snippet}
            </Sidebar.GroupLabel>
            <Sidebar.GroupContent>
              <Sidebar.Menu>
                <div class="m-2">
                  <Tree items={appState.tree} />
                </div>
              </Sidebar.Menu>
            </Sidebar.GroupContent>
          </Sidebar.Group>
        </Collapsible.Root>

        {#if appState.featureClicked && appState.featureClicked.properties}
          <Collapsible.Root open class="group/collapsible">
            <Sidebar.Group>
              <Sidebar.GroupLabel>
                {#snippet child({ props })}
                  <Collapsible.Trigger {...props}>
                    Selected Feature
                    <ChevronDown
                      class="ms-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                    />
                  </Collapsible.Trigger>
                {/snippet}
              </Sidebar.GroupLabel>
              <Collapsible.Content>
                <Sidebar.GroupContent class="px-10 overflow-auto max-h-[300px]">
                  <FeatureClicked />
                </Sidebar.GroupContent>
              </Collapsible.Content>
            </Sidebar.Group>
          </Collapsible.Root>
        {/if}
      </Sidebar.Content>
      <Sidebar.Footer />
    </Sidebar.Root>
    <!-- <FileExplorer {name} /> -->
    <Tools />
    <div class="flex flex-col grow relative" bind:clientWidth={mapWidth}>
      <Map />
      <!-- <div class="z-10 absolute top-0 left-0 m-4 w-1/4">
        <Panel />
      </div> -->
      <FeatureHighlight />
    </div>
  </Sidebar.Provider>
</div>
<Toaster />

<script lang="ts">
  import { onMount } from "svelte";
  import "mapbox-gl/dist/mapbox-gl.css";
  import mapboxgl from "mapbox-gl";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import { ModeWatcher } from "mode-watcher";
  import Eye from "@lucide/svelte/icons/eye";
  import EyesClosed from "@lucide/svelte/icons/eye-closed";
  import Map from "./components/Map.svelte";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { resetMode, setMode } from "mode-watcher";
  import Search from "@lucide/svelte/icons/scan-search";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  // import AppSidebar from "$lib/components/app-sidebar.svelte";
  import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
  import M from "@lucide/svelte/icons/map";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import {
    appState,
    populateData,
    populateGeojsonData,
  } from "./appState.svelte";
  import { bootStrap, traverseProject } from "./appMain.svelte";
  import Panel from "./components/Panel.svelte";
  import Tree from "./components/Tree.svelte";
  import FileExplorer from "./components/FileExplorer.svelte";
  import FeatureHighlight from "./components/FeatureHighlight.svelte";
  import ChevronDown from "@lucide/svelte/icons/chevron-down";
  import FeatureClicked from "./components/FeatureClicked.svelte";
  import Tools from "./components/Tools.svelte";
  import { Button } from "$lib/components/ui/button";
  import News from "./components/News.svelte";
  import EyeClosed from "@lucide/svelte/icons/eye-closed";

  onMount(() => {
    populateData()
      .then((f) => populateGeojsonData())
      .then((f) => {
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
                  <Drawer.Root direction="left" bind:open={appState.drawerOpen}>
                    <Drawer.Content class="overflow-auto">
                      <Drawer.Header>
                        <Drawer.Title
                          class="top-0 sticky bg-background p-2 text-center"
                          >Latest News <Sparkles
                            class="inline text-center mx-1"
                            size="1.2em"
                          />
                        </Drawer.Title>

                        <Drawer.Description class="">
                          {#if appState.activeClick}
                            <div class="text-center my-1">
                              <h2 class="text-center">
                                {appState.activeClick.displayName}
                              </h2>
                            </div>
                          {/if}
                          <div class="my-1 flex justify-center gap-2 w-full">
                            <Button
                              class="mx-1"
                              variant="outline"
                              onclick={() => {
                                if (!appState.map || !appState.bboxLive) return;
                                const [a, b, c, d] = appState.bboxLive;
                                const bbox = new mapboxgl.LngLatBounds([
                                  a,
                                  b,
                                  c,
                                  d,
                                ]);

                                appState.map.fitBounds(bbox, {
                                  padding: 10,
                                });
                              }}
                            >
                              <Search />
                            </Button>

                            <Button
                              class="mx-1"
                              variant="outline"
                              onclick={() => {
                                traverseProject(
                                  appState.tree,
                                  appState.activeClick.source,
                                  { visible: true },
                                );
                              }}
                            >
                              <Eye />
                            </Button>

                            <Button
                              class="mx-1"
                              variant="outline"
                              onclick={() => {
                                traverseProject(
                                  appState.tree,
                                  appState.activeClick.source,
                                  { visible: false },
                                );
                              }}
                            >
                              <EyeClosed />
                            </Button>
                          </div>
                          {#if appState.activeNews}
                            {@const liveNews =
                              appState.news[appState.activeNews]}
                            {#each liveNews as aNews}
                              <div class="mb-1">
                                <News {...aNews} />
                              </div>
                            {/each}
                          {/if}
                        </Drawer.Description>
                      </Drawer.Header>
                      <Drawer.Footer></Drawer.Footer>
                    </Drawer.Content>
                  </Drawer.Root>
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

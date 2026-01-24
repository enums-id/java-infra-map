<script lang="ts">
  import { onMount } from "svelte";
  import "mapbox-gl/dist/mapbox-gl.css";
  import mapboxgl from "mapbox-gl";
  import { Toaster } from "$lib/components/ui/sonner/index.js";
  import { ModeWatcher, mode } from "mode-watcher";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import ExternalLink from "@lucide/svelte/icons/external-link";

  import Eye from "@lucide/svelte/icons/eye";
  import EyeScan from "@lucide/svelte/icons/scan-eye";
  import * as HoverCard from "$lib/components/ui/hover-card/index.js";

  import SquareArrowOutUpRight from "@lucide/svelte/icons/square-arrow-out-up-right";
  import Map from "./components/Map.svelte";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import { resetMode, setMode } from "mode-watcher";
  import LayerPlus from "@lucide/svelte/icons/layers-plus";
  import Search from "@lucide/svelte/icons/scan-search";
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  // import AppSidebar from "$lib/components/app-sidebar.svelte";
  import GalleryVerticalEndIcon from "@lucide/svelte/icons/gallery-vertical-end";
  import M from "@lucide/svelte/icons/map";
  import MapMinus from "@lucide/svelte/icons/map-minus";
  import MapPlus from "@lucide/svelte/icons/map-plus";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import * as Drawer from "$lib/components/ui/drawer/index.js";
  import Sparkles from "@lucide/svelte/icons/sparkles";
  import {
    appState,
    populateData,
    populateGeojsonData,
  } from "./appState.svelte";
  import { bootStrap, switchLayers, traverseProject } from "./appMain.svelte";
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
  import { toast } from "svelte-sonner";

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

  let dialogOpen = $state(true);
  const name = "name";

  let addButtonClicked = $state(false);
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
                    <span class="text-muted-foreground text-xs"
                      >version-{__GIT_COMMIT__}</span
                    >
                  </div>
                </a>
              {/snippet}
            </Sidebar.MenuButton>
          </Sidebar.MenuItem>
        </Sidebar.Menu>
      </Sidebar.Header>
      <Sidebar.Content>
        <Sidebar.Group>
          <Sidebar.GroupLabel>About</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <p class="text-xs text-muted-foreground px-2">
              Java Infra Map is an open-source webmap of Java Island's
              infrastructure. <button
                class="text-xs underline"
                onclick={() => {
                  dialogOpen = true;
                }}>Furthermore</button
              >.
            </p>
          </Sidebar.GroupContent>
        </Sidebar.Group>
        <Sidebar.Separator />
        <Sidebar.Group>
          <Sidebar.GroupLabel>Quick Actions</Sidebar.GroupLabel>
          <Sidebar.GroupContent>
            <p class="text-xs text-muted-foreground px-2">
              Click the buttons below to do some actions on the map.
            </p>
            <div class="flex items-center justify-center">
              <HoverCard.Root>
                <HoverCard.Trigger
                  class="rounded-sm m-1 relative underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
                >
                  {#snippet child({ props })}
                    <Button
                      onclick={() => {
                        switchLayers("Project", { visible: true });
                        toast("Featured Projects:", {
                          description: "Added layers to the map",
                        });

                        addButtonClicked = true;
                      }}
                      variant="outline"
                      class="m-1 relative"
                      size="icon-sm"
                      {...props}
                    >
                      <span
                        class="absolute animate-ping rounded-full bg-sky-400 opacity-75 top-0 right-0 w-2 h-2"
                        class:hidden={addButtonClicked}
                      ></span>

                      <MapPlus /></Button
                    >
                  {/snippet}
                </HoverCard.Trigger>
                <HoverCard.Content class="w-80" side="right">
                  <div class="flex justify-between space-x-4">
                    <p class="text-sm">Adds featured projects to the map</p>
                  </div>
                </HoverCard.Content>
              </HoverCard.Root>

              <HoverCard.Root>
                <HoverCard.Trigger
                  class="rounded-sm m-1 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
                >
                  {#snippet child({ props })}
                    <Button
                      onclick={() => {
                        switchLayers("Project", { visible: false });
                        toast("Featured Projects:", {
                          description: "Removed layers from the map",
                        });
                      }}
                      variant="outline"
                      class="m-1"
                      size="icon-sm"
                      {...props}><MapMinus /></Button
                    >
                  {/snippet}
                </HoverCard.Trigger>
                <HoverCard.Content class="w-80" side="right">
                  <div class="flex justify-between space-x-4">
                    <p class="text-sm">Remove featured projects from the map</p>
                  </div>
                </HoverCard.Content>
              </HoverCard.Root>

              <HoverCard.Root>
                <HoverCard.Trigger
                  class="rounded-sm m-1 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
                >
                  {#snippet child({ props })}
                    <Button
                      onclick={() => {
                        const map = appState.map;
                        if (!map) return;
                        map.flyTo({
                          bearing: 0,
                          pitch: 0,
                          zoom: 7.5,
                        });
                      }}
                      variant="outline"
                      class="m-1"
                      size="icon-sm"
                      {...props}><EyeScan /></Button
                    >
                  {/snippet}
                </HoverCard.Trigger>
                <HoverCard.Content class="p-2 w-fit" side="right">
                  <div class="flex justify-between">
                    <p class="text-sm">Reset Zoom</p>
                  </div>
                </HoverCard.Content>
              </HoverCard.Root>
            </div>
          </Sidebar.GroupContent>
        </Sidebar.Group>
        <Sidebar.Separator />
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

        <Sidebar.Separator />

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

    <Dialog.Root bind:open={dialogOpen}>
      <Dialog.Content
        class="max-w-lg rounded-2xl bg-background/95 backdrop-blur shadow-xl"
      >
        <Dialog.Header class="space-y-3">
          <Dialog.Title class="text-xl font-semibold tracking-tight">
            About Java Infra Map
          </Dialog.Title>

          <Dialog.Description
            class="text-sm leading-relaxed text-muted-foreground"
          >
            <p>
              Java Infra Map is an open-source web map that visualises key
              infrastructure across Java Island, Indonesia. It provides
              investors, researchers, and planners with a clear spatial overview
              of transportation, energy, industrial, and strategic development
              projects.
              <br /><br />
              The platform is community-driven. Contributors can enrich the map by
              adding verified infrastructure projects through our
              <a
                href="https://github.com/enums-id/java-infra-map"
                class="inline underline"
                target="_blank"
              >
                GitHub repository</a
              >.
            </p>
            <div class="my-2">
              <h2 class="font-semibold text-lg my-2 text-foreground">
                Powered By
              </h2>
              <div class="flex gap-1 items-center">
                <a href="https://svelte.dev" target="_blank">
                  <img
                    src="/logos/svelte-logo-square.svg"
                    width="35rem"
                    alt=""
                  />
                </a>
                <a href="https://www.mapbox.com/" target="_blank">
                  <img
                    src={mode.current == "dark"
                      ? "/logos/mapbox-logo-white.svg"
                      : "/logos/mapbox-logo-black.svg"}
                    width="100rem"
                    alt=""
                  />
                </a>
              </div>
            </div>

            <div class="mt-4 flex gap-2">
              <!-- GitHub -->
              <Button
                variant="outline"
                size="icon"
                href="https://github.com/enums-id/java-infra-map"
                target="_blank"
                aria-label="GitHub Repository"
              >
                <img
                  src="https://cdn.simpleicons.org/github/94a3b8"
                  alt="GitHub"
                  class="h-4 w-4"
                />
              </Button>

              <!-- Website / LinkedIn -->
              <Button
                variant="outline"
                size="icon"
                href="https://enums.id"
                target="_blank"
                aria-label="Enums.id"
              >
                <ExternalLink />
              </Button>
            </div>
          </Dialog.Description>
        </Dialog.Header>
      </Dialog.Content>
    </Dialog.Root>
  </Sidebar.Provider>
</div>
<Toaster />
<Drawer.Root direction="left" bind:open={appState.drawerOpen}>
  <Drawer.Content class="overflow-auto">
    <Drawer.Header data-vaul-no-drag>
      <Drawer.Title
        class="top-0 sticky bg-background p-4 text-center text-xl"
        data-vaul-no-drag
      >
        {appState.activeClick.displayName}
      </Drawer.Title>

      <Drawer.Description class="" data-vaul-no-drag>
        <div
          class="my-1 flex justify-center gap-2 w-full mb-2 border-b p-2"
          data-vaul-no-drag
        >
          <Button
            class="mx-1"
            variant="outline"
            onclick={() => {
              if (!appState.map || !appState.bboxLive) return;
              const [a, b, c, d] = appState.bboxLive;
              const bbox = new mapboxgl.LngLatBounds([a, b, c, d]);

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
              traverseProject(appState.tree, appState.activeClick.source, {
                visible: true,
              });
            }}
          >
            <Eye />
          </Button>

          <Button
            class="mx-1"
            variant="outline"
            onclick={() => {
              traverseProject(appState.tree, appState.activeClick.source, {
                visible: false,
              });
            }}
          >
            <EyeClosed />
          </Button>

          {#if appState.activeUrl}
            <Button
              class="mx-1"
              variant="outline"
              href={appState.activeUrl}
              target="_blank"
            >
              <SquareArrowOutUpRight />
            </Button>
          {/if}
        </div>
        {#if appState.activeClick}
          <div class="text-center my-2 text-sm border-b p-2" data-vaul-no-drag>
            <p class="text-start" data-vaul-no-drag>
              {appState.activeClick.description}
            </p>
          </div>
          <div data-vaul-no-drag>
            <h3 class="text-center p-4 text-lg text-foreground">
              Latest News <Sparkles
                class="inline text-center mx-1"
                size="1.2em"
              />
            </h3>
          </div>
        {/if}

        {#if appState.activeNews}
          {@const liveNews = appState.news[appState.activeNews]}
          {#each liveNews as aNews}
            <News {...aNews} />
          {/each}
        {/if}
      </Drawer.Description>
    </Drawer.Header>
    <Drawer.Footer></Drawer.Footer>
  </Drawer.Content>
</Drawer.Root>

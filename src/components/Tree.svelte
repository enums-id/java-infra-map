<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

  import FileIcon from "@lucide/svelte/icons/file";
  import FolderIcon from "@lucide/svelte/icons/folder";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";
  import type { treeType } from "./types";
  import { appState } from "../appState.svelte";
  import { layers } from "../map/layers";

  const {
    items,
  }: {
    items: treeType;
  } = $props();
</script>

{#if appState.displayCheckbox}
  {#each items as item, index (index)}
    {@render Tree({ item })}
  {/each}
{/if}

{#snippet Tree({ item }: { item: treeType })}
  {@const [oName, ...items] = Array.isArray(item) ? item : [item]}
  {#if !items.length}
    <Sidebar.MenuButton
      isActive={false}
      class="data-[active=true]:bg-transparent"
      onclick={() => {}}
    >
      {#snippet child({ props })}
        <div class="flex items-center justify-between w-full">
          {#if oName.layerTarget}
            <div class="mr-2">
              {#if appState.displayCheckbox && appState.checkboxes[oName] === null}
                <Checkbox
                  bind:checked={oName.checked}
                  bind:ref={appState.checkboxes[oName]}
                  onCheckedChange={() => {
                    const visibility = oName.checked ? "visible" : "none";
                    const map = appState.map;
                    console.log($state.snapshot(appState.checkboxes));
                    if (!map) return;

                    oName.layerTarget.forEach((layerName: string) => {
                      const layersIn = layers
                        .map((f) => f.id)
                        .filter((f) => f.includes(layerName));
                      layersIn.forEach((layerName) => {
                        map.setLayoutProperty(
                          layerName,
                          "visibility",
                          visibility
                        );
                      });
                      localStorage.setItem(
                        `visibility-${layerName}`,
                        visibility
                      );
                    });

                    localStorage.setItem(
                      `checkbox-${oName.displayName}`,
                      oName.checked
                    );
                  }}
                />
              {/if}
            </div>
          {/if}
          <button
            class="w-full text-start text-sm p-1 my-1 flex items-center justify-start text-xs rounded hover:bg-background/80 hover:cursor-pointer w-full grow"
            onclick={() => console.log($state.snapshot(oName.layerTarget))}
          >
            <!-- <FileIcon class="w-4 h-4 mr-1 shrink-0" /> -->
            <div>
              {oName.displayName}
            </div>
          </button>
        </div>
      {/snippet}
      {oName.displayName}
    </Sidebar.MenuButton>
  {:else}
    <Sidebar.MenuItem>
      <Collapsible.Root
        class="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
      >
        <Collapsible.Trigger>
          {#snippet child({ props })}
            <Sidebar.MenuButton {...props} class="text-xs">
              <ChevronRightIcon className="transition-transform" />
              <FolderIcon />
              {oName.displayName}
            </Sidebar.MenuButton>
          {/snippet}
        </Collapsible.Trigger>
        <Collapsible.Content>
          <Sidebar.MenuSub>
            {#each items as subItem, index (index)}
              {@render Tree({ item: subItem })}
            {/each}
          </Sidebar.MenuSub>
        </Collapsible.Content>
      </Collapsible.Root>
    </Sidebar.MenuItem>
  {/if}
{/snippet}

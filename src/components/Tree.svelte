<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

  import FileIcon from "@lucide/svelte/icons/file";
  import FolderIcon from "@lucide/svelte/icons/folder";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";
  import type { treeType } from "./types";

  const {
    items,
  }: {
    items: treeType;
  } = $props();
</script>

{#each items as item, index (index)}
  {@render Tree({ item })}
{/each}

{#snippet Tree({ item }: { item: treeType })}
  {@const [oName, ...items] = Array.isArray(item) ? item : [item]}
  {#if !items.length}
    <Sidebar.MenuButton
      isActive={false}
      class="data-[active=true]:bg-transparent"
      onclick={() => {}}
    >
      {#snippet child({ props })}
        <div class="flex items-center">
          {#if oName.layerTarget}
            <div class="mr-2">
              <Checkbox bind:checked={oName.checked} />
            </div>
          {/if}
          <button
            class="w-full text-start text-sm p-1 my-1 flex items-center justify-start text-xs rounded hover:bg-background/80 hover:cursor-pointer"
          >
            <FileIcon class="w-4 h-4 mr-1 shrink-0" />
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

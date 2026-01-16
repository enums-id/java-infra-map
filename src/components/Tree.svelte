<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar/index.js";
  import * as Collapsible from "$lib/components/ui/collapsible/index.js";
  import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";

  import FileIcon from "@lucide/svelte/icons/file";
  import FolderIcon from "@lucide/svelte/icons/folder";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";

  const { items }: { items: string | any[] } = $props();
</script>

{#each items as item, index (index)}
  {@render Tree({ item })}
{/each}

{#snippet Tree({ item }: { item: string | any[] })}
  {@const [name, ...items] = Array.isArray(item) ? item : [item]}
  {#if !items.length}
    <Sidebar.MenuButton
      isActive={false}
      class="data-[active=true]:bg-transparent"
      onclick={() => {}}
    >
      {#snippet child({ props })}
        <div class="flex items-center">
          <div class="mr-2">
            <Checkbox />
          </div>
          <button
            class="w-full text-start text-sm p-1 my-1 flex items-center justify-start rounded hover:bg-background/80 hover:cursor-pointer"
          >
            <FileIcon class="w-[1.2em] mr-1" />
            <Label for="pelabuhan-{name}">{name}</Label>
          </button>
        </div>
      {/snippet}
      {name}
    </Sidebar.MenuButton>
  {:else}
    <Sidebar.MenuItem>
      <Collapsible.Root
        class="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        open={name === "lib" || name === "components"}
      >
        <Collapsible.Trigger>
          {#snippet child({ props })}
            <Sidebar.MenuButton {...props}>
              <ChevronRightIcon className="transition-transform" />
              <FolderIcon />
              {name}
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

<script lang="ts">
  import * as Sidebar from "$lib/components/ui/sidebar";
  import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import M from "@lucide/svelte/icons/map";
  import { switchLayers } from "../appMain.svelte";
</script>

<div class="p-2">
  <Sidebar.Trigger />
  <div>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {#snippet child({ props })}
          <Button
            variant="outline"
            size="icon"
            class="h-[2rem] w-[2rem]"
            {...props}
          >
            <M />
          </Button>
        {/snippet}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content class="w-56" align="start" side="right">
        <DropdownMenu.Label>Switch Layers</DropdownMenu.Label>
        <DropdownMenu.Group>
          {#each ["Power", "Land Use", "Port", "Road", "Airports", "Train"] as elem}
            <DropdownMenu.Item
              onSelect={() => {
                const e = elem as
                  | "Power"
                  | "Land Use"
                  | "Port"
                  | "Road"
                  | "Airports"
                  | "Train";
                switchLayers(e);
              }}
            >
              {elem}</DropdownMenu.Item
            >
          {/each}
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</div>

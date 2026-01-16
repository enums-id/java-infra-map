<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import Button from "$lib/components/ui/button/button.svelte";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";
  import { appState } from "../appState.svelte";

  function layerStateFunction(layername: string, prefix = "") {
    return () => {
      if (!appState.map) return;
      appState.map.setLayoutProperty(
        prefix + layername,
        "visibility",
        appState.layerState[layername] ? "visible" : "none"
      );
    };
  }
</script>

<div
  class="max-w-120 w-100 h-fit max-h-100 overflow-auto rounded text-sm p-1 px-5 bg-background"
>
  <Accordion.Root type="single" class="w-full" value="item-1 bg-background">
    <Accordion.Item value="item-1" class="">
      <Accordion.Trigger>Ship Ports</Accordion.Trigger>
      <Accordion.Content class="flex flex-col gap-4 text-balance">
        {#each ["Pelabuhan Utama", "Pelabuhan Pengumpan Regional", "Pelabuhan Pengumpan"] as l, i}
          <div class="flex items-center gap-3">
            <Checkbox
              bind:checked={appState.layerState[l]}
              id="pelabuhan-{l}"
              onCheckedChange={layerStateFunction(l)}
            />
            <Label for="pelabuhan-{l}">{l}</Label>
          </div>
        {/each}
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.Trigger>Power Network</Accordion.Trigger>
      <Accordion.Content class="flex flex-col gap-4 text-balance">
        {#each [20, 30, 70, 150, 275, 500] as voltage, i}
          <div class="flex items-center gap-3">
            <Checkbox
              bind:checked={appState.layerState[voltage]}
              id="esdm-jaringan-{voltage}"
              onCheckedChange={layerStateFunction(
                `${voltage}`,
                "jaringan-listrik-"
              )}
            />
            <Label for="esdm-jaringan-{voltage}">{voltage} kV</Label>
          </div>
        {/each}
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-3">
      <Accordion.Trigger>Return Policy</Accordion.Trigger>
      <Accordion.Content class="flex flex-col gap-4 text-balance">
        <p>
          We stand behind our products with a comprehensive 30-day return
          policy. If you&apos;re not completely satisfied, simply return the
          item in its original condition.
        </p>
        <p>
          Our hassle-free return process includes free return shipping and full
          refunds processed within 48 hours of receiving the returned item.
        </p>
      </Accordion.Content>
    </Accordion.Item>
  </Accordion.Root>
</div>

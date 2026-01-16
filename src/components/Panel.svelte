<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index.js";
  import { Checkbox } from "$lib/components/ui/checkbox";
  import { Label } from "$lib/components/ui/label";
  import { appState } from "../appState.svelte";

  const layerState: Record<string, boolean> = $state({
    "Pelabuhan Utama": true,
    "Pelabuhan Pengumpan Regional": true,
    "Pelabuhan Pengumpan": true,
  });
  function layerStateFunction(layername: string) {
    return () => {
      console.log(layerState[layername]);

      if (!appState.map) return;

      appState.map.setLayoutProperty(
        layername,
        "visibility",
        layerState[layername] ? "visible" : "none"
      );
    };
  }
</script>

<div
  class="max-w-120 w-100 h-fit max-h-100 overflow-auto rounded text-sm p-1 px-5 bg-background"
>
  <Accordion.Root type="single" class="w-full" value="item-1 bg-background">
    <Accordion.Item value="item-1" class="">
      <Accordion.Trigger>Pelabuhan</Accordion.Trigger>
      <Accordion.Content class="flex flex-col gap-4 text-balance">
        {#each ["Pelabuhan Utama", "Pelabuhan Pengumpan Regional", "Pelabuhan Pengumpan"] as l, i}
          <div class="flex items-center gap-3">
            <Checkbox
              bind:checked={layerState[l]}
              id="pelabuhan-{l}"
              onCheckedChange={layerStateFunction(l)}
            />
            <Label for="pelabuhan-{l}">{l}</Label>
          </div>
        {/each}
      </Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="item-2">
      <Accordion.Trigger>Shipping Details</Accordion.Trigger>
      <Accordion.Content class="flex flex-col gap-4 text-balance">
        <p>
          We offer worldwide shipping through trusted courier partners. Standard
          delivery takes 3-5 business days, while express shipping ensures
          delivery within 1-2 business days.
        </p>
        <p>
          All orders are carefully packaged and fully insured. Track your
          shipment in real-time through our dedicated tracking portal.
        </p>
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

<script>
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import { Label } from "$lib/components/ui/label";
  import { appState } from "../appState.svelte";
  import Theme from "./Theme.svelte";
</script>

<div class="text-xs flex justify-between py-1 items-center">
  <div class="px-4">
    <span
      >{appState.mapzoom[0].toFixed(2)}, {appState.mapzoom[0].toFixed(8)}, {appState.mapzoom[0].toFixed(
        8
      )}</span
    >
  </div>
  <div class="flex gap-1 items-center">
    <div class="mx-2 border rounded p-2 border-accent">
      <Label for="highlight">
        <Checkbox id="highlight" bind:checked={appState.highlightFeature} />
        Highlight
      </Label>
    </div>
    <Theme />
  </div>
</div>

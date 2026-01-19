<script>
  import { appState } from "../appState.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
</script>

{#if appState.featureHighlight && appState.featureHighlight.properties && appState.highlightFeature}
  {@const properties = appState.featureHighlight.properties}
  <!-- <div>
    {JSON.stringify(properties)}
  </div> -->
  <div
    class="top-10 absolute right-10 z-10 bg-background p-2 rounded border text-xs max-w-100 max-h-[40vh] overflow-auto"
  >
    <Table.Root class="overflow-hide">
      <Table.Header>
        <Table.Row>
          <Table.Head class="max-w-[200px] w-[200px]">Property</Table.Head>
          <Table.Head class="text-end"></Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <!-- {#if Object.keys(properties).includes("sources")}
          {#each Object.entries(JSON.parse(properties.sources)) as [key, value], i}
            <Table.Row>
              <Table.Cell
                class="font-medium max-w-[200px] w-[200px] overflow-auto"
                >{key}</Table.Cell
              >
              <Table.Cell class="text-end max-w-[200px] w-[200px] overflow-auto"
                >{value}</Table.Cell
              >
            </Table.Row>
          {/each}
        {:else} -->
        {#each Object.entries(properties) as [key, value], i}
          {#if value && key !== "sources" && key !== "source_tags" && !key.includes("bbox")}
            <Table.Row>
              <Table.Cell
                class="font-medium max-w-[200px] w-[200px] overflow-auto"
                >{key}</Table.Cell
              >
              <Table.Cell class="text-end max-w-[200px] w-[200px] overflow-auto"
                >{value}</Table.Cell
              >
            </Table.Row>
          {/if}
        {/each}
        {#if "source_tags" in properties}
          {#each Object.entries(JSON.parse(properties.source_tags)) as [key, value], i}
            <Table.Row>
              <Table.Cell
                class="font-medium max-w-[200px] w-[200px] overflow-auto"
                >{key}</Table.Cell
              >
              <Table.Cell class="text-end max-w-[200px] w-[200px] overflow-auto"
                >{value}</Table.Cell
              >
            </Table.Row>
          {/each}
        {/if}
        <!-- {/if} -->
      </Table.Body>
    </Table.Root>
  </div>
{/if}

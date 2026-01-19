<script>
  import { appState } from "../appState.svelte";
  import * as Table from "$lib/components/ui/table/index.js";
</script>

{#if appState.featureClicked && appState.featureClicked.properties}
  {@const properties = appState.featureClicked.properties}
  <div class="border rounded p-2">
    <Table.Root class="overflow-hide">
      <Table.Header>
        <Table.Row>
          <Table.Head class="">Property</Table.Head>
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

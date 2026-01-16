<script lang="ts">
  import { appState } from "../appState.svelte";

  const { name } = $props();
</script>

<div class="max-w-60">
  {name}
</div>

<script>
  import * as Sidebar from "$lib/components/ui/sidebar";
  import ArrowUpIcon from "@lucide/svelte/icons/arrow-up";
  import { Button } from "$lib/components/ui/button/index.js";
</script>

<div class="p-2">
  <Sidebar.Trigger />
  <div>
    <Button variant="outline" size="icon" class="h-[2rem] w-[2rem]">
      <ArrowUpIcon />
    </Button>
  </div>
</div>

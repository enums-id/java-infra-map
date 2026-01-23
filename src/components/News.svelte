<script lang="ts">
  import { setContext } from "svelte";

  const {
    newsTitle,
    datePublished,
    summary,
    link,
  }: {
    newsTitle: string;
    datePublished: string;
    summary: string;
    link: string;
  } = $props();

  // Convert string → number
  // svelte-ignore state_referenced_locally
  const timestamp = Number(datePublished);

  // Unix timestamps may be in seconds or milliseconds
  const date =
    timestamp < 1e12
      ? new Date(timestamp * 1000) // seconds → ms
      : new Date(timestamp); // already ms

  const formattedDate = date.toLocaleString();
</script>

<article
  data-vaul-no-drag
  class="flex flex-col gap-3 rounded-xl border bg-card p-5 text-card-foreground shadow-sm transition hover:shadow-md"
>
  <!-- Header -->
  <header class="flex flex-col gap-1">
    <h3 class="line-clamp-2 text-lg font-semibold leading-tight">
      {newsTitle}
    </h3>

    <time class="text-sm text-muted-foreground" datetime={date.toISOString()}>
      {formattedDate}
    </time>
  </header>

  <!-- Summary -->
  <p class=" text-sm text-muted-foreground overflow-auto">
    {summary}
  </p>

  <!-- Footer -->
  <footer class="mt-auto pt-2">
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center text-sm font-medium text-primary hover:underline"
    >
      Read more →
    </a>
  </footer>
</article>

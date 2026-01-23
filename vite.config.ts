import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

import { execSync } from "node:child_process";
const commitHash = execSync("git rev-parse --short HEAD").toString().trim();

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte(), tailwindcss()],
  resolve: {
    alias: {
      $lib: path.resolve("./src/lib"),
    },
  },
  define: {
    __GIT_COMMIT__: JSON.stringify(commitHash),
  },
});

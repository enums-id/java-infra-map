import type { Checkbox } from "$lib/components/ui/checkbox";
import type { Component } from "svelte";

export type treeType =
  | {
      displayName: string;
      isLayer?: boolean;
      layerTarget?: string[];
      checked: boolean;
      checkbox: Component | null;
      category?: "Power" | "Land Use" | "Port" | "Road" | "Airport" | "Train";
    }[]
  | any[];

import type { treeType } from "./components/types";
import { layers } from "./map/layers";

export const treeInit: treeType[] = [
  [
    { displayName: "Infrastructure" },
    [
      { displayName: "power", checked: true },
      [
        {
          displayName: "Powerline",
        },

        ...layers
          .filter((f) => f.id.includes("jaringan-listrik"))
          .map((f) => {
            const displayName =
              f.id
                .split("-")
                .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
                .join(" ") + "kV";
            return {
              displayName,
              layerTarget: [f.id],
              checked:
                localStorage.getItem(`checkbox-${displayName}`) !== "false",
            };
          }),
      ],
      [
        {
          displayName: "Substation",
        },

        ...layers
          .filter((f) => f.id.includes("substation-"))
          .map((f) => {
            return {
              displayName: f.id
                .split("-")
                .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
                .join(" "),
              layerTarget: [f.id],
              checked: localStorage.getItem(`checkbox-${f.id}`) !== "false",
            };
          }),
      ],
      [{ displayName: "generator", layerTarget: [], checked: true }],
    ],
    [
      {
        displayName: "industry",
        layerTarget: ["industry"],
        checked: localStorage.getItem(`checkbox-industry`) !== "false",
      },
    ],
    { displayName: "port", checked: true },
  ],
  [{ displayName: "Projects" }, { displayName: "Projects" }],
];

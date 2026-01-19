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
            const displayName = f.id
              .split("-")
              .map((str) => str.charAt(0).toUpperCase() + str.slice(1))
              .join(" ");
            return {
              displayName: displayName,
              layerTarget: [f.id],
              checked:
                localStorage.getItem(`checkbox-${displayName}`) !== "false",
            };
          }),
      ],
      [
        { displayName: "generator", layerTarget: [], checked: true },
        { displayName: "generator", layerTarget: ["generator"], checked: true },
      ],
    ],
    [
      { displayName: "Land Use" },
      {
        displayName: "industry",
        layerTarget: ["industry"],
        checked: localStorage.getItem(`checkbox-industry`) !== "false",
      },
    ],
    [
      { displayName: "Port (Shipping)", checked: true },
      ...layers
        .filter((f) => f.id.toLowerCase().includes("pelabuhan"))
        .map((f) => {
          return {
            displayName: f.id,
            layerTarget: [f.id],
            checked: localStorage.getItem(`checkbox-${f.id}`) !== "false",
          };
        }),
    ],
    [
      { displayName: "Road" },

      ...["motorway", "trunk", "primary"].map((d) => {
        const fdisplay = {
          displayName: d,
          layerTarget: [`roads-${d}`],
          checked: true,
        };

        return fdisplay;
      }),
    ],
  ],
];

import { appState } from "./appState.svelte";
import type { treeType } from "./components/types";
import { layers } from "./map/layers";

export const treeInit: treeType[] = [
  [
    { displayName: "Infrastructure" },
    [
      { displayName: "Power", checked: true },
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
              category: "Power",
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
              category: "Power",
            };
          }),
      ],
      [
        { displayName: "generator", layerTarget: [], checked: true },
        {
          displayName: "generator",
          layerTarget: ["generator"],
          checked: localStorage.getItem(`checkbox-generator`) !== "false",
          category: "Power",
        },
      ],
    ],
    [
      { displayName: "Land Use" },
      {
        displayName: "industry",
        layerTarget: ["industry"],
        checked: localStorage.getItem(`checkbox-industry`) !== "false",
        category: "Land Use",
      },
    ],
    [
      { displayName: "Port", checked: true },
      ...layers
        .filter(
          (f) => f.id.toLowerCase().includes("pelabuhan") && !/-\d+$/.test(f.id)
        )
        .map((f) => {
          return {
            displayName: f.id,
            layerTarget: [f.id],
            checked: localStorage.getItem(`checkbox-${f.id}`) !== "false",
            category: "Port",
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
          category: "Road",
        };

        return fdisplay;
      }),
    ],
    [
      { displayName: "Airport" },
      ...layers
        .filter(
          (f) => f.id.toLowerCase().includes("airports") && !/-\d+$/.test(f.id)
        )
        .map((f) => {
          return {
            displayName: f.id,
            layerTarget: [f.id],
            checked: localStorage.getItem(`checkbox-${f.id}`) !== "false",
            category: "Airport",
          };
        }),
    ],
    [
      { displayName: "Train" },
      {
        displayName: "Railway",
        layerTarget: [`rails`],
        checked: true,
        category: "Train",
      },
      {
        displayName: "Stations",
        layerTarget: [`stations`],
        checked: true,
        category: "Train",
      },
    ],
  ],
].map((f) => {
  return populateWithCheckbox(f);
});

function populateWithCheckbox(tree: treeType) {
  let treturn: treeType[] = [];
  for (const elem of tree) {
    const holder: treeType[] = [];

    const isObject =
      typeof elem === "object" && elem !== null && !Array.isArray(elem);

    if (Array.isArray(elem)) {
      const t = populateWithCheckbox(elem);
      holder.push(t);
    }
    if (isObject) {
      const retval = { ...elem, checkbox: null };
      holder.push(retval);

      appState.checkboxes[elem.displayName] = null;
    }

    treturn = [...treturn, ...holder];
  }
  return treturn;
}

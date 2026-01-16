export type treeType =
  | {
      displayName: string;
      isLayer?: boolean;
      layerTarget?: string;
      checked: boolean;
    }[]
  | any[];

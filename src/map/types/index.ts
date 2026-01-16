import type {
  CustomLayerInterface,
  LayerSpecification,
  SourceSpecification,
} from "mapbox-gl";

type AnyLayerSource = {
  source?: LayerSpecification["source"] | SourceSpecification;
};

export type AnyLayer =
  | (Omit<LayerSpecification, "source"> & AnyLayerSource)
  | CustomLayerInterface;

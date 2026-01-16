import type {
  CustomLayerInterface,
  LayerSpecification,
  MapEventOf,
  MapEventType,
  SourceSpecification,
} from "mapbox-gl";

type AnyLayerSource = {
  source?: LayerSpecification["source"] | SourceSpecification;
};

export type AnyLayer =
  | (Omit<LayerSpecification, "source"> & AnyLayerSource)
  | CustomLayerInterface;

export type Listener$1<T extends MapEventType> = (event: MapEventOf<T>) => void;

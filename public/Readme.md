# Registering the GeoJSON Data to the Map

1. Paste in the `.geojson` file in `./data` folder. Must be `FeatureCollection<Geometry>`.
2. edit `catalog.json`. This is to register the `.geojson` data that is just pasted.
3. Add in the `.geojson` by appending a record to the `catalog.json` array. Match the `"name"` with the `.geojson`'s name

The format of the `catalog` is like the following:

```typescript
type catalog = {
  name: string;
  url: string;
  displayName: string;
  description: string;
  category: string;
  prompt: string[];
  layers: {
    type: string; // mapboxgl layer types
    filter?: mapboxgl.FilterSpecification;
    paint?: mapboxgl.PaintSpecification;
    layout?: mapboxgl.LayoutSpecification;
  }[];
};
```

An example is like the following, for `./data/kcic.geojson`:

```json
[
    ...
  {
    "name": "kcic.geojson",
    "url": "https://kcic.co.id/",
    "displayName": "High Speed Rail Jakarta-Bandung",
    "description": "KCIC (Kereta Cepat Indonesia China) is the company responsible for developing and operating Indonesia's first high-speed railway, connecting Jakarta and Bandung. Established as a joint venture between Indonesian and Chinese state-owned enterprises, KCIC represents a major milestone in Indonesia's modern transportation infrastructure.",
    "category": "Rail",
    "prompt": ["whoosh", "kcic", "kereta cepat indonesia china"],
    "layers": [
      {
        "type": "line",
        "paint": {
          "line-color": "#000000",
          "line-width": 5
        }
      },
      {
        "type": "line",
        "paint": {
          "line-color": "#ffffff",
          "line-width": 3
        }
      }
    ]
  },
  ...
]
```

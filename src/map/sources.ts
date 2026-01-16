export const sources: Record<string, mapboxgl.SourceSpecification> = {
  industry: {
    type: "vector",
    tiles: [
      `${import.meta.env.VITE_PROTOCOL}://${
        import.meta.env.VITE_HOST
      }/xyz/industry/{z}/{x}/{y}.pbf`,
    ],
  },
  pelabuhan: {
    type: "vector",
    tiles: [
      `${import.meta.env.VITE_PROTOCOL}://${
        import.meta.env.VITE_HOST
      }/xyz/pelabuhan_xyz/{z}/{x}/{y}.pbf`,
    ],
  },
  "jaringan-listrik": {
    type: "vector",
    tiles: [
      `${import.meta.env.VITE_PROTOCOL}://${
        import.meta.env.VITE_HOST
      }/xyz/listrik/jaringan/{z}/{x}/{y}.pbf`,
    ],
  },
};

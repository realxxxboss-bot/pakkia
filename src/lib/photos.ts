/* Curated, royalty-free photography (Unsplash). One source, one treatment,
   so imagery stays consistent across the site: calm Nordic nature, campsites,
   lakes and forest light. URLs are hot-linked and optimised via next/image
   (see remotePatterns in next.config.ts). */

const base = (id: string, w = 1400) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PHOTOS = {
  // Tents at a lakeside campsite at dusk
  campLake: base("1504280390367-361c6d9f38f4"),
  // Sunlight through a Finnish forest
  forestLight: base("1441974231531-c6227db76b6e"),
  // Calm lake reflecting forested hills
  lakeMirror: base("1501785888041-af3ef285b470"),
  // Mist over a green forested valley
  valleyMist: base("1470071459604-3b5ec3a7fe05"),
  // Mountain landscape under soft northern light
  northernLight: base("1469474968028-56623f02e42e"),
  // Rolling green wilderness
  greenWild: base("1426604966848-d7adac402bff"),
} as const;

export type PhotoKey = keyof typeof PHOTOS;

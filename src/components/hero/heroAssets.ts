const HERO_BASE = "/images/hero-1/";
const HERO_EXT = ".png";

export const heroAssets = {
  bgSky: `${HERO_BASE}bg-sky${HERO_EXT}`,
  bgSkyMobile: `${HERO_BASE}bg-sky-mobile${HERO_EXT}`,
  roadMobile: `${HERO_BASE}road-mobile${HERO_EXT}`,
  road: `${HERO_BASE}road${HERO_EXT}`,
  fxDust: `${HERO_BASE}fx-dust${HERO_EXT}`,
  fxGlow: `${HERO_BASE}fx-glow${HERO_EXT}`,
  fxStreaks: `${HERO_BASE}fx-streaks${HERO_EXT}`,
  fgGrass: `${HERO_BASE}fg-grass${HERO_EXT}`,
  truckMan: `${HERO_BASE}truck-man${HERO_EXT}`,
  truckScania: `${HERO_BASE}truck-scania${HERO_EXT}`,
  truckFaw: `${HERO_BASE}truck-faw${HERO_EXT}`,

} as const;

export const heroMobileAssets = {
  bgSky: heroAssets.bgSkyMobile,
  road: heroAssets.roadMobile,
  fxGlow: heroAssets.fxGlow,
  truckMan: heroAssets.truckMan,
} as const;

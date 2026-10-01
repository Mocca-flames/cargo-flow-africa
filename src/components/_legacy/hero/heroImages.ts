export type HeroImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

export const heroImages = {
  trucksDesktop: {
    src: "/images/hero/a-trucks-desktop.png",
    width: 1536,
    height: 1024,
    alt: "MAN, Scania and FAW truck heads parked side by side",
  },
  manMobile: {
    src: "/images/hero/a-man-mobile.png",
    width: 758,
    height: 1024,
    alt: "MAN truck cab",
  },
  lowbedDesktop: {
    src: "/images/hero/b-lowbed-desktop.png",
    width: 2172,
    height: 514,
    alt: "Lowbed trailer with gooseneck",
  },
  lowbedMobile: {
    src: "/images/hero/b-lowbed-mobile.png",
    width: 605,
    height: 514,
    alt: "Gooseneck and front deck of a lowbed trailer",
  },
  triDesktop: {
    src: "/images/hero/c-tri-desktop.png",
    width: 2048,
    height: 482,
    alt: "Tri-axle flatbed trailer",
  },
  wheelsMobile: {
    src: "/images/hero/c-wheels-mobile.png",
    width: 968,
    height: 482,
    alt: "Wheels of a tri-axle flatbed trailer",
  },
} as const satisfies Record<string, HeroImage>;

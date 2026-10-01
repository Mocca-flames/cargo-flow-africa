import type { HeroImage } from "./heroImages";

type HeroTileProps = {
  variant: "a" | "b" | "c";
  image: HeroImage;
  /** Sweep is masked to the image alpha; only used where the brief asks for it. */
  sweep?: boolean;
  road?: boolean;
  glow?: boolean;
  caption?: string;
};

export default function HeroTile({
  variant,
  image,
  sweep = false,
  road = false,
  glow = false,
  caption,
}: HeroTileProps) {
  const maskStyle = {
    WebkitMaskImage: `url(${image.src})`,
    maskImage: `url(${image.src})`,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
  } as const;

  return (
    <div className={`hero-tile hero-tile--${variant}`}>
      <div className="hero-tile__plate" aria-hidden="true" />
      {road ? <div className="hero-tile__road" aria-hidden="true" /> : null}
      {caption ? <p className="hero-tile__sub">{caption}</p> : null}
      <div className="hero-tile__imgwrap">
        <img
          className="hero-tile__img"
          src={image.src}
          alt={image.alt}
          width={image.width}
          height={image.height}
          loading="eager"
          decoding="async"
          draggable={false}
        />
        {glow ? (
          <>
            <span className="hero-tile__glow hero-tile__glow--l" aria-hidden="true" />
            <span className="hero-tile__glow hero-tile__glow--r" aria-hidden="true" />
          </>
        ) : null}
        {sweep ? <span className="hero-tile__sweep" style={maskStyle} aria-hidden="true" /> : null}
      </div>
      <span className="hero-tile__shadow" aria-hidden="true" />
    </div>
  );
}

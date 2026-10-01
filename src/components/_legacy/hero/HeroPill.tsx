type HeroPillProps = {
  label: string;
  dot: "green" | "amber";
};

export default function HeroPill({ label, dot }: HeroPillProps) {
  return (
    <p className={`hero-pill hero-pill--${dot}`}>
      <span className="hero-pill__dot" aria-hidden="true" />
      <span className="hero-pill__text">{label}</span>
    </p>
  );
}

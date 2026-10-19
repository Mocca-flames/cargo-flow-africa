"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import EngineRig from "./EngineRig";
import { engineAssets, type EngineStat } from "./engineAssets";

const COUNT_MS = 480;

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function useCountUp(target: number, run: boolean, decimals: number) {
  const [value, setValue] = useState(() => (run ? 0 : target));

  useEffect(() => {
    if (!run) return;

    /* Every write happens inside the frame callback, so the effect body
       stays free of synchronous state updates. Reduced motion collapses
       the same loop to a single frame instead of a separate branch. */
    const instant = reducedMotion();
    const start = performance.now();
    let raf = 0;

    const step = (now: number) => {
      const t = instant ? 1 : Math.min(1, (now - start) / COUNT_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run]);

  return value.toFixed(decimals);
}

function EngineStat({
  stat,
  run,
}: {
  stat: EngineStat;
  run: boolean;
}) {
  const display = useCountUp(stat.value, run, stat.decimals);
  return (
    <div className="engine__stat">
      <span className="engine__stat-label">{stat.label}</span>
      <span className="engine__stat-value">
        {display}
        <span className="engine__stat-unit">{stat.unit}</span>
      </span>
    </div>
  );
}

export default function EngineShowcase({ variant }: { variant: "desktop" | "mobile" }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);
  const [loaded, setLoaded] = useState<ReadonlySet<string>>(() => new Set());
  const baseId = useId().replace(/[^\w-]/g, "");

  const asset = engineAssets[active];

  /* Mobile readout is trimmed to a single payload figure plus the
     "Top cargo" line — deck/loading dims already live on the rig, and
     axle config is redundant next to the truck drawing. */
  const mobile = variant === "mobile";
  const displayStats = mobile
    ? asset.stats.filter((stat) => stat.label === "Payload")
    : asset.stats;
  const displayMeta = mobile
    ? asset.meta
        .filter((row) => row.label !== "Axle config")
        .map((row) =>
          row.label === "Typical commodity" ? { ...row, label: "Top cargo" } : row
        )
    : asset.meta;

  const markLoaded = useCallback((id: string) => {
    setLoaded((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  /* Belt and braces for the skeleton: React fires onLoad for images that
     finish after mount, but an image served from cache can be complete
     before the handler attaches. Sweep once on mount (and whenever a new
     photo node shows up) so `.engine__photo-ph` can never outlive the
     bytes it is waiting for. */
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    wrap.querySelectorAll("img").forEach((img) => {
      const id = img.getAttribute("data-engine-photo");
      if (id && img.complete && img.naturalWidth > 0) markLoaded(id);
    });
  }, [markLoaded]);

  const select = useCallback((next: number) => {
    setActive(next);
    tabRefs.current[next]?.focus();
  }, []);

  const onTabKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
      const last = engineAssets.length - 1;
      let next = -1;

      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        next = index === last ? 0 : index + 1;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        next = index === 0 ? last : index - 1;
      } else if (event.key === "Home") {
        next = 0;
      } else if (event.key === "End") {
        next = last;
      } else {
        return;
      }

      event.preventDefault();
      select(next);
    },
    [select]
  );

  /* Reveal on approach. The fallback keeps the section readable if
     IntersectionObserver never reports, so content can never strand. */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const show = () => setEntered(true);
    const fallback = window.setTimeout(show, 1500);

    if (typeof IntersectionObserver === "undefined") {
      show();
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          show();
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  /* Fleet-tag deep links from Ch4's cards (`#fleet-<id>`). No element
     carries that id — this listener maps the hash to a class and
     scrolls to the section itself, so the browser's native anchor
     scroll never races us. `hashchange` does NOT fire on initial page
     load, hence the mount-time call. The hash is cleared after each
     application so tapping the same tag twice fires again. Invalid
     ids fall back silently to the current state; an already-active
     class skips the state write but still serves the navigation. */
  useEffect(() => {
    const apply = () => {
      const hash = window.location.hash;
      if (!hash.startsWith("#fleet-")) return;
      const id = hash.slice("#fleet-".length);
      const index = engineAssets.findIndex((item) => item.id === id);
      if (index === -1) return;
      setActive((current) => (current === index ? current : index));
      sectionRef.current?.scrollIntoView({
        behavior: reducedMotion() ? "auto" : "smooth",
        block: "start",
      });
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    };

    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  const panelId = `${baseId}-panel`;

  /* Re-keys once when the section arrives so the readout's slide and its
     count-up play on arrival too, then again on every tab switch. */
  const panelKey = `${asset.id}${entered ? "-in" : ""}`;

  const activeLoaded = loaded.has(asset.id);

  return (
    <section
      id="engine-section"
      ref={sectionRef}
      className={`engine engine--${variant}${entered ? " engine--entered" : ""}`}
      aria-label="The Engine"
    >
      <div className="engine__layout">
        {/* ── Visual: stacked photos, crossfade on selection ── */}
        <div className="engine__frame">
          <span className="engine__frame-code" aria-hidden="true">
            {asset.code}
          </span>
          <div className="engine__rig-wrap" ref={wrapRef}>
            {/* Every photo stays mounted so the next truck is already
               decoded when the tab changes — the swap is a pure CSS
               crossfade, never a decode wait. The placeholder only backs
               the active photo until its own bytes arrive. */}
            {engineAssets.map((item, index) => {
              const isActive = index === active;
              return (
                <Image
                  key={item.id}
                  src={item.image}
                  alt={isActive ? `${item.name} trailer, side view` : ""}
                  fill
                  sizes="(max-width: 767px) 100vw, 60vw"
                  className={`engine__photo${isActive ? " engine__photo--active" : ""}`}
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={isActive ? "high" : "auto"}
                  aria-hidden={!isActive}
                  decoding="async"
                  data-engine-photo={item.id}
                  onLoad={() => markLoaded(item.id)}
                />
              );
            })}
            {!activeLoaded && <span className="engine__photo-ph" aria-hidden="true" />}
          </div>
          <span className="engine__frame-index" aria-hidden="true">
            {String(active + 1).padStart(2, "0")} / {String(engineAssets.length).padStart(2, "0")}
          </span>
          <span className="engine__frame-caption" aria-hidden="true">
            {asset.name} · side view
          </span>
        </div>

        {/* ── Thumb-rail: the left-anchored switcher ── */}
        <div className="engine__rail-wrap">
          <p className="engine__rail-label">Select class</p>
          <div className="engine__rail" role="tablist" aria-label="Fleet classes">
            {engineAssets.map((item, index) => {
              const selected = index === active;
              return (
                <button
                  key={item.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`${baseId}-tab-${item.id}`}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  className="engine__card"
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                >
                  <span className="engine__thumb">
                    <EngineRig asset={item} detail="compact" />
                  </span>
                  <span className="engine__card-meta">
                    <span className="engine__card-code">{item.code}</span>
                    <span className="engine__card-name">{item.name}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Spec readout: mono values, counted up on change ── */}
        <div
          className="engine__spec"
          id={panelId}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${asset.id}`}
          tabIndex={-1}
        >
          <div className="engine__spec-inner" key={panelKey}>
            <p className="engine__summary">{asset.summary}</p>
            <div className="engine__spec-stats">
              {displayStats.map((stat) => (
                <EngineStat key={stat.label} stat={stat} run={entered} />
              ))}
            </div>
            <dl className="engine__spec-meta">
              {displayMeta.map((row) => (
                <div className="engine__spec-row" key={row.label}>
                  <dt className="engine__spec-label">{row.label}</dt>
                  <dd className="engine__spec-value">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        {/* ── Quiet secondary link, not a button ── */}
        <a className="engine__fleet-link" href="/fleet">
          <span className="engine__fleet-link-rule" aria-hidden="true" />
          See the full fleet
        </a>
      </div>
    </section>
  );
}

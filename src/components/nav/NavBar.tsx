"use client";

import { useEffect, useState } from "react";
import "./NavBar.css";

const LINKS = [
  { label: "Services", href: "#services" },
  { label: "Fleet", href: "#engine-section" },
  { label: "Corridor", href: "#corridor-section" },
  { label: "Portfolio", href: "#portfolio-section" },
];

/* Sections known to be dark (Deep Forest / night) — nav switches to light-on-dark glass there. */
const KNOWN_DARK = new Set([
  "hero",
  "coverage-section",
  "corridor-section",
  "site-footer",
]);

function luminance(r: number, g: number, b: number) {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function sectionIsDark(el: Element): boolean {
  if (el.id && KNOWN_DARK.has(el.id)) return true;
  if (el.classList.contains("corridor") || el.classList.contains("cov2"))
    return true;
  if (el.closest(".corridor") && el.tagName === "SECTION") return true;
  const bg = getComputedStyle(el).backgroundColor;
  const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return false;
  // transparent → let page bg decide (canvas = light)
  if (bg.startsWith("rgba") && parseFloat(bg.split(",")[3]) < 0.15) return false;
  return luminance(+m[1], +m[2], +m[3]) < 0.32;
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<string>("");
  const [theme, setTheme] = useState<"light" | "dark">("dark"); // hero first = dark

  /* Scrolled state + hide on scroll down / reveal on scroll up (CSS limits hiding to mobile). */
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      const delta = y - lastY;
      if (Math.abs(delta) < 8) return; // ignore jitter
      setHidden(delta > 0 && y > 80); // down = hide, up = show
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Dynamic glass theme: probe which section sits under the nav. */
  useEffect(() => {
    let raf = 0;
    const probe = () => {
      raf = 0;
      const x = window.innerWidth / 2;
      const y = 44; // centre of the floating pill
      const hit = document.elementFromPoint(x, y);
      const section = hit?.closest?.("section, footer");
      if (section) setTheme(sectionIsDark(section) ? "dark" : "light");
      else setTheme(window.scrollY < window.innerHeight * 0.9 ? "dark" : "light");
    };
    const onScrollProbe = () => {
      if (!raf) raf = requestAnimationFrame(probe);
    };
    probe();
    window.addEventListener("scroll", onScrollProbe, { passive: true });
    window.addEventListener("resize", onScrollProbe);
    return () => {
      window.removeEventListener("scroll", onScrollProbe);
      window.removeEventListener("resize", onScrollProbe);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  /* Active-link highlight */
  useEffect(() => {
    const ids = ["services", "engine-section", "corridor-section", "portfolio-section"];
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`cfa-nav-wrap${scrolled ? " is-scrolled" : ""}${hidden && !open ? " is-hidden" : ""}`}
        data-theme={theme}
      >
        <div className="cfa-nav" data-theme={theme}>
          {/* LOGO — separate desktop/mobile PNGs */}
          <a
            href="#"
            className="cfa-nav-logo"
            aria-label="Cargo Flow Africa — back to top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <img
              src="/logo-desktop.avif"
              alt="Cargo Flow Africa"
              className="cfa-nav-logo-img cfa-nav-logo-img--desktop"
            />
            <img
              src="/logo-mobile.avif"
              alt="Cargo Flow Africa"
              className="cfa-nav-logo-img cfa-nav-logo-img--mobile"
            />
          </a>

          <nav className="cfa-nav-links" aria-label="Primary">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`cfa-nav-link${active === l.href ? " is-active" : ""}`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="cfa-nav-actions">
            <a href="#verdict-section" className="cfa-nav-cta">
              Get a Quote
              <span className="cfa-nav-cta-arrow" aria-hidden="true">
                →
              </span>
            </a>

            <button
              type="button"
              className={`cfa-nav-burger${open ? " is-open" : ""}`}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`cfa-nav-mobile${open ? " is-open" : ""}`}
        data-theme={theme}
        aria-hidden={!open}
      >
        <nav aria-label="Mobile">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="cfa-nav-mobile-link"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#verdict-section"
            className="cfa-nav-mobile-cta"
            onClick={() => setOpen(false)}
          >
            Get a Quote →
          </a>
        </nav>
      </div>
    </>
  );
}
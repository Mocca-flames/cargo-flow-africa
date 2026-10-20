"use client";

import { useState } from "react";
import { people, branches, WHATSAPP_OPENER } from "@/data/contact";
import "./Footer.css";

const PLATFORM_LINKS = [
  { label: "Core Services", href: "#services", desc: "Clearance, tracking, security" },
  { label: "Fleet Specs", href: "#engine-section", desc: "ST-34, FD-120, LB-36, TL-13" },
  { label: "Load Capabilities", href: "#proof", desc: "Bulk, breakbulk, mining cargo" },
  { label: "Trade Corridors", href: "#corridor-section", desc: "Cross-border arteries" },
  { label: "Coverage Map", href: "#coverage-section", desc: "SADC & Central Africa" },
  { label: "Client Portfolio", href: "#portfolio-section", desc: "Industrial and mining proof" },
  { label: "Process", href: "#process-section", desc: "Port to pit delivery" },
];

const CORRIDOR_LANES = [
  { name: "Durban ↔ Gauteng", code: "ZAF-01", tag: "High volume" },
  { name: "Kasumbalesa Corridor", code: "ZMB-COD", tag: "DRC gateway" },
  { name: "Kazungula Crossing", code: "BWA-ZMB", tag: "Direct north" },
  { name: "Beitbridge Gateway", code: "ZAF-ZWE", tag: "Pre-cleared" },
  { name: "Trans-Kalahari Artery", code: "ZAF-BWA-NAM", tag: "Atlantic link" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="cfa-footer" id="site-footer" aria-label="Site Footer">
      <div className="cfa-footer__inner">
        <div className="cfa-footer__grid">
          {/* Column 1: Identity */}
          <div className="cfa-footer__col cfa-footer__col--brand">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                scrollToTop();
              }}
              className="cfa-footer__logo"
              aria-label="Cargo Flow Africa — Return to top"
            >
              <img
              src="/logo-mobile1.avif"
              alt="Cargo Flow Africa"
              className="cfa-nav-logo-img cfa-nav-logo-img--mobile"
            />
              <span className="cfa-footer__brand-text">
                <span className="cfa-footer__brand-title">Cargo Flow Africa</span>
                <span className="cfa-footer__brand-subtitle">
                  Heavy haulage · Cross-border logistics
                </span>
              </span>
            </a>

            <p className="cfa-footer__brand-desc">
              Specialized corridor transit and cross-border customs clearance
              connecting Southern and Central Africa, from port of entry to
              industrial and mining drop-offs.
            </p>

            <a
              href={`https://wa.me/27729377143?text=${encodeURIComponent(
                WHATSAPP_OPENER
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="cfa-footer__link cfa-footer__whatsapp"
            >
              Message dispatch on WhatsApp
            </a>

            <form
              onSubmit={handleSubscribe}
              className="cfa-footer__subscribe"
              noValidate
            >
              <label
                htmlFor="footer-email"
                className="cfa-footer__subscribe-label"
              >
                Corridor &amp; border bulletins
              </label>
              <p className="cfa-footer__subscribe-text">
                Weekly clearance advisories and border wait-times.
              </p>
              {subscribed ? (
                <p className="cfa-footer__subscribe-success" role="status">
                  Subscribed — we&apos;ll keep you posted.
                </p>
              ) : (
                <div className="cfa-footer__subscribe-row">
                  <input
                    id="footer-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="cfa-footer__subscribe-input"
                    required
                  />
                  <button
                    type="submit"
                    className="cfa-footer__subscribe-btn"
                  >
                    Subscribe
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Column 2: Platform */}
          <div className="cfa-footer__col">
            <h3 className="cfa-footer__col-heading">Platform &amp; Fleet</h3>
            <ul className="cfa-footer__list">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="cfa-footer__link cfa-footer__link--stacked">
                    <span className="cfa-footer__link-label">{link.label}</span>
                    <span className="cfa-footer__link-desc">{link.desc}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Corridors */}
          <div className="cfa-footer__col">
            <h3 className="cfa-footer__col-heading">Trade Corridors</h3>
            <ul className="cfa-footer__list">
              {CORRIDOR_LANES.map((lane) => (
                <li key={lane.code}>
                  <a href="#corridor-section" className="cfa-footer__link cfa-footer__link--stacked">
                    <span className="cfa-footer__link-label">{lane.name}</span>
                    <span className="cfa-footer__link-desc">
                      {lane.code} · {lane.tag}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <a href="#coverage-section" className="cfa-footer__link-inline">
              All territory maps →
            </a>
          </div>

          {/* Column 4: Dispatch & Hubs */}
          <div className="cfa-footer__col">
            <h3 className="cfa-footer__col-heading">Direct Dispatch</h3>
            <ul className="cfa-footer__list">
              {people.map((person) => (
                <li key={person.id} className="cfa-footer__person">
                  <span className="cfa-footer__person-name">
                    {person.name}
                    <span className="cfa-footer__person-role">{person.role}</span>
                  </span>
                  <a href={`mailto:${person.email}`} className="cfa-footer__link">
                    {person.email}
                  </a>
                  <a href={`tel:${person.phoneHref}`} className="cfa-footer__link">
                    {person.phone}
                  </a>
                </li>
              ))}
            </ul>

            <h3 className="cfa-footer__col-heading cfa-footer__col-heading--sub">
              Operational Hubs
            </h3>
            <ul className="cfa-footer__list">
              {branches.map((branch) => (
                <li key={branch.id} className="cfa-footer__branch">
                  <span className="cfa-footer__branch-city">
                    {branch.city}
                    {branch.isHq && (
                      <span className="cfa-footer__branch-tag">HQ</span>
                    )}
                  </span>
                  <span className="cfa-footer__branch-meta">
                    {branch.country} · {branch.hours}
                  </span>
                  <a
                    href={branch.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cfa-footer__link"
                  >
                    View on Maps ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="cfa-footer__bottom">
          <div className="cfa-footer__bottom-left">
            <span>
              © {new Date().getFullYear()} Cargo Flow Africa (Pty) Ltd.
            </span>
            <span className="cfa-footer__compliance">
              SADC Protocol on Transport, Communications and Meteorology
              compliant.
            </span>
          </div>

          <div className="cfa-footer__bottom-links">
            <a href="#privacy" className="cfa-footer__link">
              Privacy Policy
            </a>
            <a href="#terms" className="cfa-footer__link">
              Trading Terms
            </a>
            <a href="#transit-insurance" className="cfa-footer__link">
              Goods in Transit Cover
            </a>
          </div>

          <button
            type="button"
            onClick={scrollToTop}
            className="cfa-footer__back-to-top"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
}

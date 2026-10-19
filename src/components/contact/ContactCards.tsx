"use client";

import { type CSSProperties } from "react";
import type { PersonRecord, BranchRecord } from "@/data/contact";
import { contactCopy, WHATSAPP_OPENER } from "@/data/contact";

/* ─── Person card ───
   Name + role header, then two quick-action buttons:
   Email (mailto), WhatsApp (wa.me with opener — WhatsApp also
   supports voice calls, so no separate call button needed).
   Each button is a full-width tap target — easy on mobile. */

export function PersonCard({
  person,
  index,
}: {
  person: PersonRecord;
  index: number;
}) {
  const whatsappUrl = `https://wa.me/${person.whatsappNumber}?text=${encodeURIComponent(
    WHATSAPP_OPENER
  )}`;

  return (
    <article
      className="contact__person"
      style={{ "--i": index } as CSSProperties}
      data-person={person.id}
    >
      <header className="contact__person-header">
        <div className="contact__person-avatar" aria-hidden="true">
          {person.name.charAt(0)}
        </div>
        <div className="contact__person-info">
          <h4 className="contact__person-name">{person.name}</h4>
          <p className="contact__person-role">{person.role}</p>
        </div>
      </header>

      <div className="contact__person-actions">
        {/* Email */}
        <a
          className="contact__action contact__action--email"
          href={`mailto:${person.email}`}
        >
          <span className="contact__action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 7l9 6 9-6" />
            </svg>
          </span>
          <span className="contact__action-text">
            <span className="contact__action-label">{contactCopy.emailLabel}</span>
            <span className="contact__action-value">{person.email}</span>
          </span>
        </a>

        {/* WhatsApp — chat or call */}
        <a
          className="contact__action contact__action--whatsapp"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact__action-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c-5 0-9 3.8-9 8.5 0 1.6.4 3.1 1.2 4.4L3 21l5.3-1.2c1.2.7 2.7 1.1 4.2 1.1 5 0 9-3.8 9-8.5S17 3 12 3Z" />
              <path d="M9 9.5c.3 2.5 2.5 5 5.5 5.5l1.2-1.5 2 1c-.3 1.2-.9 1.8-1.7 1.8-3.3 0-6.5-3.3-6.8-6.8 0-.5.2-.9.5-1.5l1.3 1.2-1 1.3Z" strokeWidth="1.2" />
            </svg>
          </span>
          <span className="contact__action-text">
            <span className="contact__action-label">{contactCopy.whatsappLabel}</span>
            <span className="contact__action-value">{person.phone}</span>
          </span>
        </a>
      </div>
    </article>
  );
}

/* ─── Branch card ───
   Image-forward office showcase: 80% photo, city name overlay,
   Google Maps icon badge. Entire card is a link to Google Maps —
   no duplicated contact details (covered by person cards above). */

export function BranchCard({
  branch,
  index,
}: {
  branch: BranchRecord;
  index: number;
}) {
  return (
    <a
      className="contact__branch"
      style={{ "--i": index } as CSSProperties}
      href={branch.mapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`View ${branch.city}, ${branch.country} office on Google Maps`}
    >
      <div className="contact__branch-photo">
        {branch.photoSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            className="contact__branch-img"
            src={branch.photoSrc}
            alt={branch.photoAlt}
            loading="lazy"
          />
        ) : (
          <span className="contact__branch-tbc">
            {contactCopy.tbcPhoto}
            <span className="contact__branch-tbc-sub">
              {branch.city} · team capture
            </span>
          </span>
        )}
        {branch.isHq && (
          <span className="contact__branch-hq-tag" aria-label="Headquarters">
            HQ
          </span>
        )}
        <span className="contact__branch-maps-badge" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            className="contact__branch-maps-icon"
            src="/images/branch/google-maps.avif"
            alt=""
          />
        </span>
        <span className="contact__branch-overlay" aria-hidden="true" />
      </div>

      <div className="contact__branch-info">
        <h3 className="contact__branch-name">
          {branch.city}
          <span className="contact__branch-country"> · {branch.country}</span>
        </h3>
        <span className="contact__branch-cta">
          {contactCopy.directionsCta}
          <svg
            className="contact__branch-arrow"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M7 17L17 7M17 7H8M17 7v9" />
          </svg>
        </span>
      </div>
    </a>
  );
}

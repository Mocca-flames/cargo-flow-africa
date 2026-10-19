"use client";

import type { RefObject } from "react";
import { PersonCard, BranchCard } from "./ContactCards";
import { people, branches, contactCopy } from "@/data/contact";
import "./ContactCommon.css";
import "./ContactMobile.css";

/** Mobile drawing — same tiers stacked: ready, people, branches. */
export default function ContactMobile({
  innerRef,
  className,
}: {
  innerRef: RefObject<HTMLElement | null>;
  className: string;
}) {
  return (
    <section
      id="contact-section"
      ref={innerRef}
      className={`${className} contact--mobile`}
      aria-labelledby="contact-heading-m"
    >
      <div className="contact__inner">
        <header className="contact__header">
          <p className="contact__eyebrow">{contactCopy.eyebrow}</p>
          <h2 className="contact__heading" id="contact-heading-m">
            {contactCopy.heading}
          </h2>
          <p className="contact__standfirst">{contactCopy.standfirst}</p>
        </header>

        <a className="contact__ready" href="#verdict-section">
          <span className="contact__ready-label">
            {contactCopy.readyLabel}
          </span>
          <span className="contact__ready-cta">
            <span className="contact__cta-rule" aria-hidden="true" />
            {contactCopy.readyCta} →
          </span>
        </a>

        <h3 className="contact__tier-label">{contactCopy.directHeading}</h3>
        <div className="contact__people">
          {people.map((person, i) => (
            <PersonCard key={person.id} person={person} index={i} />
          ))}
        </div>

        <h3 className="contact__tier-label">{contactCopy.visitHeading}</h3>
        <div className="contact__branches">
          {branches.map((branch, i) => (
            <BranchCard key={branch.id} branch={branch} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

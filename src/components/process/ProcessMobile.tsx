"use client";

import type { CSSProperties, RefObject } from "react";
import StepGlyph from "./StepGlyph";
import Connector from "./Connector";
import { processSteps, processCopy } from "@/data/process";
import "./ProcessCommon.css";
import "./ProcessMobile.css";

type Props = {
  innerRef: RefObject<HTMLElement | null>;
  className: string;
};

/**
 * Mobile drawing — steps stack vertically, glyph left and text right,
 * with a single vertical dashed connector behind the glyphs running
 * from the first glyph's centre to the last. It draws top to bottom as
 * the section enters, mirroring the desktop row's left-to-right draw.
 */
export default function ProcessMobile({ innerRef, className }: Props) {
  return (
    <section
      id="process-section"
      ref={innerRef}
      className={`${className} process--mobile`}
      aria-labelledby="process-heading"
    >
      <div className="process__inner">
        <header className="process__header">
          <p className="process__eyebrow">{processCopy.eyebrow}</p>
          <h2 className="process__heading" id="process-heading">
            {processCopy.heading}
          </h2>
          {processCopy.standfirst ? (
            <p className="process__standfirst">{processCopy.standfirst}</p>
          ) : null}
        </header>

        <div className="process__row">
          <div className="process__spine">
            <Connector orientation="vertical" />
          </div>

          {processSteps.map((step, index) => (
            <div
              key={step.id}
              className="process__step"
              style={{ "--i": index } as CSSProperties}
              data-step={step.id}
            >
              <div className="process__glyph-cell">
                <StepGlyph id={step.id} />
              </div>
              <div className="process__text">
                <p className="process__number">
                  {String(step.order).padStart(2, "0")}
                </p>
                <h3 className="process__title">{step.title}</h3>
                <p className="process__body">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <footer className="process__foot">
          <a className="process__cta" href="#verdict-section">
            <span className="process__cta-rule" aria-hidden="true" />
            {processCopy.cta}
          </a>
        </footer>
      </div>
    </section>
  );
}

"use client";

import type { CSSProperties, RefObject } from "react";
import StepGlyph from "./StepGlyph";
import Connector from "./Connector";
import { processSteps, processCopy } from "@/data/process";
import "./ProcessCommon.css";
import "./ProcessDesktop.css";

type Props = {
  innerRef: RefObject<HTMLElement | null>;
  className: string;
};

/** One step: glyph on top, number + title + body beneath. */
function renderStep(step: (typeof processSteps)[number], index: number) {
  return (
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
  );
}

/**
 * Desktop drawing — a five-column row (step, connector, step,
 * connector, step). The connectors are direct grid items, so they run
 * exactly between glyph edges with no measuring; each draws left to
 * right as the section enters.
 */
export default function ProcessDesktop({ innerRef, className }: Props) {
  return (
    <section
      id="process-section"
      ref={innerRef}
      className={`${className} process--desktop`}
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
          {processSteps.flatMap((step, index) =>
            index > 0
              ? [
                  <Connector key={`connector-${step.id}`} orientation="horizontal" />,
                  renderStep(step, index),
                ]
              : [renderStep(step, index)]
          )}
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

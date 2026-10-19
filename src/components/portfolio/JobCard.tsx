"use client";

import { useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { jobs, formatRate, jobSaving, jobSavingPct } from "@/data/portfolio";
import type { Job } from "@/data/portfolio";

type Props = {
  job: Job;
  index: number;
  activeIndex: number;
  total: number;
  progress: number;
  onActivate: (index: number) => void;
};

function circularOffset(i: number, active: number, n: number): number {
  let d = i - active;
  if (d > n / 2) d -= n;
  if (d <= -n / 2) d += n;
  return d;
}

export default function JobCard({ job, index, activeIndex, total, progress, onActivate }: Props) {
  const offset = circularOffset(index, activeIndex, total);
  const isActive = offset === 0;
  const pos = offset >= -2 && offset <= 2 ? String(offset) : "far";
  const sign = pos === "far" ? (offset < 0 ? "-1" : "1") : offset < 0 ? "-1" : offset > 0 ? "1" : "0";

  const saving = jobSaving(job);
  const pct = jobSavingPct(job);
  const showSaving = saving > 0;

  /* If a logo file is missing or fails to load, the image errors and
     the [LOGO] placeholder shows instead. */
  const [logoFailed, setLogoFailed] = useState(false);
  const showLogo = job.logo !== null && !logoFailed;

  const activate = (e: MouseEvent) => {
    if (!isActive) {
      e.preventDefault();
      onActivate(index);
    }
  };

  return (
    <article
      className={`portfolio__card${isActive ? " portfolio__card--active" : ""}`}
      style={{ "--progress": progress } as CSSProperties}
      data-pos={pos}
      data-sign={sign}
      aria-labelledby={isActive ? `job-${job.id}` : undefined}
      aria-hidden={isActive ? undefined : true}
      tabIndex={isActive ? undefined : -1}
      onClick={isActive ? undefined : activate}
    >
      <div className="portfolio__logo-plate">
        {showLogo ? (
          <img
            src={job.logo as string}
            alt={`${job.client} logo`}
            className="portfolio__logo-img"
            onError={() => setLogoFailed(true)}
          />
        ) : (
          <span className="portfolio__logo-placeholder">[LOGO]</span>
        )}
      </div>

      <div className="portfolio__body">
        <h3 className="portfolio__client-name" id={`job-${job.id}`}>
          {job.client}
        </h3>

        <div className="portfolio__info">
          <span className="portfolio__info-label">Route</span>
          <p className="portfolio__info-value">
            {job.from}{" "}
            <span className="portfolio__route-arrow" aria-hidden="true">
              →
            </span>{" "}
            {job.to}
          </p>
        </div>

        <div className="portfolio__info">
          <span className="portfolio__info-label">Cargo</span>
          <p className="portfolio__info-value">{job.cargo}</p>
        </div>

        <div className="portfolio__info">
          <span className="portfolio__info-label">Truck</span>
          <p className="portfolio__info-value">{job.truck}</p>
        </div>

        <div className="portfolio__price">
          {showSaving && (
            <div className="portfolio__price-others">
              <span className="portfolio__price-others-label">Others quoted</span>
              <span className="portfolio__price-others-num">
                {job.currency} {formatRate(job.marketRate)}
              </span>
            </div>
          )}

          <div className="portfolio__price-our">
            <span className="portfolio__price-our-label">Our rate</span>
            <span className="portfolio__price-our-num">
              <span className="portfolio__price-our-figure">
                {job.currency} {formatRate(job.ourRate)}
              </span>
              <span className="portfolio__price-per">{job.per}</span>
            </span>
          </div>

          {showSaving && (
            <p className="portfolio__saving">
              You save {job.currency} {formatRate(saving)} · {pct}%
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export const allJobs = [...jobs];

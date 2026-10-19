"use client";

import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import JobCard, { allJobs } from "./JobCard";
import { portfolioCopy } from "@/data/portfolio";
import "./PortfolioCommon.css";
import "./PortfolioDesktop.css";

const AUTOPLAY_INTERVAL = 5000;
const TRANSITION_MS = 450;
const RESUME_DELAY = 8000;

export default function PortfolioDesktop({
  innerRef,
  className,
}: {
  innerRef: RefObject<HTMLElement | null>;
  className: string;
}) {
  const total = allJobs.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const progressRafRef = useRef<number | null>(null);
  const hasAutoAdvancedRef = useRef(false);

  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    prefersReducedMotion.current =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const next = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((i) => (i + 1) % total);
    startTimeRef.current = Date.now();
    setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
  }, [isTransitioning, total]);

  const prev = useCallback(() => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((i) => (i - 1 + total) % total);
    startTimeRef.current = Date.now();
    setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
  }, [isTransitioning, total]);

  const goTo = useCallback(
    (i: number) => {
      if (isTransitioning || i === activeIndex) return;
      setIsTransitioning(true);
      setActiveIndex(i);
      startTimeRef.current = Date.now();
      setTimeout(() => setIsTransitioning(false), TRANSITION_MS);
    },
    [isTransitioning, activeIndex]
  );

  const pause = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (progressRafRef.current) {
      cancelAnimationFrame(progressRafRef.current);
      progressRafRef.current = null;
    }
  }, []);

  const startAutoplay = useCallback(() => {
    if (prefersReducedMotion.current) return;
    pause();
    startTimeRef.current = Date.now();
    setProgress(0);

    const tick = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(elapsed / AUTOPLAY_INTERVAL, 1);
      setProgress(p);
      if (p < 1) {
        progressRafRef.current = requestAnimationFrame(tick);
      }
    };
    progressRafRef.current = requestAnimationFrame(tick);

    intervalRef.current = window.setInterval(() => {
      next();
      startTimeRef.current = Date.now();
      setProgress(0);
    }, AUTOPLAY_INTERVAL);
  }, [pause, next]);

  const scheduleResume = useCallback(() => {
    pause();
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsPlaying(true);
      resumeTimeoutRef.current = null;
    }, RESUME_DELAY);
  }, [pause]);

  const resumeAutoplay = useCallback(() => {
    if (resumeTimeoutRef.current) {
      clearTimeout(resumeTimeoutRef.current);
      resumeTimeoutRef.current = null;
    }
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
      setIsPlaying(false);
      scheduleResume();
    } else {
      resumeAutoplay();
    }
  }, [isPlaying, pause, scheduleResume, resumeAutoplay]);

  /* Keyboard */
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
        if (isPlaying) scheduleResume();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        next();
        if (isPlaying) scheduleResume();
      }
    };
    stage.addEventListener("keydown", handler);
    return () => stage.removeEventListener("keydown", handler);
  }, [next, prev, isPlaying, scheduleResume]);

  /* IntersectionObserver — autoplay only when visible */
  useEffect(() => {
    const section = innerRef.current;
    if (!section || prefersReducedMotion.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && isPlaying) {
          if (!hasAutoAdvancedRef.current) {
            hasAutoAdvancedRef.current = true;
            next();
          }
          startAutoplay();
        } else {
          pause();
        }
      },
      { threshold: 0.01, rootMargin: "100px 0px 0px 0px" }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [innerRef, isPlaying, startAutoplay, pause, next]);

  /* Visibility change */
  useEffect(() => {
    const handler = () => {
      if (document.hidden) {
        pause();
      } else if (isPlaying) {
        startAutoplay();
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [isPlaying, startAutoplay, pause]);

  /* Start autoplay on mount */
  useEffect(() => {
    if (!prefersReducedMotion.current && isPlaying) {
      startAutoplay();
    }
    return () => {
      pause();
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [startAutoplay, pause, isPlaying]);

  const counter = `${String(activeIndex + 1).padStart(2, "0")}/${String(total).padStart(2, "0")}`;

  return (
    <section
      id="portfolio-section"
      ref={innerRef}
      className={`${className} portfolio--desktop`}
      aria-labelledby="portfolio-heading"
    >
      <div className="portfolio__inner">
        <header className="portfolio__header">
          <div className="portfolio__header-top">
            <div className="portfolio__header-left">
              <p className="portfolio__eyebrow">{portfolioCopy.eyebrow}</p>
              <h2 className="portfolio__heading" id="portfolio-heading">
                {portfolioCopy.heading}
              </h2>
            </div>
            <div className="portfolio__header-right">
              <button
                className="portfolio__play-btn"
                onClick={togglePlay}
                aria-label={isPlaying ? "Pause autoplay" : "Play autoplay"}
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                    <polygon points="6,4 20,12 6,20" />
                  </svg>
                )}
              </button>
              <span className="portfolio__counter" aria-live="polite">
                {counter}
              </span>
            </div>
          </div>
          {portfolioCopy.standfirst && (
            <p className="portfolio__standfirst">{portfolioCopy.standfirst}</p>
          )}
        </header>

        <div
          className="portfolio__stage"
          ref={stageRef}
          tabIndex={0}
          onMouseEnter={() => {
            if (isPlaying) scheduleResume();
          }}
          onMouseLeave={() => {
            if (isPlaying) resumeAutoplay();
          }}
        >
          <button
            className="portfolio__arrow portfolio__arrow--prev"
            onClick={() => { prev(); if (isPlaying) scheduleResume(); }}
            aria-label="Previous job"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div className="portfolio__carousel-track">
            {allJobs.map((job, i) => (
              <JobCard
                key={job.id}
                job={job}
                index={i}
                activeIndex={activeIndex}
                total={total}
                progress={job.id === allJobs[activeIndex]?.id ? progress : 0}
                onActivate={goTo}
              />
            ))}
          </div>

          <button
            className="portfolio__arrow portfolio__arrow--next"
            onClick={() => { next(); if (isPlaying) scheduleResume(); }}
            aria-label="Next job"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        <div className="portfolio__dots" role="tablist" aria-label="Job selector">
          {allJobs.map((_, i) => (
            <button
              key={i}
              className={`portfolio__dot${i === activeIndex ? " portfolio__dot--active" : ""}`}
              onClick={() => { goTo(i); if (isPlaying) scheduleResume(); }}
              aria-label={`Job ${i + 1}`}
              aria-selected={i === activeIndex}
              role="tab"
              style={
                i === activeIndex
                  ? { "--dot-progress": progress } as React.CSSProperties
                  : undefined
              }
            />
          ))}
        </div>

       

        <footer className="portfolio__foot">
          <a className="portfolio__cta" href="#verdict-section">
            <span className="portfolio__cta-rule" aria-hidden="true" />
            {portfolioCopy.cta}
          </a>
        </footer>
      </div>
    </section>
  );
}

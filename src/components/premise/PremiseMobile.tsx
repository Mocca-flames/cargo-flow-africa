"use client";

import { useEffect, useState } from "react";
import "./PremiseCommon.css";
import "./PremiseMobile.css";

const MOBILE_IMAGE = "/images/section_1_hero_mobile.webp";
const MOBILE_VIDEO = "/videos/section_1_hero_video.webm";
const MOBILE_POSTER = "/images/section_1_hero_poster.png";

function WhatsAppIcon() {
  return (
    <a
      href="https://wa.me/254700000000?text=Hello%20I%20need%20cargo%20services"
      className="whatsapp-fab"
      aria-label="Chat with Dispatch — Online Now"
      target="_blank"
      rel="noopener noreferrer"
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="14" cy="14" r="14" fill="#25D366" />
        <path
          d="M10.2 21.8l-2.6-1.6a8.2 8.2 0 01-2.2-5.2c0-4.6 3.7-8.2 8.2-8.2 2.2 0 4.2.9 5.7 2.4 1.5 1.6 2.3 3.7 2.3 5.9 0 4.6-3.7 8.2-8.2 8.2zm0-14.5a6.3 6.3 0 00-6.3 6.3c0 1.6.6 3.1 1.7 4.3l1.4.9-1.4 4.1 4.2-1.1.9-1.4a6.3 6.3 0 001.7-4.3c0-3.5-2.8-6.3-6.3-6.3z"
          fill="white"
        />
      </svg>
    </a>
  );
}

export default function PremiseMobile() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const img = new Image();
    img.src = MOBILE_IMAGE;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true);
  }, []);

  return (
    <section id="premise-section" className="premise">
      <div
        className={`premise-visual ${imageLoaded ? "premise-visual--loaded" : ""}`}
        style={{
          backgroundImage: `url(${MOBILE_IMAGE})`,
        }}
      >
        {!prefersReducedMotion && !videoError && (
          <video
            className="premise-visual__video"
            src={MOBILE_VIDEO}
            poster={MOBILE_POSTER}
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            onError={() => setVideoError(true)}
          />
        )}
        <div className="premise-visual__overlay" />
      </div>

      <div className="premise-content">
        <h1 className="premise-headline">
          The weight of a deadline,<br />
          measured in distance.
        </h1>
      </div>

      <WhatsAppIcon />
    </section>
  );
}

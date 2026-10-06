"use client";

import { useEffect, useState } from "react";
import "./PremiseCommon.css";
import "./PremiseDesktop.css";

export default function PremiseDesktop() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 100);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section id="premise-section" className={`premise premise--desktop${ready ? " premise--ready" : ""}`}>
      <div className="premise-content">
        <h1 className="premise-headline">
          The weight of a deadline,
          <br />
          measured in distance.
        </h1>
      </div>
    </section>
  );
}

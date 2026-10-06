"use client";

import { useEffect, useState } from "react";
import "./PremiseCommon.css";
import "./PremiseMobile.css";

export default function PremiseMobile() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setReady(true), 100);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <section id="premise-section" className={`premise premise--mobile${ready ? " premise--ready" : ""}`}>
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

"use client";

import { type ReactNode } from "react";

export default function PremiseLiftRevealed({ children }: { children: ReactNode }) {
  return (
    <div id="premise-lift-revealed" className="premise-lift__revealed">
      {children}
    </div>
  );
}

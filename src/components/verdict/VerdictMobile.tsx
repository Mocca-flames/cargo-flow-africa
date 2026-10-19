"use client";

import type { useQuoteForm } from "./useQuoteForm";
import { QuoteFormContent } from "./QuoteFormContent";
import "./VerdictCommon.css";
import "./VerdictMobile.css";

type Props = ReturnType<typeof useQuoteForm>;

export default function VerdictMobile(form: Props) {
  return (
    <section id="verdict-section" className="verdict verdict--mobile">
      <div className="verdict__content">
        <h2 className="verdict__headline">Ready to move?</h2>
        <QuoteFormContent {...form} />
        <p className="verdict__stat" />
      </div>
    </section>
  );
}

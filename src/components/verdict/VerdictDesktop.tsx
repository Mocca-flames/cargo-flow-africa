"use client";

import type { useQuoteForm } from "./useQuoteForm";
import { QuoteFormContent } from "./QuoteFormContent";
import "./VerdictCommon.css";
import "./VerdictDesktop.css";

type Props = ReturnType<typeof useQuoteForm>;

export default function VerdictDesktop(form: Props) {
  return (
    <section id="verdict-section" className="verdict verdict--desktop">
      <div className="verdict__content">
        <h2 className="verdict__headline">Ready to move?</h2>
        <QuoteFormContent {...form} />
        <p className="verdict__stat" />
      </div>
    </section>
  );
}

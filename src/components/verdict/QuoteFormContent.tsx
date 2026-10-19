"use client";

import type { useQuoteForm } from "./useQuoteForm";
import { getTrailerHint, buildWhatsAppLink, toPayload, origins, destinations, timingOptions, getTimingLabel } from "./quote-form";
import { commodities } from "@/data/commodities";
import { fleetClasses } from "@/data/fleet";

type Props = ReturnType<typeof useQuoteForm>;

const STEP_LABELS: Record<number, string> = {
  1: "Cargo & Route",
  2: "Timing & Quantity",
  3: "Your Details",
  4: "Review",
};

export function QuoteFormContent({ state, setField, openSpecifics, toggleSpecifics, step, nextStep, prevStep, handleSubmit, resetForm, formRef }: Props) {
  const hint = getTrailerHint(state.commodity);
  const payload = toPayload(state);
  const waLink = buildWhatsAppLink(payload);

  const statusText =
    state.submitStatus === "success"
      ? "Quote sent. We will be in touch shortly."
      : state.submitStatus === "error"
        ? `Send failed: ${state.errorMessage ?? "unknown error"}.`
        : Object.values(state.errors).join(", ");

  const summaryLines = [
    payload.commodity && `Commodity: ${payload.commodity}`,
    (payload.from || payload.to) && `Route: ${payload.from} → ${payload.to}`,
    payload.quantity && `Quantity: ${payload.quantity}`,
    payload.timing && `Timing: ${payload.timing}`,
    payload.name && `Name: ${payload.name}`,
    payload.company && `Company: ${payload.company}`,
    payload.contact && `Contact: ${payload.contact}`,
  ].filter(Boolean);

  return (
    <>
      <div aria-live="polite" className="sr-only">{statusText}</div>

      {/* Step progress — visual only, no skipping */}
      <nav className="verdict__steps" aria-label="Form steps">
        {Object.entries(STEP_LABELS).map(([n]) => {
          const s = Number(n);
          return (
            <span key={s} className="verdict__step-indicator">
              <span className={`verdict__step-dot ${s === step ? "is-active" : s < step ? "is-complete" : ""}`} />
              {s < 4 && <span className="verdict__step-line" />}
            </span>
          );
        })}
      </nav>
      <p className="verdict__step-label">{STEP_LABELS[step]}</p>

      {/* Card with fixed min-height — stops header jumping between steps */}
      <div className="verdict__card">
        {state.submitStatus === "success" ? (
          <div className="verdict__success-msg">
            <p>Your quote has been received. We will reach out soon.</p>
            <button className="verdict__cta" onClick={resetForm}>Send another</button>
          </div>
        ) : (
          <form className="verdict__form" ref={formRef} onSubmit={handleSubmit} noValidate>

            {/* ── Step 1: Cargo & Route ── */}
            {step === 1 && (
              <>
                <fieldset className="verdict__fieldset">
                  <legend className="sr-only">Commodity</legend>
                  <span className="verdict__label" id="lbl-commodity">Commodity</span>
                  <div className="verdict__chips" data-focus="commodity" tabIndex={-1} role="group" aria-labelledby="lbl-commodity">
                    {commodities.map((c) => (
                      <button key={c.id} type="button"
                        className={`verdict__chip ${state.commodity === c.id ? "is-active" : ""}`}
                        aria-pressed={state.commodity === c.id}
                        aria-label={c.name}
                        onClick={() => setField("commodity", c.id)}
                      >{c.name}</button>
                    ))}
                    <button type="button"
                      className={`verdict__chip ${state.commodity === "other" ? "is-active" : ""}`}
                      aria-pressed={state.commodity === "other"}
                      onClick={() => setField("commodity", "other")}
                    >Other</button>
                  </div>
                  {state.commodity === "other" && (
                    <input className="verdict__input" id="commodityOther" name="commodityOther"
                      placeholder="Specify commodity"
                      value={state.commodityOther}
                      onChange={(e) => setField("commodityOther", e.target.value)}
                      aria-invalid={!!state.errors.commodityOther}
                      aria-describedby={state.errors.commodityOther ? "err-commodityOther" : undefined}
                    />
                  )}
                  <FieldError id="err-commodity" msg={state.errors.commodity} />
                  {state.commodity === "other" && <FieldError id="err-commodityOther" msg={state.errors.commodityOther} />}
                </fieldset>

                {hint && (
                  <button type="button" className="verdict__hint" onClick={openSpecifics}>
                    Typically moved by {hint}
                  </button>
                )}

                <fieldset className="verdict__fieldset">
                  <legend className="sr-only">Origin</legend>
                  <span className="verdict__label" id="lbl-from">From</span>
                  <div className="verdict__chips" data-focus="from" tabIndex={-1} role="group" aria-labelledby="lbl-from">
                    {origins.map((o) => (
                      <button key={o} type="button"
                        className={`verdict__chip ${state.from === o ? "is-active" : ""}`}
                        aria-pressed={state.from === o}
                        onClick={() => setField("from", o)}
                      >{o}</button>
                    ))}
                  </div>
                  <input className="verdict__input" id="from" name="from"
                    placeholder="Or type origin"
                    value={state.from}
                    onChange={(e) => setField("from", e.target.value)}
                    aria-invalid={!!state.errors.from}
                    aria-describedby={state.errors.from ? "err-from" : undefined}
                  />
                  <FieldError id="err-from" msg={state.errors.from} />
                </fieldset>

                <fieldset className="verdict__fieldset">
                  <legend className="sr-only">Destination</legend>
                  <span className="verdict__label" id="lbl-to">To</span>
                  <div className="verdict__chips" data-focus="to" tabIndex={-1} role="group" aria-labelledby="lbl-to">
                    {destinations.map((d) => (
                      <button key={d} type="button"
                        className={`verdict__chip ${state.to === d ? "is-active" : ""}`}
                        aria-pressed={state.to === d}
                        onClick={() => setField("to", d)}
                      >{d}</button>
                    ))}
                  </div>
                  <input className="verdict__input" id="to" name="to"
                    placeholder="Or type destination"
                    value={state.to}
                    onChange={(e) => setField("to", e.target.value)}
                    aria-invalid={!!state.errors.to}
                    aria-describedby={state.errors.to ? "err-to" : undefined}
                  />
                  <FieldError id="err-to" msg={state.errors.to} />
                </fieldset>

                <div className="verdict__nav">
                  <button type="button" className="verdict__cta" onClick={nextStep}>Continue</button>
                </div>
              </>
            )}

            {/* ── Step 2: Timing & Quantity ── */}
            {step === 2 && (
              <>
                <fieldset className="verdict__fieldset">
                  <legend className="sr-only">Timing window</legend>
                  <span className="verdict__label" id="lbl-timing">Timing window</span>
                  <div className="verdict__chips" data-focus="timing" tabIndex={-1} role="group" aria-labelledby="lbl-timing">
                    {timingOptions.map((t) => (
                      <button key={t} type="button"
                        className={`verdict__chip ${state.timing === t ? "is-active" : ""}`}
                        aria-pressed={state.timing === t}
                        onClick={() => setField("timing", t)}
                      >{getTimingLabel(t)}</button>
                    ))}
                  </div>
                  {state.timing === "specific-date" && (
                    <input className="verdict__input" id="timingSpecific" name="timingSpecific"
                      placeholder="e.g. 15 Oct 2026"
                      value={state.timingSpecific}
                      onChange={(e) => setField("timingSpecific", e.target.value)}
                      aria-invalid={!!state.errors.timingSpecific}
                      aria-describedby={state.errors.timingSpecific ? "err-timingSpecific" : undefined}
                    />
                  )}
                  <FieldError id="err-timing" msg={state.errors.timing} />
                  {state.timing === "specific-date" && <FieldError id="err-timingSpecific" msg={state.errors.timingSpecific} />}
                </fieldset>

                <fieldset className="verdict__fieldset">
                  <legend className="sr-only">Quantity</legend>
                  <span className="verdict__label" id="lbl-qty">Quantity</span>
                  <div className="verdict__quantity">
                    <input className="verdict__input" id="quantityValue" name="quantityValue"
                      type="number" inputMode="decimal" min="0" step="any"
                      placeholder="Amount"
                      value={state.quantityValue}
                      onChange={(e) => setField("quantityValue", e.target.value)}
                      aria-invalid={!!state.errors.quantityValue}
                      aria-describedby={state.errors.quantityValue ? "err-quantityValue" : undefined}
                    />
                    <div className="verdict__unit-toggle" role="group" aria-labelledby="lbl-qty-unit">
                      <span id="lbl-qty-unit" className="sr-only">Unit</span>
                      {(["tonnes", "loads"] as const).map((u) => (
                        <button key={u} type="button"
                          className={state.quantityUnit === u ? "is-active" : ""}
                          aria-pressed={state.quantityUnit === u}
                          onClick={() => setField("quantityUnit", u)}
                        >{u === "tonnes" ? "Tonnes" : "Loads"}</button>
                      ))}
                    </div>
                  </div>
                  <FieldError id="err-quantityValue" msg={state.errors.quantityValue} />
                </fieldset>

                <div className="verdict__nav">
                  <button type="button" className="verdict__nav-back" onClick={prevStep}>Back</button>
                  <button type="button" className="verdict__cta" onClick={nextStep}>Continue</button>
                </div>
              </>
            )}

            {/* ── Step 3: Your Details ── */}
            {step === 3 && (
              <>
                <div className="verdict__row">
                  <fieldset className="verdict__fieldset">
                    <label className="verdict__label" htmlFor="name">Name</label>
                    <input className="verdict__input" id="name" name="name"
                      value={state.name}
                      onChange={(e) => setField("name", e.target.value)}
                      aria-invalid={!!state.errors.name}
                      aria-describedby={state.errors.name ? "err-name" : undefined}
                    />
                    <FieldError id="err-name" msg={state.errors.name} />
                  </fieldset>
                  <fieldset className="verdict__fieldset">
                    <label className="verdict__label" htmlFor="company">Company</label>
                    <input className="verdict__input" id="company" name="company"
                      value={state.company}
                      onChange={(e) => setField("company", e.target.value)}
                      aria-invalid={!!state.errors.company}
                      aria-describedby={state.errors.company ? "err-company" : undefined}
                    />
                    <FieldError id="err-company" msg={state.errors.company} />
                  </fieldset>
                </div>

                <fieldset className="verdict__fieldset">
                  <label className="verdict__label" htmlFor="contact">Contact (WhatsApp preferred)</label>
                  <input className="verdict__input" id="contact" name="contact"
                    placeholder="Phone or email" inputMode="text"
                    value={state.contact}
                    onChange={(e) => setField("contact", e.target.value)}
                    aria-invalid={!!state.errors.contact}
                    aria-describedby={state.errors.contact ? "err-contact" : undefined}
                  />
                  <FieldError id="err-contact" msg={state.errors.contact} />
                </fieldset>

                <div className="verdict__nav">
                  <button type="button" className="verdict__nav-back" onClick={prevStep}>Back</button>
                  <button type="button" className="verdict__cta" onClick={nextStep}>Continue</button>
                </div>
              </>
            )}

            {/* ── Step 4: Review & Submit ── */}
            {step === 4 && (
              <>
                <div className="verdict__review">
                  {summaryLines.map((line, i) => (
                    <p key={i} className="verdict__review-line">{line}</p>
                  ))}
                </div>

                <button type="button" className="verdict__expand"
                  aria-expanded={state.specificsExpanded}
                  aria-controls="verdict-specifics"
                  onClick={toggleSpecifics}
                >Know your trailer or handling needs? Add specifics</button>

                <div id="verdict-specifics"
                  className="verdict__specifics"
                  hidden={!state.specificsExpanded}
                  aria-hidden={!state.specificsExpanded}
                >
                  <fieldset className="verdict__fieldset">
                    <legend className="sr-only">Trailer class</legend>
                    <span className="verdict__label" id="lbl-trailer">Trailer class</span>
                    <div className="verdict__chips" data-focus="trailer" tabIndex={-1} role="group" aria-labelledby="lbl-trailer">
                      <button type="button"
                        className={`verdict__chip ${state.trailer === "advise" ? "is-active" : ""}`}
                        aria-pressed={state.trailer === "advise"}
                        onClick={() => setField("trailer", "advise")}
                      >Not sure, advise me</button>
                      {fleetClasses.map((f) => (
                        <button key={f.id} type="button"
                          className={`verdict__chip ${state.trailer === f.id ? "is-active" : ""}`}
                          aria-pressed={state.trailer === f.id}
                          onClick={() => setField("trailer", f.id)}
                        >{f.name}</button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="verdict__fieldset">
                    <label className="verdict__label" htmlFor="handlingNeeds">Handling / border needs</label>
                    <textarea className="verdict__textarea" id="handlingNeeds" name="handlingNeeds"
                      rows={3} placeholder="Clearance, escorts, permits..."
                      value={state.handlingNeeds}
                      onChange={(e) => setField("handlingNeeds", e.target.value)}
                    />
                  </fieldset>

                  <fieldset className="verdict__fieldset">
                    <label className="verdict__label" htmlFor="note">Note</label>
                    <textarea className="verdict__textarea" id="note" name="note"
                      rows={3} placeholder="Anything else?"
                      value={state.note}
                      onChange={(e) => setField("note", e.target.value)}
                    />
                  </fieldset>
                </div>

                <div className="verdict__nav verdict__nav--final">
                  <button type="button" className="verdict__nav-back" onClick={prevStep}>Back</button>
                  <button className="verdict__cta" type="submit"
                    disabled={state.submitStatus === "submitting"}
                  >
                    {state.submitStatus === "submitting" ? "Sending..." : "Request quote"}
                  </button>
                </div>
                {state.submitStatus === "error" && (
                  <button type="button" className="verdict__retry"
                    onClick={() => handleSubmit()}
                  >Retry</button>
                )}
                {waLink && (
                  <a className="verdict__wa-link" href={waLink}
                    target="_blank" rel="noopener noreferrer">
                    Or message on WhatsApp
                  </a>
                )}
              </>
            )}
          </form>
        )}
      </div>
    </>
  );
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return msg ? <p id={id} className="verdict__error">{msg}</p> : null;
}

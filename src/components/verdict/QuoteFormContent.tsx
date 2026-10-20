"use client";

import { useId, useState, type KeyboardEvent, type ReactNode } from "react";
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
const TOTAL_STEPS = 4;

/* ════════════════════════════════════════════════════════════
   Combobox (typing-first field with tappable suggestions)
   ════════════════════════════════════════════════════════════ */

type ComboOption = { id: string; label: string };

type ComboProps = {
  id: string;
  label: string;
  value: string;
  options: ComboOption[];
  placeholder?: string;
  enterKeyHint?: "next" | "done";
  onInputChange: (value: string) => void;
  onSelect: (option: ComboOption) => void;
  onDone?: () => void;
  error?: string;
  errorId?: string;
  helper?: ReactNode;
};

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <strong>{text.slice(i, i + q.length)}</strong>
      {text.slice(i + q.length)}
    </>
  );
}

function Combobox({
  id, label, value, options, placeholder, enterKeyHint = "next",
  onInputChange, onSelect, onDone, error, errorId, helper,
}: ComboProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const q = value.trim().toLowerCase();
  const filtered = q
    ? options
        .filter((o) => o.label.toLowerCase().includes(q))
        .sort(
          (a, b) =>
            Number(b.label.toLowerCase().startsWith(q)) -
            Number(a.label.toLowerCase().startsWith(q))
        )
    : options;

  const exact = filtered.length === 1 && filtered[0].label.toLowerCase() === q;
  const showList = open && !exact && filtered.length > 0;

  const choose = (o: ComboOption) => {
    onSelect(o);
    setOpen(false);
    setActive(-1);
    onDone?.();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault(); // never submit the form from a suggestion field
      if (showList && active >= 0 && filtered[active]) choose(filtered[active]);
      else {
        setOpen(false);
        onDone?.();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="combo">
      <label className="verdict__label" htmlFor={id}>{label}</label>

      <input
        className="verdict__input combo__input"
        id={id}
        name={id}
        data-focus={id}
        type="text"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
        aria-invalid={!!error}
        aria-describedby={error && errorId ? errorId : undefined}
        autoComplete="off"
        spellCheck={false}
        enterKeyHint={enterKeyHint}
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onInputChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onKeyDown={onKeyDown}
      />

      {helper}

      {showList && (
        <ul className="combo__list" id={listId} role="listbox" aria-label={`${label} suggestions`}>
          {filtered.map((o, i) => (
            <li
              key={o.id}
              id={`${listId}-${i}`}
              role="option"
              aria-selected={i === active}
              className={`combo__option ${i === active ? "is-active" : ""}`}
              onMouseDown={(e) => e.preventDefault()} // keeps keyboard open on mobile
              onClick={() => choose(o)}
            >
              <Highlight text={o.label} query={value} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const commodityOptions: ComboOption[] = commodities.map((c) => ({ id: c.id, label: c.name }));
const originOptions: ComboOption[] = origins.map((o) => ({ id: o, label: o }));
const destinationOptions: ComboOption[] = destinations.map((d) => ({ id: d, label: d }));

const focusField = (id: string) => () => {
  if (typeof window === "undefined") return;
  window.requestAnimationFrame(() => document.getElementById(id)?.focus());
};

/* ════════════════════════════════════════════════════════════
   Main form
   ════════════════════════════════════════════════════════════ */

export function QuoteFormContent({
  state, setField, openSpecifics, toggleSpecifics, step, nextStep, prevStep, handleSubmit, resetForm, formRef
}: Props) {

  const hint = getTrailerHint(state.commodity);
  const payload = toPayload(state);
  const waLink = buildWhatsAppLink(payload);

  const statusText =
    state.submitStatus === "success" ? "Quote sent. We will be in touch shortly."
    : state.submitStatus === "error" ? `Send failed: ${state.errorMessage ?? "unknown error"}.`
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

  // Commodity text shown in the field. Known commodity => its name; typed text => commodityOther.
  const commodityText =
    state.commodity === "other"
      ? state.commodityOther
      : commodities.find((c) => c.id === state.commodity)?.name ?? "";

  const handleCommodityInput = (text: string) => {
    const match = commodities.find((c) => c.name.toLowerCase() === text.trim().toLowerCase());
    if (match) {
      setField("commodity", match.id);
      setField("commodityOther", "");
    } else if (text === "") {
      setField("commodity", null);
      setField("commodityOther", "");
    } else {
      setField("commodity", "other");
      setField("commodityOther", text);
    }
  };

  const commodityError = state.errors.commodity || state.errors.commodityOther;

  return (
    <>
      <div aria-live="polite" className="sr-only">{statusText}</div>

      {/* ── Progress ── */}
      <nav className="verdict__progress" aria-label="Form progress">
        <p className="verdict__progress-text">Step {step} of {TOTAL_STEPS} · {STEP_LABELS[step]}</p>
        <div
          className="verdict__progress-bar"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={TOTAL_STEPS}
          aria-valuenow={step}
        >
          <span style={{ inlineSize: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
      </nav>

      {/* ── Main Form Card ── */}
      <div className="verdict__card">
        {state.submitStatus === "success" ? (
          <div className="verdict__success-msg" role="alert">
            <p>Your quote has been received. We will reach out soon.</p>
            <button className="verdict__cta" onClick={resetForm}>Send another</button>
          </div>
        ) : (
          <form className="verdict__form" ref={formRef} onSubmit={handleSubmit} noValidate>

            {/* ── Step 1: Cargo & Route ── */}
            {step === 1 && (
              <>
                <h2 className="verdict__question">What are you moving?</h2>

                <div className="verdict__block">
                  <Combobox
                    id="commodity"
                    label="Commodity"
                    placeholder="e.g. Sulphur granules, steel coils…"
                    value={commodityText}
                    options={commodityOptions}
                    onInputChange={handleCommodityInput}
                    onSelect={(o) => handleCommodityInput(o.label)}
                    onDone={focusField("from")}
                    error={commodityError}
                    errorId="err-commodity"
                    helper={
                      hint ? (
                        <button type="button" className="verdict__hint" onClick={openSpecifics}>
                          Usually moved by {hint}
                        </button>
                      ) : null
                    }
                  />
                  <FieldError id="err-commodity" msg={commodityError} />
                </div>

                <div className="verdict__block verdict__route" role="group" aria-labelledby="lbl-route">
                  <h3 className="verdict__subhead" id="lbl-route">Route</h3>

                  <div className="verdict__route-fields">
                    <div>
                      <Combobox
                        id="from"
                        label="From"
                        placeholder="Town, city or province"
                        value={state.from}
                        options={originOptions}
                        onInputChange={(v) => setField("from", v)}
                        onSelect={(o) => setField("from", o.label)}
                        onDone={focusField("to")}
                        error={state.errors.from}
                        errorId="err-from"
                      />
                      <FieldError id="err-from" msg={state.errors.from} />
                    </div>

                    <div>
                      <Combobox
                        id="to"
                        label="To"
                        placeholder="Town, city or province"
                        value={state.to}
                        options={destinationOptions}
                        enterKeyHint="done"
                        onInputChange={(v) => setField("to", v)}
                        onSelect={(o) => setField("to", o.label)}
                        error={state.errors.to}
                        errorId="err-to"
                      />
                      <FieldError id="err-to" msg={state.errors.to} />
                    </div>
                  </div>
                </div>

                <div className="verdict__nav verdict__nav--sticky">
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
                      <button
                        key={t} type="button"
                        className={`verdict__chip ${state.timing === t ? "is-active" : ""}`}
                        aria-pressed={state.timing === t}
                        onClick={() => setField("timing", t)}
                      >
                        {getTimingLabel(t)}
                      </button>
                    ))}
                  </div>
                  {state.timing === "specific-date" && (
                    <input
                      className="verdict__input" id="timingSpecific" name="timingSpecific"
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
                    <input
                      className="verdict__input" id="quantityValue" name="quantityValue"
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
                        <button
                          key={u} type="button"
                          className={state.quantityUnit === u ? "is-active" : ""}
                          aria-pressed={state.quantityUnit === u}
                          onClick={() => setField("quantityUnit", u)}
                        >
                          {u === "tonnes" ? "Tonnes" : "Loads"}
                        </button>
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
                    <input
                      className="verdict__input" id="name" name="name"
                      autoComplete="name"
                      value={state.name}
                      onChange={(e) => setField("name", e.target.value)}
                      aria-invalid={!!state.errors.name}
                      aria-describedby={state.errors.name ? "err-name" : undefined}
                    />
                    <FieldError id="err-name" msg={state.errors.name} />
                  </fieldset>

                  <fieldset className="verdict__fieldset">
                    <label className="verdict__label" htmlFor="company">Company</label>
                    <input
                      className="verdict__input" id="company" name="company"
                      autoComplete="organization"
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
                  <input
                    className="verdict__input" id="contact" name="contact"
                    placeholder="Phone or email" inputMode="text"
                    autoComplete="contact"
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
                <div className="verdict__review" aria-live="polite">
                  {summaryLines.map((line, i) => (
                    <p key={i} className="verdict__review-line">{line}</p>
                  ))}
                </div>

                <button
                  type="button" className="verdict__expand"
                  aria-expanded={state.specificsExpanded}
                  aria-controls="verdict-specifics"
                  onClick={toggleSpecifics}
                >
                  Know your trailer or handling needs? Add specifics
                </button>

                <div
                  id="verdict-specifics"
                  className="verdict__specifics"
                  hidden={!state.specificsExpanded}
                  aria-hidden={!state.specificsExpanded}
                >
                  <fieldset className="verdict__fieldset">
                    <legend className="sr-only">Trailer class</legend>
                    <span className="verdict__label" id="lbl-trailer">Trailer class</span>
                    <div className="verdict__chips" data-focus="trailer" tabIndex={-1} role="group" aria-labelledby="lbl-trailer">
                      <button
                        type="button"
                        className={`verdict__chip ${state.trailer === "advise" ? "is-active" : ""}`}
                        aria-pressed={state.trailer === "advise"}
                        onClick={() => setField("trailer", "advise")}
                      >
                        Not sure, advise me
                      </button>
                      {fleetClasses.map((f) => (
                        <button
                          key={f.id} type="button"
                          className={`verdict__chip ${state.trailer === f.id ? "is-active" : ""}`}
                          aria-pressed={state.trailer === f.id}
                          onClick={() => setField("trailer", f.id)}
                        >
                          {f.name}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <fieldset className="verdict__fieldset">
                    <label className="verdict__label" htmlFor="handlingNeeds">Handling / border needs</label>
                    <textarea
                      className="verdict__textarea" id="handlingNeeds" name="handlingNeeds"
                      rows={3} placeholder="Clearance, escorts, permits..."
                      value={state.handlingNeeds}
                      onChange={(e) => setField("handlingNeeds", e.target.value)}
                    />
                  </fieldset>

                  <fieldset className="verdict__fieldset">
                    <label className="verdict__label" htmlFor="note">Note</label>
                    <textarea
                      className="verdict__textarea" id="note" name="note"
                      rows={3} placeholder="Anything else?"
                      value={state.note}
                      onChange={(e) => setField("note", e.target.value)}
                    />
                  </fieldset>
                </div>

                <div className="verdict__nav verdict__nav--final">
                  <button type="button" className="verdict__nav-back" onClick={prevStep}>Back</button>
                  <button
                    className="verdict__cta" type="submit"
                    disabled={state.submitStatus === "submitting"}
                  >
                    {state.submitStatus === "submitting" ? "Sending..." : "Request quote"}
                  </button>
                </div>

                {state.submitStatus === "error" && (
                  <button type="button" className="verdict__retry" onClick={() => handleSubmit()}>
                    Retry
                  </button>
                )}

                {waLink && (
                  <a className="verdict__wa-link" href={waLink} target="_blank" rel="noopener noreferrer">
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
  if (!msg) return null;
  return (
    <p id={id} className="verdict__error" role="alert">
      {msg}
    </p>
  );
}
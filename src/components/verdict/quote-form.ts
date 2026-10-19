import { commodities } from "@/data/commodities";
import { fleetByCode, fleetClasses } from "@/data/fleet";
import { corridors } from "@/data/corridors";
import type { CommodityId } from "@/data/commodities";
import type { FleetId } from "@/data/fleet";

export type CommodityChoice = CommodityId | "other" | null;
export type TrailerChoice = FleetId | "advise";
export type TimingChoice = "this-week" | "this-month" | "next-3-months" | "specific-date" | null;

export interface QuoteFormState {
  commodity: CommodityChoice;
  commodityOther: string;
  from: string;
  to: string;
  quantityValue: string;
  quantityUnit: "tonnes" | "loads";
  timing: TimingChoice;
  timingSpecific: string;
  name: string;
  company: string;
  contact: string;
  trailer: TrailerChoice;
  handlingNeeds: string;
  note: string;
  specificsExpanded: boolean;
  errors: Record<string, string>;
  submitStatus: "idle" | "submitting" | "success" | "error";
  errorMessage?: string;
}

export function createDefaultState(): QuoteFormState {
  return {
    commodity: null,
    commodityOther: "",
    from: "",
    to: "",
    quantityValue: "",
    quantityUnit: "tonnes",
    timing: null,
    timingSpecific: "",
    name: "",
    company: "",
    contact: "",
    trailer: "advise",
    handlingNeeds: "",
    note: "",
    specificsExpanded: false,
    errors: {},
    submitStatus: "idle",
  };
}

const TIMING_LABELS: Record<NonNullable<TimingChoice>, string> = {
  "this-week": "This week",
  "this-month": "This month",
  "next-3-months": "Next 3 months",
  "specific-date": "Specific date",
};

export function getTimingLabel(t: TimingChoice): string | null {
  return t ? TIMING_LABELS[t] ?? null : null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d][\d\s()-]{6,}$/;

export function validate(state: QuoteFormState): Record<string, string> {
  const e: Record<string, string> = {};
  if (!state.commodity) e.commodity = "Select a commodity";
  if (state.commodity === "other" && !state.commodityOther.trim()) e.commodityOther = "Enter the commodity";
  if (!state.from.trim()) e.from = "Enter or select origin";
  if (!state.to.trim()) e.to = "Enter or select destination";
  if (!state.quantityValue.trim()) e.quantityValue = "Enter quantity";
  else if (isNaN(Number(state.quantityValue)) || Number(state.quantityValue) <= 0) e.quantityValue = "Must be a positive number";
  if (!state.timing) e.timing = "Select a timing window";
  if (state.timing === "specific-date" && !state.timingSpecific.trim()) e.timingSpecific = "Enter a date or window";
  if (!state.name.trim()) e.name = "Enter your name";
  if (!state.company.trim()) e.company = "Enter your company";
  if (!state.contact.trim()) e.contact = "Enter phone or email";
  else if (!EMAIL_RE.test(state.contact) && !PHONE_RE.test(state.contact)) e.contact = "Enter a valid phone or email";
  return e;
}

export function clearFieldError(errors: Record<string, string>, field: string): Record<string, string> {
  const copy = { ...errors };
  delete copy[field];
  return copy;
}

export interface QuotePayload {
  commodity: string;
  from: string;
  to: string;
  quantity: string;
  timing: string;
  name: string;
  company: string;
  contact: string;
  trailer?: string;
  handlingNeeds?: string;
  note?: string;
}

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

/**
 * STUB — the ONLY place delivery happens.
 * TODO: Replace the console.log below with a real POST to your webhook
 * (FastAPI endpoint, Google Sheets Apps Script, etc.).
 *
 *   const res = await fetch("/api/quote", { method: "POST", body: JSON.stringify(payload) });
 *   if (!res.ok) return { ok: false, error: res.statusText };
 *   return { ok: true };
 */
export async function submitQuote(payload: QuotePayload): Promise<SubmitResult> {
  console.log("[submitQuote stub]", JSON.stringify(payload, null, 2));
  return new Promise((resolve) => setTimeout(() => resolve({ ok: true }), 300));
}

function readableCommodityName(c: CommodityChoice): string {
  if (!c || c === "other") return "";
  return commodities.find((x) => x.id === c)?.name ?? c;
}

function readableTrailerName(t: TrailerChoice): string {
  if (t === "advise") return "Not sure, advise me";
  return fleetClasses.find((f) => f.id === t)?.name ?? t;
}

/**
 * The WhatsApp number, or null if unset. One gate every wa.me link in
 * the app goes through.
 */
function whatsappNumber(): string | null {
  const raw = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (!raw) return null;
  const number = raw.replace(/\D/g, "");
  return number || null;
}

/**
 * Build a wa.me deep-link from free text. Used by Coverage's per-
 * country "run this lane" CTA, which prefills a message naming the
 * lane. Returns null when no number is configured — callers fall
 * back to the quote form.
 */
export function buildWhatsAppTextLink(text: string): string | null {
  const number = whatsappNumber();
  if (!number) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

/**
 * Build a wa.me deep-link from a payload.
 * - Strips non-digits from NEXT_PUBLIC_WHATSAPP_NUMBER.
 * - Omits empty optional lines.
 * - Uses readable names, not internal IDs.
 * - Returns null if the number is missing or empty.
 */
export function buildWhatsAppLink(payload: QuotePayload): string | null {
  const lines: string[] = [
    "Quote Request",
    `Commodity: ${payload.commodity}`,
    `Route: ${payload.from} → ${payload.to}`,
    `Quantity: ${payload.quantity}`,
    `Timing: ${payload.timing}`,
    `Name: ${payload.name}`,
    `Company: ${payload.company}`,
    `Contact: ${payload.contact}`,
  ];
  if (payload.trailer) lines.push(`Trailer: ${payload.trailer}`);
  if (payload.handlingNeeds) lines.push(`Handling: ${payload.handlingNeeds}`);
  if (payload.note) lines.push(`Note: ${payload.note}`);

  return buildWhatsAppTextLink(lines.join("\n"));
}

export function toPayload(state: QuoteFormState): QuotePayload {
  const commodity = state.commodity === "other" ? state.commodityOther.trim() : readableCommodityName(state.commodity);
  const timing = state.timing === "specific-date" ? state.timingSpecific.trim() : (getTimingLabel(state.timing) ?? "");

  const trailer = state.specificsExpanded && state.trailer !== "advise"
    ? readableTrailerName(state.trailer)
    : undefined;

  const result: QuotePayload = {
    commodity,
    from: state.from.trim(),
    to: state.to.trim(),
    quantity: `${state.quantityValue.trim()} ${state.quantityUnit}`,
    timing,
    name: state.name.trim(),
    company: state.company.trim(),
    contact: state.contact.trim(),
  };
  if (trailer) result.trailer = trailer;
  const hn = state.handlingNeeds.trim();
  if (hn) result.handlingNeeds = hn;
  const nt = state.note.trim();
  if (nt) result.note = nt;
  return result;
}

export function getTrailerHint(commodity: CommodityChoice): string | null {
  if (!commodity || commodity === "other") return null;
  const record = commodities.find((c) => c.id === commodity);
  if (!record || !record.fleet.length) return null;
  const fleetRecord = fleetByCode(record.fleet[0]);
  return fleetRecord ? fleetRecord.name : null;
}

const allCorridors = Object.values(corridors);
export const origins = [...new Set(allCorridors.map((c) => c.from))];
export const destinations = [...new Set(allCorridors.map((d) => d.to))];

export const timingOptions: NonNullable<TimingChoice>[] = [
  "this-week",
  "this-month",
  "next-3-months",
  "specific-date",
];

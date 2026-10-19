/**
 * Process section — the three steps of a job, and its copy.
 *
 * The section answers the buyer's last friction question — "what
 * actually happens after I send you my job?" — in one screen: three
 * steps, a draw-on connector, then a quiet hand-off into the Verdict's
 * quote form. This file is the single source of truth for that copy
 * and the step records, so the desktop layout, the mobile stack and any
 * future sub-page read one list instead of restating the steps.
 *
 * ALL COPY IS PLACEHOLDER, marked `TODO(copy)`. The structure is
 * approved; the wording is the owner's to replace. Keep the shape:
 * headings 2-4 words, body one sentence, present tense.
 */

export type ProcessStepId = "send-spec" | "plan-run" | "truck-rolls";

export type ProcessStepRecord = {
  id: ProcessStepId;
  /** 1-based step order — also the reveal/index number, mono, gold. */
  order: number;
  /** Short step title. Sora, 2-4 words. TODO(copy) */
  title: string;
  /** One sentence, present tense. DM Sans, max ~2 lines. TODO(copy) */
  body: string;
};

export const processSteps: ProcessStepRecord[] = [
  {
    id: "send-spec",
    order: 1,
    // TODO(copy): confirm what dispatch actually needs on first contact.
    title: "Send the spec",
    body: "Commodity, tonnage, origin, destination and the date it has to land. One message to dispatch.",
  },
  {
    id: "plan-run",
    order: 2,
    // TODO(copy): confirm the planning steps we want to name (permits? escorts?).
    title: "We plan the run",
    body: "Load plan, trailer selection, route and border clearances — booked before anything moves.",
  },
  {
    id: "truck-rolls",
    order: 3,
    // TODO(copy): confirm what tracking we can honestly promise.
    title: "Truck rolls, you track",
    body: "We roll, you follow the run, and the load lands on the date you gave us.",
  },
];

/* ─── Copy ─── */

export const processCopy = {
  // TODO(copy): eyebrow stays short, all-caps is fine (HUD label register).
  eyebrow: "PROCESS",
  heading: "How a Job Runs",
  // TODO(copy): optional standfirst — drop it if the steps speak for themselves.
  standfirst: "One message in, a tracked run out.",
  /** Quiet text link into the Verdict form (`#verdict-section`). */
  cta: "Start at step 01",
  /** Optional WhatsApp alternative beside the CTA. TODO(copy) */
  whatsappCta: "Or message dispatch",
} as const;

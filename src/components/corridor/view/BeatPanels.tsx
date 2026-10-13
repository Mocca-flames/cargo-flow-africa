import { BEATS } from "../config";
import { BeatCopy } from "./BeatCopy";

/**
 * The stack of story cards, one per BEATS entry (config.ts). All cards are
 * absolutely stacked; the animation flips `data-active` on each as scroll
 * progress enters its [from, to) window — CSS fades the active one in.
 * To add a beat: append to BEATS in config.ts; nothing to change here.
 *
 * Placement differs by variant (CorridorDesktop.css vs CorridorMobile.css):
 * left column on desktop, bottom sheet on mobile.
 */
export function BeatPanels() {
  return (
    <div className="corridor__panels">
      {BEATS.map((b) => (
        <article key={b.id} className="corridor__panel" data-beat={b.id} data-active="false">
          <BeatCopy b={b} />
        </article>
      ))}
    </div>
  );
}

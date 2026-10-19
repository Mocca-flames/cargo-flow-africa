# Services Section — Next.js + GSAP Spec (v2)

Audience: the dev agent working in this repo. Adapt file paths to the repo's structure.

## 0. Decision summary

| Topic | Decision |
|---|---|
| Desktop scroll logic | GSAP `ScrollTrigger` replaces the hand-rolled `onScroll` math, `visualViewport` listener, boot guard, MutationObserver and the redundant IntersectionObserver |
| Desktop layout | CSS `position: sticky` inside a tall track. No `position: fixed`, no visibility gate, no `pin` |
| Mobile | **No scroll-jack.** Native scroll only. One sticky full-bleed backdrop, short text cards scroll over it, image swaps via opacity |
| Lenis | Desktop only, and only if it is already used site-wide. Never on mobile. Wire it into GSAP's ticker |
| Mobile static mode | Removed. The new mobile layout replaces it |
| Markup | One DOM for both breakpoints. CSS changes the layout, so there are no duplicate images |

## 1. What "no scroll-jack" means on mobile

Scroll-jack = JS or CSS that changes how far or how fast the page moves for a given swipe (pinning, scrubbing, snap, smooth-scroll libraries, scroll normalization, forced scroll distance).

Mobile must follow all of these rules:

- The browser owns scrolling and momentum. Swipe distance equals scroll distance.
- No `pin: true`, no `scrub`, no `snap` in the mobile branch.
- No `ScrollTrigger.normalizeScroll()`.
- No Lenis, no `touchmove` or `wheel` listeners, no `preventDefault`, no `touch-action` overrides.
- No `position: fixed` layers and no JS height math. Use `svh` units so the address bar can't change layout.
- The section is about 3 viewports tall, not 6. Cards are about 50svh each.
- JS only toggles a class on the active image. All motion is CSS opacity (compositor only).

Why it feels smooth: the page scrolls like any normal page, the backdrop uses CSS sticky (browser-native), and the only "effect" is a 0.5s opacity cross-fade.

## 2. Single DOM

```
section.services
  div.services-track
    div.services-sticky
      div.services-images           (6 × .services-image, next/image fill)
      div.services-panels            (6 × .services-panel)
      ol.services-progress           (6 × button.services-progress__dot, desktop only)
```

Panel content: `num`, `title`, `body`, optional CTA ("Learn more" link from the service `id`).

## 3. CSS

```css
.services { overflow: clip; }              /* NOT hidden/auto: they break sticky */
.services-track { position: relative; }

/* ---------- Desktop (>1024px) ---------- */
@media (min-width: 1025px) {
  .services-track { height: calc(6 * 100svh); }
  .services-sticky {
    position: sticky; top: 0; height: 100svh;
    display: grid; grid-template-columns: 55fr 45fr;
  }
  .services-panels { grid-column: 1; display: grid; grid-template-areas: "p"; align-content: center; }
  .services-panel {
    grid-area: p; opacity: 0; transform: translateY(32px); pointer-events: none;
    transition: opacity .6s var(--ease-out), transform .6s var(--ease-out);
  }
  .services-panel.is-active { opacity: 1; transform: none; pointer-events: auto; }
  .services-images { grid-column: 2; grid-row: 1; position: relative; }
  .services-image { position: absolute; inset: 6%; opacity: 0; transition: opacity .7s var(--ease-out); }
  .services-image.is-active { opacity: 1; }
}

/* ---------- Mobile / tablet (<=1024px): native scroll ---------- */
@media (max-width: 1024px) {
  .services-track { height: auto; }
  .services-sticky { display: contents; }   /* flatten wrapper so images and panels become track children */

  .services-images {
    position: sticky; top: 0; height: 100svh; z-index: 0;
    contain: strict;                         /* isolates paint/layout of the backdrop */
  }
  .services-image { position: absolute; inset: 0; opacity: 0; transition: opacity .5s ease-out; }
  .services-image.is-active { opacity: 1; will-change: opacity; }
  .services-image img { object-fit: cover; }

  /* Scrim: keeps text readable over any photo, heavier at the top where text sits */
  .services-images::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(to bottom, rgba(13,31,60,.72) 0%, rgba(13,31,60,.45) 55%, rgba(13,31,60,.15) 100%);
  }

  .services-panels { position: relative; z-index: 1; margin-top: -100svh; padding: 12svh var(--container-pad) 30svh; }
  .services-panel {
    min-height: 50svh;                        /* short cards: about 3 viewports in total */
    opacity: 1; transform: none; pointer-events: auto;
    max-width: 34rem;
  }
  .services-panel__title { font-size: clamp(var(--text-2xl), 7vw, var(--text-4xl)); }
  .services-panel__body  { font-size: var(--text-base); }
  .services-progress { display: none; }
}

@media (prefers-reduced-motion: reduce) {
  .services-panel, .services-image { transition: none; }
}
```

Layout rules for mobile:
- Text sits upper-middle. The bottom 25% of each screen stays clear for the thumb (hence the `30svh` bottom padding on the last card and a clear bottom zone while scrolling).
- Keep body copy short (2–3 lines). Long text belongs behind a "read more".
- Optional polish: solid `rgba(13,31,60,.6)` card background. Skip `backdrop-filter: blur` on low-tier devices because it is costly.

## 4. Component (Next.js App Router)

```tsx
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Service = { id: string; title: string; description: string; image: string; alt: string };

export default function Services({ services }: { services: Service[] }) {
  const root = useRef<HTMLElement>(null);
  const count = services.length;

  useGSAP(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const track  = el.querySelector<HTMLElement>('.services-track')!;
    const panels = q('.services-panel');
    const images = q('.services-image');
    const dots   = q('.services-progress__dot');

    let current = -1;
    const activate = (i: number) => {
      if (i === current) return;
      current = i;
      panels.forEach((p, k) => p.classList.toggle('is-active', k === i));
      images.forEach((m, k) => m.classList.toggle('is-active', k === i));
      dots.forEach((d, k) => {
        d.classList.toggle('is-active', k === i);
        d.classList.toggle('is-past', k < i);
      });
    };
    activate(0);

    const mm = gsap.matchMedia();

    // Desktop: progress through the tall track picks the panel. No pin, CSS sticky holds the stage.
    mm.add('(min-width: 1025px)', () => {
      const st = ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => activate(Math.min(count - 1, Math.floor(self.progress * count))),
      });

      const onDot = (i: number) => () => {
        const y = st.start + ((i + 0.5) / count) * (st.end - st.start);
        window.scrollTo({ top: y, behavior: 'smooth' });   // or lenis.scrollTo(y) if Lenis is active
      };
      const handlers = dots.map((d, i) => { const h = onDot(i); d.addEventListener('click', h); return h; });

      return () => dots.forEach((d, i) => d.removeEventListener('click', handlers[i]));
    });

    // Mobile / tablet: native scroll. No pin, no scrub, no snap. Triggers only toggle a class.
    mm.add('(max-width: 1024px)', () => {
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && activate(i),
        });
      });
    });
  }, { scope: root, dependencies: [count] });

  return (
    <section id="services" ref={root} className="services">
      <div className="services-track">
        <div className="services-sticky">
          <div className="services-images">
            {services.map((s, i) => (
              <div key={s.id} className="services-image">
                <Image
                  src={s.image} alt={s.alt} fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  quality={70}
                  priority={i < 2}
                />
              </div>
            ))}
          </div>

          <div className="services-panels">
            {services.map((s, i) => (
              <article key={s.id} className="services-panel">
                <span className="services-panel__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="services-panel__title">{s.title}</h3>
                <p className="services-panel__body">{s.description}</p>
              </article>
            ))}
          </div>

          <ol className="services-progress">
            {services.map((s, i) => (
              <li key={s.id}><button className="services-progress__dot" aria-label={s.title} /></li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
```

Notes:
- `useGSAP` + `matchMedia` auto-reverts all triggers on unmount and when the breakpoint changes. This avoids Next.js route-change leaks.
- State is class toggles via refs, not React state, so there are no re-renders while scrolling.
- Replace `window.scrollTo` with `lenis.scrollTo` if Lenis is active on desktop.
- First image `priority` (it's visible on arrival). Others lazy by default.
- `next.config`: `images: { formats: ['image/avif', 'image/webp'] }`. Use mobile-friendly sources (about 800–1080px wide, not the 620×1200 desktop crop). `object-fit: cover` handles the crop.

## 5. Lenis + GSAP

Keep Lenis only if other desktop sections rely on it. If so, sync it once, globally (not inside this component):

```ts
const mm = gsap.matchMedia();
mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  const tick = (t: number) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);
  return () => { gsap.ticker.remove(tick); lenis.destroy(); };
});
```

Touch devices never get Lenis. If nothing else needs smooth scrolling, Lenis can be dropped entirely. This section works fine on native scroll.

## 6. Delete from the old implementation

- `onScroll` math, `visualViewport` resize listener, `_bootGuard`
- MutationObserver retries and the `setTimeout` fallback
- Redundant IntersectionObserver
- Visibility gate (`opacity: 0` sticky) and `inert` toggling. Sticky is naturally bounded by its track
- `.services--static` mode and the JS-injected `.services-panel__mobile-img`
- The `content.js` HTML-injection step (render from props instead)
- `?debug=1` helpers, unless still wanted

## 7. Performance rules

- Mobile has zero scroll listeners of our own. ScrollTrigger uses one passive listener for all 6 triggers.
- Animate `opacity` and `transform` only.
- `will-change: opacity` only on the active image, never on all 6.
- `contain: strict` on the sticky backdrop.
- Do not use `backdrop-filter` or heavy `box-shadow` on mobile cards.
- Do not call `ScrollTrigger.refresh()` on resize or address-bar changes. `svh` and CSS-only layout make it unnecessary. If a refresh is needed after images load, call it once.
- Test on a mid-range Android in Chrome with the address bar collapsing.

## 8. Accessibility

- Panels stay in the DOM and are readable on mobile. On desktop, inactive panels are `pointer-events: none` and should get `aria-hidden="true"` while inactive.
- Progress dots are real `<button>`s with `aria-label`s. ArrowUp/ArrowDown on desktop triggers the previous or next dot.
- Images have meaningful `alt` text.
- `prefers-reduced-motion`: transitions off, same layout.

## 9. Acceptance checklist

- [ ] One swipe equals normal scroll distance on mobile. No snapping, no resistance, no momentum change.
- [ ] Mobile section is about 3 viewports tall, not 6.
- [ ] Image swaps when a card's text reaches roughly mid-screen, with a visible 0.5s cross-fade.
- [ ] Text stays readable on all 6 images (scrim check).
- [ ] Bottom 25% of the screen is free of text while scrolling.
- [ ] No jank when the address bar collapses or expands.
- [ ] Resizing across 1024px swaps layouts cleanly (matchMedia revert).
- [ ] Navigating away and back leaves no duplicate triggers.
- [ ] Lighthouse mobile: no layout shift from this section.
- [ ] No `fixed`, `pin`, `scrub`, `snap`, `normalizeScroll`, or Lenis in the mobile code path.

## 10. Tuning knobs

| Knob | Where | Default |
|---|---|---|
| When the image swaps on mobile | trigger `start`/`end` | `top 55%` / `bottom 55%` |
| Card height | `.services-panel { min-height }` | `50svh` |
| Scrim strength | `.services-images::after` | `.72 → .15` |
| Cross-fade speed | `.services-image` transition | `.5s` mobile, `.7s` desktop |
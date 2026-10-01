"use client";

import { useEffect, type RefObject } from "react";

const clamp = (value: number, min: number, max: number): number =>
  Math.min(Math.max(value, min), max);

const setVar = (stage: HTMLElement, name: string, value: number): void => {
  stage.style.setProperty(name, value.toFixed(4));
};

export function useHeroPointer(stageRef: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const supportsPointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const isDesktop = window.matchMedia("(min-width: 1024px)");

    if (!supportsPointer.matches || prefersReducedMotion.matches || !isDesktop.matches) {
      return;
    }

    const setPointer = (mx: number, my: number): void => {
      setVar(stage, "--mx", mx);
      setVar(stage, "--my", my);
    };

    let rafId = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let hasPointer = false;

    const stopLoop = (): void => {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    };

    const applyPointer = (): void => {
      const dx = targetX - currentX;
      const dy = targetY - currentY;

      if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
        currentX = targetX;
        currentY = targetY;
        setPointer(currentX, currentY);
        stopLoop();
        return;
      }

      currentX += dx * 0.08;
      currentY += dy * 0.08;
      setPointer(currentX, currentY);

      if (Math.abs(targetX - currentX) < 0.001 && Math.abs(targetY - currentY) < 0.001) {
        currentX = targetX;
        currentY = targetY;
        setPointer(currentX, currentY);
        stopLoop();
        return;
      }

      rafId = window.requestAnimationFrame(applyPointer);
    };

    const startLoop = (): void => {
      if (stage.classList.contains("is-offscreen") || rafId) return;
      rafId = window.requestAnimationFrame(applyPointer);
    };

    const setOffscreen = (isOffscreen: boolean): void => {
      stage.classList.toggle("is-offscreen", isOffscreen);
      if (isOffscreen) {
        stopLoop();
      }
    };

    const handlePointerMove = (event: PointerEvent): void => {
      if (!stage.classList.contains("is-ready") || stage.classList.contains("is-offscreen")) {
        return;
      }

      const rect = stage.getBoundingClientRect();
      const nx = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
      const ny = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);

      targetX = clamp(nx, -1, 1);
      targetY = clamp(ny, -1, 1);
      hasPointer = true;
      startLoop();
    };

    const handlePointerLeave = (): void => {
      targetX = 0;
      targetY = 0;
      hasPointer = false;
      startLoop();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        setOffscreen(!entry.isIntersecting);
      },
      { threshold: [0, 0.2, 0.5, 1] },
    );

    observer.observe(stage);

    const handleVisibility = (): void => {
      if (document.hidden) {
        setOffscreen(true);
        return;
      }

      stage.classList.remove("is-offscreen");
      if (hasPointer) {
        startLoop();
      }
    };

    const enablePointer = (): void => {
      stage.addEventListener("pointermove", handlePointerMove, { passive: true });
      stage.addEventListener("pointerleave", handlePointerLeave, { passive: true });
      stage.addEventListener("pointercancel", handlePointerLeave, { passive: true });
      document.addEventListener("visibilitychange", handleVisibility);
    };

    if (stage.classList.contains("is-ready")) {
      enablePointer();
    } else {
      const readyObserver = new MutationObserver((mutations) => {
        if (!mutations.some((mutation) => mutation.type === "attributes" && mutation.attributeName === "class")) {
          return;
        }

        if (stage.classList.contains("is-ready")) {
          readyObserver.disconnect();
          enablePointer();
        }
      });

      readyObserver.observe(stage, { attributes: true });
    }

    return () => {
      observer.disconnect();
      stage.removeEventListener("pointermove", handlePointerMove);
      stage.removeEventListener("pointerleave", handlePointerLeave);
      stage.removeEventListener("pointercancel", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibility);
      stopLoop();
    };
  }, [stageRef]);
}

"use client";

import { useEffect, useRef, type PointerEvent, type ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  href?: string;
  label?: string;
};

export default function GlassCard({ children, className = "", href, label }: GlassCardProps) {
  const frame = useRef<number | null>(null);

  useEffect(() => () => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
  }, []);

  function moveHighlight(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const card = event.currentTarget;
    const { left, top } = card.getBoundingClientRect();
    const x = event.clientX - left;
    const y = event.clientY - top;
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      card.style.setProperty("--cursor-x", `${x}px`);
      card.style.setProperty("--cursor-y", `${y}px`);
      card.dataset.highlight = "true";
      frame.current = null;
    });
  }

  function clearHighlight(event: PointerEvent<HTMLElement>) {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    frame.current = null;
    delete event.currentTarget.dataset.highlight;
  }

  const props = {
    className: `pd-glass ${href ? "pd-glass-link" : ""} ${className}`,
    onPointerMove: moveHighlight,
    onPointerLeave: clearHighlight,
    onPointerCancel: clearHighlight,
  };

  return href ? (
    <a {...props} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}>{children}</a>
  ) : (
    <div {...props}>{children}</div>
  );
}

export function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame: number | null = null;

    function hide() {
      if (frame !== null) cancelAnimationFrame(frame);
      frame = null;
      glow.current?.removeAttribute("data-active");
    }

    function move(event: globalThis.PointerEvent) {
      if (motion.matches || !finePointer.matches || event.pointerType !== "mouse") return;
      if (frame !== null) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (glow.current) {
          glow.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
          glow.current.dataset.active = "true";
        }
        frame = null;
      });
    }

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("blur", hide);
    document.documentElement.addEventListener("pointerleave", hide);
    motion.addEventListener("change", hide);
    finePointer.addEventListener("change", hide);
    return () => {
      hide();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("blur", hide);
      document.documentElement.removeEventListener("pointerleave", hide);
      motion.removeEventListener("change", hide);
      finePointer.removeEventListener("change", hide);
    };
  }, []);

  return <div className="pd-cursor-glow" ref={glow} aria-hidden="true" />;
}

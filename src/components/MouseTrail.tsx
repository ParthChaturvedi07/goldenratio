"use client";

import React, { useCallback, useRef } from "react";

const trailImages = [
  "/images/trail-1.png",
  "/images/trail-2.png",
  "/images/trail-3.png",
  "/images/trail-4.png",
];

interface MouseTrailProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export default function MouseTrail({ containerRef }: MouseTrailProps) {
  const imageIndexRef = useRef(0);
  const lastSpawnRef = useRef(0);
  const throttleMs = 120;

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawnRef.current < throttleMs) return;
      lastSpawnRef.current = now;

      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create trail image element
      const trailEl = document.createElement("div");
      trailEl.className = "trail-image";
      trailEl.style.left = `${x - 80}px`;
      trailEl.style.top = `${y - 80}px`;

      const img = document.createElement("img");
      img.src = trailImages[imageIndexRef.current % trailImages.length];
      img.alt = "";
      img.draggable = false;
      trailEl.appendChild(img);

      container.appendChild(trailEl);
      imageIndexRef.current++;

      // Remove after animation completes
      setTimeout(() => {
        if (trailEl.parentNode) {
          trailEl.parentNode.removeChild(trailEl);
        }
      }, 1400);
    },
    [containerRef]
  );

  return (
    <div
      className="absolute inset-0 z-10 hidden lg:block"
      onMouseMove={handleMouseMove}
    />
  );
}

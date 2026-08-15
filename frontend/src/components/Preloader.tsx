"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const PRELOADER_IMAGES = [
  "/images/1bef8902-e0b0-409a-9571-d90359822153.png",
  "/images/IMG_0615.jpg",
  "/images/IMG_0738.JPG",
  "/images/IMG_0727.JPG",
  "/images/IMG_0732.JPG",
  "/images/IMG_20221110_172236.jpg",
  "/images/IMG20251029190139.jpg"
];

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({
  onComplete,
}: PreloaderProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  const leftTextRef =
    useRef<HTMLSpanElement>(null);

  const rightTextRef =
    useRef<HTMLSpanElement>(null);

  const imageContainerRef =
    useRef<HTMLDivElement>(null);

  const imageRefs =
    useRef<HTMLImageElement[]>([]);

  const taglineRef =
    useRef<HTMLDivElement>(null);

  const hasExited = useRef(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const images = imageRefs.current;

      if (!images.length) return;

      gsap.set(leftTextRef.current, {
        x: 0,
      });

      gsap.set(rightTextRef.current, {
        x: 0,
      });

      gsap.set(imageContainerRef.current, {
        y: "100vh",
        opacity: 1,
        scale: 1,
      });

      gsap.set(images, {
        opacity: 0,
      });

      gsap.set(images[0], {
        opacity: 1,
      });

      gsap.set(taglineRef.current, {
        opacity: 0,
        y: 20,
      });

      const intro = gsap.timeline({
        defaults: {
          duration: 1.8,
          ease: "power4.inOut",
        },
      });

      const splitDistance =
        window.innerWidth <= 600
          ? window.innerWidth * 0.42
          : window.innerWidth * 0.40;

      intro.to(
        leftTextRef.current,
        {
          x: -splitDistance,
        },
        0.25
      );

      intro.to(
        rightTextRef.current,
        {
          x: splitDistance,
        },
        0.25
      );

      intro.to(
        imageContainerRef.current,
        {
          y: 0,
        },
        0.25
      );

      intro.to(
        taglineRef.current,
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
        },
        1.35
      );

      let currentIndex = 0;

      const imageInterval =
        window.setInterval(() => {
          if (hasExited.current) return;

          const previousIndex =
            currentIndex;

          currentIndex =
            (currentIndex + 1) %
            images.length;

          gsap.set(
            images[previousIndex],
            {
              opacity: 0,
            }
          );

          gsap.set(
            images[currentIndex],
            {
              opacity: 1,
            }
          );
        }, 180);

      const exitTimer =
        window.setTimeout(() => {
          if (hasExited.current) return;

          hasExited.current = true;

          clearInterval(imageInterval);

          const exit = gsap.timeline({
            defaults: {
              ease: "power3.inOut",
            },

            onComplete: () => {

              sessionStorage.setItem(
                "preloaderDone",
                "true"
              );

              onComplete();
            },
          });

          exit.to(
            taglineRef.current,
            {
              opacity: 0,
              y: 15,
              duration: 0.4,
            },
            0
          );

          exit.to(
            imageContainerRef.current,
            {
              opacity: 0,
              scale: 1.08,
              duration: 0.7,
            },
            0
          );

          exit.to(
            overlayRef.current,
            {
              opacity: 0,
              duration: 0.7,
              ease: "power2.out",
            },
            0.3
          );
        }, 5500);

      return () => {
        clearInterval(imageInterval);
        clearTimeout(exitTimer);
      };
    }, overlayRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="preloader"
    >
      <div className="preloader-center">

        <div className="preloader-title">

          <span
            ref={leftTextRef}
            className="preloader-word preloader-word-left font-bold"
          >
            GOLDEN
          </span>

          <span
            ref={rightTextRef}
            className="preloader-word preloader-word-right font-bold"
          >
            RATIO
          </span>

        </div>

        <div
          ref={imageContainerRef}
          className="preloader-image"
        >
          {PRELOADER_IMAGES.map(
            (src, index) => (
              <img
                key={src}
                ref={(el) => {
                  if (el) {
                    imageRefs.current[index] =
                      el;
                  }
                }}
                src={src}
                alt=""
                draggable={false}
              />
            )
          )}
        </div>
      </div>

      <div
        ref={taglineRef}
        className="preloader-tagline"
      >
        A TECHNOLOGY-FIRST DESIGN & BUILD STUDIO
        REDEFINING
        <br />
        SPEED, PRECISION, AND EXECUTION.
      </div>
    </div>
  );
}
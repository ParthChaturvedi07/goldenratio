"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LocomotiveScrollInstance = any;

interface SmoothScrollContextType {
  scroll: LocomotiveScrollInstance | null;
  isReady: boolean;
}

const SmoothScrollContext = createContext<SmoothScrollContextType>({
  scroll: null,
  isReady: false,
});

export const useSmoothScroll = () => useContext(SmoothScrollContext);

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export default function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [scroll, setScroll] = useState<LocomotiveScrollInstance | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!scrollRef.current) return;

    let locoScroll: LocomotiveScrollInstance | null = null;

    const initScroll = async () => {
      // Dynamic import — locomotive-scroll is client-only
      const LocomotiveScroll = (await import("locomotive-scroll")).default;

      locoScroll = new LocomotiveScroll({
        el: scrollRef.current!,
        smooth: true,
        multiplier: 0.8,
        lerp: 0.08,
        smartphone: { smooth: true },
        tablet: { smooth: true },
      });

      // ── Wire Locomotive into GSAP ScrollTrigger ──
      ScrollTrigger.scrollerProxy(scrollRef.current!, {
        scrollTop(value?: number) {
          if (arguments.length && value !== undefined) {
            locoScroll!.scrollTo(value, { duration: 0, disableLerp: true });
          }
          return locoScroll!.scroll.instance.scroll.y;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
        // Locomotive uses CSS transforms — tell ScrollTrigger about this
        pinType: (scrollRef.current as HTMLElement).style.transform
          ? "transform"
          : "fixed",
      });

      // Each time Locomotive updates, tell ScrollTrigger to refresh positions
      locoScroll.on("scroll", ScrollTrigger.update);

      // After everything is set up, refresh ScrollTrigger
      ScrollTrigger.addEventListener("refresh", () => locoScroll!.update());
      // Delay the initial refresh slightly so all DOM is laid out
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);

      setScroll(locoScroll);
      setIsReady(true);
    };

    initScroll();

    return () => {
      if (locoScroll) {
        ScrollTrigger.getAll().forEach((st) => st.kill());
        ScrollTrigger.removeEventListener("refresh", () =>
          locoScroll!.update()
        );
        locoScroll.destroy();
      }
    };
  }, []);

  return (
    <SmoothScrollContext.Provider value={{ scroll, isReady }}>
      <div
        ref={scrollRef}
        data-scroll-container
        id="smooth-scroll-container"
      >
        {children}
      </div>
    </SmoothScrollContext.Provider>
  );
}

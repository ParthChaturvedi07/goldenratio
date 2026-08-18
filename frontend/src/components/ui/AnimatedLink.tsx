"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  useRef,
  useState,
  PointerEvent,
  MouseEvent,
} from "react";

interface AnimatedLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "inverted";
}

export default function AnimatedLink({
  href,
  children,
  className,
  variant = "default",
}: AnimatedLinkProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  const [origin, setOrigin] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(0);
  const [hovered, setHovered] = useState(false);

  const updateOrigin = (
    e: PointerEvent<HTMLAnchorElement> | MouseEvent<HTMLAnchorElement>
  ) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const radius =
      Math.max(
        Math.hypot(x, y),
        Math.hypot(rect.width - x, y),
        Math.hypot(x, rect.height - y),
        Math.hypot(rect.width - x, rect.height - y)
      ) * 2;

    setOrigin({ x, y });
    setSize(radius);
  };

  const circleBg = variant === "inverted" ? "bg-[#f5f2ec]" : "bg-black";

  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Link
        ref={ref}
        href={href}
        onPointerEnter={(e) => {
          updateOrigin(e);
          setHovered(true);
        }}
        onPointerMove={updateOrigin}
        onPointerLeave={() => setHovered(false)}
        className={`relative overflow-hidden ${className}`}
      >
        <motion.span
          className={`absolute rounded-full ${circleBg} pointer-events-none`}
          style={{
            left: origin.x,
            top: origin.y,
            width: size,
            height: size,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            scale: hovered ? 1 : 0,
          }}
          transition={{
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1],
          }}
        />

        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      </Link>
    </motion.div>
  );
}
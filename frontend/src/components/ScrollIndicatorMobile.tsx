"use client";

import React from "react";
import { ArrowDown } from "lucide-react";

export default function ScrollIndicatorMobile() {
  const text = "SCROLL DOWN • TO EXPLORE • ";
  const chars = text.split("");

  return (
    <div className="md:hidden flex items-center justify-center py-10 w-full bg-[#f5f2ec]">
      <div className="relative flex items-center justify-center w-28 h-28">
        {/* Circling Text */}
        <div className="absolute inset-0 animate-[spin_12s_linear_infinite]">
          {chars.map((char, i) => (
            <span
              key={i}
              className="absolute left-1/2 top-0 bottom-0 flex flex-col justify-start w-4 -ml-2 text-[10px] font-semibold text-black/60 tracking-widest"
              style={{
                transform: `rotate(${i * (360 / chars.length)}deg)`,
              }}
            >
              {char}
            </span>
          ))}
        </div>
        
        {/* Bouncing Arrow */}
        <div className="animate-bounce mt-1">
          <ArrowDown className="w-5 h-5 text-black/80" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

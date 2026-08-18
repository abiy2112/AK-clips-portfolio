import React from "react";

interface AKLogoProps {
  className?: string;
  size?: number | string;
  rounded?: "full" | "2xl" | "3xl" | "xl" | "none";
  withGlassEffect?: boolean;
}

export default function AKLogo({
  className = "",
  size = 48,
  rounded = "2xl",
  withGlassEffect = false,
}: AKLogoProps) {
  const roundedClass = {
    full: "rounded-full",
    "3xl": "rounded-3xl",
    "2xl": "rounded-2xl",
    xl: "rounded-xl",
    none: "rounded-none",
  }[rounded];

  const sizeStyle = typeof size === "number" ? { width: size, height: size } : {};

  return (
    <div
      style={sizeStyle}
      className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden select-none ${roundedClass} ${
        withGlassEffect
          ? "shadow-[0_8px_32px_rgba(199,21,54,0.35)] ring-1 ring-white/20 after:absolute after:inset-0 after:rounded-inherit after:bg-gradient-to-b after:from-white/20 after:to-transparent after:pointer-events-none"
          : "shadow-lg"
      } ${className}`}
    >
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full object-cover"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="akRedGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C8102E" />
            <stop offset="50%" stopColor="#AD0D27" />
            <stop offset="100%" stopColor="#8A081D" />
          </linearGradient>
          <linearGradient id="cyanAccent" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7DE8F8" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>
          <linearGradient id="topGlassSheen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
            <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Crimson Red Background Container */}
        <rect width="500" height="500" fill="url(#akRedGrad)" />

        {/* Glass specular sheen on top half */}
        <rect width="500" height="260" fill="url(#topGlassSheen)" />

        {/* Black AK Graphic Monogram */}
        <g fill="#171516">
          {/* Left leg of A (slanted) */}
          <polygon points="50,358 108,358 238,154 182,154" />

          {/* Right vertical stem of A */}
          <rect x="195" y="154" width="44" height="204" rx="2" />

          {/* Left vertical stem of K */}
          <rect x="258" y="154" width="44" height="204" rx="2" />

          {/* Upper arm of K with curved brush tip */}
          <path d="M 302 242 L 406 140 C 418 135, 432 144, 428 158 C 424 172, 396 198, 364 230 L 302 292 Z" />

          {/* Lower leg of K */}
          <path d="M 324 260 L 436 348 C 448 358, 442 365, 426 360 L 302 278 Z" />
        </g>

        {/* Cyan Play Button Symbol inside 'A' */}
        <g transform="translate(194, 228)">
          <polygon
            points="0,0 50,28 0,56"
            fill="#122332"
            stroke="url(#cyanAccent)"
            strokeWidth="7.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>

        {/* Cyan Circle Symbol inside 'K' */}
        <circle
          cx="304"
          cy="258"
          r="9"
          fill="#122332"
          stroke="url(#cyanAccent)"
          strokeWidth="5.5"
        />
      </svg>
    </div>
  );
}

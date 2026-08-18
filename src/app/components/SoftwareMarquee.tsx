import React, { useRef, useState, useEffect } from "react";
import { Zap, Sparkles, Cpu, Sliders } from "lucide-react";

interface SoftwareTool {
  id: string;
  name: string;
  role: string;
  highlight: string;
  accentColor: string;
  glowClass: string;
  badge: string;
  renderLogo: () => React.ReactNode;
}

const SOFTWARE_TOOLS: SoftwareTool[] = [
  {
    id: "premiere",
    name: "Adobe Premiere Pro",
    role: "Lead Video Editing",
    highlight: "Multi-Cam, Pace & Cuts",
    accentColor: "#9999FF",
    badge: "Primary NLE",
    glowClass: "hover:border-[#9999FF]/80 hover:shadow-[0_0_25px_rgba(153,153,255,0.3)]",
    renderLogo: () => (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10 shrink-0 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="prBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B003D" />
            <stop offset="100%" stopColor="#00005B" />
          </linearGradient>
          <linearGradient id="prText" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E39BFF" />
            <stop offset="100%" stopColor="#9999FF" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="11" fill="url(#prBg)" />
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="10"
          stroke="#9999FF"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#prText)"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="-0.5px"
        >
          Pr
        </text>
      </svg>
    ),
  },
  {
    id: "aftereffects",
    name: "Adobe After Effects",
    role: "Motion Graphics & VFX",
    highlight: "Kinetic Typography, 3D Camera",
    accentColor: "#D292FF",
    badge: "VFX & Motion",
    glowClass: "hover:border-[#D292FF]/80 hover:shadow-[0_0_25px_rgba(210,146,255,0.3)]",
    renderLogo: () => (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10 shrink-0 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="aeBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#25004D" />
            <stop offset="100%" stopColor="#0B0024" />
          </linearGradient>
          <linearGradient id="aeText" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E9B8FF" />
            <stop offset="100%" stopColor="#D292FF" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="11" fill="url(#aeBg)" />
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="10"
          stroke="#D292FF"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#aeText)"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="-0.5px"
        >
          Ae
        </text>
      </svg>
    ),
  },
  {
    id: "capcut",
    name: "CapCut Pro",
    role: "Viral Short-Form & Pacing",
    highlight: "TikTok & Reels Retention",
    accentColor: "#00E5FF",
    badge: "Viral Shorts",
    glowClass: "hover:border-[#00E5FF]/80 hover:shadow-[0_0_25px_rgba(0,229,255,0.3)]",
    renderLogo: () => (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10 shrink-0 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="capcutGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#12161F" />
            <stop offset="100%" stopColor="#05070A" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="11" fill="url(#capcutGlow)" />
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="10"
          stroke="#00E5FF"
          strokeOpacity="0.5"
          strokeWidth="1.5"
        />
        <g transform="translate(6, 6) scale(0.9)">
          {/* CapCut Official Geometric Blade Top */}
          <path
            d="M10 9 H32 L23.5 18 H1.5 L10 9 Z"
            fill="#FFFFFF"
          />
          {/* CapCut Official Geometric Blade Bottom */}
          <path
            d="M1.5 22 H23.5 L32 31 H10 L1.5 22 Z"
            fill="#00E5FF"
          />
        </g>
      </svg>
    ),
  },
  {
    id: "figma",
    name: "Figma",
    role: "UI & Storyboard Flow",
    highlight: "Graphics & Thumbnails",
    accentColor: "#F24E1E",
    badge: "Design",
    glowClass: "hover:border-[#F24E1E]/80 hover:shadow-[0_0_25px_rgba(242,78,30,0.3)]",
    renderLogo: () => (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10 shrink-0 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="48" height="48" rx="11" fill="#18181B" />
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="10"
          stroke="#F24E1E"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
        <g transform="translate(13, 8) scale(0.58)">
          <path
            d="M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z"
            fill="#F24E1E"
          />
          <path
            d="M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z"
            fill="#FF7262"
          />
          <path
            d="M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z"
            fill="#A259FF"
          />
          <path
            d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z"
            fill="#1ABCFE"
          />
          <path
            d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z"
            fill="#0ACF83"
          />
        </g>
      </svg>
    ),
  },
  {
    id: "photoshop",
    name: "Adobe Photoshop",
    role: "Thumbnail & Graphics",
    highlight: "High-CTR Cover Art",
    accentColor: "#31A8FF",
    badge: "Graphics",
    glowClass: "hover:border-[#31A8FF]/80 hover:shadow-[0_0_25px_rgba(49,168,255,0.3)]",
    renderLogo: () => (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10 shrink-0 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="psBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#001D34" />
            <stop offset="100%" stopColor="#000D1C" />
          </linearGradient>
          <linearGradient id="psText" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7CD1FF" />
            <stop offset="100%" stopColor="#31A8FF" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="11" fill="url(#psBg)" />
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="10"
          stroke="#31A8FF"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#psText)"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="-0.5px"
        >
          Ps
        </text>
      </svg>
    ),
  },
  {
    id: "mediaencoder",
    name: "Adobe Media Encoder",
    role: "Rendering & Pipeline",
    highlight: "High-Bitrate 4K 60FPS",
    accentColor: "#FFA000",
    badge: "Export",
    glowClass: "hover:border-[#FFA000]/80 hover:shadow-[0_0_25px_rgba(255,160,0,0.3)]",
    renderLogo: () => (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10 shrink-0 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="meBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1B261D" />
            <stop offset="100%" stopColor="#0B181E" />
          </linearGradient>
          <linearGradient id="meText" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFD366" />
            <stop offset="100%" stopColor="#FFA000" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="11" fill="url(#meBg)" />
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="10"
          stroke="#FFA000"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#meText)"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="-0.5px"
        >
          Me
        </text>
      </svg>
    ),
  },
  {
    id: "illustrator",
    name: "Adobe Illustrator",
    role: "Vector & Branding",
    highlight: "Logos & Dynamic Assets",
    accentColor: "#FF9A00",
    badge: "Vector",
    glowClass: "hover:border-[#FF9A00]/80 hover:shadow-[0_0_25px_rgba(255,154,0,0.3)]",
    renderLogo: () => (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10 shrink-0 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="aiBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#331000" />
            <stop offset="100%" stopColor="#1A0600" />
          </linearGradient>
          <linearGradient id="aiText" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFC866" />
            <stop offset="100%" stopColor="#FF9A00" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="11" fill="url(#aiBg)" />
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="10"
          stroke="#FF9A00"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#aiText)"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="-0.5px"
        >
          Ai
        </text>
      </svg>
    ),
  },
  {
    id: "davinci",
    name: "DaVinci Resolve",
    role: "Color Grading & Finishing",
    highlight: "Cinematic LUTs & Scopes",
    accentColor: "#FF453A",
    badge: "Colorist",
    glowClass: "hover:border-[#FF453A]/80 hover:shadow-[0_0_25px_rgba(255,69,58,0.3)]",
    renderLogo: () => (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10 shrink-0 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="dvrBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1F2228" />
            <stop offset="100%" stopColor="#0E1014" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="11" fill="url(#dvrBg)" />
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="10"
          stroke="#FF453A"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
        <g transform="translate(24, 24)">
          {/* DaVinci 3-Color Pinwheel Aperture */}
          <path
            d="M0 -14 C5 -14, 11 -8, 10 -1 C9 3, 4 4, 0 0 C-1 -4, -1 -9, 0 -14 Z"
            fill="#FF3B30"
          />
          <path
            d="M0 -14 C5 -14, 11 -8, 10 -1 C9 3, 4 4, 0 0 C-1 -4, -1 -9, 0 -14 Z"
            fill="#34C759"
            transform="rotate(120)"
          />
          <path
            d="M0 -14 C5 -14, 11 -8, 10 -1 C9 3, 4 4, 0 0 C-1 -4, -1 -9, 0 -14 Z"
            fill="#007AFF"
            transform="rotate(240)"
          />
          <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
        </g>
      </svg>
    ),
  },
  {
    id: "blender",
    name: "Blender 3D",
    role: "3D Motion & Visual FX",
    highlight: "Camera Tracking & Assets",
    accentColor: "#F5792A",
    badge: "3D Studio",
    glowClass: "hover:border-[#F5792A]/80 hover:shadow-[0_0_25px_rgba(245,121,42,0.3)]",
    renderLogo: () => (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10 shrink-0 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="blenderBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E252D" />
            <stop offset="100%" stopColor="#0E1217" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="11" fill="url(#blenderBg)" />
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="10"
          stroke="#F5792A"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
        <g transform="translate(24, 24) scale(0.68)">
          <path
            d="M0 -16 C-2 -16, -3 -15, -4 -13 L-14 5 C-16 8, -14 13, -10 15 C-5 18, 5 18, 10 15 C14 13, 16 8, 14 5 L4 -13 C3 -15, 2 -16, 0 -16 Z"
            fill="#EA7600"
          />
          <circle cx="0" cy="5" r="9" fill="#FFFFFF" />
          <circle cx="0" cy="5" r="5.5" fill="#225797" />
          <circle cx="0" cy="-18" r="3" fill="#EA7600" />
          <circle cx="-16" cy="-8" r="3" fill="#EA7600" />
          <circle cx="16" cy="-8" r="3" fill="#EA7600" />
        </g>
      </svg>
    ),
  },
  {
    id: "audition",
    name: "Adobe Audition",
    role: "Audio Mastering & Mixing",
    highlight: "Waveform Cleanup & Bass",
    accentColor: "#00E4BB",
    badge: "Audio DSP",
    glowClass: "hover:border-[#00E4BB]/80 hover:shadow-[0_0_25px_rgba(0,228,187,0.3)]",
    renderLogo: () => (
      <svg
        viewBox="0 0 48 48"
        className="w-10 h-10 shrink-0 drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="auBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#002D30" />
            <stop offset="100%" stopColor="#001416" />
          </linearGradient>
          <linearGradient id="auText" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#55FFE0" />
            <stop offset="100%" stopColor="#00E4BB" />
          </linearGradient>
        </defs>
        <rect width="48" height="48" rx="11" fill="url(#auBg)" />
        <rect
          x="1"
          y="1"
          width="46"
          height="46"
          rx="10"
          stroke="#00E4BB"
          strokeOpacity="0.6"
          strokeWidth="1.5"
        />
        <text
          x="50%"
          y="54%"
          dominantBaseline="middle"
          textAnchor="middle"
          fill="url(#auText)"
          fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
          fontWeight="900"
          fontSize="22"
          letterSpacing="-0.5px"
        >
          Au
        </text>
      </svg>
    ),
  },
];

export default function SoftwareMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Quadruple the list to create a seamless infinite scrolling ribbon
  const displayTools = [
    ...SOFTWARE_TOOLS,
    ...SOFTWARE_TOOLS,
    ...SOFTWARE_TOOLS,
    ...SOFTWARE_TOOLS,
  ];

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (containerRef.current && !isDragging) {
        // Speed: 0.045px/ms, slows down on hover for easy inspection
        const speed = isHovered ? 0.012 : 0.045;
        containerRef.current.scrollLeft += speed * delta;

        const maxScroll = containerRef.current.scrollWidth / 2;
        if (containerRef.current.scrollLeft >= maxScroll) {
          containerRef.current.scrollLeft -= maxScroll;
        }
      }

      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setIsHovered(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="py-12 relative z-10 select-none">
      <div className="max-w-5xl mx-auto px-4 mb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 shadow-inner">
              <Sliders className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Production Software & Creative Toolkit</span>
                <span className="px-2 py-0.5 rounded-md bg-[#C8102E]/20 border border-[#C8102E]/40 text-[10px] text-[#ff4b67] font-semibold">
                  Official Suite
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Official industry-standard editing engines powering every AK clipps production
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <span className="inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-400">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>4K 60FPS • Metal / CUDA</span>
            </span>
          </div>
        </div>
      </div>

      {/* Moving Marquee Strip Container */}
      <div className="w-full relative overflow-hidden">
        {/* Soft edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-[#090D16] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-[#090D16] to-transparent z-20 pointer-events-none"></div>

        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-3.5 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing px-4 sm:px-8 py-3"
          style={{ scrollBehavior: "auto" }}
        >
          {displayTools.map((tool, idx) => (
            <div
              key={`${tool.id}-${idx}`}
              className={`shrink-0 flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-800 transition-all duration-200 shadow-lg group hover:scale-[1.03] ${tool.glowClass}`}
            >
              {/* Official App Logo */}
              <div className="shrink-0 transition-transform duration-200 group-hover:scale-105">
                {tool.renderLogo()}
              </div>

              {/* Tool Information */}
              <div className="min-w-0 pr-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-white group-hover:text-white transition-colors whitespace-nowrap">
                    {tool.name}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[9px] font-mono text-slate-300 border border-slate-700">
                    {tool.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 whitespace-nowrap flex items-center gap-1.5 mt-0.5">
                  <span className="text-slate-300">{tool.role}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-cyan-400/90 font-mono text-[10px]">
                    {tool.highlight}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useRef, useState, useEffect } from "react";
import { Zap, Layers, Sparkles } from "lucide-react";

interface SoftwareTool {
  id: string;
  name: string;
  badge: string;
  badgeColor: string;
  textColor: string;
  borderColor: string;
  glowColor: string;
  role: string;
  highlight: string;
}

const SOFTWARE_TOOLS: SoftwareTool[] = [
  {
    id: "premiere",
    name: "Adobe Premiere Pro",
    badge: "Pr",
    badgeColor: "bg-[#00005B]",
    textColor: "text-[#9999FF]",
    borderColor: "border-[#9999FF]/40",
    glowColor: "group-hover:border-[#9999FF]",
    role: "Video Editing",
    highlight: "Multi-Cam, Pace & Cuts",
  },
  {
    id: "aftereffects",
    name: "Adobe After Effects",
    badge: "Ae",
    badgeColor: "bg-[#00005B]",
    textColor: "text-[#9999FF]",
    borderColor: "border-[#9999FF]/40",
    glowColor: "group-hover:border-[#9999FF]",
    role: "Motion Graphics & VFX",
    highlight: "Kinetic Typography, 3D Camera",
  },
  {
    id: "mediaencoder",
    name: "Adobe Media Encoder",
    badge: "Me",
    badgeColor: "bg-[#0A1C2A]",
    textColor: "text-[#E09F3E]",
    borderColor: "border-[#E09F3E]/40",
    glowColor: "group-hover:border-[#E09F3E]",
    role: "Rendering & Pipeline",
    highlight: "High-Bitrate 4K 60FPS",
  },
  {
    id: "capcut",
    name: "CapCut Pro",
    badge: "CapCut",
    badgeColor: "bg-black",
    textColor: "text-[#00E5FF]",
    borderColor: "border-[#00E5FF]/40",
    glowColor: "group-hover:border-[#00E5FF]",
    role: "Viral Short-Form",
    highlight: "TikTok & Reels Retention",
  },
  {
    id: "figma",
    name: "Figma",
    badge: "Fg",
    badgeColor: "bg-[#1E1E1E]",
    textColor: "text-[#F24E1E]",
    borderColor: "border-[#F24E1E]/40",
    glowColor: "group-hover:border-[#F24E1E]",
    role: "UI & Layout Design",
    highlight: "Storyboards & Visual Flow",
  },
  {
    id: "photoshop",
    name: "Adobe Photoshop",
    badge: "Ps",
    badgeColor: "bg-[#001E36]",
    textColor: "text-[#31A8FF]",
    borderColor: "border-[#31A8FF]/40",
    glowColor: "group-hover:border-[#31A8FF]",
    role: "Thumbnail & Graphics",
    highlight: "High-CTR Cover Art",
  },
  {
    id: "illustrator",
    name: "Adobe Illustrator",
    badge: "Ai",
    badgeColor: "bg-[#330000]",
    textColor: "text-[#FF9A00]",
    borderColor: "border-[#FF9A00]/40",
    glowColor: "group-hover:border-[#FF9A00]",
    role: "Vector & Branding",
    highlight: "Logos & Dynamic Assets",
  },
];

export default function SoftwareMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Triple the list to create a seamless infinite scrolling ribbon
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
        // Speed: 0.045px/ms, slower on hover
        const speed = isHovered ? 0.01 : 0.045;
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
    <section className="py-8 relative z-10 select-none">
      <div className="max-w-5xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-slate-800 text-cyan-400">
              <Zap className="w-3.5 h-3.5 fill-current" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                <span>Production Software & Creative Toolkit</span>
                <span className="px-1.5 py-0.2 rounded bg-red-950/60 border border-red-800/40 text-[10px] text-[#ff4b67] font-semibold">
                  Pro Suite
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Industry standard post-production tools powering every project
              </p>
            </div>
          </div>
          <span className="hidden sm:inline text-[10px] font-mono text-slate-500">
            ⚡ GPU Accelerated
          </span>
        </div>
      </div>

      {/* Moving Marquee Strip Container */}
      <div className="w-full relative overflow-hidden">
        {/* Fade gradients on edges */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#090D16] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#090D16] to-transparent z-20 pointer-events-none"></div>

        <div
          ref={containerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="flex gap-3 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing px-4 sm:px-6 py-2"
          style={{ scrollBehavior: "auto" }}
        >
          {displayTools.map((tool, idx) => (
            <div
              key={`${tool.id}-${idx}`}
              className={`shrink-0 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all duration-200 shadow-md group hover:scale-[1.02]`}
            >
              {/* App Icon Badge */}
              <div
                className={`w-10 h-10 rounded-xl ${tool.badgeColor} border ${tool.borderColor} flex items-center justify-center font-bold font-mono text-xs sm:text-sm ${tool.textColor} shadow-inner shrink-0 group-hover:scale-105 transition-transform`}
              >
                {tool.badge}
              </div>

              {/* Info */}
              <div className="min-w-0 pr-1">
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors whitespace-nowrap">
                  {tool.name}
                </div>
                <div className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                  <span>{tool.role}</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-500 font-mono text-[9px]">
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

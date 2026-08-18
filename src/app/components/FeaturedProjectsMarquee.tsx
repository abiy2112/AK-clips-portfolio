import React, { useRef, useState, useEffect } from "react";
import { Play, ExternalLink, Film, Zap, Plus, Sparkles } from "lucide-react";
import { ProjectItem } from "../types/project";

interface FeaturedProjectsMarqueeProps {
  projects: ProjectItem[];
  onSelectProject?: (project: ProjectItem) => void;
  onOpenUpload?: () => void;
}

export default function FeaturedProjectsMarquee({
  projects,
  onSelectProject,
  onOpenUpload,
}: FeaturedProjectsMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // If projects is small, repeat more times to ensure seamless infinite looping
  const repeatCount = projects.length <= 3 ? 6 : projects.length <= 6 ? 4 : 3;
  const displayProjects: ProjectItem[] = [];
  for (let i = 0; i < repeatCount; i++) {
    displayProjects.push(...projects);
  }

  // Auto-scroll loop with slow down on hover
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (containerRef.current && !isDragging) {
        // Speed: 0.045px/ms normally, 0.009px/ms on hover (significantly slowed down)
        const speed = isHovered ? 0.009 : 0.045;
        containerRef.current.scrollLeft += speed * delta;

        // Reset scroll seamlessly when reaching halfway
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

  // Mouse Drag handlers
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

  const getThumbnailSrc = (p: ProjectItem) => {
    if (p.thumbnailUrl) return p.thumbnailUrl;
    if (p.type === "youtube" || (!p.type && !p.id.startsWith("gdrive-") && !p.id.startsWith("custom-"))) {
      return `https://img.youtube.com/vi/${p.id}/mqdefault.jpg`;
    }
    return "";
  };

  return (
    <div className="w-full relative select-none py-2">
      {/* Side Fade Mask for Clean Infinite Ticker look */}
      <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#090D16] to-transparent z-20 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#090D16] to-transparent z-20 pointer-events-none"></div>

      {/* Scrollable / Draggable Container */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="flex gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing px-4 sm:px-6 py-2"
        style={{ scrollBehavior: isDragging ? "auto" : "auto" }}
      >
        {displayProjects.map((p, idx) => {
          const thumb = getThumbnailSrc(p);

          return (
            <div
              key={`${p.id}-${idx}`}
              onClick={(e) => {
                if (isDragging) {
                  e.preventDefault();
                  return;
                }
                if (onSelectProject) {
                  onSelectProject(p);
                }
              }}
              className="shrink-0 w-[240px] sm:w-[270px] group rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 hover:scale-[1.01] transition-all duration-200 overflow-hidden shadow-md cursor-pointer"
            >
              {/* 16:9 Video Thumbnail */}
              <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
                {thumb ? (
                  <img
                    src={thumb}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950 p-4 text-center">
                    <Film className="w-8 h-8 text-cyan-400 mb-1" />
                    <span className="text-[10px] text-slate-400 font-mono">
                      {p.sourceLabel || "AK Video Cut"}
                    </span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-[#C8102E] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Category Tag */}
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-slate-200">
                  {p.category}
                </div>

                {/* Custom Badge if uploaded */}
                {p.isCustom && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-cyan-950/90 border border-cyan-700/60 text-[9px] font-bold text-cyan-300">
                    ⚡ New
                  </div>
                )}
              </div>

              {/* Title & Metadata */}
              <div className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                    {p.title}
                  </h4>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 shrink-0 transition-colors" />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>AK clipps • {p.sourceLabel || "YouTube Cut"}</span>
                  {p.duration && <span className="font-mono text-slate-500">{p.duration}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Marquee Footer Subtext & Upload Shortcut */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 mt-2 px-4 sm:px-6">
        <span>← Autoscrolling • Hover to slow down • Drag or swipe horizontally to explore →</span>
        {onOpenUpload && (
          <button
            type="button"
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>⚡ Upload Video (Passcode: 5252)</span>
          </button>
        )}
      </div>
    </div>
  );
}

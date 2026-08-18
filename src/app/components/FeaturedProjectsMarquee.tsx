import React, { useRef, useState, useEffect } from "react";
import { Play, ExternalLink } from "lucide-react";

interface ProjectItem {
  id: string;
  title: string;
  category: string;
  duration?: string;
}

interface FeaturedProjectsMarqueeProps {
  projects: ProjectItem[];
}

export default function FeaturedProjectsMarquee({
  projects,
}: FeaturedProjectsMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Repeat list multiple times for continuous scrolling
  const displayProjects = [
    ...projects,
    ...projects,
    ...projects,
    ...projects,
  ];

  // Auto-scroll loop with slow down on hover
  useEffect(() => {
    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (containerRef.current && !isDragging) {
        // Speed: 0.05px/ms normally, 0.008px/ms on hover (significantly slowed down)
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

  return (
    <div className="w-full relative overflow-hidden select-none py-2">
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
        {displayProjects.map((p, idx) => (
          <a
            key={`${p.id}-${idx}`}
            href={`https://youtube.com/watch?v=${p.id}`}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => {
              if (isDragging) e.preventDefault();
            }}
            className="shrink-0 w-[240px] sm:w-[270px] group rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-600 transition-all duration-200 overflow-hidden shadow-md"
          >
            {/* 16:9 Video Thumbnail */}
            <div className="relative aspect-video bg-black overflow-hidden">
              <img
                src={`https://img.youtube.com/vi/${p.id}/mqdefault.jpg`}
                alt={p.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
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
            </div>

            {/* Title & Metadata */}
            <div className="p-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                  {p.title}
                </h4>
                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-slate-300 shrink-0 transition-colors" />
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                AK clipps • YouTube Cut
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="text-center text-[11px] text-slate-400 mt-2">
        <span>← Autoscrolling • Hover to slow down • Drag or swipe horizontally to explore →</span>
      </div>
    </div>
  );
}

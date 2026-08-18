import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  ExternalLink,
  Film,
  Zap,
  LayoutGrid,
  Sparkles,
  Layers,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { ProjectItem } from "../types/project";

interface FeaturedProjectsMarqueeProps {
  projects: ProjectItem[];
  onSelectProject?: (project: ProjectItem) => void;
  onOpenUpload?: () => void;
  onDeleteProject?: (projectId: string) => void;
}

const CATEGORY_FILTERS = [
  "All",
  "My Uploads",
  "TikTok & Shorts",
  "Cinematic Documentary",
  "Social Media Promo",
  "Creative Typography",
];

export default function FeaturedProjectsMarquee({
  projects,
  onSelectProject,
  onOpenUpload,
  onDeleteProject,
}: FeaturedProjectsMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [viewMode, setViewMode] = useState<"marquee" | "grid">("marquee");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const customProjects = projects.filter((p) => p.isCustom);
  const latestCustom = customProjects.length > 0 ? customProjects[0] : null;

  // Filter projects for Grid view
  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === "All") return true;
    if (selectedCategory === "My Uploads") return p.isCustom;
    return p.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  // If projects is small, repeat more times to ensure seamless infinite looping
  const repeatCount = projects.length <= 3 ? 6 : projects.length <= 6 ? 4 : 3;
  const displayProjects: ProjectItem[] = [];
  for (let i = 0; i < repeatCount; i++) {
    displayProjects.push(...projects);
  }

  // Auto-scroll loop with slow down on hover and touch drag
  useEffect(() => {
    if (viewMode !== "marquee") return;

    let animationFrameId: number;
    let lastTime = performance.now();

    const scrollLoop = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      if (containerRef.current && !isDragging) {
        const speed = isHovered ? 0.009 : 0.045;
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
  }, [isHovered, isDragging, viewMode, projects]);

  // Mouse / Touch Drag handlers
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

  // Touch handlers for mobile phone swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;
    setIsDragging(true);
    setStartX(e.touches[0].pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const x = e.touches[0].pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  const getThumbnailSrc = (p: ProjectItem) => {
    if (p.thumbnailUrl) return p.thumbnailUrl;
    if (
      p.type === "youtube" ||
      (!p.type && !p.id.startsWith("gdrive-") && !p.id.startsWith("custom-"))
    ) {
      return `https://img.youtube.com/vi/${p.id}/mqdefault.jpg`;
    }
    return "";
  };

  return (
    <div className="w-full relative select-none py-2 space-y-4">
      {/* View Toggle Bar & Filter Controls (Optimized for Mobile & Desktop) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 sm:px-2">
        {/* Category Pills with My Uploads Highlight */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 max-w-full">
          {CATEGORY_FILTERS.map((cat) => {
            const isUploadCat = cat === "My Uploads";
            const isSelected = selectedCategory === cat;
            const count =
              cat === "All"
                ? projects.length
                : isUploadCat
                ? customProjects.length
                : projects.filter((p) =>
                    p.category.toLowerCase().includes(cat.toLowerCase())
                  ).length;

            if (isUploadCat && customProjects.length === 0) {
              return null; // Only show if custom uploads exist
            }

            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  if (cat === "My Uploads") {
                    setViewMode("grid"); // Auto-switch to grid to easily view uploads
                  }
                }}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? isUploadCat
                      ? "bg-gradient-to-r from-[#C8102E] to-red-600 text-white shadow-md shadow-red-950/50 scale-105 border border-red-500/40"
                      : "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-950/30 scale-105"
                    : isUploadCat
                    ? "bg-red-950/50 border border-red-800/60 text-red-300 hover:text-white"
                    : "bg-slate-900/90 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
                }`}
              >
                {isUploadCat && <Zap className="w-3 h-3 fill-current text-amber-300" />}
                <span>{cat}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? "bg-black/30 text-white"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Switcher: Marquee vs Grid */}
        <div className="flex items-center gap-1 self-end sm:self-auto bg-slate-900/90 border border-slate-800 p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("marquee")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === "marquee"
                ? "bg-[#C8102E] text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Cinematic Continuous Ticker"
          >
            <Film className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Ticker</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              viewMode === "grid"
                ? "bg-[#C8102E] text-white shadow-sm font-semibold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Interactive Grid Gallery"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Grid ({projects.length})</span>
          </button>
        </div>
      </div>

      {/* Prominent "Just Uploaded" Notification Banner (Instant Feedback for Uploaded Videos) */}
      {latestCustom && (
        <div className="mx-1 sm:mx-2 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border border-red-800/60 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-16 h-10 sm:w-20 sm:h-12 rounded-xl bg-black overflow-hidden shrink-0 border border-red-800/80 shadow-md">
              {latestCustom.thumbnailUrl ? (
                <img
                  src={latestCustom.thumbnailUrl}
                  alt={latestCustom.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-950 text-slate-500">
                  <Film className="w-4 h-4 text-cyan-400" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 fill-white text-white" />
              </div>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.2 rounded bg-[#C8102E] text-white text-[9px] font-bold">
                  ⚡ CUSTOM UPLOAD
                </span>
                <span className="text-[10px] text-slate-400 truncate">
                  {latestCustom.category} • {latestCustom.sourceLabel || "Direct Link"}
                </span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-white truncate mt-0.5">
                {latestCustom.title}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={() => onSelectProject?.(latestCustom)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C8102E] hover:bg-[#b00e27] text-white text-xs font-bold shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play Video Now</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("My Uploads");
                setViewMode("grid");
              }}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
            >
              View All Uploads ({customProjects.length})
            </button>
          </div>
        </div>
      )}

      {/* MODE 1: Continuous Infinite Marquee Ticker */}
      {viewMode === "marquee" && (
        <div className="w-full relative overflow-hidden">
          {/* Side Fade Mask for Clean Infinite Ticker look */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-[#090D16] to-transparent z-20 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-[#090D16] to-transparent z-20 pointer-events-none"></div>

          {/* Scrollable / Draggable / Touch Container */}
          <div
            ref={containerRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            className="flex gap-3.5 sm:gap-4 overflow-x-auto scrollbar-hide cursor-grab active:cursor-grabbing px-2 sm:px-6 py-2 touch-pan-x"
            style={{ scrollBehavior: "auto" }}
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
                    onSelectProject?.(p);
                  }}
                  className={`shrink-0 w-[240px] sm:w-[280px] group rounded-2xl bg-slate-900/90 border transition-all duration-200 overflow-hidden shadow-lg cursor-pointer ${
                    p.isCustom
                      ? "border-red-600/70 hover:border-red-500 hover:scale-[1.02] shadow-red-950/30"
                      : "border-slate-800 hover:border-slate-600 hover:scale-[1.01]"
                  }`}
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
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-slate-200">
                      {p.category}
                    </div>

                    {/* Custom Badge if uploaded */}
                    {p.isCustom && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#C8102E] border border-red-500/50 text-[9px] font-bold text-white shadow-md">
                        ⚡ UPLOADED
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
                      <span className="truncate">
                        AK clipps • {p.sourceLabel || "Video Cut"}
                      </span>
                      {p.duration && (
                        <span className="font-mono text-slate-500 shrink-0 ml-1">
                          {p.duration}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: Responsive Grid Gallery (Optimized for Phones & Large Displays) */}
      {viewMode === "grid" && (
        <div className="px-1 sm:px-2 animate-fade-in">
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-4">
              {filteredProjects.map((p) => {
                const thumb = getThumbnailSrc(p);

                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectProject?.(p)}
                    className={`group rounded-2xl bg-slate-900/90 border transition-all duration-200 overflow-hidden shadow-md cursor-pointer ${
                      p.isCustom
                        ? "border-red-600/70 hover:border-red-500 hover:scale-[1.02]"
                        : "border-slate-800 hover:border-slate-600 hover:scale-[1.01]"
                    }`}
                  >
                    {/* 16:9 Aspect Video Preview */}
                    <div className="relative aspect-video bg-black overflow-hidden flex items-center justify-center">
                      {thumb ? (
                        <img
                          src={thumb}
                          alt={p.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 p-4 text-center">
                          <Film className="w-8 h-8 text-cyan-400 mb-1" />
                          <span className="text-[10px] text-slate-400 font-mono">
                            {p.sourceLabel || "Direct Video"}
                          </span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-[#C8102E] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
                          <Play className="w-4 h-4 fill-current ml-0.5" />
                        </div>
                      </div>

                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-sm border border-white/10 text-[10px] font-semibold text-slate-200">
                        {p.category}
                      </div>

                      {p.isCustom && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-[#C8102E] border border-red-500/50 text-[9px] font-bold text-white shadow-md">
                          ⚡ UPLOADED
                        </div>
                      )}
                    </div>

                    {/* Metadata & Actions */}
                    <div className="p-3">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-cyan-400 transition-colors truncate">
                          {p.title}
                        </h4>
                        {p.isCustom && onDeleteProject && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteProject(p.id);
                            }}
                            className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-800 transition-colors"
                            title="Delete custom video"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div className="text-[10px] text-slate-400 mt-1 flex items-center justify-between">
                        <span className="truncate">
                          AK clipps • {p.sourceLabel || "Video Cut"}
                        </span>
                        {p.duration && (
                          <span className="font-mono text-slate-500 shrink-0 ml-1">
                            {p.duration}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 p-6 space-y-3">
              <Film className="w-10 h-10 text-slate-600 mx-auto" />
              <div className="text-sm font-bold text-white">No projects found in this category</div>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {selectedCategory === "My Uploads"
                  ? "You haven't uploaded any custom videos yet. Click upload to add one!"
                  : "Try selecting 'All' or another category filter above."}
              </p>
              {onOpenUpload && (
                <button
                  type="button"
                  onClick={onOpenUpload}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8102E] text-white text-xs font-bold shadow-md hover:bg-[#b00e27] cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>Upload Video Now</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer Subtext */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 px-1 sm:px-2 pt-1">
        <span>
          {viewMode === "marquee"
            ? "← Autoscrolling ticker • Tap any project to play in 4K theater • Drag/swipe to browse →"
            : `Showing ${filteredProjects.length} of ${projects.length} project cuts`}
        </span>
        {onOpenUpload && (
          <button
            type="button"
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-cyan-400 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Upload Another Video</span>
          </button>
        )}
      </div>
    </div>
  );
}

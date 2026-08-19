import React, { useEffect, useState } from "react";
import { X, ExternalLink, Film, Play, Sparkles, Volume2, VolumeX, Maximize2 } from "lucide-react";
import { ProjectItem } from "../types/project";

interface VideoPlayerModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function VideoPlayerModal({
  project,
  onClose,
}: VideoPlayerModalProps) {
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      window.addEventListener("keydown", handleKeyDown);
      // Lock body scroll on mobile
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  if (!project) return null;

  const rawUrl = (project.videoUrl || "").trim();
  const lowerUrl = rawUrl.toLowerCase();
  const categoryLower = (project.category || "").toLowerCase();

  const isVerticalFormat =
    categoryLower.includes("tiktok") ||
    categoryLower.includes("short") ||
    categoryLower.includes("reel") ||
    categoryLower.includes("vertical");

  const isYouTube =
    project.type === "youtube" ||
    lowerUrl.includes("youtube.com") ||
    lowerUrl.includes("youtu.be") ||
    (!project.type &&
      project.id &&
      !project.id.startsWith("gdrive-") &&
      !project.id.startsWith("custom-") &&
      !project.id.startsWith("cloud_") &&
      !project.id.startsWith("tiktok-"));

  const isGoogleDrive =
    project.type === "googledrive" ||
    project.id.startsWith("gdrive-") ||
    lowerUrl.includes("drive.google.com");

  const isDirectOrStorageVideo =
    project.type === "file" ||
    project.type === "local" ||
    project.type === "direct" ||
    lowerUrl.endsWith(".mp4") ||
    lowerUrl.endsWith(".webm") ||
    lowerUrl.endsWith(".mov") ||
    lowerUrl.includes("firebasestorage.googleapis.com") ||
    lowerUrl.startsWith("blob:") ||
    lowerUrl.startsWith("data:video");

  // Format YouTube embed
  let youtubeEmbedUrl = "";
  if (isYouTube) {
    let ytId = project.id;
    if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) {
      const match = rawUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
      if (match) ytId = match[1];
    }
    youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
  }

  // Format Google Drive embed
  let driveEmbedUrl = project.embedUrl || rawUrl;
  if (isGoogleDrive && !driveEmbedUrl.includes("/preview")) {
    driveEmbedUrl = driveEmbedUrl.replace(/\/view(\?.*)?$/, "/preview");
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full bg-slate-950 border-0 sm:border border-slate-800 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col h-full sm:h-auto max-h-full sm:max-h-[92vh] animate-fade-in-up ${
          isVerticalFormat ? "max-w-md" : "max-w-4xl"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile-Friendly Title Bar with Large Touch Target Close Button */}
        <div className="px-3.5 py-3 sm:px-4 sm:py-3 bg-slate-900/95 border-b border-slate-800/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
            <div className="hidden sm:flex items-center gap-1.5 shrink-0">
              <span
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer block"
                title="Close"
              ></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
            </div>
            <div className="flex items-center gap-2 min-w-0">
              <Film className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-white truncate">
                {project.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-200 font-medium transition-colors"
                title="Open Source Link"
              >
                <span>Link</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {/* Big touch target for thumb close on mobile */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Canvas (Responsive for Landscape & Vertical Mobile Formats) */}
        <div
          className={`relative w-full bg-black flex items-center justify-center overflow-hidden flex-1 sm:flex-initial ${
            isVerticalFormat
              ? "aspect-[9/16] max-h-[75vh] sm:max-h-[620px]"
              : "aspect-video min-h-[220px] max-h-[75vh]"
          }`}
        >
          {isYouTube ? (
            <iframe
              src={youtubeEmbedUrl}
              title={project.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : isGoogleDrive ? (
            <iframe
              src={driveEmbedUrl}
              title={project.title}
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : isDirectOrStorageVideo && project.videoUrl ? (
            <video
              src={project.videoUrl}
              controls
              autoPlay
              playsInline
              webkit-playsinline="true"
              preload="auto"
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center p-6 space-y-4">
              <Film className="w-12 h-12 text-cyan-400 mx-auto opacity-80 animate-pulse" />
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">
                  {project.title}
                </div>
                <div className="text-xs text-slate-400">
                  {project.category} • {project.sourceLabel || "Video Project"}
                </div>
              </div>
              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#b00e27] text-white text-xs font-bold shadow-lg transition-transform active:scale-95"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Open Video in New Tab</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Mobile-Friendly Footer Details */}
        <div className="p-3.5 sm:p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#C8102E]/20 border border-[#C8102E]/40 text-[#ff4b67] text-[11px] font-bold">
              {project.category}
            </span>
            <span className="text-slate-300 text-[11px] font-medium">
              {project.sourceLabel || "AK clipps Video"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="text-white font-medium">Abiy Ketema</span>
          </div>
        </div>
      </div>
    </div>
  );
}

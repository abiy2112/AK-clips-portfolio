import React, { useEffect } from "react";
import { X, ExternalLink, Film, Play, Sparkles } from "lucide-react";
import { ProjectItem } from "../types/project";

interface VideoPlayerModalProps {
  project: ProjectItem | null;
  onClose: () => void;
}

export default function VideoPlayerModal({
  project,
  onClose,
}: VideoPlayerModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  const isYouTube =
    project.type === "youtube" ||
    (!project.type && project.id && !project.id.startsWith("gdrive-") && !project.id.startsWith("custom-"));
  const isGoogleDrive =
    project.type === "googledrive" || project.id.startsWith("gdrive-");
  const isLocalOrDirect =
    project.type === "local" || project.type === "direct";

  const youtubeEmbedUrl = isYouTube
    ? `https://www.youtube.com/embed/${project.id}?autoplay=1&rel=0`
    : "";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS Title Bar */}
        <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer block"
                title="Close"
              ></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
            </div>
            <div className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-bold text-white truncate max-w-xs sm:max-w-md">
                {project.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {project.videoUrl && (
              <a
                href={project.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 hover:text-white transition-colors"
              >
                <span>Open Source</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Player Canvas */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
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
              src={project.embedUrl || project.videoUrl}
              title={project.title}
              allow="autoplay"
              allowFullScreen
              className="w-full h-full border-0"
            />
          ) : isLocalOrDirect && project.videoUrl ? (
            <video
              src={project.videoUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="text-center p-6 space-y-3">
              <Film className="w-12 h-12 text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">
                Preview not directly embeddable
              </div>
              {project.videoUrl && (
                <a
                  href={project.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C8102E] text-white text-xs font-medium"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Video Link</span>
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer Details */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#C8102E]/20 border border-[#C8102E]/40 text-[#ff4b67] text-[10px] font-bold">
              {project.category}
            </span>
            <span className="text-slate-400">
              {project.sourceLabel || "AK clipps Showcase"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <span>4K Master Cut</span>
            <span>•</span>
            <span className="text-white font-medium">Abiy Ketema</span>
          </div>
        </div>
      </div>
    </div>
  );
}

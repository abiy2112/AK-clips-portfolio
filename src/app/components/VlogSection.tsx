import React, { useState } from "react";
import { Play, Calendar, Tag, Film, ExternalLink } from "lucide-react";
import { VlogItem } from "../types/vlog";
import VideoPlayerModal from "./VideoPlayerModal";
import { ProjectItem } from "../types/project";

interface VlogSectionProps {
  vlogs: VlogItem[];
}

/** Convert a VlogItem into the shape VideoPlayerModal expects (ProjectItem). */
function vlogToProject(vlog: VlogItem): ProjectItem {
  return {
    id: vlog.id,
    title: vlog.title,
    category: "Vlog",
    type: detectType(vlog.videoUrl),
    videoUrl: vlog.videoUrl,
    thumbnailUrl: vlog.thumbnailUrl,
    sourceLabel: "Vlog",
  };
}

function detectType(url: string): ProjectItem["type"] {
  if (!url) return "direct";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("drive.google.com")) return "googledrive";
  if (url.includes("tiktok.com")) return "tiktok";
  return "direct";
}

function getYouTubeThumbnail(url: string): string | undefined {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (match) return `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
  return undefined;
}

function formatDate(dateStr: string, createdAt?: number): string {
  if (dateStr && dateStr !== "Just now" && dateStr !== "Recent") return dateStr;
  if (createdAt) {
    return new Date(createdAt).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }
  return dateStr || "Recent";
}

export default function VlogSection({ vlogs }: VlogSectionProps) {
  const [activeVlog, setActiveVlog] = useState<ProjectItem | null>(null);

  if (vlogs.length === 0) return null;

  return (
    <section id="vlogs" className="py-8 sm:py-12 px-3 sm:px-4 max-w-5xl mx-auto relative z-10">
      <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
            <Film className="w-4 h-4 text-cyan-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Vlogs
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {vlogs.map((vlog, i) => {
          const thumb =
            vlog.thumbnailUrl ||
            getYouTubeThumbnail(vlog.videoUrl) ||
            undefined;

          return (
            <div
              key={vlog.id}
              className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${i * 100}`}
            >
              <div
                className="group bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-600 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-black/40"
                onClick={() => setActiveVlog(vlogToProject(vlog))}
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video bg-slate-950 overflow-hidden">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt={vlog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                      <Film className="w-10 h-10 text-slate-600" />
                    </div>
                  )}
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3.5 space-y-2">
                  <h3 className="text-sm font-bold text-white leading-snug line-clamp-2 group-hover:text-cyan-400 transition-colors">
                    {vlog.title}
                  </h3>

                  {vlog.description && (
                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {vlog.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(vlog.date, vlog.createdAt)}</span>
                    </div>

                    {vlog.tags && vlog.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-slate-500" />
                        {vlog.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Video Player Modal (reuses existing modal) */}
      <VideoPlayerModal
        project={activeVlog}
        onClose={() => setActiveVlog(null)}
      />
    </section>
  );
}

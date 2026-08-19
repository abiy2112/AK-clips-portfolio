import React, { useState } from "react";
import { Calendar, Tag, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { VlogItem } from "../types/vlog";

interface VlogSectionProps {
  vlogs: VlogItem[];
}

function getExcerpt(content: string, maxLen = 160): string {
  if (content.length <= maxLen) return content;
  return content.slice(0, maxLen).replace(/\s+\S*$/, "") + "…";
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
  const [expanded, setExpanded] = useState<string | null>(null);

  if (vlogs.length === 0) return null;

  return (
    <section id="vlogs" className="py-8 sm:py-12 px-3 sm:px-4 max-w-5xl mx-auto relative z-10">
      <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
            <BookOpen className="w-4 h-4 text-cyan-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white">
            Vlogs
          </h2>
        </div>
      </div>

      <div className="space-y-3">
        {vlogs.map((vlog, i) => {
          const isOpen = expanded === vlog.id;
          const excerpt = vlog.excerpt || getExcerpt(vlog.content);

          return (
            <div
              key={vlog.id}
              className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${i * 100}`}
            >
              <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors">
                {/* Header row — always visible */}
                <button
                  onClick={() => setExpanded(isOpen ? null : vlog.id)}
                  className="w-full text-left p-4 sm:p-5 flex items-start justify-between gap-3 group cursor-pointer"
                >
                  <div className="flex-1 space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug">
                      {vlog.title}
                    </h3>

                    {!isOpen && (
                      <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                        {excerpt}
                      </p>
                    )}

                    <div className="flex items-center flex-wrap gap-2 pt-0.5">
                      <div className="flex items-center gap-1 text-[10px] text-slate-500">
                        <Calendar className="w-3 h-3" />
                        <span>{formatDate(vlog.date, vlog.createdAt)}</span>
                      </div>
                      {vlog.tags && vlog.tags.length > 0 && (
                        <div className="flex items-center gap-1">
                          <Tag className="w-3 h-3 text-slate-500" />
                          {vlog.tags.slice(0, 3).map((tag) => (
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

                  <div className="shrink-0 mt-0.5 text-slate-500 group-hover:text-slate-300 transition-colors">
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {/* Expanded full content */}
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-slate-800">
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap pt-3">
                      {vlog.content}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

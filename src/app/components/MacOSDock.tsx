import React, { useState } from "react";
import {
  Film,
  Briefcase,
  Layers,
  Mail,
  Send,
  Youtube,
  Music,
  Zap,
  Sliders,
} from "lucide-react";
import AKLogo from "./AKLogo";

interface DockItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  isCustomLogo?: boolean;
  isExternal?: boolean;
  badge?: string;
  color?: string;
}

interface MacOSDockProps {
  onOpenUpload?: () => void;
}

export default function MacOSDock({ onOpenUpload }: MacOSDockProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const mainApps: DockItem[] = [
    {
      id: "home",
      label: "AK clipps (Home)",
      href: "#hero",
      isCustomLogo: true,
    },
    {
      id: "projects",
      label: "Featured Projects",
      href: "#projects",
      icon: Film,
      color: "text-slate-200",
    },
    {
      id: "software",
      label: "Creative Toolkit (Premiere, AE, CapCut)",
      href: "#software",
      icon: Sliders,
      color: "text-slate-200",
    },
    {
      id: "upload",
      label: "Studio Upload (Admin Only)",
      onClick: onOpenUpload,
      icon: Zap,
      badge: "Admin",
      color: "text-amber-400",
    },
    {
      id: "work",
      label: "Work Experience",
      href: "#work",
      icon: Briefcase,
      color: "text-slate-200",
    },
    {
      id: "skills",
      label: "Skills & Software",
      href: "#skills",
      icon: Layers,
      color: "text-slate-200",
    },
    {
      id: "reviews",
      label: "Reviews (4.6 ⚡)",
      href: "#reviews",
      icon: Zap,
      badge: "4.6",
      color: "text-amber-400",
    },
    {
      id: "contact",
      label: "Get in Touch",
      href: "#contact",
      icon: Mail,
      color: "text-slate-200",
    },
  ];

  const externalApps: DockItem[] = [
    {
      id: "telegram",
      label: "Telegram (@Ak_clips)",
      href: "https://t.me/Ak_clips",
      icon: Send,
      isExternal: true,
      color: "text-cyan-400",
    },
    {
      id: "youtube",
      label: "MUSIKANA YouTube (8K+)",
      href: "https://youtube.com/@musikana1",
      icon: Youtube,
      isExternal: true,
      color: "text-red-500",
    },
    {
      id: "tiktok",
      label: "TikTok Portfolio",
      href: "https://www.tiktok.com/@orbitrise/video/7543299885341117701",
      icon: Music,
      isExternal: true,
      color: "text-pink-400",
    },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 select-none">
      <div className="bg-slate-900/90 backdrop-blur-xl border border-slate-800 px-2.5 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-2xl">
        {/* Main Section Navigation */}
        {mainApps.map((app) => {
          const isHovered = hoveredId === app.id;

          return (
            <div
              key={app.id}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHoveredId(app.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Tooltip Badge */}
              {isHovered && (
                <div className="absolute -top-8 px-2 py-0.5 bg-slate-950 border border-slate-800 text-white text-[10px] font-medium rounded-md shadow-lg whitespace-nowrap animate-fade-in pointer-events-none z-50">
                  {app.label}
                </div>
              )}

              {app.onClick ? (
                <button
                  type="button"
                  onClick={app.onClick}
                  className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-150 transform cursor-pointer ${
                    isHovered
                      ? "scale-115 -translate-y-1 bg-slate-800"
                      : "bg-slate-950/60 hover:bg-slate-800"
                  }`}
                >
                  {app.icon && (
                    <app.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${app.color || "text-white"}`} />
                  )}
                  {app.badge && (
                    <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-[#C8102E] text-white text-[8px] font-bold rounded-full border border-slate-950">
                      {app.badge}
                    </span>
                  )}
                </button>
              ) : (
                <a
                  href={app.href}
                  className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-150 transform ${
                    isHovered
                      ? "scale-115 -translate-y-1 bg-slate-800"
                      : "bg-slate-950/60 hover:bg-slate-800"
                  }`}
                >
                  {app.isCustomLogo ? (
                    <AKLogo size={28} rounded="xl" />
                  ) : app.icon ? (
                    <app.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${app.color || "text-white"}`} />
                  ) : null}

                  {/* Rating Badge */}
                  {app.badge && (
                    <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-[#C8102E] text-white text-[8px] font-bold rounded-full border border-slate-950">
                      {app.badge}
                    </span>
                  )}
                </a>
              )}

              {/* Active dot */}
              <div
                className={`w-1 h-1 rounded-full mt-1 ${
                  app.id === "upload" ? "bg-amber-400" : "bg-slate-500"
                }`}
              ></div>
            </div>
          );
        })}

        {/* Dock Separator */}
        <div className="w-[1px] h-6 bg-slate-800 mx-1"></div>

        {/* Social / External Shortcuts */}
        {externalApps.map((app) => {
          const isHovered = hoveredId === app.id;

          return (
            <div
              key={app.id}
              className="relative flex flex-col items-center"
              onMouseEnter={() => setHoveredId(app.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Tooltip Badge */}
              {isHovered && (
                <div className="absolute -top-8 px-2 py-0.5 bg-slate-950 border border-slate-800 text-white text-[10px] font-medium rounded-md shadow-lg whitespace-nowrap animate-fade-in pointer-events-none z-50">
                  {app.label}
                </div>
              )}

              <a
                href={app.href}
                target="_blank"
                rel="noreferrer"
                className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-150 transform ${
                  isHovered ? "scale-115 -translate-y-1 bg-slate-800" : "bg-slate-950/60 hover:bg-slate-800"
                }`}
              >
                {app.icon && (
                  <app.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${app.color || "text-white"}`} />
                )}
              </a>

              <div className="w-1 h-1 rounded-full bg-cyan-400 mt-1"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { Maximize2, Minus, X } from "lucide-react";

interface MacOSWindowProps {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  windowControlsClassName?: string;
  headerRight?: React.ReactNode;
  isCollapsible?: boolean;
}

export default function MacOSWindow({
  title,
  subtitle,
  icon,
  children,
  className = "",
  windowControlsClassName = "",
  headerRight,
  isCollapsible = false,
}: MacOSWindowProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div
      className={`macos-window overflow-hidden transition-all duration-300 ${
        isFullscreen ? "fixed inset-4 z-50 overflow-y-auto" : ""
      } ${className}`}
    >
      {/* Window Titlebar */}
      <div className={`macos-titlebar px-4 py-3 flex items-center justify-between select-none ${windowControlsClassName}`}>
        {/* Left Traffic Lights */}
        <div className="flex items-center gap-2 group/traffic">
          <button
            onClick={() => isCollapsible && setIsMinimized((p) => !p)}
            className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E] flex items-center justify-center text-black/60 opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
            title="Close"
          >
            <X className="w-2 h-2 opacity-0 group-hover/traffic:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => isCollapsible && setIsMinimized((p) => !p)}
            className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123] flex items-center justify-center text-black/60 opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
            title="Minimize"
          >
            <Minus className="w-2 h-2 opacity-0 group-hover/traffic:opacity-100 transition-opacity" />
          </button>
          <button
            onClick={() => setIsFullscreen((p) => !p)}
            className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29] flex items-center justify-center text-black/60 opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            <Maximize2 className="w-2 h-2 opacity-0 group-hover/traffic:opacity-100 transition-opacity" />
          </button>

          {title && (
            <div className="flex items-center gap-2 ml-3">
              {icon && <span className="text-slate-300">{icon}</span>}
              <span className="text-xs font-semibold text-slate-200 tracking-tight">
                {title}
              </span>
              {subtitle && (
                <span className="text-[11px] text-slate-400 font-normal hidden sm:inline">
                  — {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right Titlebar Controls */}
        {headerRight && <div className="flex items-center gap-2">{headerRight}</div>}
      </div>

      {/* Window Body */}
      {!isMinimized && (
        <div className="p-4 sm:p-6 lg:p-8 animate-fade-in relative z-10">
          {children}
        </div>
      )}
    </div>
  );
}

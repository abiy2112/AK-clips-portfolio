import React, { useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Sparkles,
  Film,
} from "lucide-react";

export default function VideoStudioTimeline() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [playheadPos, setPlayheadPos] = useState(38); // percentage

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPlayheadPos((prev) => (prev >= 98 ? 2 : prev + 0.35));
    }, 50);
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-slate-200">
      {/* Studio Header Toolbar */}
      <div className="px-3.5 py-2 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C8102E]"></span>
            <span className="font-mono text-[10px] text-white font-semibold">
              REC • 4K 60FPS
            </span>
          </div>

          <div className="font-mono text-slate-400 text-xs hidden sm:block">
            TC: <span className="text-white font-medium">00:02:44:18</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPlayheadPos(5)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Playhead"
          >
            <SkipBack className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 rounded bg-[#C8102E] hover:bg-[#b00e27] text-white font-medium flex items-center gap-1.5 text-[11px] transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3 h-3 fill-current" />
                <span>Pause Cut</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 fill-current" />
                <span>Play Timeline</span>
              </>
            )}
          </button>
          <button
            onClick={() => setPlayheadPos(92)}
            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="End"
          >
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
            ProRes 422 HQ
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium hidden md:inline">
            GPU Accelerated
          </span>
        </div>
      </div>

      {/* Timeline Tracks View */}
      <div className="p-3 bg-slate-950/40 space-y-1.5 relative overflow-hidden select-none">
        {/* Playhead Indicator */}
        <div
          className="absolute top-0 bottom-0 z-20 pointer-events-none transition-all duration-75 flex flex-col items-center"
          style={{ left: `${playheadPos}%` }}
        >
          <div className="w-3 h-3 bg-[#C8102E] border border-white/80 rotate-45 -mt-1 shadow-sm"></div>
          <div className="w-[1.5px] h-full bg-[#C8102E]"></div>
        </div>

        {/* Time ruler ticks */}
        <div className="flex justify-between text-[9px] font-mono text-slate-500 px-1 pb-1 border-b border-slate-800/80">
          <span>00:00</span>
          <span>00:30</span>
          <span>01:00</span>
          <span>01:30</span>
          <span>02:00</span>
          <span>02:30</span>
          <span>03:00</span>
        </div>

        {/* Track V3: Graphics & Subtitles */}
        <div className="flex items-center gap-2">
          <div className="w-14 shrink-0 text-[9px] font-mono text-slate-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            <span>TXT/FX</span>
          </div>
          <div className="flex-1 h-6 bg-slate-950/60 rounded p-0.5 flex gap-1 relative border border-slate-800/60 overflow-hidden">
            <div className="w-[22%] h-full rounded bg-cyan-950/60 border border-cyan-800/50 flex items-center px-1.5 text-[9px] text-cyan-300 font-medium truncate">
              ⚡ Hook Captions
            </div>
            <div className="w-[35%] h-full rounded bg-purple-950/60 border border-purple-800/50 flex items-center px-1.5 text-[9px] text-purple-300 font-medium truncate">
              ✨ Motion Typography
            </div>
            <div className="w-[28%] h-full rounded bg-cyan-950/60 border border-cyan-800/50 flex items-center px-1.5 text-[9px] text-cyan-300 font-medium truncate">
              🎯 Call to Action
            </div>
          </div>
        </div>

        {/* Track V1: Primary Video Footage */}
        <div className="flex items-center gap-2">
          <div className="w-14 shrink-0 text-[9px] font-mono text-slate-400 flex items-center gap-1">
            <Film className="w-3 h-3 text-red-400" />
            <span>VIDEO 1</span>
          </div>
          <div className="flex-1 h-7 bg-slate-950/60 rounded p-0.5 flex gap-1 relative border border-slate-800/60 overflow-hidden">
            <div className="w-[20%] h-full rounded bg-red-950/60 border border-red-800/50 flex items-center px-1.5 text-[9px] text-slate-200 font-medium truncate">
              🎬 4K Footage (Addis)
            </div>
            <div className="w-[28%] h-full rounded bg-red-950/70 border border-red-800/60 flex items-center px-1.5 text-[9px] text-slate-200 font-medium truncate">
              🏙️ Property Showcase
            </div>
            <div className="w-[22%] h-full rounded bg-red-950/60 border border-red-800/50 flex items-center px-1.5 text-[9px] text-slate-200 font-medium truncate">
              🎵 MUSIKANA Lyrics
            </div>
            <div className="w-[28%] h-full rounded bg-red-950/70 border border-red-800/60 flex items-center px-1.5 text-[9px] text-slate-200 font-medium truncate">
              📱 TikTok Dynamic Cut
            </div>
          </div>
        </div>

        {/* Track A1: Audio & Sound Design */}
        <div className="flex items-center gap-2">
          <div className="w-14 shrink-0 text-[9px] font-mono text-slate-400 flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-emerald-400" />
            <span>AUDIO 1</span>
          </div>
          <div className="flex-1 h-6 bg-slate-950/60 rounded p-0.5 flex gap-1 relative border border-slate-800/60 overflow-hidden">
            <div className="w-full h-full rounded bg-emerald-950/50 border border-emerald-800/50 flex items-center justify-between px-2 text-[9px] text-emerald-300">
              <span className="font-mono text-[9px] truncate">
                🔊 Audio Master (EQ, Drops, Whooshes & Voiceover)
              </span>
              <div className="flex items-center gap-0.5 h-2.5">
                <div className="w-0.5 h-full bg-emerald-400"></div>
                <div className="w-0.5 h-2 bg-emerald-400"></div>
                <div className="w-0.5 h-2.5 bg-emerald-400"></div>
                <div className="w-0.5 h-1.5 bg-emerald-400"></div>
                <div className="w-0.5 h-2 bg-emerald-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

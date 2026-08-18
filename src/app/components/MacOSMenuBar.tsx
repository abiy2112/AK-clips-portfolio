import React, { useState, useEffect } from "react";
import {
  Wifi,
  Battery,
  Sliders,
  Search,
  ExternalLink,
  Film,
  Sparkles,
  Play,
  Send,
  X,
  Check,
  Zap,
} from "lucide-react";
import AKLogo from "./AKLogo";

interface MacOSMenuBarProps {
  activeSection?: string;
  onOpenUpload?: () => void;
}

export default function MacOSMenuBar({
  activeSection = "hero",
  onOpenUpload,
}: MacOSMenuBarProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
      );
      setCurrentDate(
        now.toLocaleDateString([], {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const spotlightItems = [
    {
      title: "Upload Video / Creator Studio (Admin Only)",
      category: "Studio Admin",
      action: onOpenUpload,
      icon: Zap,
    },
    {
      title: "AK clipps - Video Editor & Creative Storyteller",
      category: "Profile",
      href: "#hero",
      icon: Film,
    },
    {
      title: "Featured Video Projects (YouTube, Drive, TikTok)",
      category: "Portfolio",
      href: "#projects",
      icon: Play,
    },
    {
      title: "Client Reviews (4.6 ⚡ Rating)",
      category: "Reviews",
      href: "#reviews",
      icon: Zap,
    },
    {
      title: "Production Software & Toolkit (Premiere, After Effects, CapCut)",
      category: "Tools",
      href: "#software",
      icon: Sliders,
    },
    {
      title: "Work Experience & Channels (MUSIKANA, Orbit Rise)",
      category: "Experience",
      href: "#work",
      icon: Sparkles,
    },
    {
      title: "Skills & Post-Production Software",
      category: "Skills",
      href: "#skills",
      icon: Sliders,
    },
    {
      title: "Direct Contact (Telegram @Ak_clips)",
      category: "Contact",
      href: "https://t.me/Ak_clips",
      icon: Send,
    },
  ];

  const filteredSpotlight = spotlightItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 h-7 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 text-[11px] text-slate-300 select-none">
        <div className="max-w-7xl mx-auto h-full px-3 flex items-center justify-between">
          {/* Left Menu Items */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="#hero"
              className="flex items-center gap-1.5 px-1.5 py-0.5 rounded hover:bg-slate-800 text-white transition-colors"
            >
              <AKLogo size={15} rounded="xl" />
              <span className="font-bold tracking-tight">AK clipps</span>
            </a>

            <div className="h-2.5 w-[1px] bg-slate-800 mx-1 hidden sm:block"></div>

            <nav className="hidden sm:flex items-center gap-0.5 text-slate-300">
              <a
                href="#hero"
                className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                Home
              </a>
              <a
                href="#projects"
                className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                Projects
              </a>
              <a
                href="#work"
                className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                Work
              </a>
              <a
                href="#skills"
                className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                Skills
              </a>
              <a
                href="#reviews"
                className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors flex items-center gap-1"
              >
                Reviews
                <span className="px-1 py-0.2 bg-[#C8102E] text-[9px] font-bold rounded text-white flex items-center gap-0.5">
                  <span>4.6</span>
                  <Zap className="w-2.5 h-2.5 fill-current text-amber-300" />
                </span>
              </a>
              <a
                href="#software"
                className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                Tools
              </a>
              <a
                href="#contact"
                className="px-2 py-0.5 rounded hover:bg-slate-800 hover:text-white transition-colors"
              >
                Contact
              </a>
            </nav>
          </div>

          {/* Right Status Controls */}
          <div className="flex items-center gap-1 sm:gap-2 text-slate-400">
            {/* Quick Upload Button */}
            {onOpenUpload && (
              <button
                onClick={onOpenUpload}
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-[#C8102E]/20 hover:bg-[#C8102E] text-[#ff4b67] hover:text-white border border-[#C8102E]/40 text-[10px] font-semibold transition-all cursor-pointer"
                title="Upload / Add Video (Admin Only)"
              >
                <Zap className="w-3 h-3 fill-current text-amber-300" />
                <span className="hidden xs:inline">Upload</span>
              </button>
            )}

            {/* Rating pill indicator */}
            <a
              href="#reviews"
              className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-colors"
            >
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-white">4.6</span>
            </a>

            {/* Spotlight Search button */}
            <button
              onClick={() => setShowSpotlight(true)}
              className="p-1 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              title="Spotlight Search"
            >
              <Search className="w-3 h-3" />
            </button>

            {/* Wi-Fi */}
            <div className="p-0.5 hidden xs:block" title="Wi-Fi: Connected">
              <Wifi className="w-3 h-3" />
            </div>

            {/* Battery */}
            <div
              className="hidden sm:flex items-center gap-1 p-0.5"
              title="100% Battery"
            >
              <span className="text-[10px]">100%</span>
              <Battery className="w-3 h-3 text-emerald-400" />
            </div>

            {/* Control Center Toggle */}
            <button
              onClick={() => setShowControlCenter((p) => !p)}
              className={`p-1 rounded transition-colors cursor-pointer ${
                showControlCenter
                  ? "bg-slate-800 text-white"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
              title="Control Center"
            >
              <Sliders className="w-3 h-3" />
            </button>

            {/* Live Clock */}
            <div className="font-medium px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-200 flex items-center gap-1">
              <span className="hidden md:inline text-slate-400">{currentDate}</span>
              <span>{currentTime}</span>
            </div>
          </div>
        </div>
      </header>

      {/* macOS Control Center Dropdown */}
      {showControlCenter && (
        <div
          className="fixed top-8 right-3 z-50 w-72 p-3 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl text-slate-200 select-none shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <AKLogo size={20} rounded="xl" />
              <div>
                <div className="text-xs font-bold text-white">AK clipps Studio</div>
                <div className="text-[10px] text-slate-400">macOS Edition</div>
              </div>
            </div>
            <button
              onClick={() => setShowControlCenter(false)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2">
            {/* Creator Upload Action */}
            {onOpenUpload && (
              <button
                onClick={() => {
                  setShowControlCenter(false);
                  onOpenUpload();
                }}
                className="w-full p-2 rounded-lg bg-gradient-to-r from-[#C8102E]/20 to-red-950/40 border border-[#C8102E]/40 hover:border-[#C8102E] text-white flex items-center justify-between text-xs font-semibold transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-[#C8102E] text-white">
                    <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                  </div>
                  <div className="text-left">
                    <div>Upload / Add Video</div>
                    <div className="text-[10px] text-slate-400 font-normal">
                      Admin Only
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-[#ff4b67]">Open →</span>
              </button>
            )}

            {/* Quick Status Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-red-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-semibold text-white">Video Mode</div>
                  <div className="text-[9px] text-slate-400">4K 60FPS Pro</div>
                </div>
              </div>

              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] font-semibold text-white">Rating</div>
                  <div className="text-[9px] text-amber-400 font-bold">4.6 ⚡ / 5.0</div>
                </div>
              </div>
            </div>

            {/* Quick Action Links */}
            <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 space-y-1.5">
              <div className="text-[9px] font-bold uppercase tracking-wider text-slate-400">
                Shortcuts
              </div>
              <div className="flex flex-col gap-1 text-xs">
                <a
                  href="https://t.me/Ak_clips"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-1 rounded hover:bg-slate-800 text-white transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Send className="w-3 h-3 text-cyan-400" />
                    Telegram (@Ak_clips)
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
                <a
                  href="https://youtube.com/@musikana1"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-1 rounded hover:bg-slate-800 text-white transition-colors"
                >
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Play className="w-3 h-3 text-red-400" />
                    MUSIKANA Channel (8K+)
                  </span>
                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Share / Copy Portfolio link */}
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopiedLink(true);
                setTimeout(() => setCopiedLink(false), 2000);
              }}
              className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-white transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Share Portfolio</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Spotlight Search Modal */}
      {showSpotlight && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in"
          onClick={() => setShowSpotlight(false)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-2.5 px-3.5 py-3 border-b border-slate-800">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search AK clipps (Upload Video, Tools, Projects, Reviews)..."
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none"
              />
              <button
                onClick={() => setShowSpotlight(false)}
                className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
              >
                ESC
              </button>
            </div>

            {/* Search Results */}
            <div className="max-h-64 overflow-y-auto p-1.5 divide-y divide-slate-800/40">
              {filteredSpotlight.length > 0 ? (
                filteredSpotlight.map((item, idx) => {
                  const Icon = item.icon;
                  if (item.action) {
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setShowSpotlight(false);
                          item.action?.();
                        }}
                        className="w-full text-left flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 transition-colors group cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="p-1.5 rounded bg-red-950/60 text-[#ff4b67]">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-medium text-white group-hover:text-cyan-400 transition-colors">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-slate-400">{item.category}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-300">
                          Open
                        </span>
                      </button>
                    );
                  }

                  return (
                    <a
                      key={idx}
                      href={item.href}
                      onClick={() => setShowSpotlight(false)}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded bg-slate-950 text-slate-300">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <div className="text-xs font-medium text-white group-hover:text-cyan-400 transition-colors">
                            {item.title}
                          </div>
                          <div className="text-[10px] text-slate-400">{item.category}</div>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500 group-hover:text-slate-300">
                        Jump →
                      </span>
                    </a>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-slate-500">
                  No results for "{searchQuery}"
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

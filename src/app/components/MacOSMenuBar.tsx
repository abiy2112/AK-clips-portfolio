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
  Menu,
  Briefcase,
  Layers,
  Mail,
  Youtube,
  Music,
} from "lucide-react";
import AKLogo from "./AKLogo";

interface MacOSMenuBarProps {
  activeSection?: string;
  onOpenAdmin?: () => void;
  rating?: string;
}

export default function MacOSMenuBar({
  activeSection = "hero",
  onOpenAdmin,
  rating = "4.6",
}: MacOSMenuBarProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [showControlCenter, setShowControlCenter] = useState(false);
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
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
      title: "AK clipps - Video Editor & Creative Storyteller",
      category: "Profile",
      href: "#hero",
      icon: Film,
    },
    {
      title: "Featured Video Projects & Portfolio",
      category: "Portfolio",
      href: "#projects",
      icon: Play,
    },
    {
      title: "Work Experience (MUSIKANA 8K+, Orbit Rise)",
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
      title: "Client Reviews (4.6 Rating)",
      category: "Reviews",
      href: "#reviews",
      icon: Zap,
    },
    {
      title: "Production Software & Toolkit",
      category: "Tools",
      href: "#software",
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
      <header className="fixed top-0 left-0 right-0 z-50 h-9 sm:h-7 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 text-[11px] text-slate-300 select-none">
        <div className="max-w-7xl mx-auto h-full px-3 flex items-center justify-between">
          {/* Left Menu Items */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="#hero"
              className="flex items-center gap-1.5 px-1.5 py-1 sm:py-0.5 rounded hover:bg-slate-800 text-white transition-colors"
            >
              <AKLogo size={16} rounded="xl" />
              <span className="font-bold tracking-tight text-xs sm:text-[11px]">
                AK clipps
              </span>
            </a>

            <div className="h-2.5 w-[1px] bg-slate-800 mx-1 hidden sm:block"></div>

            {/* Desktop Navigation Links */}
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
                  <span>{rating}</span>
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

          {/* Right Status Controls & Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
            {/* Discreet Lightning Icon for Admin Panel */}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="p-1.5 sm:p-1 rounded hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors cursor-pointer flex items-center justify-center"
                aria-label="Studio Access"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
              </button>
            )}

            {/* Rating pill indicator */}
            <a
              href="#reviews"
              className="flex items-center gap-1 px-1.5 py-1 sm:py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-200 hover:text-white transition-colors"
            >
              <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-white">{rating}</span>
            </a>

            {/* Spotlight Search button */}
            <button
              onClick={() => setShowSpotlight(true)}
              className="p-1.5 sm:p-1 rounded hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
              title="Spotlight Search"
            >
              <Search className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
            </button>

            {/* Wi-Fi (Desktop only) */}
            <div className="p-0.5 hidden md:block" title="Wi-Fi: Connected">
              <Wifi className="w-3 h-3" />
            </div>

            {/* Battery (Desktop only) */}
            <div
              className="hidden md:flex items-center gap-1 p-0.5"
              title="100% Battery"
            >
              <span className="text-[10px]">100%</span>
              <Battery className="w-3 h-3 text-emerald-400" />
            </div>

            {/* Control Center Toggle */}
            <button
              onClick={() => setShowControlCenter((p) => !p)}
              className={`p-1.5 sm:p-1 rounded transition-colors cursor-pointer hidden xs:block ${
                showControlCenter
                  ? "bg-slate-800 text-white"
                  : "hover:bg-slate-800 hover:text-white"
              }`}
              title="Control Center"
            >
              <Sliders className="w-3.5 h-3.5 sm:w-3 sm:h-3" />
            </button>

            {/* Live Clock (Desktop only) */}
            <div className="font-medium px-1.5 py-0.5 rounded hover:bg-slate-800 text-slate-200 hidden sm:flex items-center gap-1">
              <span className="hidden md:inline text-slate-400">{currentDate}</span>
              <span>{currentTime}</span>
            </div>

            {/* Mobile Navigation Menu Toggle (Hamburger) */}
            <button
              onClick={() => setShowMobileMenu((p) => !p)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 hover:text-white sm:hidden transition-colors cursor-pointer"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Slide-out Sheet */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col justify-end sm:hidden animate-fade-in"
          onClick={() => setShowMobileMenu(false)}
        >
          <div
            className="w-full bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 pb-8 space-y-4 shadow-2xl animate-fade-in-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <AKLogo size={24} rounded="xl" />
                <div>
                  <div className="text-sm font-bold text-white">AK clipps Navigation</div>
                  <div className="text-[10px] text-slate-400">Abiy Ketema • Video Editor</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {onOpenAdmin && (
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onOpenAdmin();
                    }}
                    className="p-1.5 rounded-full bg-slate-800 text-amber-400 hover:text-amber-300"
                    title="Studio"
                  >
                    <Zap className="w-4 h-4 fill-current" />
                  </button>
                )}
                <button
                  onClick={() => setShowMobileMenu(false)}
                  className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2">
              <a
                href="#projects"
                onClick={() => setShowMobileMenu(false)}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-600 flex items-center gap-2.5 text-xs font-semibold text-white transition-colors"
              >
                <Film className="w-4 h-4 text-cyan-400" />
                <span>Featured Projects</span>
              </a>

              <a
                href="#reviews"
                onClick={() => setShowMobileMenu(false)}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-600 flex items-center gap-2.5 text-xs font-semibold text-white transition-colors"
              >
                <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Reviews ({rating}★)</span>
              </a>

              <a
                href="#work"
                onClick={() => setShowMobileMenu(false)}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-600 flex items-center gap-2.5 text-xs font-semibold text-white transition-colors"
              >
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <span>Work Experience</span>
              </a>

              <a
                href="#skills"
                onClick={() => setShowMobileMenu(false)}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-600 flex items-center gap-2.5 text-xs font-semibold text-white transition-colors"
              >
                <Layers className="w-4 h-4 text-purple-400" />
                <span>Skills & Software</span>
              </a>

              <a
                href="#software"
                onClick={() => setShowMobileMenu(false)}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-600 flex items-center gap-2.5 text-xs font-semibold text-white transition-colors"
              >
                <Sliders className="w-4 h-4 text-cyan-400" />
                <span>Creative Toolkit</span>
              </a>

              <a
                href="#contact"
                onClick={() => setShowMobileMenu(false)}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-600 flex items-center gap-2.5 text-xs font-semibold text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-pink-400" />
                <span>Get in Touch</span>
              </a>
            </div>

            {/* Direct Connect Buttons */}
            <div className="pt-2 border-t border-slate-800 flex gap-2">
              <a
                href="https://t.me/Ak_clips"
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-[#C8102E] text-white flex items-center justify-center gap-2 text-xs font-bold shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>

              <a
                href="mailto:abiyketema21@gmail.com"
                className="flex-1 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 flex items-center justify-center gap-2 text-xs font-medium"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* macOS Control Center Dropdown */}
      {showControlCenter && (
        <div
          className="fixed top-10 right-3 z-50 w-72 p-3 bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-xl text-slate-200 select-none shadow-xl animate-fade-in"
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
                  <div className="text-[9px] text-amber-400 font-bold">{rating} ⚡ / 5.0</div>
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
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-16 sm:pt-20 px-3 sm:px-4 animate-fade-in"
          onClick={() => setShowSpotlight(false)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl"
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
                placeholder="Search AK clipps (Upload, Projects, Reviews, Tools)..."
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

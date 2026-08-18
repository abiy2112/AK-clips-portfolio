import {
  Mail,
  Phone,
  MapPin,
  Play,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  Youtube,
  Music,
  Linkedin,
  Send,
  Sparkles,
  ArrowRight,
  Film,
  Layers,
  Sliders,
  CheckCircle2,
  Clock,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import imagechan from "../img/channels4_profile.jpg";
import ClientReviews from "./components/ClientReviews";
import MacOSMenuBar from "./components/MacOSMenuBar";
import MacOSDock from "./components/MacOSDock";
import MacOSWindow from "./components/MacOSWindow";
import VideoStudioTimeline from "./components/VideoStudioTimeline";
import FeaturedProjectsMarquee from "./components/FeaturedProjectsMarquee";
import SoftwareMarquee from "./components/SoftwareMarquee";
import AKLogo from "./components/AKLogo";
import AdminAuthModal from "./components/AdminAuthModal";
import VideoUploadModal from "./components/VideoUploadModal";
import VideoPlayerModal from "./components/VideoPlayerModal";
import { ProjectItem } from "./types/project";
import {
  getStoredProjects,
  saveStoredProjects,
  getCreatorAuthStatus,
  setCreatorAuthStatus,
} from "./utils/videoParser";

const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: "Kpl1YGsYaXY",
    title: "Ethiopian Tourism & Heritage",
    category: "Cinematic Documentary",
    type: "youtube",
    videoUrl: "https://youtube.com/watch?v=Kpl1YGsYaXY",
    sourceLabel: "YouTube Cut",
  },
  {
    id: "2y93gUqIRnY",
    title: "Short Form Viral Cut 1",
    category: "TikTok & Shorts",
    type: "youtube",
    videoUrl: "https://youtube.com/watch?v=2y93gUqIRnY",
    sourceLabel: "TikTok / Shorts",
  },
  {
    id: "se6H6d5qpNs",
    title: "Dynamic Fast-Paced Cut 2",
    category: "Social Media Promo",
    type: "youtube",
    videoUrl: "https://youtube.com/watch?v=se6H6d5qpNs",
    sourceLabel: "YouTube Cut",
  },
  {
    id: "4JyLoYDakG4",
    title: "Kinetic Motion Visual 3",
    category: "Creative Typography",
    type: "youtube",
    videoUrl: "https://youtube.com/watch?v=4JyLoYDakG4",
    sourceLabel: "Creative Motion",
  },
];

export default function App() {
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Projects state: combines custom uploaded projects from localStorage with default projects
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    const custom = getStoredProjects();
    return [...custom, ...DEFAULT_PROJECTS];
  });

  // Modal & Auth states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeVideoModalProject, setActiveVideoModalProject] = useState<ProjectItem | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getCreatorAuthStatus());

  useEffect(() => {
    // Intersection Observer for clean fade-in
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll(".fade-up").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [projects]);

  // Auth & Project management handlers
  const handleOpenUpload = () => {
    if (isAuthenticated) {
      setIsUploadModalOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCreatorAuthStatus(true);
    setIsAuthModalOpen(false);
    setIsUploadModalOpen(true);
  };

  const handleAddProject = (newProject: ProjectItem) => {
    setProjects((prev) => {
      const updated = [newProject, ...prev];
      const customOnly = updated.filter((p) => p.isCustom);
      saveStoredProjects(customOnly);
      return updated;
    });
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== projectId);
      const customOnly = updated.filter((p) => p.isCustom);
      saveStoredProjects(customOnly);
      return updated;
    });
  };

  const handleResetProjects = () => {
    setProjects(DEFAULT_PROJECTS);
    saveStoredProjects([]);
  };

  const handleLockSession = () => {
    setIsAuthenticated(false);
    setCreatorAuthStatus(false);
    setIsUploadModalOpen(false);
  };

  const skills = [
    {
      category: "Video Editing",
      tools: ["Adobe Premiere Pro", "DaVinci Resolve", "CapCut Pro"],
      icon: "🎬",
      badge: "Primary",
      desc: "Fast-paced retention editing, multi-cam syncing, and audio alignment.",
    },
    {
      category: "Motion Graphics & VFX",
      tools: ["After Effects", "Blender 3D", "Kinetic Typography"],
      icon: "✨",
      badge: "Advanced",
      desc: "Dynamic lower-thirds, tracking masks, custom animated transitions.",
    },
    {
      category: "Post-Production",
      tools: ["Cinematic Color Grading", "Audio Mixing & Sound Design"],
      icon: "🎨",
      badge: "Pro",
      desc: "LUT tailoring, waveform cleanup, impactful whooshes and bass drops.",
    },
    {
      category: "Content Strategy",
      tools: ["Viral Hook Crafting", "Script Adaptation", "TikTok & Shorts Pacing"],
      icon: "📱",
      badge: "Growth",
      desc: "High-retention structure engineered to maximize viewer watch-time.",
    },
  ];

  const experiences = [
    {
      title: "Lead Video Editor & Producer",
      company: "MUSIKANA (YouTube Channel)",
      companyUrl: "https://youtube.com/@musikana1?si=YM0bpGXPvAAbcyKw",
      location: "Addis Ababa",
      period: "Jul 2023 - Present",
      subscribers: "8,000+ Subscribers",
      responsibilities: [
        "Head video editor for high-performing Amharic lyrics video streams and music visuals.",
        "Engineered kinetic motion typography synchronized frame-by-frame to musical rhythm.",
        "Managed publishing cadence resulting in thousands of recurring organic views.",
      ],
      thumbnail: imagechan,
      videoUrl: "https://youtube.com/@musikana1",
      tag: "YouTube",
    },
    {
      title: "Viral Short-Form Editor",
      company: "Freelance & Creator Studios",
      location: "Addis Ababa",
      period: "Jun 2024 - Present",
      subscribers: "1M+ Views Generated",
      responsibilities: [
        "Edited high-retention TikTok and Instagram Reels for prominent Ethiopian creators (@orbitrise, @abela_.g, @dagimshumey_).",
        "Conducted script interpretation, dynamic jump-cuts, and visual retention hooks.",
        "Managed raw footage ingest, sound design, and custom caption styling.",
      ],
      isTikTok: true,
      links: [
        "https://www.tiktok.com/@orbitrise/video/7543299885341117701",
        "https://www.tiktok.com/@abela_.g/video/7508002112287165702",
        "https://www.tiktok.com/@dagimshumey_/video/7569241398868856120",
      ],
      tag: "TikTok / Reels",
    },
    {
      title: "Commercial & Promotional Editor",
      company: "Blue Sky Properties",
      location: "Addis Ababa, Ethiopia",
      period: "Jun 2025 - Nov 2025",
      subscribers: "Real Estate Campaigns",
      responsibilities: [
        "Produced luxury real estate showcase films highlighting upscale architectural properties.",
        "Applied cinematic architectural color grading and seamless speed ramping.",
        "Co-wrote compelling voiceover scripts to drive buyer inquiries.",
      ],
      isTikTok: true,
      links: [
        "https://www.tiktok.com/@blueskypropet/video/7536115078043553029",
      ],
      tag: "Commercial",
    },
    {
      title: "Broadcast & Media Video Editor",
      company: "4 Kilo Gbi Gubae",
      location: "Addis Ababa, Ethiopia",
      period: "Dec 2025 - Present",
      subscribers: "Media Coordination",
      responsibilities: [
        "Post-production and broadcast editing for comprehensive documentary and event programs.",
        "Executed multi-camera color correction, audio leveling, and subtitle mastering.",
        "Standardized efficient turnaround workflows for rapid video publishing.",
      ],
      tag: "Broadcast",
    },
  ];

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-[#C8102E]/30 selection:text-white relative overflow-x-hidden pb-24">
      {/* macOS Clean Top Menu Bar */}
      <MacOSMenuBar onOpenUpload={handleOpenUpload} />

      {/* Hero Section: Clean macOS Welcoming Screen */}
      <header id="hero" className="relative pt-14 sm:pt-16 pb-8 px-4 max-w-5xl mx-auto z-10">
        <MacOSWindow
          title="AK clipps Studio"
          subtitle="Abiy Ketema"
          icon={<Film className="w-3.5 h-3.5 text-slate-300" />}
          headerRight={
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-950/50 text-emerald-400 text-[10px] font-medium border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Available
              </span>
              <a
                href="#reviews"
                className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 text-amber-400 text-[10px] font-semibold hover:bg-slate-700 transition-colors"
              >
                <Zap className="w-3 h-3 fill-amber-400" />
                <span>4.6</span>
              </a>
            </div>
          }
        >
          {/* Clean Welcoming Screen */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center py-2 sm:py-4">
            {/* Left Content */}
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
                <AKLogo size={16} rounded="xl" />
                <span>Video Editor & Motion Designer</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                  AK clipps
                </h1>
                <div className="text-base sm:text-lg text-slate-400 font-normal mt-1">
                  Abiy Ketema • Crafting high-retention visual stories
                </div>
              </div>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
                Specializing in viral short-form TikTok/Reels, YouTube long-form content, luxury commercial property showcases, and rhythmic motion graphics.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="https://t.me/Ak_clips"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-[#C8102E] hover:bg-[#b00e27] text-white font-medium rounded-lg shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Telegram (@Ak_clips)</span>
                </a>

                <a
                  href="#projects"
                  className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg border border-slate-700 transition-colors flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 text-slate-300 fill-slate-300" />
                  <span>Explore Projects</span>
                </a>

                <button
                  type="button"
                  onClick={handleOpenUpload}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-cyan-400 font-medium rounded-lg border border-slate-700 hover:border-cyan-500/40 transition-colors flex items-center gap-1.5 text-xs sm:text-sm cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-amber-400" />
                  <span>Studio Upload (Admin Only)</span>
                </button>
              </div>

              {/* Quick Contacts */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-400">
                <a
                  href="mailto:abiyketema21@gmail.com"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white transition-colors"
                >
                  <Mail className="w-3 h-3 text-cyan-400" />
                  <span>abiyketema21@gmail.com</span>
                </a>
                <a
                  href="tel:+251934681880"
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:text-white transition-colors"
                >
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span>+251-934681880</span>
                </a>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                  <MapPin className="w-3 h-3 text-red-400" />
                  <span>Addis Ababa, Ethiopia</span>
                </div>
              </div>
            </div>

            {/* Right Clean Logo & Profile Card */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-5 flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <AKLogo size={105} rounded="2xl" />
                  <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-full flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <Zap className="w-2.5 h-2.5 fill-amber-400" />
                    <span>4.6</span>
                  </div>
                </div>

                <div className="text-base font-bold text-white flex items-center gap-1.5">
                  <span>AK clipps</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xs text-slate-400 mb-3">Abiy Ketema</div>

                {/* Profile Stats */}
                <div className="w-full grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center justify-center gap-0.5">
                      <span>4.6</span>
                      <Zap className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="text-[9px] text-slate-400">Rating</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">3+ Yrs</div>
                    <div className="text-[9px] text-slate-400">Experience</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">5M+</div>
                    <div className="text-[9px] text-slate-400">Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Timeline Suite */}
          <div id="timeline" className="mt-6 pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
              <span className="font-medium flex items-center gap-1.5 text-slate-300">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                Editing Suite & Timeline
              </span>
              <span className="text-[10px] font-mono">4K 60FPS</span>
            </div>
            <VideoStudioTimeline />
          </div>
        </MacOSWindow>
      </header>

      {/* Moving Software Toolkit Marquee (Premiere Pro, After Effects, Media Encoder, CapCut, Figma, Photoshop, Illustrator) */}
      <div id="software">
        <SoftwareMarquee />
      </div>

      {/* Featured Projects: Smaller Infinite Scrolling Ticker (Slow on Hover & Scrollable) */}
      <section id="projects" className="py-12 px-4 max-w-5xl mx-auto relative z-10">
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
                <Play className="w-4 h-4 fill-slate-200" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Featured <span className="text-cyan-400">Projects</span>
                </h2>
                <p className="text-slate-400 text-xs mt-0.5">
                  Continuous ticker • Hover to inspect or click to watch
                </p>
              </div>
            </div>

            {/* Creator Studio Upload Button (Admin Only) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleOpenUpload}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#9f0a22] hover:from-[#d91233] hover:to-[#b00e27] text-white text-xs font-bold shadow-lg shadow-red-950/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-red-500/30"
              >
                <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                <span>Upload Video</span>
                <span className="px-1.5 py-0.2 bg-black/40 rounded text-[10px] text-red-200 font-medium">
                  Admin Only
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Infinite auto-scroll marquee component with hover slow down and drag */}
        <FeaturedProjectsMarquee
          projects={projects}
          onSelectProject={(p) => setActiveVideoModalProject(p)}
          onOpenUpload={handleOpenUpload}
        />
      </section>

      {/* About Me Section */}
      <section className="py-12 px-4 max-w-5xl mx-auto relative z-10">
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
          <MacOSWindow
            title="Inspector — About Abiy Ketema"
            icon={<Award className="w-3.5 h-3.5 text-red-400" />}
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-3 flex justify-center">
                <AKLogo size={95} rounded="2xl" />
              </div>
              <div className="md:col-span-9 space-y-2.5">
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  About <span className="text-cyan-400">Abiy Ketema (AK clipps)</span>
                </h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Detail-oriented Video Editor with <span className="text-white font-medium">3+ years</span> of experience producing video content across social media, corporate, and entertainment channels. Skilled in visual pacing, motion typography, and audio mastering.
                </p>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Founder & producer of the <span className="text-white font-medium">MUSIKANA</span> YouTube channel with over <span className="text-cyan-400 font-semibold">8,000+ subscribers</span>, delivering synchronized motion lyrics streams and creative video cuts with over <span className="text-white font-medium">5M+</span> overall reach.
                </p>
              </div>
            </div>
          </MacOSWindow>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-12 px-4 max-w-5xl mx-auto relative z-10">
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-6">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
              <Code className="w-4 h-4" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Skills & <span className="text-cyan-400">Software</span>
            </h2>
          </div>
          <p className="text-slate-400 text-xs">
            Editing toolkits, motion software, and post-production proficiencies.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((s, i) => (
            <div
              key={i}
              className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${
                i * 100
              }`}
            >
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{s.icon}</span>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-medium text-slate-300">
                      {s.badge}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-sm mb-1">{s.category}</h3>
                  <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-800 space-y-1">
                  {s.tools.map((t, j) => (
                    <div
                      key={j}
                      className="text-[11px] text-slate-300 flex items-center gap-1.5"
                    >
                      <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Work Experience Section */}
      <section id="work" className="py-12 px-4 max-w-5xl mx-auto relative z-10">
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-6">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
              <Briefcase className="w-4 h-4" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Work <span className="text-cyan-400">Experience</span>
            </h2>
          </div>
          <p className="text-slate-400 text-xs">
            Client projects, YouTube production, and commercial campaigns.
          </p>
        </div>

        <div className="space-y-4">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${
                i * 100
              }`}
            >
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
                <div className="flex flex-col md:flex-row gap-5 items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-white">{exp.title}</h3>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium">
                        {exp.tag}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="text-slate-200 font-medium">{exp.company}</span>
                      <span>•</span>
                      <span>{exp.location}</span>
                      <span>•</span>
                      <span className="font-mono text-[11px]">{exp.period}</span>
                    </div>

                    <ul className="space-y-1.5 pt-1">
                      {exp.responsibilities.map((r, j) => (
                        <li
                          key={j}
                          className="text-xs text-slate-300 flex items-start gap-2"
                        >
                          <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Media Thumbnails */}
                  {(exp.thumbnail || exp.isTikTok) && (
                    <div className="shrink-0 flex gap-2 pt-1 md:pt-0">
                      {exp.isTikTok ? (
                        exp.links?.map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="w-12 h-12 rounded-lg bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
                            title="Watch TikTok Video"
                          >
                            <Music className="w-4 h-4 text-pink-400 mb-0.5" />
                            <span className="text-[8px] font-bold">Clip {lIdx + 1}</span>
                          </a>
                        ))
                      ) : (
                        <a
                          href={exp.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="relative w-20 h-20 rounded-xl border border-slate-700 overflow-hidden hover:opacity-90 transition-opacity"
                        >
                          <img
                            src={exp.thumbnail}
                            alt="Channel preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Youtube className="w-5 h-5 text-red-500" />
                          </div>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client Reviews Section (Abiy, 4.6 Rated, 5M+ Views, Realistic Likes) */}
      <ClientReviews />

      {/* Education */}
      <section className="py-10 px-4 max-w-4xl mx-auto relative z-10">
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
              <GraduationCap className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Education & <span className="text-cyan-400">Background</span>
            </h2>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <h3 className="text-base font-bold text-white">
              Information Systems Student
            </h3>
            <p className="text-xs font-semibold text-cyan-400 mb-1">
              Addis Ababa University
            </p>
            <p className="text-xs text-slate-400">
              Technical asset management, narrative pacing, and digital media workflows.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Let's Create High-Impact Video Content</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">
              Get in Touch with <span className="text-cyan-400">AK clipps</span>
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-8">
              Available for YouTube video editing, TikTok/Reels retainers, and promotional campaigns.
            </p>
          </div>

          {/* Avatar */}
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-200 mb-8">
            <AKLogo size={90} rounded="2xl" />
            <div className="mt-2 font-bold text-white text-sm">AK clipps (Abiy Ketema)</div>
            <div className="text-[11px] text-slate-400">Addis Ababa, Ethiopia</div>
          </div>

          {/* Action Buttons */}
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-400 w-full max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href="https://t.me/Ak_clips"
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-[#C8102E] hover:bg-[#b00e27] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Telegram</span>
              </a>

              <a
                href="mailto:abiyketema21@gmail.com"
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>Email</span>
              </a>

              <a
                href="https://www.linkedin.com/in/abiy-ketema-2a8902290"
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer"
              >
                <Linkedin className="w-3.5 h-3.5 text-sky-400" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center relative border-t border-slate-800/80 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <AKLogo size={16} rounded="lg" />
            <span className="font-semibold text-slate-300">AK clipps</span>
            <span>— Abiy Ketema</span>
          </div>

          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} AK clipps. All rights reserved. • 4.6</span>
            <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>Rated</span>
          </div>
        </div>
      </footer>

      {/* Floating macOS Dock */}
      <MacOSDock onOpenUpload={handleOpenUpload} />

      {/* Security Gatekeeper Authorization Modal (Admin Only) */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Creator Video Upload & Project Manager Studio Modal */}
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        projects={projects}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onResetProjects={handleResetProjects}
        onLockSession={handleLockSession}
      />

      {/* High-End Cinema Video Player Modal */}
      <VideoPlayerModal
        project={activeVideoModalProject}
        onClose={() => setActiveVideoModalProject(null)}
      />
    </div>
  );
}
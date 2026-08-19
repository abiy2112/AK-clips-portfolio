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
import MacOSWindow from "./components/MacOSWindow";
import VideoStudioTimeline from "./components/VideoStudioTimeline";
import FeaturedProjectsMarquee from "./components/FeaturedProjectsMarquee";
import SoftwareMarquee from "./components/SoftwareMarquee";
import AKLogo from "./components/AKLogo";
import AdminAuthModal from "./components/AdminAuthModal";
import AdminPanel from "./components/AdminPanel";
import VideoPlayerModal from "./components/VideoPlayerModal";
import { ProjectItem } from "./types/project";
import { ReviewItem } from "./types/review";
import { SiteContactSettings, SiteContentSettings } from "./types/settings";
import {
  getCreatorAuthStatus,
  setCreatorAuthStatus,
} from "./utils/videoParser";
import {
  subscribeToProjects,
  saveProjectToCloud,
  deleteProjectFromCloud,
  subscribeToReviews,
  subscribeToVlogs,
  saveReviewToCloud,
} from "./utils/cloudDB";
import {
  subscribeToContactSettings,
  subscribeToContentSettings,
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_CONTENT_SETTINGS,
} from "./utils/siteSettings";
import { INITIAL_REVIEWS } from "./data/initialReviews";
import VlogSection from "./components/VlogSection";
import { VlogItem } from "./types/vlog";

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

  // Cloud custom projects (from Firestore) + static defaults
  const [customProjects, setCustomProjects] = useState<ProjectItem[]>([]);
  const projects = [...customProjects, ...DEFAULT_PROJECTS];

  // Reviews from Cloud Firestore
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);

  // Vlogs from Cloud Firestore
  const [vlogs, setVlogs] = useState<VlogItem[]>([]);

  // Contact & Written Content settings from Cloud Firestore
  const [contactSettings, setContactSettings] = useState<SiteContactSettings>(DEFAULT_CONTACT_SETTINGS);
  const [contentSettings, setContentSettings] = useState<SiteContentSettings>(DEFAULT_CONTENT_SETTINGS);

  // Modal & Auth states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [activeVideoModalProject, setActiveVideoModalProject] = useState<ProjectItem | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getCreatorAuthStatus());
  const [activeSection, setActiveSection] = useState<"projects" | "about" | "work" | "skills" | "reviews" | "vlogs">("projects");

  // Subscribe to custom projects from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToProjects((cloudProjects) => {
      setCustomProjects(cloudProjects);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to client reviews from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToReviews((cloudReviews) => {
      if (cloudReviews.length > 0) {
        setReviews(cloudReviews);
      }
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to vlogs from Firestore
  useEffect(() => {
    const unsubscribe = subscribeToVlogs((cloudVlogs) => {
      setVlogs(cloudVlogs);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to contact and content settings from Firestore
  useEffect(() => {
    const unsubContact = subscribeToContactSettings((settings) => {
      setContactSettings(settings);
    });
    const unsubContent = subscribeToContentSettings((settings) => {
      setContentSettings(settings);
    });
    return () => {
      unsubContact();
      unsubContent();
    };
  }, []);

  // Intersection Observer for clean fade-in animations
  useEffect(() => {
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
  }, [projects, reviews, vlogs, contentSettings]);

  // Admin access handler (triggered by top lightning icon)
  const handleOpenAdmin = () => {
    if (isAuthenticated) {
      setIsAdminPanelOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setCreatorAuthStatus(true);
    setIsAuthModalOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleLockSession = () => {
    setIsAuthenticated(false);
    setCreatorAuthStatus(false);
    setIsAdminPanelOpen(false);
  };

  const handleAddProject = (newProject: ProjectItem) => {
    setCustomProjects((prev) => [
      newProject,
      ...prev.filter((p) => p.id !== newProject.id),
    ]);
    saveProjectToCloud(newProject).catch(console.error);
  };

  const handleDeleteProject = (projectId: string) => {
    setCustomProjects((prev) => prev.filter((p) => p.id !== projectId));
    deleteProjectFromCloud(projectId).catch(console.error);
  };

  const handleResetProjects = () => {
    customProjects.forEach((p) => deleteProjectFromCloud(p.id).catch(console.error));
    setCustomProjects([]);
  };

  const handleAddReview = (newReview: ReviewItem) => {
    setReviews((prev) => [
      newReview,
      ...prev.filter((r) => r.id !== newReview.id),
    ]);
    // Also save to cloud as a failsafe (AdminPanel also calls saveReviewToCloud)
    saveReviewToCloud(newReview).catch(console.error);
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== reviewId));
  };

  const handleAddVlog = (newVlog: VlogItem) => {
    setVlogs((prev) => [newVlog, ...prev.filter((v) => v.id !== newVlog.id)]);
  };

  const handleDeleteVlog = (vlogId: string) => {
    setVlogs((prev) => prev.filter((v) => v.id !== vlogId));
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
      companyUrl: contactSettings.youtubeChannelUrl || "https://youtube.com/@musikana1?si=YM0bpGXPvAAbcyKw",
      location: "Addis Ababa",
      period: "Jul 2023 - Present",
      subscribers: "8,000+ Subscribers",
      responsibilities: [
        "Head video editor for high-performing Amharic lyrics video streams and music visuals.",
        "Engineered kinetic motion typography synchronized frame-by-frame to musical rhythm.",
        "Managed publishing cadence resulting in thousands of recurring organic views.",
      ],
      thumbnail: imagechan,
      videoUrl: contactSettings.youtubeChannelUrl || "https://youtube.com/@musikana1",
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
    <div className="min-h-screen bg-[#090D16] text-slate-100 font-sans selection:bg-[#C8102E]/30 selection:text-white relative overflow-x-hidden pb-20 sm:pb-24">
      {/* macOS Clean Top Menu Bar with Discreet Lightning Icon for Admin Access */}
      <MacOSMenuBar
        activeSection={activeSection}
        onSelectTab={setActiveSection}
        onOpenAdmin={handleOpenAdmin}
        rating={contentSettings.rating}
      />

      {/* Hero Section: Clean macOS Welcoming Screen (Mobile-First) */}
      <header id="hero" className="relative pt-12 sm:pt-16 pb-6 sm:pb-8 px-3 sm:px-4 max-w-5xl mx-auto z-10">
        <MacOSWindow
          title={`${contentSettings.name} Studio`}
          subtitle={contentSettings.fullName}
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
                <span>{contentSettings.rating}</span>
              </a>
            </div>
          }
        >
          {/* Welcoming Screen */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center py-2 sm:py-4">
            {/* Left Content */}
            <div className="md:col-span-8 space-y-3.5 sm:space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium">
                <AKLogo size={16} rounded="xl" />
                <span>{contentSettings.badgeText}</span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight leading-tight">
                  {contentSettings.name}
                </h1>
                <div className="text-sm sm:text-lg text-slate-400 font-normal mt-1">
                  {contentSettings.fullName} • {contentSettings.tagline}
                </div>
              </div>

              <p className="text-slate-300 text-xs sm:text-base leading-relaxed max-w-xl">
                {contentSettings.heroDescription}
              </p>

              {/* CTAs (Full width on mobile phones, inline on desktop) */}
              <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 pt-1">
                <a
                  href={contactSettings.telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-5 py-3 bg-[#C8102E] hover:bg-[#b00e27] text-white font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-98"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram (@{contactSettings.telegramUsername})</span>
                </a>

                <a
                  href="#projects"
                  onClick={() => setActiveSection("projects")}
                  className="w-full sm:w-auto px-5 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-98"
                >
                  <Play className="w-3.5 h-3.5 text-slate-300 fill-slate-300" />
                  <span>Explore Projects</span>
                </a>
              </div>

              {/* Quick Contacts */}
              <div className="flex flex-wrap gap-2 pt-1 text-xs text-slate-400">
                <a
                  href={`mailto:${contactSettings.email}`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px] sm:text-xs">{contactSettings.email}</span>
                </a>
                <a
                  href={`tel:${contactSettings.phone.replace(/[^0-9+]/g, "")}`}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] sm:text-xs">{contactSettings.phone}</span>
                </a>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                  <MapPin className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[11px] sm:text-xs">{contactSettings.location}</span>
                </div>
              </div>
            </div>

            {/* Right Clean Logo & Profile Card */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="w-full bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-5 flex flex-col items-center text-center">
                <div className="relative mb-3">
                  <AKLogo size={90} rounded="2xl" />
                  <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-full flex items-center gap-1 text-[10px] font-bold text-amber-400">
                    <Zap className="w-2.5 h-2.5 fill-amber-400" />
                    <span>{contentSettings.rating}</span>
                  </div>
                </div>

                <div className="text-base font-bold text-white flex items-center gap-1.5">
                  <span>{contentSettings.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-xs text-slate-400 mb-3">{contentSettings.fullName}</div>

                {/* Profile Stats */}
                <div className="w-full grid grid-cols-3 gap-1.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                  <div>
                    <div className="text-xs font-bold text-white flex items-center justify-center gap-0.5">
                      <span>{contentSettings.rating}</span>
                      <Zap className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="text-[9px] text-slate-400">Rating</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{contentSettings.experienceYears}</div>
                    <div className="text-[9px] text-slate-400">Experience</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">{contentSettings.totalViews}</div>
                    <div className="text-[9px] text-slate-400">Views</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Timeline Suite */}
          <div id="timeline" className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
              <span className="font-medium flex items-center gap-1.5 text-slate-300">
                <Sliders className="w-3.5 h-3.5 text-slate-400" />
                Editing Suite
              </span>
            </div>
            <VideoStudioTimeline />
          </div>
        </MacOSWindow>
      </header>

      {/* ──────────── TAB BAR ──────────── */}
      <div className="sticky top-10 sm:top-11 z-30 bg-[#090D16]/80 backdrop-blur-md border-b border-slate-800/60">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 flex items-center gap-0.5 overflow-x-auto scrollbar-hide py-1">
          {([
            { id: "projects", label: "Projects" },
            { id: "about",    label: "About" },
            { id: "work",     label: "Work" },
            { id: "skills",   label: "Skills" },
            { id: "reviews",  label: "Reviews" },
            { id: "vlogs",    label: "Vlogs" },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeSection === tab.id
                  ? "bg-[#C8102E] text-white"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ──────────── SECTION CONTENT (only active tab visible) ──────────── */}

      {/* Featured Projects */}
      {activeSection === "projects" && (
        <section id="projects" className="py-8 sm:py-12 px-3 sm:px-4 max-w-5xl mx-auto relative z-10">
          <FeaturedProjectsMarquee
            projects={projects}
            onSelectProject={(p) => setActiveVideoModalProject(p)}
            onDeleteProject={handleDeleteProject}
          />
        </section>
      )}

      {/* About */}
      {activeSection === "about" && (
        <section className="py-8 sm:py-12 px-3 sm:px-4 max-w-5xl mx-auto relative z-10 space-y-6">
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
            <MacOSWindow
              title={`Inspector — About ${contentSettings.fullName}`}
              icon={<Award className="w-3.5 h-3.5 text-red-400" />}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6 items-center">
                <div className="md:col-span-3 flex justify-center">
                  <AKLogo size={85} rounded="2xl" />
                </div>
                <div className="md:col-span-9 space-y-2.5">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    About <span className="text-cyan-400">{contentSettings.fullName} ({contentSettings.name})</span>
                  </h2>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {contentSettings.aboutDescription1}
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    {contentSettings.aboutDescription2}
                  </p>
                </div>
              </div>
            </MacOSWindow>
          </div>

          {/* Education */}
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
                <GraduationCap className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Education &amp; <span className="text-cyan-400">Background</span>
              </h2>
            </div>

            <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 sm:p-5">
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
      )}

      {/* Skills */}
      {activeSection === "skills" && (
        <section id="skills" className="py-8 sm:py-12 px-3 sm:px-4 max-w-5xl mx-auto relative z-10">
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
                <Code className="w-4 h-4" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Skills &amp; <span className="text-cyan-400">Software</span>
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {skills.map((s, i) => (
              <div
                key={i}
                className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${i * 100}`}
              >
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <span className="text-2xl">{s.icon}</span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[9px] font-medium text-slate-300">
                        {s.badge}
                      </span>
                    </div>
                    <h3 className="text-white font-bold text-sm mb-1">{s.category}</h3>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3">{s.desc}</p>
                  </div>
                  <div className="pt-2.5 border-t border-slate-800 space-y-1">
                    {s.tools.map((t, j) => (
                      <div key={j} className="text-[11px] text-slate-300 flex items-center gap-1.5">
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
      )}

      {/* Work Experience */}
      {activeSection === "work" && (
        <section id="work" className="py-8 sm:py-12 px-3 sm:px-4 max-w-5xl mx-auto relative z-10">
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-4 sm:mb-6">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-200">
                <Briefcase className="w-4 h-4" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Work <span className="text-cyan-400">Experience</span>
              </h2>
            </div>
          </div>

          <div className="space-y-3.5 sm:space-y-4">
            {experiences.map((exp, i) => (
              <div
                key={i}
                className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${i * 100}`}
              >
                <div className="bg-slate-900 rounded-xl border border-slate-800 p-4 sm:p-5">
                  <div className="flex flex-col md:flex-row gap-4 sm:gap-5 items-start justify-between">
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
                          <li key={j} className="text-xs text-slate-300 flex items-start gap-2">
                            <ArrowRight className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {(exp.thumbnail || exp.isTikTok) && (
                      <div className="shrink-0 flex gap-2 pt-1 md:pt-0">
                        {exp.isTikTok ? (
                          exp.links?.map((link, lIdx) => (
                            <a
                              key={lIdx}
                              href={link}
                              target="_blank"
                              rel="noreferrer"
                              className="w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-slate-800/80 border border-slate-700 flex flex-col items-center justify-center text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
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
                            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-slate-700 overflow-hidden hover:opacity-90 transition-opacity"
                          >
                            <img src={exp.thumbnail} alt="Channel preview" className="w-full h-full object-cover" />
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
      )}

      {/* Reviews */}
      {activeSection === "reviews" && (
        <ClientReviews
          reviews={reviews}
          rating={contentSettings.rating}
          isAdmin={isAuthenticated}
          onAddReview={handleAddReview}
          onDeleteReview={handleDeleteReview}
        />
      )}

      {/* Vlogs */}
      {activeSection === "vlogs" && (
        <VlogSection vlogs={vlogs} />
      )}


      {/* Production Software & Creative Toolkit Marquee */}
      <div id="software">
        <SoftwareMarquee />
      </div>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-16 px-3 sm:px-4 text-center relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800 text-slate-300 text-xs font-medium mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Let's Create High-Impact Video Content</span>
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2.5 tracking-tight">
              {contentSettings.contactSectionTitle}
            </h2>

            <p className="text-slate-400 text-xs sm:text-sm max-w-md mx-auto mb-6 sm:mb-8">
              {contentSettings.contactSectionSubtitle}
            </p>
          </div>

          {/* Avatar */}
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-200 mb-6 sm:mb-8">
            <AKLogo size={80} rounded="2xl" />
            <div className="mt-2 font-bold text-white text-sm">
              {contentSettings.name} ({contentSettings.fullName})
            </div>
            <div className="text-[11px] text-slate-400">{contactSettings.location}</div>
          </div>

          {/* Action Buttons (Mobile-first full touch layout) */}
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-400 w-full max-w-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <a
                href={contactSettings.telegramUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-[#C8102E] hover:bg-[#b00e27] text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer shadow-md active:scale-98"
              >
                <Send className="w-4 h-4" />
                <span>Telegram</span>
              </a>

              <a
                href={`mailto:${contactSettings.email}`}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-98"
              >
                <Mail className="w-4 h-4 text-cyan-400" />
                <span>Email</span>
              </a>

              <a
                href={contactSettings.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer active:scale-98"
              >
                <Linkedin className="w-4 h-4 text-sky-400" />
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
            <span className="font-semibold text-slate-300">{contentSettings.name}</span>
            <span>— {contentSettings.fullName}</span>
          </div>

          <div className="flex items-center gap-1">
            <span>© {new Date().getFullYear()} {contentSettings.name}. All rights reserved. • {contentSettings.rating}</span>
            <Zap className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>Rated</span>
          </div>
        </div>
      </footer>

      {/* Security Gatekeeper Authorization Modal (Passcode 5252) */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Universal Studio Admin Panel (Uploads, Reviews, Contact, Content) */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        projects={projects}
        reviews={reviews}
        vlogs={vlogs}
        contactSettings={contactSettings}
        contentSettings={contentSettings}
        onAddProject={handleAddProject}
        onDeleteProject={handleDeleteProject}
        onResetProjects={handleResetProjects}
        onAddReview={handleAddReview}
        onDeleteReview={handleDeleteReview}
        onAddVlog={handleAddVlog}
        onDeleteVlog={handleDeleteVlog}
        onLockSession={handleLockSession}
      />

      {/* Cinema Video Player Modal (Mobile Optimized) */}
      <VideoPlayerModal
        project={activeVideoModalProject}
        onClose={() => setActiveVideoModalProject(null)}
      />
    </div>
  );
}
import {
  Mail,
  Phone,
  MapPin,
  Play,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  ExternalLink,
  Youtube,
  Music,
  Linkedin,
  Send,
  Sparkles,
  Star,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import imageme from "../img/me.jpg";
import imagechan from "../img/channels4_profile.jpg";
import ClientReviews from "./components/ClientReviews";

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const observerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    // Intersection Observer for fade-in animations
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-up").forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observerRef.current?.disconnect();
    };
  }, []);

  const skills = [
    {
      category: "Video Editing",
      tools: ["Adobe Premiere Pro", "Cap Cut", "DaVinci Resolve"],
      icon: "🎬",
      color: "from-purple-500/20 to-pink-500/20",
    },
    {
      category: "Motion Graphics",
      tools: ["After Effects", "Blender"],
      icon: "✨",
      color: "from-blue-500/20 to-cyan-500/20",
    },
    {
      category: "Post-Production",
      tools: ["Color Grading & Correction", "Audio Editing & Mixing"],
      icon: "🎨",
      color: "from-orange-500/20 to-red-500/20",
    },
    {
      category: "Content Creation",
      tools: ["Storyboarding & Script Interpretation", "Social Media Content"],
      icon: "📱",
      color: "from-green-500/20 to-emerald-500/20",
    },
  ];

  const experiences = [
    {
      title: "YouTube Video Editor and Content Creator",
      company: "Self Employed (MUSIKANA)",
      companyUrl: "https://youtube.com/@musikana1?si=YM0bpGXPvAAbcyKw",
      location: "Addis Ababa",
      period: "Jul 2023 - Present",
      responsibilities: [
        "Edited videos for my channel MUSIKANA.",
        "Streaming Amharic lyrics videos on YouTube and other social media platforms.",
        "Created visually appealing content to engage audience.",
      ],
      thumbnail: imagechan,
      videoUrl: "https://youtube.com/@musikana1",
      accent: "from-red-600 to-orange-500",
    },
    {
      title: "TikTok Video Editor",
      company: "Freelance",
      location: "Addis Ababa",
      period: "Jun 2024 - Present",
      responsibilities: [
        "Edited TikTok videos for various local Ethiopian clients.",
        "Managed raw footage organization and helped with video shooting.",
        "Created content and wrote scripts for clients.",
      ],
      isTikTok: true,
      links: [
        "https://www.tiktok.com/@orbitrise/video/7543299885341117701",
        "https://www.tiktok.com/@abela_.g/video/7508002112287165702",
        "https://www.tiktok.com/@dagimshumey_/video/7569241398868856120",
      ],
      accent: "from-cyan-500 to-blue-500",
    },
    {
      title: "Promotional Video Editor",
      company: "Blue Sky Properties",
      location: "Addis Ababa, Ethiopia",
      period: "Jun 2025 - Nov 2025",
      responsibilities: [
        "Edited promotional videos showcasing real estate properties.",
        "Wrote scripts for the videos.",
        "Note: I edited multiple videos for their channel, make sure to check out the whole channel!",
      ],
      isTikTok: true,
      links: [
        "https://www.tiktok.com/@blueskypropet/video/7536115078043553029",
      ],
      accent: "from-emerald-500 to-teal-500",
    },
    {
      title: "Video Editor",
      company: "4 Kilo Gbi Gubae",
      location: "Addis Ababa, Ethiopia",
      period: "Dec 2025 - Present",
      responsibilities: [
        "Edit different types of videos for the channel.",
        "Write scripts for the videos.",
        "Color grading and correction.",
      ],
      accent: "from-purple-500 to-pink-500",
    },
  ];

  const projects = [
    { id: "Kpl1YGsYaXY", title: "Ethiopian Tourism", category: "Cinematic" },
    { id: "2y93gUqIRnY", title: "Short Form Edit 1", category: "Social Media" },
    { id: "se6H6d5qpNs", title: "Short Form Edit 2", category: "Social Media" },
    { id: "4JyLoYDakG4", title: "Short Form Edit 3", category: "Social Media" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950 text-zinc-300 font-sans selection:bg-red-500/30 selection:text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-zinc-900/80 backdrop-blur-xl border-b border-white/10 py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <span className="text-2xl font-black bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
            AK
          </span>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#work" className="hover:text-red-400 transition-colors">
              Work
            </a>
            <a href="#projects" className="hover:text-red-400 transition-colors">
              Projects
            </a>
            <a href="#reviews" className="hover:text-red-400 transition-colors">
              Reviews
            </a>
            <a href="#contact" className="hover:text-red-400 transition-colors">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1757845366142-e5929f71c7bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aWRlbyUyMGVkaXRpbmclMjB3b3Jrc3BhY2UlMjBmaWxtfGVufDF8fHx8MTc3MDA0MTM2Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Video editing workspace"
            className="w-full h-full object-cover animate-scale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/90 via-zinc-950/70 to-zinc-950"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-6 py-3 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-zinc-300">
              Video Editor & Creative Storyteller
            </span>
          </div>

          <h1 className="text-7xl md:text-9xl mb-6 text-white tracking-tight animate-fade-in-up">
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent animate-gradient">
              Abiy Ketema
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 mb-12 animate-fade-in-up animation-delay-200">
            Crafting visual stories that captivate and inspire
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-zinc-400 animate-fade-in-up animation-delay-400">
            {[
              {
                icon: Mail,
                text: "abiyketema21@gmail.com",
                href: "mailto:abiyketema21@gmail.com",
              },
              { icon: Phone, text: "+251-934681880", href: "tel:+251934681880" },
              {
                icon: MapPin,
                text: "Addis Ababa, Ethiopia",
                href: "https://www.google.com/maps/search/Ethiopia%2C+Addis+Ababa%2C+0000%2C+Ethiopia",
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full hover:bg-white/10 hover:border-red-500/50 hover:scale-105 transition-all duration-300 group"
              >
                <item.icon className="w-4 h-4 group-hover:text-red-400 transition-colors" />
                <span className="text-sm">{item.text}</span>
              </a>
            ))}
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-zinc-500" />
          </div>
        </div>
      </header>

      {/* About Me */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-red-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 rounded-2xl">
              <Award className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-4xl font-black text-white">
              About{" "}
              <span className="bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text text-transparent">
                Me
              </span>
            </h2>
          </div>
          <div className="relative p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            <div className="absolute -top-3 -left-3 w-20 h-20 bg-red-500/20 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-3 -right-3 w-20 h-20 bg-purple-500/20 rounded-full blur-2xl"></div>
            <p className="text-lg leading-relaxed text-zinc-300 relative z-10">
              Creative and detail-oriented Video Editor with{" "}
              <span className="text-red-400 font-bold">3+ years</span> of experience
              in editing high-quality videos for clients across social media,
              corporate, and entertainment platforms. Skilled in storytelling,
              motion graphics, and post-production techniques. I also manage the{" "}
              <span className="text-purple-400 font-bold">MUSIKANA</span> YouTube
              channel with over{" "}
              <span className="text-red-400 font-bold">8,000+ subscribers</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-xl border border-white/10 rounded-2xl">
                <Code className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-4xl font-black text-white">
                Skills &{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Expertise
                </span>
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((s, i) => (
              <div
                key={i}
                className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${
                  i * 100
                }`}
              >
                <div
                  className={`relative p-6 bg-gradient-to-br ${s.color} backdrop-blur-xl border border-white/10 rounded-2xl hover:scale-105 transition-all duration-300 group overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="text-4xl mb-4">{s.icon}</div>
                  <h3 className="text-white font-bold text-lg mb-4">
                    {s.category}
                  </h3>
                  <ul className="space-y-2">
                    {s.tools.map((t, j) => (
                      <li
                        key={j}
                        className="text-sm text-zinc-300 flex items-center gap-2"
                      >
                        <Star className="w-3 h-3 text-red-400 fill-current" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience */}
      <section id="work" className="py-24 px-4 max-w-5xl mx-auto">
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
          <div className="flex items-center gap-4 mb-16">
            <div className="p-3 bg-gradient-to-br from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-white/10 rounded-2xl">
              <Briefcase className="w-6 h-6 text-orange-400" />
            </div>
            <h2 className="text-4xl font-black text-white">
              Work{" "}
              <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
          </div>
        </div>
        <div className="space-y-8">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${
                i * 100
              }`}
            >
              <div className="relative p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl hover:border-red-500/30 transition-all duration-300 group">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-2 h-2 rounded-full bg-gradient-to-r ${exp.accent} animate-pulse`}
                      ></div>
                      <h3 className="text-2xl text-white font-bold">
                        {exp.title}
                      </h3>
                    </div>
                    <p className="text-transparent bg-gradient-to-r from-red-400 to-purple-400 bg-clip-text font-medium mb-4">
                      {exp.company}{" "}
                      <span className="text-zinc-500 text-sm ml-2">
                        | {exp.period}
                      </span>
                    </p>
                    <ul className="space-y-3">
                      {exp.responsibilities.map((r, j) => (
                        <li
                          key={j}
                          className="text-sm text-zinc-400 flex items-start gap-2"
                        >
                          <ArrowRight className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {(exp.thumbnail || exp.isTikTok) && (
                    <div className="flex gap-3">
                      {exp.isTikTok ? (
                        exp.links?.map((link, lIdx) => (
                          <a
                            key={lIdx}
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                            className="relative w-20 h-20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center hover:scale-110 transition-all duration-300 group overflow-hidden"
                          >
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            <Music className="w-8 h-8 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
                          </a>
                        ))
                      ) : (
                        <a
                          href={exp.videoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="relative w-24 h-24 rounded-2xl border-2 border-white/10 overflow-hidden hover:scale-110 transition-all duration-300 group shadow-2xl"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                          <img
                            src={exp.thumbnail}
                            alt="Preview"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <Youtube className="absolute bottom-2 right-2 w-4 h-4 text-white z-20 opacity-0 group-hover:opacity-100 transition-opacity" />
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

      {/* Selected Projects */}
      <section id="projects" className="py-24 px-4 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
            <div className="flex items-center gap-4 mb-12">
              <div className="p-3 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/10 rounded-2xl">
                <Play className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-4xl font-black text-white">
                Featured{" "}
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Projects
                </span>
              </h2>
            </div>
          </div>
          <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide">
            {projects.map((p, i) => (
              <a
                key={i}
                href={`https://youtube.com/watch?v=${p.id}`}
                target="_blank"
                rel="noreferrer"
                className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${
                  i * 100
                } snap-center shrink-0 w-[85vw] md:w-[45vw] lg:w-[30vw] group`}
                onMouseEnter={() => setActiveProject(p.id)}
                onMouseLeave={() => setActiveProject(null)}
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 group-hover:border-red-500/50 transition-all duration-300 shadow-2xl">
                  <img
                    src={`https://img.youtube.com/vi/${p.id}/maxresdefault.jpg`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    alt={p.title}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-all duration-300">
                      <Play className="w-8 h-8 text-white fill-current ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-xl border border-white/10 rounded-full text-xs font-medium text-zinc-300 mb-3">
                      {p.category}
                    </span>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      {p.title}
                      <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                  </div>
                </div>
              </a>
            ))}
          </div>
          <p className="text-center text-zinc-500 text-sm mt-6">
            ← Swipe to explore more projects →
          </p>
        </div>
      </section>

      {/* Client Comments & Reviews */}
      <ClientReviews />

      {/* Education */}
      <section className="py-24 px-4 max-w-4xl mx-auto">
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-xl border border-white/10 rounded-2xl">
              <GraduationCap className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-4xl font-black text-white">
              My{" "}
              <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                Education
              </span>
            </h2>
          </div>
          <div className="relative p-8 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl hover:border-green-500/30 transition-all duration-300">
            <div className="absolute -top-2 -right-2 w-32 h-32 bg-green-500/10 rounded-full blur-3xl"></div>
            <h3 className="text-2xl text-white font-bold mb-2">
              Information Systems Student
            </h3>
            <p className="text-transparent bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-lg">
              Addis Ababa University
            </p>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-4 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-red-500/5 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Let's build{" "}
              <span className="bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                something great.
              </span>
            </h2>
          </div>

          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-200">
            <div className="relative w-40 h-40 md:w-48 md:h-48 mb-12">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500 via-purple-500 to-blue-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-full h-full rounded-full border-4 border-white/20 backdrop-blur-xl overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-300">
                <img
                  src={imageme}
                  alt="Abiy Ketema"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-400">
            <div className="flex flex-wrap justify-center gap-4">
              {[
                {
                  icon: Mail,
                  text: "Email",
                  href: "mailto:abiyketema21@gmail.com",
                  gradient: "from-red-500/20 to-orange-500/20",
                },
                {
                  icon: Send,
                  text: "Telegram",
                  href: "https://t.me/Ak_videoss",
                  gradient: "from-blue-500/20 to-cyan-500/20",
                },
                {
                  icon: Linkedin,
                  text: "LinkedIn",
                  href: "https://www.linkedin.com/in/abiy-ketema-2a8902290",
                  gradient: "from-purple-500/20 to-pink-500/20",
                },
              ].map((btn, i) => (
                <a
                  key={i}
                  href={btn.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`relative group px-8 py-4 bg-gradient-to-br ${btn.gradient} backdrop-blur-xl border border-white/10 rounded-full font-bold text-white hover:scale-105 transition-all duration-300 overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    <btn.icon className="w-5 h-5" />
                    {btn.text}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 text-center relative border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-zinc-500 text-sm">
            © {new Date().getFullYear()} Abiy Ketema. All rights reserved.
          </p>
        </div>
      </footer>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(2rem);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
        
        @keyframes scale {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        
        .animate-scale {
          animation: scale 20s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .fade-up {
          opacity: 0;
          transform: translateY(2rem);
        }
        
        .fade-up.animate-in {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
import { useState, useEffect } from "react";
import {
  MessageSquareQuote,
  Star,
  ThumbsUp,
  Sparkles,
  CheckCircle2,
  Send,
  Plus,
  Filter,
  Film,
  TrendingUp,
  Clock,
  User,
  Quote,
  X,
} from "lucide-react";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  companyOrHandle?: string;
  avatarColor: string;
  rating: number;
  category: "TikTok & Reels" | "YouTube & Music" | "Real Estate & Promo" | "Other";
  date: string;
  comment: string;
  verified: boolean;
  projectHighlight?: string;
  likes: number;
  isCustom?: boolean;
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    name: "Orbit Rise",
    role: "TikTok Content Creator",
    companyOrHandle: "@orbitrise",
    avatarColor: "from-cyan-500 to-blue-600",
    rating: 5,
    category: "TikTok & Reels",
    date: "2 weeks ago",
    comment:
      "Abiy transformed our raw footage into high-retention viral TikTok clips! His pacing, caption animations, and sound effects brought our engagement to a whole new level. Super fast turnaround too!",
    verified: true,
    projectHighlight: "Viral TikTok Series (1M+ views)",
    likes: 24,
  },
  {
    id: "rev-2",
    name: "Blue Sky Properties",
    role: "Marketing Director",
    companyOrHandle: "Real Estate Agency",
    avatarColor: "from-emerald-500 to-teal-600",
    rating: 5,
    category: "Real Estate & Promo",
    date: "1 month ago",
    comment:
      "Working with Abiy on our luxury property promotional videos was seamless. He has an incredible eye for color grading, smooth cinematic transitions, and impactful script pacing. Highly recommended for commercial edits!",
    verified: true,
    projectHighlight: "Commercial Property Showcase",
    likes: 19,
  },
  {
    id: "rev-3",
    name: "Abela G.",
    role: "Influencer & Entertainer",
    companyOrHandle: "@abela_.g",
    avatarColor: "from-purple-500 to-pink-600",
    rating: 5,
    category: "TikTok & Reels",
    date: "1 month ago",
    comment:
      "Abiy knows exactly what makes social media video click. He catches the beat drops perfectly and keeps viewers hooked from the first 2 seconds. Best video editor I've worked with in Addis!",
    verified: true,
    projectHighlight: "Short Form Entertainment Series",
    likes: 31,
  },
  {
    id: "rev-4",
    name: "Dagim Shumey",
    role: "Digital Creator",
    companyOrHandle: "@dagimshumey_",
    avatarColor: "from-orange-500 to-amber-600",
    rating: 5,
    category: "TikTok & Reels",
    date: "2 months ago",
    comment:
      "Great communication, attention to details, and very creative visual rhythm. Whenever I hand over a script or raw video, Abiy always exceeds expectations with the final cut.",
    verified: true,
    projectHighlight: "Lifestyle & Vlog Edits",
    likes: 15,
  },
  {
    id: "rev-5",
    name: "MUSIKANA Community",
    role: "Channel Co-Producer",
    companyOrHandle: "YouTube (8K+ Subs)",
    avatarColor: "from-red-500 to-rose-600",
    rating: 5,
    category: "YouTube & Music",
    date: "3 months ago",
    comment:
      "His work on the Amharic lyrics videos and motion typography is breathtaking. Every frame feels synchronized to the rhythm and emotion of the music. Pure artistic storytelling!",
    verified: true,
    projectHighlight: "Cinematic Lyrics Video Stream",
    likes: 42,
  },
  {
    id: "rev-6",
    name: "4 Kilo Gbi Gubae",
    role: "Media Coordinator",
    companyOrHandle: "Channel Production",
    avatarColor: "from-violet-500 to-indigo-600",
    rating: 5,
    category: "YouTube & Music",
    date: "Recent",
    comment:
      "Outstanding color correction and script adaptation. Abiy manages large multi-cam footage efficiently and delivers broadcast-ready videos right on schedule.",
    verified: true,
    projectHighlight: "Documentary & Event Videos",
    likes: 18,
  },
];

const CATEGORIES = [
  "All",
  "TikTok & Reels",
  "YouTube & Music",
  "Real Estate & Promo",
] as const;

export default function ClientReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    try {
      const saved = localStorage.getItem("ak_portfolio_client_reviews");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_REVIEWS;
  });

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("ak_portfolio_liked_reviews");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    companyOrHandle: "",
    category: "TikTok & Reels" as ReviewItem["category"],
    rating: 5,
    comment: "",
    projectHighlight: "",
  });
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Sync reviews with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "ak_portfolio_client_reviews",
        JSON.stringify(reviews)
      );
    } catch {
      // ignore
    }
  }, [reviews]);

  // Sync likes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "ak_portfolio_liked_reviews",
        JSON.stringify(likedReviews)
      );
    } catch {
      // ignore
    }
  }, [likedReviews]);

  // Trigger intersection animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.05 }
    );

    const elements = document.querySelectorAll("#reviews .fade-up");
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [activeCategory, reviews, isFormOpen]);

  const handleLike = (id: string) => {
    const isLiked = likedReviews[id];
    setLikedReviews((prev) => ({ ...prev, [id]: !isLiked }));
    setReviews((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, likes: isLiked ? r.likes - 1 : r.likes + 1 } : r
      )
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      setFormError("Please fill in your name and comment.");
      return;
    }
    setFormError("");
    setIsSubmitting(true);

    // Color palettes for new comments
    const colors = [
      "from-rose-500 to-red-600",
      "from-purple-500 to-indigo-600",
      "from-cyan-500 to-blue-600",
      "from-emerald-500 to-teal-600",
      "from-amber-500 to-orange-600",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    setTimeout(() => {
      const newReview: ReviewItem = {
        id: "custom-" + Date.now(),
        name: formData.name.trim(),
        role: formData.role.trim() || "Client / Creator",
        companyOrHandle: formData.companyOrHandle.trim() || undefined,
        avatarColor: randomColor,
        rating: formData.rating,
        category: formData.category,
        date: "Just now",
        comment: formData.comment.trim(),
        verified: true,
        projectHighlight: formData.projectHighlight.trim() || undefined,
        likes: 1,
        isCustom: true,
      };

      setReviews((prev) => [newReview, ...prev]);
      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setFormData({
        name: "",
        role: "",
        companyOrHandle: "",
        category: "TikTok & Reels",
        rating: 5,
        comment: "",
        projectHighlight: "",
      });

      setTimeout(() => {
        setSubmittedSuccess(false);
        setIsFormOpen(false);
      }, 2000);
    }, 600);
  };

  const filteredReviews =
    activeCategory === "All"
      ? reviews
      : reviews.filter((r) => r.category === activeCategory);

  const averageRating = (
    reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section id="reviews" className="py-24 px-4 relative overflow-hidden">
      {/* Background glow accents */}
      <div className="absolute top-1/2 -left-32 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-blue-500/10 border border-white/10 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4 text-red-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Client Feedback & Testimonials
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-red-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 rounded-2xl">
                  <MessageSquareQuote className="w-6 h-6 text-red-400" />
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white">
                  Client{" "}
                  <span className="bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Reviews
                  </span>
                </h2>
              </div>
              <p className="text-zinc-400 mt-3 max-w-xl text-base">
                Discover what creators, channels, and businesses say about collaborating on high-impact video projects.
              </p>
            </div>

            {/* Leave a Comment CTA Button */}
            <button
              onClick={() => setIsFormOpen((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-500 via-purple-600 to-blue-600 hover:from-red-600 hover:via-purple-700 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-red-500/20 hover:shadow-red-500/30 hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 self-start md:self-auto cursor-pointer"
            >
              {isFormOpen ? (
                <>
                  <X className="w-5 h-5" />
                  <span>Close Form</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Leave a Comment</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Social Proof / Stats Banner */}
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-3.5 p-2">
              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white flex items-center gap-1">
                  {averageRating}{" "}
                  <span className="text-amber-400 text-base">/ 5.0</span>
                </div>
                <div className="text-xs text-zinc-400">Average Rating</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <Film className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">25+</div>
                <div className="text-xs text-zinc-400">Projects Delivered</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">8M+</div>
                <div className="text-xs text-zinc-400">Combined Views</div>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-2">
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <Clock className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">100%</div>
                <div className="text-xs text-zinc-400">On-Time Delivery</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Comment Submission Form */}
        {isFormOpen && (
          <div className="mb-14 fade-up opacity-0 translate-y-8 transition-all duration-700 animate-in">
            <div className="relative p-6 md:p-8 bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-red-500/20 rounded-xl border border-red-500/30 text-red-400">
                    <Quote className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Share Your Experience
                    </h3>
                    <p className="text-xs text-zinc-400">
                      Your feedback will appear immediately in the client comments section below.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-zinc-400 hover:text-white p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="py-12 text-center flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 animate-bounce">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">
                    Thank you for your review!
                  </h4>
                  <p className="text-sm text-zinc-400">
                    Your comment has been added to the feedback feed.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  {formError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Dawit Alemayehu"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Role / Channel / Handle
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Creator (@handle) or Brand Manager"
                        value={formData.companyOrHandle}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            companyOrHandle: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Project Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value as ReviewItem["category"],
                          })
                        }
                        className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-xl text-white focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                      >
                        <option value="TikTok & Reels">TikTok & Reels</option>
                        <option value="YouTube & Music">YouTube & Music</option>
                        <option value="Real Estate & Promo">
                          Real Estate & Promo
                        </option>
                        <option value="Other">Other Creative Project</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                        Rating
                      </label>
                      <div className="flex items-center gap-2 py-2">
                        {[1, 2, 3, 4, 5].map((star) => {
                          const isActive =
                            (hoverRating !== null
                              ? hoverRating
                              : formData.rating) >= star;
                          return (
                            <button
                              type="button"
                              key={star}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(null)}
                              onClick={() =>
                                setFormData({ ...formData, rating: star })
                              }
                              className="p-1 text-zinc-500 hover:scale-125 transition-transform cursor-pointer"
                            >
                              <Star
                                className={`w-6 h-6 transition-colors ${
                                  isActive
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-zinc-600"
                                }`}
                              />
                            </button>
                          );
                        })}
                        <span className="text-sm font-bold text-amber-400 ml-2">
                          {hoverRating !== null
                            ? hoverRating
                            : formData.rating}{" "}
                          / 5
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                      Project Highlight / Type (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. TikTok Ad Campaign, YouTube Mini-Doc, Music Video"
                      value={formData.projectHighlight}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectHighlight: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                      Your Comment / Review *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Share your thoughts on the collaboration, editing quality, turnaround time, or storytelling..."
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-red-500/60 focus:ring-2 focus:ring-red-500/20 transition-all text-sm resize-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-6 py-3 rounded-xl border border-white/10 text-zinc-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 via-purple-600 to-blue-600 hover:from-red-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all text-sm cursor-pointer disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <span>Posting...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Publish Comment</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Filter className="w-4 h-4 text-zinc-500 mr-2 shrink-0" />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-white text-zinc-950 shadow-lg shadow-white/10 scale-105 font-bold"
                    : "bg-white/5 border border-white/10 text-zinc-400 hover:bg-white/10 hover:text-zinc-200"
                }`}
              >
                {cat}
                {cat === "All" && (
                  <span className="ml-2 px-1.5 py-0.5 rounded-full text-[10px] bg-red-500/20 text-red-300">
                    {reviews.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev, idx) => {
            const isLiked = !!likedReviews[rev.id];
            const initials = rev.name
              .split(" ")
              .map((n) => n[0])
              .slice(0, 2)
              .join("")
              .toUpperCase();

            return (
              <div
                key={rev.id}
                className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${
                  (idx % 4) * 100
                }`}
              >
                <div className="relative h-full flex flex-col justify-between p-7 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl hover:border-red-500/30 hover:shadow-2xl hover:shadow-red-500/5 transition-all duration-300 group overflow-hidden">
                  {/* Subtle hover glow */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-red-500/10 to-purple-500/0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div>
                    {/* Top row: Avatar, Name, Category & Verified tag */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${rev.avatarColor} flex items-center justify-center font-black text-white text-base shadow-lg shadow-black/40 border border-white/20`}
                        >
                          {initials || <User className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-white font-bold text-base group-hover:text-red-400 transition-colors">
                              {rev.name}
                            </h4>
                            {rev.verified && (
                              <CheckCircle2
                                className="w-4 h-4 text-blue-400 shrink-0"
                                title="Verified Client / Collaboration"
                              />
                            )}
                          </div>
                          <p className="text-xs text-zinc-400">
                            {rev.companyOrHandle || rev.role}
                          </p>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-zinc-400 shrink-0">
                        {rev.date}
                      </span>
                    </div>

                    {/* Star Rating & Project Tag */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < rev.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-zinc-700"
                            }`}
                          />
                        ))}
                      </div>
                      {rev.projectHighlight && (
                        <span className="text-[11px] font-medium text-zinc-400 bg-white/5 px-2.5 py-0.5 rounded-full truncate max-w-[150px]">
                          {rev.projectHighlight}
                        </span>
                      )}
                    </div>

                    {/* Review Quote / Comment */}
                    <p className="text-zinc-300 text-sm leading-relaxed mb-6 italic">
                      "{rev.comment}"
                    </p>
                  </div>

                  {/* Bottom row: Category badge & Like / Helpful button */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="text-[11px] font-semibold tracking-wide uppercase text-zinc-400 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                      {rev.category}
                    </span>

                    <button
                      onClick={() => handleLike(rev.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                        isLiked
                          ? "bg-red-500/20 text-red-400 border border-red-500/40 scale-105"
                          : "bg-white/5 text-zinc-400 hover:text-zinc-200 hover:bg-white/10 border border-white/10"
                      }`}
                      title="Mark as helpful"
                    >
                      <ThumbsUp
                        className={`w-3.5 h-3.5 ${
                          isLiked ? "fill-red-400 text-red-400" : ""
                        }`}
                      />
                      <span>Helpful ({rev.likes})</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state if filtering yields no result */}
        {filteredReviews.length === 0 && (
          <div className="py-16 text-center bg-white/5 border border-white/10 rounded-3xl">
            <MessageSquareQuote className="w-12 h-12 text-zinc-500 mx-auto mb-3" />
            <h4 className="text-lg font-bold text-white">No reviews found</h4>
            <p className="text-zinc-400 text-sm mt-1">
              Be the first to leave a comment for this category!
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setIsFormOpen(true);
              }}
              className="mt-4 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all"
            >
              Write a Review
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

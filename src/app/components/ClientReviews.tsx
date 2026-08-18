import { useState, useEffect } from "react";
import {
  MessageSquareQuote,
  Star,
  ThumbsUp,
  Sparkles,
  CheckCircle2,
  Send,
  Plus,
  Film,
  TrendingUp,
  Clock,
  Quote,
  X,
  ShieldCheck,
} from "lucide-react";

export interface ReviewItem {
  id: string;
  name: string;
  role: string;
  companyOrHandle?: string;
  avatarBg: string;
  avatarText: string;
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
    avatarBg: "bg-slate-800 border-slate-700",
    avatarText: "text-cyan-400",
    rating: 4.8,
    category: "TikTok & Reels",
    date: "2 weeks ago",
    comment:
      "Abiy transformed our raw footage into high-retention viral TikTok clips! His pacing, caption animations, and sound effects brought our engagement to a whole new level. Super fast turnaround too!",
    verified: true,
    projectHighlight: "Viral TikTok Series (1M+ views)",
    likes: 6,
  },
  {
    id: "rev-2",
    name: "Blue Sky Properties",
    role: "Marketing Director",
    companyOrHandle: "Real Estate Agency",
    avatarBg: "bg-slate-800 border-slate-700",
    avatarText: "text-rose-400",
    rating: 4.6,
    category: "Real Estate & Promo",
    date: "1 month ago",
    comment:
      "Working with Abiy on our luxury property promotional videos was seamless. He has an incredible eye for color grading, smooth cinematic transitions, and impactful script pacing. Highly recommended for commercial edits!",
    verified: true,
    projectHighlight: "Commercial Property Showcase",
    likes: 5,
  },
  {
    id: "rev-3",
    name: "Abela G.",
    role: "Influencer & Entertainer",
    companyOrHandle: "@abela_.g",
    avatarBg: "bg-slate-800 border-slate-700",
    avatarText: "text-amber-400",
    rating: 4.7,
    category: "TikTok & Reels",
    date: "1 month ago",
    comment:
      "Abiy knows exactly what makes social media video click. He catches the beat drops perfectly and keeps viewers hooked from the first 2 seconds. Best video editor I've worked with!",
    verified: true,
    projectHighlight: "Short Form Entertainment Series",
    likes: 8,
  },
  {
    id: "rev-4",
    name: "Dagim Shumey",
    role: "Digital Creator",
    companyOrHandle: "@dagimshumey_",
    avatarBg: "bg-slate-800 border-slate-700",
    avatarText: "text-purple-400",
    rating: 4.5,
    category: "TikTok & Reels",
    date: "2 months ago",
    comment:
      "Great communication, attention to details, and very creative visual rhythm. Whenever I hand over a script or raw video, Abiy always delivers beyond expectations.",
    verified: true,
    projectHighlight: "Lifestyle & Vlog Edits",
    likes: 4,
  },
  {
    id: "rev-5",
    name: "MUSIKANA Community",
    role: "Channel Co-Producer",
    companyOrHandle: "YouTube (8K+ Subs)",
    avatarBg: "bg-slate-800 border-slate-700",
    avatarText: "text-red-400",
    rating: 4.6,
    category: "YouTube & Music",
    date: "3 months ago",
    comment:
      "His work on the Amharic lyrics videos and motion typography is breathtaking. Every frame feels synchronized to the rhythm and emotion of the music. Pure artistic storytelling by Abiy!",
    verified: true,
    projectHighlight: "Cinematic Lyrics Video Stream",
    likes: 9,
  },
  {
    id: "rev-6",
    name: "4 Kilo Gbi Gubae",
    role: "Media Coordinator",
    companyOrHandle: "Channel Production",
    avatarBg: "bg-slate-800 border-slate-700",
    avatarText: "text-emerald-400",
    rating: 4.5,
    category: "YouTube & Music",
    date: "Recent",
    comment:
      "Outstanding color correction and script adaptation. Abiy manages multi-cam footage efficiently and delivers broadcast-ready videos right on schedule.",
    verified: true,
    projectHighlight: "Documentary & Event Videos",
    likes: 5,
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
      const saved = localStorage.getItem("ak_portfolio_client_reviews_v4");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // fallback
    }
    return INITIAL_REVIEWS;
  });

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("ak_portfolio_liked_reviews_v4");
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
    rating: 4.6,
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
        "ak_portfolio_client_reviews_v4",
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
        "ak_portfolio_liked_reviews_v4",
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
      setFormError("Please fill in your name and review comment.");
      return;
    }
    setFormError("");
    setIsSubmitting(true);

    setTimeout(() => {
      const newReview: ReviewItem = {
        id: "custom-" + Date.now(),
        name: formData.name.trim(),
        role: formData.role.trim() || "Client / Creator",
        companyOrHandle: formData.companyOrHandle.trim() || undefined,
        avatarBg: "bg-slate-800 border-slate-700",
        avatarText: "text-cyan-400",
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
        rating: 4.6,
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

  const officialRating = "4.6";

  return (
    <section id="reviews" className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium mb-3">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verified Client Testimonials</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-400">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                  Client <span className="text-cyan-400">Reviews</span>
                </h2>
              </div>
              <p className="text-slate-400 mt-2 max-w-xl text-sm">
                Feedback from content creators, channels, and commercial clients edited by <span className="text-slate-200 font-medium">Abiy</span>.
              </p>
            </div>

            {/* Leave a Comment CTA Button */}
            <button
              onClick={() => setIsFormOpen((prev) => !prev)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#C8102E] hover:bg-[#b00e27] text-white font-medium rounded-lg shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all text-xs sm:text-sm self-start md:self-auto cursor-pointer"
            >
              {isFormOpen ? (
                <>
                  <X className="w-4 h-4" />
                  <span>Close Form</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Leave a Review</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 4.6 Rating & Clean Stats Banner */}
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 sm:p-5 bg-slate-900/90 rounded-2xl border border-slate-800">
            {/* 4.6 Overall Rating Card */}
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
              <div className="p-2.5 rounded-xl bg-slate-800 text-amber-400">
                <Star className="w-5 h-5 fill-amber-400" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white flex items-center gap-1">
                  {officialRating}
                  <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
                </div>
                <div className="text-[11px] text-slate-400">Average Rating</div>
              </div>
            </div>

            {/* Projects Delivered */}
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
              <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
                <Film className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">25+</div>
                <div className="text-[11px] text-slate-400">Projects Delivered</div>
              </div>
            </div>

            {/* Views Generated (Updated to 5M+) */}
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
              <div className="p-2.5 rounded-xl bg-slate-800 text-red-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">5M+</div>
                <div className="text-[11px] text-slate-400">Combined Views</div>
              </div>
            </div>

            {/* On-Time Delivery */}
            <div className="flex items-center gap-3 p-2 rounded-xl bg-slate-950/50 border border-slate-800/60">
              <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold text-white">100%</div>
                <div className="text-[11px] text-slate-400">On-Time Delivery</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Review Form */}
        {isFormOpen && (
          <div className="mb-10 fade-up opacity-0 translate-y-8 transition-all duration-700 animate-in">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 md:p-6">
              <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-950/40 rounded-lg text-red-400">
                    <Quote className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Leave a Review for Abiy
                    </h3>
                    <p className="text-xs text-slate-400">
                      Your feedback will appear immediately below.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="py-6 text-center flex flex-col items-center justify-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-white">
                    Thank you for your review!
                  </h4>
                  <p className="text-xs text-slate-400">
                    Your testimonial has been added.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-lg">
                      {formError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="e.g. Samuel T."
                        className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Role or Channel Handle
                      </label>
                      <input
                        type="text"
                        value={formData.companyOrHandle}
                        onChange={(e) =>
                          setFormData({ ...formData, companyOrHandle: e.target.value })
                        }
                        placeholder="e.g. @contentcreator or YouTube Channel"
                        className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
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
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                      >
                        <option value="TikTok & Reels">TikTok & Reels</option>
                        <option value="YouTube & Music">YouTube & Music</option>
                        <option value="Real Estate & Promo">Real Estate & Promo</option>
                        <option value="Other">Other Video Project</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1.5">
                        Rating Score: <span className="text-amber-400 font-semibold">{formData.rating} Stars</span>
                      </label>
                      <div className="flex items-center gap-1.5 pt-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: star })}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                (hoverRating !== null
                                  ? star <= hoverRating
                                  : star <= formData.rating)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-slate-700"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Your Feedback / Review *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      placeholder="Describe your editing experience with Abiy..."
                      className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-800 rounded-lg text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 bg-[#C8102E] hover:bg-[#b00e27] text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Submitting Review..." : "Publish Review"}</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Category Filters */}
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-6">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReviews.map((item, idx) => (
            <div
              key={item.id}
              className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${
                idx * 100
              }`}
            >
              <div className="bg-slate-900/85 rounded-xl border border-slate-800 hover:border-slate-700 p-4 sm:p-5 h-full flex flex-col justify-between transition-colors">
                <div>
                  {/* Top Bar with rating & date */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < Math.floor(item.rating)
                              ? "text-amber-400 fill-amber-400"
                              : i < item.rating
                              ? "text-amber-400 fill-amber-400/50"
                              : "text-slate-700"
                          }`}
                        />
                      ))}
                      <span className="text-xs font-semibold text-white ml-1">
                        {item.rating}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-400">
                      {item.date}
                    </span>
                  </div>

                  {/* Comment Text */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
                    "{item.comment}"
                  </p>

                  {/* Project Highlight Badge if present */}
                  {item.projectHighlight && (
                    <div className="mb-3 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-950/60 border border-slate-800 text-[10px] text-cyan-400">
                      <Film className="w-3 h-3" />
                      <span>{item.projectHighlight}</span>
                    </div>
                  )}
                </div>

                {/* Author Info & Like Footer */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${item.avatarBg} ${item.avatarText} border`}
                    >
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white flex items-center gap-1">
                        <span>{item.name}</span>
                        {item.verified && (
                          <ShieldCheck className="w-3 h-3 text-cyan-400" />
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {item.companyOrHandle || item.role}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors cursor-pointer ${
                      likedReviews[item.id]
                        ? "bg-red-950/40 text-red-400 border border-red-800/40"
                        : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span className="text-[11px]">{item.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

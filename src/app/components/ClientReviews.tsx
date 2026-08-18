import { useState, useEffect, useRef } from "react";
import {
  MessageSquareQuote,
  Zap,
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
  Lock,
  Unlock,
  Trash2,
  Mail,
  Check,
  AlertCircle,
  Loader2,
  Star,
} from "lucide-react";
import {
  getCreatorAuthStatus,
} from "../utils/videoStorage";
import {
  subscribeToReviews,
  saveReviewToCloud,
  deleteReviewFromCloud,
} from "../utils/cloudDB";
import { ReviewItem } from "../types/review";
import { INITIAL_REVIEWS } from "../data/initialReviews";

export type { ReviewItem };

const CATEGORIES = [
  "All",
  "TikTok & Reels",
  "YouTube & Music",
  "Real Estate & Promo",
] as const;

interface ClientReviewsProps {
  reviews?: ReviewItem[];
  rating?: string;
  isAdmin?: boolean;
  onDeleteReview?: (id: string) => void;
  onAddReview?: (newReview: ReviewItem) => void;
}

export default function ClientReviews({
  reviews: propReviews,
  rating = "4.6",
  isAdmin = false,
  onDeleteReview,
  onAddReview,
}: ClientReviewsProps) {
  const [internalReviews, setInternalReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);
  const reviews = propReviews && propReviews.length > 0 ? propReviews : internalReviews;

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem("ak_portfolio_liked_reviews_v5");
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

  // Verification State
  const [verificationType, setVerificationType] = useState<"telegram" | "email">("telegram");
  const [verificationInput, setVerificationInput] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState("");

  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  // Subscribe to reviews from Firestore on mount if propReviews not supplied
  useEffect(() => {
    if (propReviews && propReviews.length > 0) return;
    const unsubscribe = subscribeToReviews((cloudReviews) => {
      if (cloudReviews.length > 0) {
        setInternalReviews(cloudReviews);
      }
    });
    return () => unsubscribe();
  }, [propReviews]);

  // Sync likes with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        "ak_portfolio_liked_reviews_v5",
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
    const targetReview = reviews.find((r) => r.id === id);
    if (targetReview) {
      const updatedReview = {
        ...targetReview,
        likes: isLiked ? Math.max(0, targetReview.likes - 1) : targetReview.likes + 1,
      };
      saveReviewToCloud(updatedReview).catch(console.error);
    }
  };

  // Verification handler
  const handleVerifyAccount = () => {
    setVerificationError("");
    const input = verificationInput.trim();

    if (!input) {
      setVerificationError(
        verificationType === "telegram"
          ? "Please enter your Telegram handle (e.g. @username)."
          : "Please enter your email address."
      );
      return;
    }

    if (verificationType === "telegram") {
      const handle = input.startsWith("@") ? input : `@${input}`;
      if (handle.length < 3) {
        setVerificationError("Please enter a valid Telegram handle.");
        return;
      }
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
        setVerificationInput(handle);
      }, 350);
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        setVerificationError("Please enter a valid email address.");
        return;
      }
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        setIsVerified(true);
      }, 350);
    }
  };

  // Submit review form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.comment.trim()) {
      setFormError("Please fill in your name and review comment.");
      return;
    }

    if (!isVerified) {
      setFormError(
        `Please verify your ${verificationType === "telegram" ? "Telegram handle" : "Email"} before publishing your review.`
      );
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      const newReview: ReviewItem = {
        id: "rev_" + Date.now(),
        name: formData.name.trim(),
        role: formData.role.trim() || "Verified Client",
        companyOrHandle:
          formData.companyOrHandle.trim() ||
          (verificationType === "telegram" ? verificationInput : ""),
        avatarBg: "bg-slate-800 border-slate-700",
        avatarText: "text-cyan-400",
        rating: formData.rating,
        category: formData.category,
        date: "Just now",
        comment: formData.comment.trim(),
        verified: true,
        verifiedMethod: verificationType,
        verifiedHandle: verificationInput.trim(),
        projectHighlight: formData.projectHighlight.trim() || undefined,
        likes: 1,
        isCustom: true,
        createdAt: Date.now(),
      };

      // Optimistic local update
      setInternalReviews((prev) => [newReview, ...prev]);
      onAddReview?.(newReview);

      // Persist to Firestore — all devices see it immediately
      await saveReviewToCloud(newReview);

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
      setIsVerified(false);
      setVerificationInput("");

      setTimeout(() => {
        setSubmittedSuccess(false);
        setIsFormOpen(false);
      }, 1500);
    } catch (err: any) {
      setFormError(err?.message || "Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete review handler
  const handleDelete = (reviewId: string) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      setInternalReviews((prev) => prev.filter((r) => r.id !== reviewId));
      onDeleteReview?.(reviewId);
      deleteReviewFromCloud(reviewId).catch(console.error);
    }
  };

  const filteredReviews =
    activeCategory === "All"
      ? reviews
      : reviews.filter((r) => r.category === activeCategory);

  return (
    <section id="reviews" className="py-12 sm:py-20 px-3 sm:px-4 relative">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-medium mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Verified Client Testimonials</span>
              </div>
              <div className="flex items-center gap-2.5 sm:gap-3">
                <div className="p-2 sm:p-2.5 rounded-xl bg-red-950/40 border border-red-800/40 text-red-400">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                  Client <span className="text-cyan-400">Reviews</span>
                </h2>
              </div>
              <p className="text-slate-400 mt-1.5 max-w-xl text-xs sm:text-sm">
                Feedback from content creators, channels, and commercial campaigns edited by <span className="text-slate-200 font-medium">Abiy Ketema</span>.
              </p>
            </div>

            {/* Actions: Leave a Review */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setIsFormOpen((prev) => !prev)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C8102E] hover:bg-[#b00e27] text-white font-semibold rounded-xl shadow-md transition-all text-xs sm:text-sm cursor-pointer active:scale-95"
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
        </div>

        {/* Rating & Clean Stats Banner (Mobile 2x2 Grid) */}
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-6 sm:mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 p-3 sm:p-4 bg-slate-900 rounded-2xl border border-slate-800">
            {/* Rating Card */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="p-2 rounded-lg bg-slate-800 text-amber-400 shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-400" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-white flex items-center gap-0.5">
                  <span>{rating}</span>
                  <span className="text-[10px] text-amber-400 font-bold">⚡</span>
                  <span className="text-[10px] text-slate-400 font-normal">/ 5.0</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">Average Rating</div>
              </div>
            </div>

            {/* Projects Delivered */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="p-2 rounded-lg bg-slate-800 text-slate-300 shrink-0">
                <Film className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-white">25+</div>
                <div className="text-[10px] text-slate-400 truncate">Projects Done</div>
              </div>
            </div>

            {/* Views Generated */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="p-2 rounded-lg bg-slate-800 text-red-400 shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-white">5M+</div>
                <div className="text-[10px] text-slate-400 truncate">Combined Reach</div>
              </div>
            </div>

            {/* On-Time Delivery */}
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/80">
              <div className="p-2 rounded-lg bg-slate-800 text-emerald-400 shrink-0">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-base sm:text-xl font-bold text-white">100%</div>
                <div className="text-[10px] text-slate-400 truncate">On-Time Turnaround</div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Review Form (Mobile Optimized) */}
        {isFormOpen && (
          <div className="mb-8 fade-up opacity-0 translate-y-8 transition-all duration-700 animate-in">
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-red-950/40 rounded-lg text-red-400">
                    <Quote className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Leave a Verified Review for Abiy
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Share your experience working with AK clipps.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {submittedSuccess ? (
                <div className="p-6 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-base font-bold text-white">
                    Thank You! Review Published
                  </h4>
                  <p className="text-xs text-emerald-300">
                    Your testimonial is now live on the portfolio across all devices.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  {formError && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Dawit Kebede"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-base sm:text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Your Role / Channel (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="e.g. Content Creator / YouTube Host"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-base sm:text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>
                  </div>

                  {/* Account Verification Section */}
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        <span>Account Verification *</span>
                      </label>

                      <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setVerificationType("telegram");
                            setIsVerified(false);
                            setVerificationError("");
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                            verificationType === "telegram"
                              ? "bg-cyan-500 text-slate-950 font-bold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Send className="w-3 h-3" />
                          <span>Telegram</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setVerificationType("email");
                            setIsVerified(false);
                            setVerificationError("");
                          }}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                            verificationType === "email"
                              ? "bg-cyan-500 text-slate-950 font-bold"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          <Mail className="w-3 h-3" />
                          <span>Email</span>
                        </button>
                      </div>
                    </div>

                    {isVerified ? (
                      <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800/50 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="text-xs text-emerald-300 font-medium">
                            Verified: <span className="font-mono font-bold text-white">{verificationInput}</span>
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsVerified(false)}
                          className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer"
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex flex-col sm:flex-row items-stretch gap-2">
                          <input
                            type={verificationType === "email" ? "email" : "text"}
                            value={verificationInput}
                            onChange={(e) => {
                              setVerificationInput(e.target.value);
                              setVerificationError("");
                            }}
                            placeholder={
                              verificationType === "telegram"
                                ? "Enter your @username"
                                : "Enter your email address"
                            }
                            className="flex-1 px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyAccount}
                            disabled={isVerifying}
                            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-50"
                          >
                            {isVerifying ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Verifying...</span>
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="w-3.5 h-3.5" />
                                <span>Verify Account</span>
                              </>
                            )}
                          </button>
                        </div>
                        {verificationError && (
                          <div className="text-[11px] text-red-400 font-medium">
                            {verificationError}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            category: e.target.value as ReviewItem["category"],
                          })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-base sm:text-xs text-white focus:outline-none focus:border-[#C8102E]"
                      >
                        <option value="TikTok & Reels">TikTok & Reels</option>
                        <option value="YouTube & Music">YouTube & Music</option>
                        <option value="Real Estate & Promo">Real Estate & Promo</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        Rating Score: <span className="text-amber-400 font-semibold">{formData.rating} ⚡</span>
                      </label>
                      <div className="flex items-center gap-1 pt-1">
                        {[1, 2, 3, 4, 5].map((lvl) => (
                          <button
                            key={lvl}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating: lvl })}
                            onMouseEnter={() => setHoverRating(lvl)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1.5 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer"
                          >
                            <Zap
                              className={`w-5 h-5 ${
                                (hoverRating !== null ? lvl <= hoverRating : lvl <= formData.rating)
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
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Project Highlight (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.projectHighlight}
                      onChange={(e) =>
                        setFormData({ ...formData, projectHighlight: e.target.value })
                      }
                      placeholder="e.g. 1M+ Views TikTok Series or Real Estate Film"
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-base sm:text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Testimonial / Feedback *
                    </label>
                    <textarea
                      rows={3}
                      value={formData.comment}
                      onChange={(e) =>
                        setFormData({ ...formData, comment: e.target.value })
                      }
                      placeholder="Describe the editing quality, pacing, turnaround speed, and communication..."
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-base sm:text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-[#C8102E] hover:bg-[#b00e27] text-white font-bold rounded-xl shadow-lg transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Publishing Review...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Publish Review to Portfolio</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Category Filters (Mobile Scrollable) */}
        <div className="fade-up opacity-0 translate-y-8 transition-all duration-700 mb-5">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredReviews.map((item, idx) => (
            <div
              key={item.id}
              className={`fade-up opacity-0 translate-y-8 transition-all duration-700 animation-delay-${
                idx * 100
              }`}
            >
              <div className="bg-slate-900 rounded-xl border border-slate-800 hover:border-slate-700 p-4 sm:p-5 h-full flex flex-col justify-between transition-colors relative">
                <div>
                  {/* Top Bar with rating & date + admin delete icon */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Zap
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

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {item.date}
                      </span>

                      {/* Admin Delete Action Button */}
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="p-1 rounded bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-red-200 border border-red-800/50 transition-colors cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Comment Text */}
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-3">
                    "{item.comment}"
                  </p>

                  {/* Project Highlight Badge */}
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
                      className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${item.avatarBg || "bg-slate-800 border-slate-700"} ${item.avatarText || "text-cyan-400"} border`}
                    >
                      {item.name ? item.name.charAt(0) : "C"}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white flex items-center gap-1">
                        <span>{item.name}</span>
                        {item.verified && (
                          <span
                            className="inline-flex items-center text-cyan-400"
                            title={
                              item.verifiedHandle
                                ? `Verified: ${item.verifiedHandle}`
                                : "Verified Client"
                            }
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        {item.verifiedHandle ? (
                          <span className="font-mono text-cyan-400/80">{item.verifiedHandle}</span>
                        ) : (
                          <span>{item.companyOrHandle || item.role}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleLike(item.id)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer active:scale-95 ${
                      likedReviews[item.id]
                        ? "bg-[#C8102E]/20 text-[#ff4b67] border border-[#C8102E]/30"
                        : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                    <span>{item.likes}</span>
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

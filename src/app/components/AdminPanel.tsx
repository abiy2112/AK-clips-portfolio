import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Play,
  Film,
  Link as LinkIcon,
  Upload,
  Zap,
  Check,
  Sparkles,
  ExternalLink,
  Lock,
  Layers,
  FileVideo,
  AlertCircle,
  Loader2,
  MessageSquareQuote,
  Phone,
  Mail,
  Edit3,
  Globe,
  Sliders,
  Send,
  Save,
  CheckCircle2,
  User,
  Star,
  RefreshCw,
  Eye,
} from "lucide-react";
import { ProjectItem } from "../types/project";
import { ReviewItem } from "../types/review";
import { SiteContactSettings, SiteContentSettings } from "../types/settings";
import {
  parseVideoSource,
  extractYouTubeId,
  extractGoogleDriveId,
  generateThumbnailFromVideoFile,
} from "../utils/videoParser";
import {
  uploadVideoToStorage,
  saveProjectToCloud,
  deleteProjectFromCloud,
  saveReviewToCloud,
  deleteReviewFromCloud,
} from "../utils/cloudDB";
import {
  saveContactSettings,
  saveContentSettings,
  DEFAULT_CONTACT_SETTINGS,
  DEFAULT_CONTENT_SETTINGS,
} from "../utils/siteSettings";
import AKLogo from "./AKLogo";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
  reviews: ReviewItem[];
  contactSettings: SiteContactSettings;
  contentSettings: SiteContentSettings;
  onAddProject: (newProject: ProjectItem) => void;
  onDeleteProject: (projectId: string) => void;
  onResetProjects: () => void;
  onLockSession: () => void;
}

const CATEGORY_PRESETS = [
  "TikTok & Shorts",
  "Cinematic Documentary",
  "Social Media Promo",
  "Creative Typography",
  "Luxury Commercial",
  "Music Video",
];

const REVIEW_CATEGORIES = [
  "TikTok & Reels",
  "YouTube & Music",
  "Real Estate & Promo",
] as const;

export default function AdminPanel({
  isOpen,
  onClose,
  projects,
  reviews,
  contactSettings,
  contentSettings,
  onAddProject,
  onDeleteProject,
  onResetProjects,
  onLockSession,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<"projects" | "reviews" | "contact" | "content">("projects");

  // ----------------------------------------------------
  // PROJECTS STATE
  // ----------------------------------------------------
  const [projectSubTab, setProjectSubTab] = useState<"upload" | "manage">("upload");
  const [uploadMode, setUploadMode] = useState<"link" | "file">("link");
  const [videoUrl, setVideoUrl] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectCategory, setProjectCategory] = useState("TikTok & Shorts");
  const [customCategory, setCustomCategory] = useState("");
  const [projectThumbnailUrl, setProjectThumbnailUrl] = useState("");
  const [projectDuration, setProjectDuration] = useState("");
  const [localFileName, setLocalFileName] = useState("");
  const [localFileObjectUrl, setLocalFileObjectUrl] = useState("");
  const [localFileBlob, setLocalFileBlob] = useState<File | null>(null);
  const [isCapturingThumbnail, setIsCapturingThumbnail] = useState(false);
  const [isProjectSuccess, setIsProjectSuccess] = useState(false);
  const [projectError, setProjectError] = useState("");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploadingProject, setIsUploadingProject] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // ----------------------------------------------------
  // REVIEWS STATE
  // ----------------------------------------------------
  const [reviewSubTab, setReviewSubTab] = useState<"manage" | "add">("manage");
  const [reviewName, setReviewName] = useState("");
  const [reviewRole, setReviewRole] = useState("");
  const [reviewHandle, setReviewHandle] = useState("");
  const [reviewCategory, setReviewCategory] = useState<ReviewItem["category"]>("TikTok & Reels");
  const [reviewRating, setReviewRating] = useState(4.6);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewHighlight, setReviewHighlight] = useState("");
  const [reviewLikes, setReviewLikes] = useState(45);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccessMsg, setReviewSuccessMsg] = useState(false);
  const [reviewErrorMsg, setReviewErrorMsg] = useState("");

  // ----------------------------------------------------
  // CONTACT SETTINGS STATE
  // ----------------------------------------------------
  const [contactForm, setContactForm] = useState<SiteContactSettings>(contactSettings);
  const [isSavingContact, setIsSavingContact] = useState(false);
  const [contactSuccessMsg, setContactSuccessMsg] = useState(false);

  useEffect(() => {
    setContactForm(contactSettings);
  }, [contactSettings]);

  // ----------------------------------------------------
  // CONTENT SETTINGS STATE
  // ----------------------------------------------------
  const [contentForm, setContentForm] = useState<SiteContentSettings>(contentSettings);
  const [isSavingContent, setIsSavingContent] = useState(false);
  const [contentSuccessMsg, setContentSuccessMsg] = useState(false);

  useEffect(() => {
    setContentForm(contentSettings);
  }, [contentSettings]);

  if (!isOpen) return null;

  // ----------------------------------------------------
  // PROJECT HANDLERS
  // ----------------------------------------------------
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setProjectError("");
    setLocalFileName(file.name);
    setLocalFileBlob(file);

    const objectUrl = URL.createObjectURL(file);
    setLocalFileObjectUrl(objectUrl);
    setVideoUrl(objectUrl);

    if (!projectTitle) {
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ");
      setProjectTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    setIsCapturingThumbnail(true);
    try {
      const generatedThumb = await generateThumbnailFromVideoFile(file);
      if (generatedThumb && !projectThumbnailUrl) {
        setProjectThumbnailUrl(generatedThumb);
      }
    } catch {
      // ignore
    } finally {
      setIsCapturingThumbnail(false);
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setProjectThumbnailUrl(objectUrl);
  };

  const handleResetProjectForm = () => {
    setVideoUrl("");
    setProjectTitle("");
    setProjectCategory("TikTok & Shorts");
    setCustomCategory("");
    setProjectThumbnailUrl("");
    setProjectDuration("");
    setLocalFileName("");
    setLocalFileObjectUrl("");
    setLocalFileBlob(null);
    setProjectError("");
    setUploadProgress(null);
    setIsUploadingProject(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectError("");

    if (!projectTitle.trim()) {
      setProjectError("Please enter a title for this video project.");
      return;
    }

    const finalCategory = customCategory.trim() || projectCategory;
    const parsed = parseVideoSource(videoUrl);

    if (uploadMode === "link" && !videoUrl.trim()) {
      setProjectError("Please paste a valid video URL (YouTube, Google Drive, or MP4 link).");
      return;
    }

    if (uploadMode === "file" && !localFileBlob) {
      setProjectError("Please select a local video file from your computer.");
      return;
    }

    setIsUploadingProject(true);
    const newProjectId = `cloud_${Date.now()}`;

    try {
      let finalVideoUrl = videoUrl;

      if (uploadMode === "file" && localFileBlob) {
        setUploadProgress(5);
        finalVideoUrl = await uploadVideoToStorage(
          newProjectId,
          localFileBlob,
          (progress) => setUploadProgress(progress)
        );
      }

      const newProject: ProjectItem = {
        id: newProjectId,
        title: projectTitle.trim(),
        category: finalCategory,
        type: uploadMode === "file" ? "file" : parsed.type,
        videoUrl: finalVideoUrl,
        thumbnailUrl: projectThumbnailUrl.trim() || undefined,
        duration: projectDuration.trim() || undefined,
        sourceLabel:
          uploadMode === "file"
            ? "Direct MP4 File"
            : parsed.type === "youtube"
            ? "YouTube Cut"
            : parsed.type === "googledrive"
            ? "Google Drive"
            : "Video Link",
        isCustom: true,
        createdAt: Date.now(),
      };

      onAddProject(newProject);

      setIsProjectSuccess(true);
      handleResetProjectForm();
      setTimeout(() => {
        setIsProjectSuccess(false);
        setProjectSubTab("manage");
      }, 900);
    } catch (err: any) {
      setProjectError(err?.message || "Failed to upload video to cloud. Please try again.");
    } finally {
      setIsUploadingProject(false);
      setUploadProgress(null);
    }
  };

  // ----------------------------------------------------
  // REVIEW HANDLERS
  // ----------------------------------------------------
  const handleAddReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewErrorMsg("");

    if (!reviewName.trim()) {
      setReviewErrorMsg("Please enter the client's name.");
      return;
    }
    if (!reviewComment.trim()) {
      setReviewErrorMsg("Please enter the review testimonial.");
      return;
    }

    setIsSubmittingReview(true);
    try {
      const newReview: ReviewItem = {
        id: `rev_${Date.now()}`,
        name: reviewName.trim(),
        role: reviewRole.trim() || "Creator / Brand",
        companyOrHandle: reviewHandle.trim() || "@creator",
        category: reviewCategory,
        rating: reviewRating,
        comment: reviewComment.trim(),
        projectHighlight: reviewHighlight.trim() || "Video Editing & Post-Production",
        date: "Just now",
        likes: Number(reviewLikes) || 40,
        verifiedClient: true,
        createdAt: Date.now(),
      };

      await saveReviewToCloud(newReview);

      setReviewSuccessMsg(true);
      setReviewName("");
      setReviewRole("");
      setReviewHandle("");
      setReviewComment("");
      setReviewHighlight("");
      setTimeout(() => {
        setReviewSuccessMsg(false);
        setReviewSubTab("manage");
      }, 900);
    } catch (err: any) {
      setReviewErrorMsg(err?.message || "Failed to save review to cloud.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this review from the cloud database?")) {
      try {
        await deleteReviewFromCloud(id);
      } catch (err) {
        console.error("Error deleting review:", err);
      }
    }
  };

  // ----------------------------------------------------
  // CONTACT SETTINGS HANDLERS
  // ----------------------------------------------------
  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContact(true);
    try {
      await saveContactSettings(contactForm);
      setContactSuccessMsg(true);
      setTimeout(() => setContactSuccessMsg(false), 2500);
    } catch (err) {
      console.error("Failed to save contact settings:", err);
    } finally {
      setIsSavingContact(false);
    }
  };

  // ----------------------------------------------------
  // CONTENT SETTINGS HANDLERS
  // ----------------------------------------------------
  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingContent(true);
    try {
      await saveContentSettings(contentForm);
      setContentSuccessMsg(true);
      setTimeout(() => setContentSuccessMsg(false), 2500);
    } catch (err) {
      console.error("Failed to save content settings:", err);
    } finally {
      setIsSavingContent(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl h-[92vh] max-h-[850px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            {/* macOS traffic light circles */}
            <div className="flex items-center gap-1.5">
              <span
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer block"
                title="Close Panel"
              ></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
            </div>

            <div className="h-4 w-[1px] bg-slate-800 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <AKLogo size={20} rounded="lg" />
              <div>
                <span className="text-xs sm:text-sm font-bold text-white tracking-tight">
                  Studio Admin Panel
                </span>
                <span className="hidden sm:inline text-[10px] text-slate-400 ml-2">
                  Universal Management Suite
                </span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onLockSession}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-red-950/60 hover:text-red-300 text-slate-300 text-xs transition-colors cursor-pointer border border-slate-700"
              title="Lock Admin Session"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lock Session</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Switcher */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex flex-wrap gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab("projects")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "projects"
                ? "bg-[#C8102E] text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Projects & Uploads ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "reviews"
                ? "bg-[#C8102E] text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <MessageSquareQuote className="w-3.5 h-3.5" />
            <span>Client Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("contact")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "contact"
                ? "bg-[#C8102E] text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Contact & Socials</span>
          </button>

          <button
            onClick={() => setActiveTab("content")}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "content"
                ? "bg-[#C8102E] text-white shadow-sm"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Written Content & Copy</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0B0F1A]/80">
          {/* ================================================================ */}
          {/* TAB 1: PROJECTS & UPLOADS */}
          {/* ================================================================ */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              {/* Project Subtabs */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setProjectSubTab("upload")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      projectSubTab === "upload"
                        ? "bg-slate-800 text-white border border-slate-700"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload New Video</span>
                  </button>

                  <button
                    onClick={() => setProjectSubTab("manage")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      projectSubTab === "manage"
                        ? "bg-slate-800 text-white border border-slate-700"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>Manage Projects ({projects.length})</span>
                  </button>
                </div>

                {projects.some((p) => p.isCustom) && (
                  <button
                    onClick={onResetProjects}
                    className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear All Custom</span>
                  </button>
                )}
              </div>

              {projectSubTab === "upload" ? (
                <form onSubmit={handleSaveProject} className="space-y-5 max-w-2xl mx-auto">
                  {/* Mode Selector */}
                  <div className="p-1 bg-slate-950 rounded-xl border border-slate-800 grid grid-cols-2 gap-1">
                    <button
                      type="button"
                      onClick={() => setUploadMode("link")}
                      className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        uploadMode === "link"
                          ? "bg-slate-800 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Video Link (YouTube / Drive / MP4)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setUploadMode("file")}
                      className={`py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        uploadMode === "file"
                          ? "bg-slate-800 text-white shadow-sm"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5 text-pink-400" />
                      <span>Upload Local Video File</span>
                    </button>
                  </div>

                  {uploadMode === "link" ? (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Video Link URL <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=... or https://drive.google.com/..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="block text-xs font-medium text-slate-300">
                        Select Video File <span className="text-red-400">*</span>
                      </label>
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-6 text-center cursor-pointer transition-colors bg-slate-950/40"
                      >
                        <FileVideo className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                        <div className="text-xs text-white font-medium">
                          {localFileName ? localFileName : "Click to browse video file"}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1">
                          Supports MP4, MOV, WebM (auto-uploads to cloud storage)
                        </div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/mp4,video/quicktime,video/webm"
                          onChange={handleVideoFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}

                  {/* Project Details Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-medium text-slate-300">
                        Project Title <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g., Luxury Real Estate Showcase 2026"
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">Category</label>
                      <select
                        value={projectCategory}
                        onChange={(e) => setProjectCategory(e.target.value)}
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                      >
                        {CATEGORY_PRESETS.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Custom Category (Optional)
                      </label>
                      <input
                        type="text"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        placeholder="e.g., 3D Kinetic Motion"
                        className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Thumbnail URL or Image
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={projectThumbnailUrl}
                          onChange={(e) => setProjectThumbnailUrl(e.target.value)}
                          placeholder="https://... or choose image"
                          className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                        />
                        <button
                          type="button"
                          onClick={() => thumbnailInputRef.current?.click()}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-xl transition-colors cursor-pointer shrink-0"
                        >
                          Browse
                        </button>
                        <input
                          ref={thumbnailInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleThumbnailFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-medium text-slate-300">
                        Duration (Optional)
                      </label>
                      <input
                        type="text"
                        value={projectDuration}
                        onChange={(e) => setProjectDuration(e.target.value)}
                        placeholder="e.g. 0:45 or 2:30"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>
                  </div>

                  {/* Upload Progress Indicator */}
                  {uploadProgress !== null && (
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                      <div className="flex justify-between text-xs text-slate-300">
                        <span>Uploading to Cloud Storage...</span>
                        <span className="font-mono text-cyan-400">{uploadProgress}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-cyan-400 transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Errors & Success */}
                  {projectError && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{projectError}</span>
                    </div>
                  )}

                  {isProjectSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                      <span>Project published to Cloud Database successfully!</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleResetProjectForm}
                      className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="submit"
                      disabled={isUploadingProject}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C8102E] to-[#9f0a22] hover:from-[#d91233] text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {isUploadingProject ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving Project to Cloud...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-3.5 h-3.5 fill-current text-amber-300" />
                          <span>Publish Project to Portfolio</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                /* Manage Projects List */
                <div className="space-y-3">
                  <div className="text-xs text-slate-400">
                    Showing all {projects.length} portfolio video projects.
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400">
                              {proj.category}
                            </span>
                            {proj.isCustom ? (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                                Cloud
                              </span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                                Default
                              </span>
                            )}
                          </div>
                          <div className="text-xs font-bold text-white truncate" title={proj.title}>
                            {proj.title}
                          </div>
                          <div className="text-[10px] text-slate-500 truncate">{proj.videoUrl}</div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
                          <span className="text-[10px] text-slate-400">{proj.sourceLabel}</span>
                          {proj.isCustom ? (
                            <button
                              onClick={() => onDeleteProject(proj.id)}
                              className="p-1.5 rounded bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-white transition-colors cursor-pointer"
                              title="Delete from Cloud"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-600">Locked</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 2: CLIENT REVIEWS */}
          {/* ================================================================ */}
          {activeTab === "reviews" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    onClick={() => setReviewSubTab("manage")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      reviewSubTab === "manage"
                        ? "bg-slate-800 text-white border border-slate-700"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <MessageSquareQuote className="w-3.5 h-3.5" />
                    <span>Manage Reviews ({reviews.length})</span>
                  </button>

                  <button
                    onClick={() => setReviewSubTab("add")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                      reviewSubTab === "add"
                        ? "bg-slate-800 text-white border border-slate-700"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Testimonial</span>
                  </button>
                </div>
              </div>

              {reviewSubTab === "manage" ? (
                <div className="space-y-3">
                  <div className="text-xs text-slate-400">
                    Live client testimonials stored in Firestore. Deletions apply across all devices instantly.
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{rev.name}</span>
                                {rev.verifiedClient && (
                                  <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {rev.role} • {rev.companyOrHandle}
                              </div>
                            </div>

                            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded">
                              <Star className="w-3 h-3 fill-amber-400" />
                              <span>{rev.rating}</span>
                            </div>
                          </div>

                          <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>

                          <div className="text-[10px] text-cyan-400 font-medium">
                            ★ {rev.projectHighlight}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                          <span>Category: {rev.category}</span>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="flex items-center gap-1 px-2 py-1 rounded bg-red-950/60 hover:bg-red-900 text-red-400 hover:text-white transition-colors cursor-pointer"
                            title="Delete Review"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Add New Review Form */
                <form onSubmit={handleAddReviewSubmit} className="space-y-4 max-w-xl mx-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="block text-xs text-slate-300">Client Name *</label>
                      <input
                        type="text"
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="e.g. Dawit & Orbit Rise"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs text-slate-300">Role / Designation</label>
                      <input
                        type="text"
                        value={reviewRole}
                        onChange={(e) => setReviewRole(e.target.value)}
                        placeholder="e.g. Lead Creator"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs text-slate-300">Handle / Company</label>
                      <input
                        type="text"
                        value={reviewHandle}
                        onChange={(e) => setReviewHandle(e.target.value)}
                        placeholder="e.g. @orbitrise"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs text-slate-300">Category</label>
                      <select
                        value={reviewCategory}
                        onChange={(e) => setReviewCategory(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                      >
                        {REVIEW_CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs text-slate-300">Rating (1.0 - 5.0)</label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={reviewRating}
                        onChange={(e) => setReviewRating(parseFloat(e.target.value) || 4.6)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs text-slate-300">Likes Count</label>
                      <input
                        type="number"
                        value={reviewLikes}
                        onChange={(e) => setReviewLikes(parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="block text-xs text-slate-300">Project Highlight</label>
                      <input
                        type="text"
                        value={reviewHighlight}
                        onChange={(e) => setReviewHighlight(e.target.value)}
                        placeholder="e.g. 1.2M Views Viral TikTok Campaign"
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="block text-xs text-slate-300">Testimonial Comment *</label>
                      <textarea
                        rows={3}
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="Write client testimonial text..."
                        className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                      />
                    </div>
                  </div>

                  {reviewErrorMsg && (
                    <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-xs text-red-300">
                      {reviewErrorMsg}
                    </div>
                  )}

                  {reviewSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300">
                      Review saved to Cloud database!
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmittingReview}
                    className="w-full py-2.5 rounded-xl bg-[#C8102E] hover:bg-[#b00e27] text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmittingReview ? "Saving to Cloud..." : "Save Testimonial to Cloud"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* ================================================================ */}
          {/* TAB 3: CONTACT & SOCIALS */}
          {/* ================================================================ */}
          {activeTab === "contact" && (
            <form onSubmit={handleSaveContact} className="space-y-5 max-w-2xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Contact Information & Links</h3>
                  <p className="text-[11px] text-slate-400">
                    Update phone, email, telegram, and social links shown across the website.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSavingContact}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8102E] hover:bg-[#b00e27] text-white text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingContact ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>

              {contactSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Contact settings updated and saved to Cloud!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Telegram Username
                  </label>
                  <input
                    type="text"
                    value={contactForm.telegramUsername}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, telegramUsername: e.target.value })
                    }
                    placeholder="Ak_clips"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Telegram Direct Link URL
                  </label>
                  <input
                    type="url"
                    value={contactForm.telegramUrl}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, telegramUrl: e.target.value })
                    }
                    placeholder="https://t.me/Ak_clips"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">Email Address</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, email: e.target.value })
                    }
                    placeholder="abiyketema21@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">Phone Number</label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, phone: e.target.value })
                    }
                    placeholder="+251-934681880"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">Location</label>
                  <input
                    type="text"
                    value={contactForm.location}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, location: e.target.value })
                    }
                    placeholder="Addis Ababa, Ethiopia"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    LinkedIn Profile URL
                  </label>
                  <input
                    type="url"
                    value={contactForm.linkedinUrl}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, linkedinUrl: e.target.value })
                    }
                    placeholder="https://www.linkedin.com/in/..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">
                    YouTube Channel URL
                  </label>
                  <input
                    type="url"
                    value={contactForm.youtubeChannelUrl}
                    onChange={(e) =>
                      setContactForm({ ...contactForm, youtubeChannelUrl: e.target.value })
                    }
                    placeholder="https://youtube.com/@musikana1"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>
              </div>
            </form>
          )}

          {/* ================================================================ */}
          {/* TAB 4: WRITTEN CONTENT & COPY */}
          {/* ================================================================ */}
          {activeTab === "content" && (
            <form onSubmit={handleSaveContent} className="space-y-5 max-w-2xl mx-auto">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white">Website Text & Copywriting</h3>
                  <p className="text-[11px] text-slate-400">
                    Edit headers, descriptions, statistics, and bio copy in real-time.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={isSavingContent}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C8102E] hover:bg-[#b00e27] text-white text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingContent ? "Saving..." : "Save Changes"}</span>
                </button>
              </div>

              {contentSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Written content updated and saved to Cloud!</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">Brand Name</label>
                  <input
                    type="text"
                    value={contentForm.name}
                    onChange={(e) => setContentForm({ ...contentForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">Full Name</label>
                  <input
                    type="text"
                    value={contentForm.fullName}
                    onChange={(e) => setContentForm({ ...contentForm, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Badge / Profession Title
                  </label>
                  <input
                    type="text"
                    value={contentForm.badgeText}
                    onChange={(e) => setContentForm({ ...contentForm, badgeText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">Hero Tagline</label>
                  <input
                    type="text"
                    value={contentForm.tagline}
                    onChange={(e) => setContentForm({ ...contentForm, tagline: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Hero Section Description
                  </label>
                  <textarea
                    rows={2}
                    value={contentForm.heroDescription}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, heroDescription: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                {/* Numeric Stats */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">Rating Display</label>
                  <input
                    type="text"
                    value={contentForm.rating}
                    onChange={(e) => setContentForm({ ...contentForm, rating: e.target.value })}
                    placeholder="4.6"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-medium text-slate-300">
                    Years Experience
                  </label>
                  <input
                    type="text"
                    value={contentForm.experienceYears}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, experienceYears: e.target.value })
                    }
                    placeholder="3+ Yrs"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Total Reach / Views
                  </label>
                  <input
                    type="text"
                    value={contentForm.totalViews}
                    onChange={(e) => setContentForm({ ...contentForm, totalViews: e.target.value })}
                    placeholder="5M+"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                {/* About Bio Section */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">
                    About Section — Paragraph 1
                  </label>
                  <textarea
                    rows={3}
                    value={contentForm.aboutDescription1}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, aboutDescription1: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">
                    About Section — Paragraph 2
                  </label>
                  <textarea
                    rows={3}
                    value={contentForm.aboutDescription2}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, aboutDescription2: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                {/* Contact Section Call to Action */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Contact Section Header Title
                  </label>
                  <input
                    type="text"
                    value={contentForm.contactSectionTitle}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, contactSectionTitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Contact Section Subtitle
                  </label>
                  <input
                    type="text"
                    value={contentForm.contactSectionSubtitle}
                    onChange={(e) =>
                      setContentForm({ ...contentForm, contactSectionSubtitle: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-[#C8102E]"
                  />
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

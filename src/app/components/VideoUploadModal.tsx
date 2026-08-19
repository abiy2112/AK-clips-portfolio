import React, { useState, useRef } from "react";
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
} from "lucide-react";
import { ProjectItem } from "../types/project";
import {
  parseVideoSource,
  extractYouTubeId,
  extractGoogleDriveId,
  generateThumbnailFromVideoFile,
} from "../utils/videoParser";
import { uploadVideoToStorage } from "../utils/cloudDB";
import AKLogo from "./AKLogo";

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: ProjectItem[];
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

export default function VideoUploadModal({
  isOpen,
  onClose,
  projects,
  onAddProject,
  onDeleteProject,
  onResetProjects,
  onLockSession,
}: VideoUploadModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "manage">("upload");
  const [uploadMode, setUploadMode] = useState<"link" | "file">("link");

  // Form State
  const [videoUrl, setVideoUrl] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("TikTok & Shorts");
  const [customCategory, setCustomCategory] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [localFileName, setLocalFileName] = useState("");
  const [localFileObjectUrl, setLocalFileObjectUrl] = useState("");
  const [localFileBlob, setLocalFileBlob] = useState<File | null>(null);
  const [isCapturingThumbnail, setIsCapturingThumbnail] = useState(false);
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);
  const [validationError, setValidationError] = useState("");
  // Cloud upload progress (0-100, or null when idle)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle local video file selection
  const handleVideoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setValidationError("");
    setLocalFileName(file.name);
    setLocalFileBlob(file);

    const objectUrl = URL.createObjectURL(file);
    setLocalFileObjectUrl(objectUrl);
    setVideoUrl(objectUrl);

    if (!title) {
      // Auto-populate clean title from filename
      const cleanName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ");
      setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }

    // Auto-generate video thumbnail from first frame
    setIsCapturingThumbnail(true);
    try {
      const generatedThumb = await generateThumbnailFromVideoFile(file);
      if (generatedThumb && !thumbnailUrl) {
        setThumbnailUrl(generatedThumb);
      }
    } catch {
      // ignore
    } finally {
      setIsCapturingThumbnail(false);
    }
  };

  // Handle local thumbnail image selection
  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setThumbnailUrl(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Auto-detect thumbnail for YouTube when URL changes
  const handleUrlChange = (val: string) => {
    setVideoUrl(val);
    setValidationError("");
    const ytId = extractYouTubeId(val);
    if (ytId && !thumbnailUrl) {
      setThumbnailUrl(`https://img.youtube.com/vi/${ytId}/hqdefault.jpg`);
    }
  };

  // Submit Handler
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();

    const targetUrl = uploadMode === "link" ? videoUrl.trim() : localFileObjectUrl;
    if (!targetUrl) {
      setValidationError(
        uploadMode === "link"
          ? "Please enter a valid YouTube, Google Drive, TikTok, or video link."
          : "Please select a local video file from your computer or phone."
      );
      return;
    }

    if (!title.trim()) {
      setValidationError("Please enter a title for your video project.");
      return;
    }

    const finalCategory =
      category === "Custom" && customCategory.trim()
        ? customCategory.trim()
        : category;

    const newProject = parseVideoSource(
      targetUrl,
      title.trim(),
      finalCategory,
      thumbnailUrl.trim() || undefined,
      duration.trim() || undefined
    );

    // For local file: upload to Firebase Storage and get a public cloud URL
    if (uploadMode === "file" && localFileBlob) {
      setIsUploading(true);
      setUploadProgress(0);
      setValidationError("");
      try {
        const downloadURL = await uploadVideoToStorage(
          newProject.id,
          localFileBlob,
          (pct) => setUploadProgress(pct)
        );
        // Replace the local blob URL with the permanent cloud URL
        newProject.type = "direct";
        newProject.videoUrl = downloadURL;
        newProject.embedUrl = downloadURL;
        newProject.sourceLabel = "Cloud Upload";
      } catch {
        setIsUploading(false);
        setUploadProgress(null);
        setValidationError(
          "Video upload to cloud failed. Check your connection and try again."
        );
        return;
      }
      setIsUploading(false);
      setUploadProgress(null);
    }

    onAddProject(newProject);

    // Show success confirmation
    setIsSuccessMessage(true);
    setTimeout(() => {
      setIsSuccessMessage(false);
      // Reset form
      setVideoUrl("");
      setTitle("");
      setThumbnailUrl("");
      setDuration("");
      setLocalFileName("");
      setLocalFileObjectUrl("");
      setLocalFileBlob(null);
      setCustomCategory("");
      onClose(); // Close modal and let user see the newly added video!
    }, 1000);
  };

  const detectedYtId = extractYouTubeId(videoUrl);
  const detectedGDriveId = extractGoogleDriveId(videoUrl);

  const previewThumbnail =
    thumbnailUrl ||
    (detectedYtId
      ? `https://img.youtube.com/vi/${detectedYtId}/mqdefault.jpg`
      : "");

  const customProjectsCount = projects.filter((p) => p.isCustom).length;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* macOS Title Bar with Admin Badge */}
        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-950/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <span
                onClick={onClose}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer block"
                title="Close"
              ></span>
              <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 block"></span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <AKLogo size={16} rounded="md" />
              <span className="text-xs sm:text-sm font-bold text-white">
                AK clipps Studio
              </span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-950/70 border border-emerald-800 text-emerald-400 text-[9px] sm:text-[10px] font-semibold flex items-center gap-1">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400"></span>
                <span>Admin</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => {
                onLockSession();
                onClose();
              }}
              className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] sm:text-[11px] text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Lock creator session"
            >
              <Lock className="w-3 h-3 text-slate-400" />
              <span className="hidden xs:inline">Lock</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-3 sm:px-4 pt-2.5 bg-slate-950/50 border-b border-slate-800/80 flex items-center justify-between overflow-x-auto scrollbar-hide">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("upload")}
              className={`pb-2 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "upload"
                  ? "border-[#C8102E] text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Upload / Add Video</span>
            </button>

            <button
              onClick={() => setActiveTab("manage")}
              className={`pb-2 px-2.5 sm:px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === "manage"
                  ? "border-[#C8102E] text-white"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>
                All Projects ({projects.length})
                {customProjectsCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-[#C8102E] text-[9px] text-white">
                    +{customProjectsCount} Uploads
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Tab 1: Upload / Add Video */}
        {activeTab === "upload" ? (
          <div className="p-3 sm:p-5 overflow-y-auto space-y-4">
            {/* Input Mode Toggle: Links vs Local File */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-slate-950/70 border border-slate-800">
              <button
                type="button"
                onClick={() => setUploadMode("link")}
                className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                  uploadMode === "link"
                    ? "bg-[#C8102E] text-white shadow-sm font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Web Link (YouTube / Drive)</span>
              </button>

              <button
                type="button"
                onClick={() => setUploadMode("file")}
                className={`py-2 px-2 sm:px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer text-center ${
                  uploadMode === "file"
                    ? "bg-[#C8102E] text-white shadow-sm font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Upload className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">Upload Video File (.mp4/.mov)</span>
              </button>
            </div>

            <form onSubmit={handlePublish} className="space-y-3.5">
              {/* Link Input Method */}
              {uploadMode === "link" ? (
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300 flex items-center justify-between">
                    <span>Video URL (YouTube, Google Drive, TikTok, or MP4 Link)</span>
                    <span className="text-[10px] text-cyan-400 font-normal">
                      Auto-detected
                    </span>
                  </label>
                  <input
                    type="text"
                    value={videoUrl}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://youtube.com/watch?v=... or Google Drive link"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]"
                  />
                  {detectedYtId && (
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                      <Check className="w-3 h-3" />
                      <span>YouTube ID: {detectedYtId} (Cover loaded)</span>
                    </div>
                  )}
                  {detectedGDriveId && (
                    <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                      <Check className="w-3 h-3" />
                      <span>Google Drive ID: {detectedGDriveId}</span>
                    </div>
                  )}
                </div>
              ) : (
                /* Local File Upload Method */
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Select Local Video File (.mp4, .mov, .webm)
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,video/*"
                    onChange={handleVideoFileChange}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-800 hover:border-slate-600 bg-slate-950/60 rounded-xl p-4 sm:p-5 text-center cursor-pointer transition-colors"
                  >
                    {isCapturingThumbnail ? (
                      <div className="flex flex-col items-center justify-center py-2">
                        <Loader2 className="w-6 h-6 text-cyan-400 animate-spin mb-1" />
                        <span className="text-xs text-slate-300 font-medium">
                          Extracting video frame thumbnail...
                        </span>
                      </div>
                    ) : (
                      <>
                        <FileVideo className="w-7 h-7 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-1.5" />
                        <div className="text-xs font-semibold text-white truncate px-2">
                          {localFileName ? localFileName : "Tap to browse video file from device"}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Uploaded securely to Firebase Cloud Storage
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Title & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Ethiopian Luxury Penthouse Cut"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-300">
                    Duration / Quality Tag
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 0:45 • HD"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>
              </div>

              {/* Category Picker */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Category Tag
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_PRESETS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors cursor-pointer ${
                        category === cat
                          ? "bg-[#C8102E] text-white font-bold"
                          : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCategory("Custom")}
                    className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-[11px] font-medium transition-colors cursor-pointer ${
                      category === "Custom"
                        ? "bg-[#C8102E] text-white font-bold"
                        : "bg-slate-800/80 text-slate-300 hover:bg-slate-700"
                    }`}
                  >
                    + Custom
                  </button>
                </div>
                {category === "Custom" && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Type custom category name..."
                    className="w-full mt-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none"
                  />
                )}
              </div>

              {/* Custom Thumbnail (Optional) */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
                  <span>Custom Thumbnail Image (Optional)</span>
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="text-cyan-400 hover:text-cyan-300 text-[10px] cursor-pointer"
                  >
                    Choose Cover Image
                  </button>
                </div>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailFileChange}
                  className="hidden"
                />
                <input
                  type="text"
                  value={thumbnailUrl}
                  onChange={(e) => setThumbnailUrl(e.target.value)}
                  placeholder="https://example.com/thumbnail.jpg or auto-captured from video"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>

              {/* Live Preview Card */}
              {(title || videoUrl || localFileName) && (
                <div className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
                  <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-cyan-400" />
                    <span>PREVIEW BEFORE PUBLISHING</span>
                  </div>
                  <div className="w-full max-w-[280px] rounded-xl bg-slate-900 border border-slate-700 overflow-hidden shadow-lg">
                    <div className="aspect-video bg-black relative flex items-center justify-center overflow-hidden">
                      {previewThumbnail ? (
                        <img
                          src={previewThumbnail}
                          alt="preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Film className="w-8 h-8 text-slate-600" />
                      )}
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <div className="w-8 h-8 rounded-full bg-[#C8102E] text-white flex items-center justify-center shadow-lg">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </div>
                      <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-white font-semibold">
                        {category === "Custom" ? customCategory || "Custom" : category}
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-bold text-white truncate">
                        {title || "Untitled Project"}
                      </div>
                      <div className="text-[9px] text-slate-400 mt-0.5">
                        AK clipps • {duration || "Featured Video"}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Cloud Upload Progress Bar */}
              {isUploading && uploadProgress !== null && (
                <div className="p-3 rounded-xl bg-slate-950/80 border border-cyan-900/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-cyan-400 font-semibold flex items-center gap-1.5">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      Uploading to Firebase Cloud...
                    </span>
                    <span className="text-white font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cyan-500 to-[#C8102E] rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400">Video will be accessible from any device once complete.</div>
                </div>
              )}

              {validationError && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{validationError}</span>
                </div>
              )}

              {isSuccessMessage && (
                <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-xs font-semibold text-emerald-300 flex items-center justify-center gap-2 animate-fade-in">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Video successfully published to Featured Projects!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isUploading}
                  className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-xs font-medium text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#C8102E] hover:bg-[#b00e27] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  {isUploading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /><span>Uploading to Cloud…</span></>
                  ) : (
                    <><Zap className="w-4 h-4 fill-current" /><span>Publish to Featured Projects</span></>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Tab 2: Manage Projects */
          <div className="p-3 sm:p-5 overflow-y-auto space-y-3">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs text-slate-400">
                All projects active in Featured section
              </div>
              <button
                type="button"
                onClick={onResetProjects}
                className="text-[11px] text-red-400 hover:text-red-300 underline cursor-pointer"
              >
                Reset to defaults
              </button>
            </div>

            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <div
                  key={`${proj.id}-${idx}`}
                  className="p-2.5 sm:p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-12 h-8 rounded bg-black shrink-0 overflow-hidden relative border border-slate-800">
                      {proj.thumbnailUrl ||
                      proj.type === "youtube" ||
                      !proj.type ? (
                        <img
                          src={
                            proj.thumbnailUrl ||
                            `https://img.youtube.com/vi/${proj.id}/mqdefault.jpg`
                          }
                          alt={proj.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-900 text-slate-500">
                          <Film className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                        <span className="truncate">{proj.title}</span>
                        {proj.isCustom && (
                          <span className="shrink-0 px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-[8px] sm:text-[9px]">
                            Custom
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {proj.category} • {proj.sourceLabel || "Video"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {proj.isCustom && (
                      <button
                        type="button"
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 border border-red-800/80 text-red-400 hover:text-white transition-colors cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3">
              <button
                type="button"
                onClick={() => setActiveTab("upload")}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Upload Another Video</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import { ProjectItem, VideoSourceType } from "../types/project";
export {
  storeVideoBlob,
  getVideoBlob,
  deleteVideoBlob,
  generateThumbnailFromVideoFile,
  loadStoredProjectsWithBlobs,
  saveCustomProjects,
  getCreatorAuthStatus,
  setCreatorAuthStatus,
} from "./videoStorage";

/**
 * Extracts YouTube ID from various YouTube URL formats, shorts, or raw ID.
 */
export function extractYouTubeId(urlOrId: string): string | null {
  const trimmed = urlOrId.trim();
  if (!trimmed) return null;

  // Direct 11-character video ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Handle standard watch URL, share URL, shorts, embed, mobile URLs, etc.
  const regex =
    /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
  const match = trimmed.match(regex);
  return match ? match[1] : null;
}

/**
 * Extracts Google Drive file ID from view/share/preview links.
 */
export function extractGoogleDriveId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  // Patterns like /file/d/ID/view, /open?id=ID, /uc?id=ID
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/i);
  if (matchFileD) return matchFileD[1];

  const matchParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (matchParam) return matchParam[1];

  return null;
}

/**
 * Detects the video source type and returns normalized fields for ProjectItem.
 */
export function parseVideoSource(
  input: string,
  title: string,
  category: string,
  customThumbnail?: string,
  duration?: string
): ProjectItem {
  const cleanInput = input.trim();
  const timestamp = Date.now();

  // 1. YouTube check
  const ytId = extractYouTubeId(cleanInput);
  if (ytId) {
    return {
      id: ytId,
      title: title.trim() || `YouTube Project (${ytId.slice(0, 5)})`,
      category: category.trim() || "Featured Video",
      type: "youtube",
      videoUrl: `https://youtube.com/watch?v=${ytId}`,
      embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`,
      thumbnailUrl:
        customThumbnail?.trim() ||
        `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      duration: duration?.trim() || "YouTube Cut",
      sourceLabel: "YouTube Video",
      isCustom: true,
      createdAt: timestamp,
    };
  }

  // 2. Google Drive check
  const gDriveId = extractGoogleDriveId(cleanInput);
  if (gDriveId) {
    return {
      id: `gdrive-${gDriveId}`,
      title: title.trim() || "Google Drive Master Project",
      category: category.trim() || "Commercial & Raw Cut",
      type: "googledrive",
      videoUrl: `https://drive.google.com/file/d/${gDriveId}/view`,
      embedUrl: `https://drive.google.com/file/d/${gDriveId}/preview`,
      thumbnailUrl: customThumbnail?.trim() || "",
      duration: duration?.trim() || "Master Cut",
      sourceLabel: "Google Drive Master",
      isCustom: true,
      createdAt: timestamp,
    };
  }

  // 3. TikTok check
  if (cleanInput.includes("tiktok.com")) {
    return {
      id: `tiktok-${timestamp}`,
      title: title.trim() || "TikTok Viral Cut",
      category: category.trim() || "TikTok & Shorts",
      type: "tiktok",
      videoUrl: cleanInput,
      embedUrl: cleanInput,
      thumbnailUrl: customThumbnail?.trim() || "",
      duration: duration?.trim() || "Vertical 9:16",
      sourceLabel: "TikTok / Reels",
      isCustom: true,
      createdAt: timestamp,
    };
  }

  // 4. Local or Direct URL / Blob / Data URL
  const isLocal = cleanInput.startsWith("data:") || cleanInput.startsWith("blob:");
  return {
    id: `custom-${timestamp}`,
    title: title.trim() || (isLocal ? "Local Studio Video" : "Direct Video Project"),
    category: category.trim() || "Video Showcase",
    type: isLocal ? "local" : "direct",
    videoUrl: cleanInput,
    embedUrl: cleanInput,
    thumbnailUrl: customThumbnail?.trim() || "",
    duration: duration?.trim() || "HD Studio",
    sourceLabel: isLocal ? "Local Studio Upload" : "Direct Video Link",
    isCustom: true,
    createdAt: timestamp,
  };
}

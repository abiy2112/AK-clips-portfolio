export type VideoSourceType =
  | "youtube"
  | "googledrive"
  | "tiktok"
  | "direct"
  | "local";

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  type?: VideoSourceType;
  videoUrl?: string;
  embedUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  sourceLabel?: string;
  isCustom?: boolean;
  createdAt?: number;
}

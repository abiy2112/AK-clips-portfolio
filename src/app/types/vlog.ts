// VlogItem type — Firestore `vlogs` collection
// Vlogs are text-based posts (like a blog), not video uploads
export interface VlogItem {
  id: string;
  title: string;
  content: string;        // the main text body
  excerpt?: string;       // short preview (auto-derived from content if not set)
  date: string;
  tags?: string[];
  isCustom?: boolean;
  createdAt?: number;
}

// VlogItem type — persisted to Firestore `vlogs` collection
export interface VlogItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  date: string;
  tags?: string[];
  isCustom?: boolean;
  createdAt?: number;
}

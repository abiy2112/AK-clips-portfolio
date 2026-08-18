// Shared ReviewItem type used across ClientReviews.tsx and cloudDB.ts
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
  verifiedMethod?: "telegram" | "email";
  verifiedHandle?: string;
  projectHighlight?: string;
  likes: number;
  isCustom?: boolean;
  createdAt?: number;
}

import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { SiteContactSettings, SiteContentSettings } from "../types/settings";

export const DEFAULT_CONTACT_SETTINGS: SiteContactSettings = {
  telegramUsername: "Ak_clips",
  telegramUrl: "https://t.me/Ak_clips",
  email: "abiyketema21@gmail.com",
  phone: "+251934681880",
  location: "Addis Ababa, Ethiopia",
  linkedinUrl: "https://www.linkedin.com/in/abiy-ketema-2a8902290",
  youtubeChannelUrl: "https://youtube.com/@musikana1",
};

export const DEFAULT_CONTENT_SETTINGS: SiteContentSettings = {
  name: "AK clipps",
  fullName: "Abiy Ketema",
  tagline: "Crafting high-retention visual stories",
  badgeText: "Video Editor & Motion Designer",
  heroDescription:
    "Specializing in viral short-form TikTok/Reels, YouTube long-form content, luxury commercial property showcases, and rhythmic motion graphics.",
  rating: "4.6",
  experienceYears: "3+ Yrs",
  totalViews: "5M+",
  aboutDescription1:
    "Detail-oriented Video Editor with 3+ years of experience producing video content across social media, corporate, and entertainment channels. Skilled in visual pacing, motion typography, and audio mastering.",
  aboutDescription2:
    "Founder & producer of the MUSIKANA YouTube channel with over 8,000+ subscribers, delivering synchronized motion lyrics streams and creative video cuts with over 5M+ overall reach.",
  contactSectionTitle: "Get in Touch with AK clipps",
  contactSectionSubtitle:
    "Available for YouTube video editing, TikTok/Reels retainers, and promotional campaigns.",
};

/**
 * Subscribe to contact settings in Firestore with fallback to defaults.
 */
export function subscribeToContactSettings(
  callback: (settings: SiteContactSettings) => void
): () => void {
  const docRef = doc(db, "settings", "contact");
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ ...DEFAULT_CONTACT_SETTINGS, ...(snap.data() as Partial<SiteContactSettings>) });
      } else {
        callback(DEFAULT_CONTACT_SETTINGS);
      }
    },
    (err) => {
      console.error("[siteSettings] Contact subscription error:", err);
      callback(DEFAULT_CONTACT_SETTINGS);
    }
  );
}

/**
 * Save updated contact settings to Firestore.
 */
export async function saveContactSettings(settings: Partial<SiteContactSettings>): Promise<void> {
  const docRef = doc(db, "settings", "contact");
  await setDoc(docRef, { ...settings, updatedAt: Date.now() }, { merge: true });
}

/**
 * Subscribe to content settings in Firestore with fallback to defaults.
 */
export function subscribeToContentSettings(
  callback: (settings: SiteContentSettings) => void
): () => void {
  const docRef = doc(db, "settings", "content");
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        callback({ ...DEFAULT_CONTENT_SETTINGS, ...(snap.data() as Partial<SiteContentSettings>) });
      } else {
        callback(DEFAULT_CONTENT_SETTINGS);
      }
    },
    (err) => {
      console.error("[siteSettings] Content subscription error:", err);
      callback(DEFAULT_CONTENT_SETTINGS);
    }
  );
}

/**
 * Save updated content settings to Firestore.
 */
export async function saveContentSettings(settings: Partial<SiteContentSettings>): Promise<void> {
  const docRef = doc(db, "settings", "content");
  await setDoc(docRef, { ...settings, updatedAt: Date.now() }, { merge: true });
}

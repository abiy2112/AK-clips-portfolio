/**
 * cloudDB.ts
 *
 * All cloud persistence — Firestore (projects + reviews) + Firebase Storage (video files).
 * This replaces the previous IndexedDB / localStorage approach so that every device
 * visiting the portfolio sees the same data in real-time.
 */

import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase";
import { ProjectItem } from "../types/project";
import { ReviewItem } from "../types/review";
import { INITIAL_REVIEWS } from "../data/initialReviews";

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTS — Firestore `projects` collection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Subscribe to custom projects in real-time.
 * Returns an unsubscribe function; call it on component unmount.
 */
export function subscribeToProjects(
  callback: (projects: ProjectItem[]) => void
): () => void {
  const q = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const projects = snapshot.docs.map((d) => ({
        ...(d.data() as Omit<ProjectItem, "id">),
        id: d.id,
      })) as ProjectItem[];
      callback(projects);
    },
    (err) => {
      console.error("[cloudDB] projects subscription error:", err);
    }
  );
}

/** Save (create or update) a custom project to Firestore. */
export async function saveProjectToCloud(project: ProjectItem): Promise<void> {
  const { id, ...rest } = project;
  await setDoc(doc(db, "projects", id), {
    ...rest,
    isCustom: true,
    createdAt: project.createdAt ?? Date.now(),
    updatedAt: Date.now(),
  });
}

/** Delete a custom project from Firestore (and its video from Storage if applicable). */
export async function deleteProjectFromCloud(id: string): Promise<void> {
  await deleteDoc(doc(db, "projects", id));
  // Best-effort: delete the associated video file from Storage (may not exist for link-type projects)
  try {
    await deleteObject(ref(storage, `videos/${id}`));
  } catch {
    // Ignore — video might have been a YouTube/Drive link with no Storage file
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// VIDEO FILE UPLOAD — Firebase Storage
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Upload a local video file to Firebase Storage.
 * Returns the public download URL once complete.
 * @param projectId   Used as the storage path key (`videos/<projectId>`)
 * @param file        The File or Blob to upload
 * @param onProgress  Optional callback with 0-100 upload progress
 */
export function uploadVideoToStorage(
  projectId: string,
  file: File | Blob,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `videos/${projectId}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snap) => {
        const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
        onProgress?.(pct);
      },
      (err) => {
        console.error("[cloudDB] Storage upload error:", err);
        reject(err);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        resolve(url);
      }
    );
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// REVIEWS — Firestore `reviews` collection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Subscribe to reviews in real-time.
 * On first call, if the collection is empty, seeds the INITIAL_REVIEWS.
 * Returns an unsubscribe function; call it on component unmount.
 */
export function subscribeToReviews(
  callback: (reviews: ReviewItem[]) => void
): () => void {
  const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    async (snapshot) => {
      if (snapshot.empty) {
        // First-ever load: seed initial reviews so all devices see them
        try {
          await seedInitialReviews();
        } catch (e) {
          console.warn("[cloudDB] Could not seed initial reviews:", e);
          callback([...INITIAL_REVIEWS].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)));
        }
        return;
      }
      const reviews = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name || "Verified Client",
          role: data.role || "Client",
          companyOrHandle: data.companyOrHandle || "",
          avatarBg: data.avatarBg || "bg-slate-800 border-slate-700",
          avatarText: data.avatarText || "text-cyan-400",
          rating: typeof data.rating === "number" ? data.rating : 4.6,
          category: data.category || "TikTok & Reels",
          date: data.date || "Recent",
          comment: data.comment || "",
          verified: typeof data.verified === "boolean" ? data.verified : true,
          verifiedMethod: data.verifiedMethod,
          verifiedHandle: data.verifiedHandle,
          projectHighlight: data.projectHighlight,
          likes: typeof data.likes === "number" ? data.likes : 0,
          isCustom: data.isCustom ?? true,
          createdAt: data.createdAt || Date.now(),
        } as ReviewItem;
      });
      callback(reviews);
    },
    (err) => {
      console.error("[cloudDB] reviews subscription error:", err);
      callback([...INITIAL_REVIEWS]);
    }
  );
}

/** Seed the 6 initial reviews to Firestore as a single atomic batch write. */
async function seedInitialReviews(): Promise<void> {
  const batch = writeBatch(db);
  INITIAL_REVIEWS.forEach((review) => {
    const docRef = doc(db, "reviews", review.id);
    batch.set(docRef, {
      ...review,
      createdAt: review.createdAt ?? Date.now(),
    });
  });
  await batch.commit();
}

/** Save (create or update) a review to Firestore. */
export async function saveReviewToCloud(review: ReviewItem): Promise<void> {
  const { id, ...rest } = review;
  await setDoc(doc(db, "reviews", id), {
    ...rest,
    createdAt: review.createdAt ?? Date.now(),
    updatedAt: Date.now(),
  }, { merge: true });
}

/** Delete a review from Firestore. */
export async function deleteReviewFromCloud(id: string): Promise<void> {
  await deleteDoc(doc(db, "reviews", id));
}

/** Load all reviews once (non-realtime). Used as a fallback. */
export async function loadReviewsOnce(): Promise<ReviewItem[]> {
  try {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...(d.data() as Omit<ReviewItem, "id">), id: d.id })) as ReviewItem[];
  } catch {
    return [...INITIAL_REVIEWS];
  }
}

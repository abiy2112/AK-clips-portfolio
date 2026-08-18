import { ProjectItem } from "../types/project";

const DB_NAME = "AKClipsStudioDB";
const STORE_VIDEOS = "uploaded_videos";
const STORE_PROJECTS = "projects_meta";
const STORE_REVIEWS = "client_reviews";
const DB_VERSION = 2;

const STORAGE_PROJECTS_KEY = "ak_portfolio_custom_projects_v3";
const STORAGE_REVIEWS_KEY = "ak_portfolio_client_reviews_v5";
const AUTH_KEY = "ak_creator_auth_v2";

/**
 * Open or upgrade native browser IndexedDB with all required object stores
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB is not supported in this browser"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_VIDEOS)) {
        db.createObjectStore(STORE_VIDEOS);
      }
      if (!db.objectStoreNames.contains(STORE_PROJECTS)) {
        db.createObjectStore(STORE_PROJECTS, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(STORE_REVIEWS)) {
        db.createObjectStore(STORE_REVIEWS, { keyPath: "id" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Store a local video Blob in IndexedDB
 */
export async function storeVideoBlob(id: string, file: Blob): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_VIDEOS, "readwrite");
      const store = tx.objectStore(STORE_VIDEOS);
      store.put(file, id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error("Failed to store video in IndexedDB", e);
  }
}

/**
 * Retrieve a stored video Blob from IndexedDB
 */
export async function getVideoBlob(id: string): Promise<Blob | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_VIDEOS, "readonly");
      const store = tx.objectStore(STORE_VIDEOS);
      const req = store.get(id);
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  } catch (e) {
    console.error("Failed to get video from IndexedDB", e);
    return null;
  }
}

/**
 * Delete a video blob from IndexedDB
 */
export async function deleteVideoBlob(id: string): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_VIDEOS, "readwrite");
      const store = tx.objectStore(STORE_VIDEOS);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error("Failed to delete video from IndexedDB", e);
  }
}

/**
 * Capture a lightweight, downsampled video thumbnail from an uploaded File or Blob
 */
export function generateThumbnailFromVideoFile(file: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement("video");
      const objectUrl = URL.createObjectURL(file);
      video.src = objectUrl;
      video.muted = true;
      video.playsInline = true;
      video.crossOrigin = "anonymous";

      video.onloadeddata = () => {
        // Seek to 1s or 20% duration
        video.currentTime = Math.min(1.0, video.duration > 0 ? video.duration / 5 : 0.5);
      };

      video.onseeked = () => {
        try {
          const maxDim = 480;
          let w = video.videoWidth || 480;
          let h = video.videoHeight || 270;
          if (w > maxDim) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          }

          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, w, h);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.65);
            URL.revokeObjectURL(objectUrl);
            resolve(dataUrl);
            return;
          }
        } catch (err) {
          console.warn("Thumbnail capture warning", err);
        }
        URL.revokeObjectURL(objectUrl);
        resolve("");
      };

      video.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve("");
      };
    } catch {
      resolve("");
    }
  });
}

/**
 * Load stored custom projects and resolve live object URLs for local videos
 */
export async function loadStoredProjectsWithBlobs(): Promise<ProjectItem[]> {
  let customProjects: ProjectItem[] = [];

  // 1. Try loading from IndexedDB first (Primary source of truth)
  try {
    const db = await openDB();
    customProjects = await new Promise<ProjectItem[]>((resolve) => {
      const tx = db.transaction(STORE_PROJECTS, "readonly");
      const store = tx.objectStore(STORE_PROJECTS);
      const req = store.getAll();
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => resolve([]);
    });
  } catch (e) {
    console.warn("Could not read projects from IndexedDB, falling back to localStorage", e);
  }

  // 2. Fallback to localStorage if IndexedDB had no projects yet
  if (!customProjects || customProjects.length === 0) {
    try {
      const raw =
        localStorage.getItem(STORAGE_PROJECTS_KEY) ||
        localStorage.getItem("ak_portfolio_custom_projects_v2");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          customProjects = parsed;
          // Migrate to IndexedDB in the background
          saveCustomProjects(customProjects);
        }
      }
    } catch (e) {
      console.warn("Failed to load projects from localStorage", e);
    }
  }

  if (!customProjects || customProjects.length === 0) {
    return [];
  }

  // 3. Resolve live Blob object URLs for local video items
  const resolved = await Promise.all(
    customProjects.map(async (project) => {
      if (project.type === "local" && project.id) {
        const blob = await getVideoBlob(project.id);
        if (blob) {
          const liveUrl = URL.createObjectURL(blob);
          return {
            ...project,
            videoUrl: liveUrl,
            embedUrl: liveUrl,
          };
        }
      }
      return project;
    })
  );

  return resolved;
}

/**
 * Save custom projects to IndexedDB and fallback localStorage
 */
export async function saveCustomProjects(projects: ProjectItem[]): Promise<void> {
  // Sanitize ephemeral object URLs
  const sanitized: ProjectItem[] = projects.map((p) => {
    if (p.type === "local") {
      return {
        ...p,
        videoUrl: "",
        embedUrl: "",
      };
    }
    return p;
  });

  // 1. Save to IndexedDB (virtually unlimited storage)
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_PROJECTS, "readwrite");
      const store = tx.objectStore(STORE_PROJECTS);
      store.clear(); // sync current custom projects list
      sanitized.forEach((item) => {
        store.put(item);
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error("Failed to save projects to IndexedDB", e);
  }

  // 2. Fallback save to localStorage (with safety catch for quota)
  try {
    // Strip large thumbnail base64 if needed for localStorage fallback
    const lightCopy = sanitized.map((p) => {
      if (p.thumbnailUrl && p.thumbnailUrl.startsWith("data:") && p.thumbnailUrl.length > 50000) {
        return { ...p, thumbnailUrl: "" };
      }
      return p;
    });
    localStorage.setItem(STORAGE_PROJECTS_KEY, JSON.stringify(lightCopy));
  } catch (e) {
    console.warn("Could not save to localStorage quota, IndexedDB remains source of truth", e);
  }
}

/**
 * Client Reviews Persistence via IndexedDB + localStorage
 */
export async function loadStoredReviews<T>(defaultReviews: T[]): Promise<T[]> {
  try {
    const db = await openDB();
    const dbReviews = await new Promise<T[]>((resolve) => {
      const tx = db.transaction(STORE_REVIEWS, "readonly");
      const store = tx.objectStore(STORE_REVIEWS);
      const req = store.getAll();
      req.onsuccess = () => resolve(Array.isArray(req.result) ? req.result : []);
      req.onerror = () => resolve([]);
    });

    if (dbReviews && dbReviews.length > 0) {
      return dbReviews;
    }
  } catch (e) {
    console.warn("Could not read reviews from IndexedDB", e);
  }

  // Fallback to localStorage
  try {
    const raw =
      localStorage.getItem(STORAGE_REVIEWS_KEY) ||
      localStorage.getItem("ak_portfolio_client_reviews_v4");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Save to IndexedDB
        saveStoredReviews(parsed);
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Failed to load reviews from localStorage", e);
  }

  return defaultReviews;
}

/**
 * Save all reviews to IndexedDB and localStorage
 */
export async function saveStoredReviews<T extends { id: string }>(reviews: T[]): Promise<void> {
  // 1. IndexedDB
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_REVIEWS, "readwrite");
      const store = tx.objectStore(STORE_REVIEWS);
      store.clear();
      reviews.forEach((rev) => {
        store.put(rev);
      });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error("Failed to save reviews to IndexedDB", e);
  }

  // 2. localStorage
  try {
    localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.warn("localStorage quota hit for reviews, IndexedDB is active", e);
  }
}

/**
 * Delete a specific review by ID from IndexedDB and localStorage
 */
export async function deleteStoredReview(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE_REVIEWS, "readwrite");
      const store = tx.objectStore(STORE_REVIEWS);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error("Failed to delete review from IndexedDB", e);
  }
}

/**
 * Creator Admin Auth persistence
 */
export function getCreatorAuthStatus(): boolean {
  try {
    return (
      sessionStorage.getItem(AUTH_KEY) === "true" ||
      localStorage.getItem(AUTH_KEY) === "true"
    );
  } catch {
    return false;
  }
}

export function setCreatorAuthStatus(isAuth: boolean): void {
  try {
    if (isAuth) {
      sessionStorage.setItem(AUTH_KEY, "true");
      localStorage.setItem(AUTH_KEY, "true");
    } else {
      sessionStorage.removeItem(AUTH_KEY);
      localStorage.removeItem(AUTH_KEY);
    }
  } catch {
    // Ignore storage restriction
  }
}


import { ProjectItem } from "../types/project";

const DB_NAME = "AKClipsStudioDB";
const STORE_NAME = "uploaded_videos";
const DB_VERSION = 1;
const STORAGE_KEY = "ak_portfolio_custom_projects_v2";
const AUTH_KEY = "ak_creator_auth_v2";

/**
 * Open or initialize native browser IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB not supported in this environment"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Store a local video Blob/File in IndexedDB for permanent persistence across reloads
 */
export async function storeVideoBlob(id: string, file: Blob): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
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
      const tx = db.transaction(STORE_NAME, "readonly");
      const store = tx.objectStore(STORE_NAME);
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
      const tx = db.transaction(STORE_NAME, "readwrite");
      const store = tx.objectStore(STORE_NAME);
      store.delete(id);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.error("Failed to delete video from IndexedDB", e);
  }
}

/**
 * Automatically capture a video thumbnail from an uploaded File or Blob
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
        // Seek to 1s or 25% of duration
        video.currentTime = Math.min(1.0, video.duration > 0 ? video.duration / 4 : 0.5);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
            URL.revokeObjectURL(objectUrl);
            resolve(dataUrl);
            return;
          }
        } catch (err) {
          console.warn("Canvas capture warning", err);
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
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: ProjectItem[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    const resolved = await Promise.all(
      parsed.map(async (project) => {
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
  } catch (e) {
    console.error("Failed to load stored projects with blobs", e);
    return [];
  }
}

/**
 * Save custom projects list to localStorage
 */
export function saveCustomProjects(projects: ProjectItem[]): void {
  try {
    // When saving, strip ephemeral object URLs to avoid stale pointers
    const sanitized = projects.map((p) => {
      if (p.type === "local") {
        return {
          ...p,
          videoUrl: "",
          embedUrl: "",
        };
      }
      return p;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.error("Failed to save projects to localStorage", e);
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

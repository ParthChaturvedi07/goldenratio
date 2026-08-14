const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface Project {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  concept?: string;
  role?: string;
  industry?: string;
  image: string;
  gallery?: { src: string; caption?: string }[];
  videos?: { src: string; caption?: string }[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Prefix image/video paths with the backend URL when needed.
 * - `/uploads/...` paths need the backend origin (for SSR fetches)
 * - `/images/...` paths are served via Next.js public or backend static, kept relative
 * - Absolute URLs (http/https) are returned as-is
 */
export function getMediaUrl(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  // Both /uploads and /images are proxied via next.config rewrites, so keep relative
  return path;
}

// ── Fetch helpers ──────────────────────────────────────────

async function apiFetch<T>(endpoint: string): Promise<T> {
  // On the server side (SSR / RSC), relative URLs don't work — use absolute URL
  const isServer = typeof window === "undefined";
  const base = isServer ? API_BASE_URL : "";
  const url = `${base}${endpoint}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  if (!json.success) {
    throw new Error(json.message || "API request failed");
  }

  return json.data as T;
}

/** Fetch all active projects, optionally filtered by category. */
export async function fetchProjects(category?: string): Promise<Project[]> {
  const query = category && category !== "All" ? `?category=${encodeURIComponent(category)}` : "";
  return apiFetch<Project[]>(`/api/projects${query}`);
}

/** Fetch a single project by its slug. */
export async function fetchProject(slug: string): Promise<Project> {
  return apiFetch<Project>(`/api/projects/${encodeURIComponent(slug)}`);
}

/** Fetch the list of unique project categories (includes "All" at index 0). */
export async function fetchCategories(): Promise<string[]> {
  return apiFetch<string[]>("/api/projects/categories");
}

// ── Products ──────────────────────────────────────────────

export interface Product {
  _id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  discountPrice?: number | null;
  currency: string;
  sku?: string;
  stock?: number;
  specifications?: { label: string; value: string }[];
  tags?: string[];
  image: string;
  gallery?: { src: string; publicId?: string; caption?: string }[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Fetch all active products, optionally filtered by category. */
export async function fetchProducts(category?: string): Promise<Product[]> {
  const query = category && category !== "All" ? `?category=${encodeURIComponent(category)}` : "";
  return apiFetch<Product[]>(`/api/products${query}`);
}

/** Fetch a single product by its slug. */
export async function fetchProduct(slug: string): Promise<Product> {
  return apiFetch<Product>(`/api/products/${encodeURIComponent(slug)}`);
}

/** Fetch the list of unique product categories (includes "All" at index 0). */
export async function fetchProductCategories(): Promise<string[]> {
  return apiFetch<string[]>("/api/products/categories");
}

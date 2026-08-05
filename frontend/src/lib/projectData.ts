/**
 * Project type definition — matches the server-side Mongoose model.
 * 
 * NOTE: All project data is now fetched dynamically from the server.
 * Use the fetch helpers in `@/lib/api` instead of importing static data.
 */
export type { Project } from "./api";

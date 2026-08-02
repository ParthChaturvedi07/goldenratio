const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const BACKEND_URL = API_URL.replace('/api', '');

/**
 * Resolves any media path to a full backend URL.
 * The backend now serves both /uploads/* and /images/* statically,
 * so all media resolves against a single origin.
 */
export const resolveMediaUrl = (path) => {
  if (!path) return 'https://placehold.co/600x400/161616/555555?text=No+Image';
  
  // Already a full URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // All relative paths resolve against the backend
  return `${BACKEND_URL}${path}`;
};

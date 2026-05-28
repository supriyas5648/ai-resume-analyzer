// fallback to localhost backend when VITE_API_URL not provided
export const API = import.meta.env.VITE_API_URL || "http://localhost:5000";
export const API_BASE =
  (import.meta as any)?.env?.VITE_API_BASE_URL ||
  (typeof window !== 'undefined' ? (window as any).VITE_API_BASE_URL : '') ||
  'http://localhost:8787';



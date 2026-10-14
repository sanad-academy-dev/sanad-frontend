export const SANAD_BACKEND_URL =
  process.env.SANAD_API_URL ??
  process.env.DASHBOARD_API_URL ??
  "http://localhost:5180/api";

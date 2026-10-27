const DEFAULT_BACKEND_URL = "http://localhost:5180/api";

export function getSanadBackendUrl(): string {
  const configuredUrl =
    process.env.SANAD_API_URL ??
    process.env.DASHBOARD_API_URL ??
    DEFAULT_BACKEND_URL;

  let backendUrl: URL;
  try {
    backendUrl = new URL(configuredUrl);
  } catch {
    throw new Error("SANAD_API_URL must be a valid absolute URL");
  }

  if (process.env.NODE_ENV === "production" && backendUrl.protocol !== "https:") {
    throw new Error("SANAD_API_URL must use HTTPS in production");
  }

  return backendUrl.toString().replace(/\/$/, "");
}

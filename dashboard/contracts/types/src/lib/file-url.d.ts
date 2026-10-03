/**
 * Resolves a stored file path/key to a displayable URL.
 *
 * - S3 keys (e.g. "uploads/uuid_name.png") → proxied through /api/uploads/serve
 *   so the S3 bucket never needs to be public.
 * - Legacy local paths ("/uploads/...") → prefixed with the API base URL.
 * - Full URLs (http/https) → returned as-is (backwards compat with old records).
 * - null/undefined → null.
 */
export declare function getFileUrl(path: string): string;
export declare function getFileUrl(path: string | null | undefined): string | null;

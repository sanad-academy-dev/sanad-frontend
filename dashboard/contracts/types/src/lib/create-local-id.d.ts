/**
 * Generates a client-only id for local state (React keys, draft rows, etc.) — never persisted.
 * `crypto.randomUUID` requires a secure context, so it's undefined on plain-HTTP origins;
 * falls back to `crypto.getRandomValues` (broadly supported) and finally `Math.random`.
 */
export declare function createLocalId(): string;

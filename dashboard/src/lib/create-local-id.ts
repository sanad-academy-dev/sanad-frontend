/**
 * Generates a client-only id for local state (React keys, draft rows, etc.) — never persisted.
 * `crypto.randomUUID` requires a secure context, so it's undefined on plain-HTTP origins;
 * falls back to `crypto.getRandomValues` (broadly supported) and finally `Math.random`.
 */
export function createLocalId(): string {
	if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
		return crypto.randomUUID();
	}
	if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
		const bytes = crypto.getRandomValues(new Uint8Array(16));
		return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
	}
	return `${Date.now().toString(16)}${Math.random().toString(16).slice(2)}`;
}

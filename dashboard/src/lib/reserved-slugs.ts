export const RESERVED_SLUGS = Object.freeze(
	new Set<string>([
		"about",
		"admin",
		"api",
		"app",
		"book",
		"clinic",
		"dashboard",
		"help",
		"home",
		"login",
		"logout",
		"mail",
		"management",
		"privacy",
		"public",
		"settings",
		"signin",
		"signup",
		"support",
		"terms",
		"www",
	]),
);

export const SLUG_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SLUG_MIN_LENGTH = 3;
export const SLUG_MAX_LENGTH = 50;

export type SlugValidationError = "format" | "length" | "numeric" | "reserved";

export function validateSlug(input: string): SlugValidationError | null {
	if (input.length < SLUG_MIN_LENGTH || input.length > SLUG_MAX_LENGTH) {
		return "length";
	}
	if (!SLUG_REGEX.test(input)) {
		return "format";
	}
	if (/^[0-9]+$/.test(input)) {
		return "numeric";
	}
	if (RESERVED_SLUGS.has(input)) {
		return "reserved";
	}
	return null;
}

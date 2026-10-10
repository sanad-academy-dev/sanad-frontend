export declare const RESERVED_SLUGS: Readonly<Set<string>>;
export declare const SLUG_REGEX: RegExp;
export declare const SLUG_MIN_LENGTH = 3;
export declare const SLUG_MAX_LENGTH = 50;
export type SlugValidationError = "format" | "length" | "numeric" | "reserved";
export declare function validateSlug(input: string): SlugValidationError | null;

import { getFileUrl } from "@/lib/file-url";

// ألوان الغلاف الخالص (بديل الصورة) — تُخزَّن في coverKey كـ "color:#HEX".
// نفس فكرة «Solid Color» في المرجع، بلوحة ألوان متسقة مع التصميم.
export const COVER_COLORS = [
	"#9CA3AF",
	"#F97316",
	"#F5C33B",
	"#22C55E",
	"#14857A",
	"#38BDF8",
	"#6366F1",
	"#C026A9",
	"#F472B6",
	"#374151",
] as const;

const COLOR_PREFIX = "color:";

// يبني قيمة coverKey للون خالص
export const colorCoverKey = (hex: string) => `${COLOR_PREFIX}${hex}`;

export const isColorCover = (coverKey?: string | null): coverKey is string =>
	!!coverKey?.startsWith(COLOR_PREFIX);

// يستخرج قيمة اللون من coverKey (أو null)
export const coverColor = (coverKey?: string | null) =>
	isColorCover(coverKey) ? coverKey.slice(COLOR_PREFIX.length) : null;

export type ResolvedCover =
	| { type: "color"; color: string }
	| { type: "image"; url: string }
	| null;

// يحوّل coverKey إلى شكل قابل للعرض: لون خالص، أو صورة، أو لا شيء
export function resolveCover(coverKey?: string | null): ResolvedCover {
	if (!coverKey) return null;
	if (isColorCover(coverKey))
		return { type: "color", color: coverKey.slice(COLOR_PREFIX.length) };
	const url = getFileUrl(coverKey);
	return url ? { type: "image", url } : null;
}

// لون حتمي مشتق من نص (اسم) لخلفية الأحرف الأولى عند غياب الصورة.
// نفس الاسم يعطي نفس اللون دائمًا — لتمييز بصري ثابت بين الموظفين.

// لوحة هادئة متناسقة مع الهوية (خلفية فاتحة + نص داكن للتباين)
const AVATAR_COLORS = [
	{ bg: "#EEF0FE", fg: "#4F46E5" }, // indigo
	{ bg: "#E7F8EE", fg: "#008A2E" }, // green
	{ bg: "#FFF1E7", fg: "#C2410C" }, // orange
	{ bg: "#FCE7F3", fg: "#BE185D" }, // pink
	{ bg: "#E0F2FE", fg: "#0369A1" }, // sky
	{ bg: "#F3E8FF", fg: "#7E22CE" }, // purple
	{ bg: "#FEF3C7", fg: "#B45309" }, // amber
	{ bg: "#DCFCE7", fg: "#15803D" }, // emerald
] as const;

// تجزئة نصية بسيطة ومستقرة (djb2)
function hash(text: string): number {
	let h = 5381;
	for (let i = 0; i < text.length; i++) h = (h * 33) ^ text.charCodeAt(i);
	return Math.abs(h);
}

export function avatarColor(seed: string): { bg: string; fg: string } {
	return AVATAR_COLORS[hash(seed) % AVATAR_COLORS.length];
}

// الأحرف الأولى (حتى حرفين) من الاسم
export function initialsOf(name: string): string {
	return (
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((w) => w[0])
			.join("")
			.toUpperCase() || "?"
	);
}

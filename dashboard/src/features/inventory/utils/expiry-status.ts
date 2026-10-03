export type ExpiryStatus = "expired" | "near" | "ok" | "none";

export interface ExpiryMeta {
	status: ExpiryStatus;
	label: string;
	className: string;
	/** الأيام المتبقّية حتى الانتهاء (سالبة إن انتهت) — null إن لا يوجد تاريخ */
	daysLeft: number | null;
}

/** يشتقّ حالة الصلاحية من تاريخ الانتهاء (افتراضيًا "قريب" خلال 30 يومًا) */
export function getExpiryMeta(
	expiryDate: string | Date | null | undefined,
	nearDays = 30,
): ExpiryMeta {
	if (!expiryDate) {
		return { status: "none", label: "—", className: "text-muted-foreground", daysLeft: null };
	}
	const exp = new Date(expiryDate).getTime();
	const now = Date.now();
	const daysLeft = Math.ceil((exp - now) / 86_400_000);

	if (daysLeft < 0) {
		return { status: "expired", label: "منتهية", className: "text-red-600", daysLeft };
	}
	if (daysLeft <= nearDays) {
		return {
			status: "near",
			label: `تنتهي خلال ${daysLeft} يوم`,
			className: "text-amber-600",
			daysLeft,
		};
	}
	return { status: "ok", label: "سارية", className: "text-emerald-600", daysLeft };
}

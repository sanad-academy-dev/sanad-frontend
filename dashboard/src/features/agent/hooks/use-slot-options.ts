import { useQuery } from "@tanstack/react-query";

import type { PromptSlotKind } from "@/features/agent/types/preset.types";
import { backendUrl } from "@/lib/backend-fetch";

export type SlotOption = { value: string; label: string };

// قوائم ثابتة للفراغات من نوع enum
const ENUM_OPTIONS: Record<string, SlotOption[]> = {
	employmentType: [
		{ value: "FULL_TIME", label: "دوام كامل" },
		{ value: "PART_TIME", label: "دوام جزئي" },
	],
	gender: [
		{ value: "MALE", label: "ذكر" },
		{ value: "FEMALE", label: "أنثى" },
		{ value: "UNKNOWN", label: "غير معروف" },
	],
	taskPriority: [
		{ value: "URGENT", label: "عاجلة" },
		{ value: "HIGH", label: "عالية" },
		{ value: "MEDIUM", label: "متوسطة" },
		{ value: "LOW", label: "منخفضة" },
	],
	taskType: [
		{ value: "ADMINISTRATIVE", label: "إدارية" },
		{ value: "MEDICAL", label: "طبية" },
		{ value: "PHARMACEUTICALS", label: "صيدلانية" },
		{ value: "INVENTORY", label: "مخزون" },
		{ value: "FINANCE", label: "مالية" },
		{ value: "LABORATORY", label: "مختبر" },
		{ value: "COSMETICS", label: "تجميل" },
	],
};

// خرائط مصدر الـ select إلى نقطة نهاية + دالة استخراج (value,label)
const SOURCES: Record<
	string,
	{ url: string; map: (row: Record<string, unknown>) => SlotOption }
> = {
	branches: {
		url: "/api/branches",
		map: (r) => ({ value: String(r.id), label: String(r.name ?? r.arName ?? r.id) }),
	},
	staffRoles: {
		url: "/api/staff-roles",
		map: (r) => ({ value: String(r.id), label: String(r.name ?? r.arName ?? r.id) }),
	},
	specializations: {
		url: "/api/specializations",
		map: (r) => ({ value: String(r.id), label: String(r.arName ?? r.name ?? r.id) }),
	},
	animalTypes: {
		url: "/api/animal-types",
		map: (r) => ({ value: String(r.id), label: String(r.arName ?? r.enName ?? r.id) }),
	},
	patients: {
		url: "/api/patients",
		map: (r) => ({ value: String(r.id), label: String(r.name ?? r.code ?? r.id) }),
	},
	owners: {
		url: "/api/owners",
		map: (r) => ({ value: String(r.id), label: String(r.name ?? r.phone ?? r.id) }),
	},
	staff: {
		url: "/api/staff",
		map: (r) => ({ value: String(r.id), label: String(r.name ?? r.code ?? r.id) }),
	},
	// أعضاء الأكاديمية (مستخدمون) — لإسناد المهام (Task.assignees يرتبط بجدول User لا Staff)
	members: {
		url: "/api/users",
		map: (r) => ({ value: String(r.id), label: String(r.name ?? r.id) }),
	},
	// الزيارات — لأوامر إعادة الجدولة/الحالة (التسمية: الطفل + الكود للتمييز)
	appointments: {
		url: "/api/appointments/list?period=all",
		map: (r) => {
			const patient = (r.patient as { name?: string } | null)?.name ?? "";
			const when = typeof r.startsAt === "string" ? ` — ${r.startsAt.slice(0, 10)}` : "";
			return { value: String(r.id), label: `${patient} (${String(r.code)})${when}` };
		},
	},
	consultationTypes: {
		url: "/api/consultation-types",
		map: (r) => ({ value: String(r.id), label: String(r.name ?? r.id) }),
	},
	// الدورات القابلة للحجز — عناصر ITEM النشطة من شجرة الدورات (كما في نموذج الحجز الفعلي)
	services: {
		url: "/api/services",
		map: (r) => ({
			value: String(r.id),
			label:
				r.price != null ? `${String(r.name)} — ${String(r.price)}` : String(r.name ?? r.id),
		}),
	},
};

export const useSlotOptions = (source: string | undefined, kind: PromptSlotKind) => {
	const config = source ? SOURCES[source] : undefined;

	const { data, isLoading } = useQuery<SlotOption[]>({
		queryKey: ["agent", "slot-options", source ?? "none"],
		enabled: kind === "select" && Boolean(config),
		staleTime: 1000 * 60 * 5,
		queryFn: async () => {
			if (!config) return [];
			const res = await fetch(backendUrl(config.url), {
				credentials: "include",
			});
			if (!res.ok) return [];
			const json = await res.json();
			let rows: Record<string, unknown>[] = Array.isArray(json) ? json : (json.data ?? []);
			// التخصّصات تُعاد كشجرة (فئات لها children)؛ الموظف يُسنَد لتخصص فرعي فقط،
			// لذا نُسطّح الأبناء ونتجاهل الفئات الأم.
			if (source === "specializations") {
				rows = rows.flatMap((cat) =>
					Array.isArray(cat.children) ? (cat.children as Record<string, unknown>[]) : [],
				);
			}
			// الدورات شجرة من 3 مستويات (فئة ← فرعية ← عنصر ITEM)؛ القابل للحجز هو ITEM النشط فقط
			if (source === "services") {
				rows = rows
					.flatMap((cat) =>
						Array.isArray(cat.children)
							? (cat.children as Record<string, unknown>[]).flatMap((sub) =>
									Array.isArray(sub.children)
										? (sub.children as Record<string, unknown>[])
										: [],
								)
							: [],
					)
					.filter((item) => item.isActive !== false);
			}
			return rows.map(config.map);
		},
	});

	if (kind === "enum" && source) {
		return { options: ENUM_OPTIONS[source] ?? [], isLoading: false };
	}

	return { options: data ?? [], isLoading };
};

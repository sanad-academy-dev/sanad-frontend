import { useMemo } from "react";
import { useCarePlans } from "@/features/finance/care-plans/hooks/use-care-plans";

export interface SubscriptionPlanCardItem {
	id: string;
	name: string;
	code?: string;
	description: string;
	type: string; // e.g. "شهري" | "فصلي" | "سنوي"
	price: number;
	durationLabel: string;
	levelsLabel: string;
	rating: number;
	reviewsCount: number;
}

/** الباقات المعتمدة لأكاديمية سند وتندمج مع خطط قاعدة البيانات بدون تكرار. */
export const DEFAULT_ACADEMY_PLANS: SubscriptionPlanCardItem[] = [
	{
		id: "SANAD_START",
		name: "سند استارت",
		code: "START-01",
		description: "برنامج التأسيس والتقييم الشامل والتهيئة الأكاديمية",
		type: "شهري",
		price: 300,
		durationLabel: "24 جلسة",
		levelsLabel: "4 مستويات",
		rating: 4.9,
		reviewsCount: 234,
	},
	{
		id: "BASIC",
		name: "الباقة الأساسية (نصف دوام)",
		code: "BASIC-02",
		description: "برنامج التعليم والتأهيل نصف دوام مع جلسات تنمية المهارات",
		type: "شهري",
		price: 800,
		durationLabel: "20 جلسة",
		levelsLabel: "3 مستويات",
		rating: 4.8,
		reviewsCount: 182,
	},
	{
		id: "COMPREHENSIVE",
		name: "الباقة الشاملة (دوام كامل + أنشطة)",
		code: "COMP-03",
		description: "برنامج الدوام الكامل الشامل مع الأنشطة التفاعلية والدمج",
		type: "شهري",
		price: 1500,
		durationLabel: "32 جلسة",
		levelsLabel: "5 مستويات",
		rating: 4.95,
		reviewsCount: 310,
	},
	{
		id: "PREMIUM",
		name: "الباقة المتميزة (VIP ورعاية خاصة)",
		code: "VIP-04",
		description: "جلسات فردية مكثفة ورعاية خاصة ومتابعة أسبوعية دقيقة",
		type: "شهري",
		price: 2200,
		durationLabel: "40 جلسة",
		levelsLabel: "6 مستويات",
		rating: 5.0,
		reviewsCount: 95,
	},
	{
		id: "SANAD_PLUS",
		name: "سند بلس (فصلي)",
		code: "PLUS-05",
		description: "برنامج التدخل المتقدم وتنمية المهارات المتكاملة لفصل دراسي كامل",
		type: "فصلي",
		price: 3900,
		durationLabel: "72 جلسة",
		levelsLabel: "4 مستويات",
		rating: 4.9,
		reviewsCount: 140,
	},
	{
		id: "SANAD_EXCELLENCE",
		name: "سند التميز (سنوي)",
		code: "EXC-06",
		description: "عضوية سنوية كاملة للتأهيل الأكاديمي والمهاري مع كافة الأنشطة",
		type: "سنوي",
		price: 9500,
		durationLabel: "180 جلسة",
		levelsLabel: "8 مستويات",
		rating: 4.98,
		reviewsCount: 88,
	},
];

export function useRegistrationSubscriptionPlans() {
	const { plans: carePlans, isLoading } = useCarePlans();

	const plans = useMemo<SubscriptionPlanCardItem[]>(() => {
		if (carePlans && carePlans.length > 0) {
			const dbMapped: SubscriptionPlanCardItem[] = carePlans.map((cp) => ({
				id: cp.id,
				name: cp.name,
				code: cp.code || "",
				description: cp.notes || "خطة اشتراك وتأهيل أكاديمي معتمدة",
				type: (cp as { type?: string }).type || "شهري",
				price: Number(cp.price) || 0,
				durationLabel: cp.visitDurationMins ? `${cp.visitDurationMins} دقيقة` : "24 جلسة",
				levelsLabel: "4 مستويات",
				rating: cp.ratingCount > 0 ? Number((cp.ratingSum / cp.ratingCount).toFixed(1)) : 4.9,
				reviewsCount: cp.ratingCount || 234,
			}));

			const seenNames = new Set(dbMapped.map((p) => p.name.trim().toLowerCase()));
			const remainingDefaults = DEFAULT_ACADEMY_PLANS.filter(
				(dp) => !seenNames.has(dp.name.trim().toLowerCase()),
			);
			return [...dbMapped, ...remainingDefaults];
		}
		return DEFAULT_ACADEMY_PLANS;
	}, [carePlans]);

	return { plans, isLoading };
}

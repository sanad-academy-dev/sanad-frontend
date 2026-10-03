import { describe, expect, it } from "vitest";

import {
	FINANCE_NAV_GROUPS,
	FINANCE_NAV_ITEMS,
	FINANCE_NAV_READ_PERMISSIONS,
	type FinanceNavItem,
	financeNavItemPermission,
} from "@/features/finance/navigation/finance-nav";
import { FINANCE_DEFAULT_GRANT, PERMISSIONS } from "@/lib/permissions";
import arTranslations from "@/locales/ar/translation.json";
import enTranslations from "@/locales/en/translation.json";

/**
 * [LY-P0] §10.1 — قفل التنقّل: الولاء داخل تجميع «المالية»، محكوم بصلاحية أماميّة،
 * ويختفي تمامًا لمن لا يملك شيئًا منها.
 */

/** يطابق `app-sidebar.tsx`: الصفّ يظهر لمن يحمل صلاحيته المباشرة. */
const visibleWith = (held: string[]) =>
	FINANCE_NAV_ITEMS.filter(
		(item) => item.gate.kind === "permission" && held.includes(item.gate.permission),
	);

const lookup = (bundle: Record<string, unknown>, key: string): unknown =>
	key.split(".").reduce<unknown>((node, part) => {
		if (node && typeof node === "object" && part in node) {
			return (node as Record<string, unknown>)[part];
		}
		return undefined;
	}, bundle);

const loyaltyItems = FINANCE_NAV_ITEMS.filter((item) => item.url.includes("loyalty"));

describe("[LY-P0] §10.1 — تنقّل الولاء", () => {
	it("يعيش داخل تجميع «المالية» ولا يُنشئ مجموعة عليا جديدة", () => {
		const group = FINANCE_NAV_GROUPS.find((g) => g.key === "loyalty");
		expect(group, "مجموعة الولاء مفقودة من تجميع المالية").toBeTruthy();
		// [LY-P5] المجموعة مكتملة: البرنامج، حركة النقاط، التقارير
		expect(group?.items.map((item) => item.url)).toEqual([
			"/management/loyalty-program",
			"/management/loyalty-ledger",
			"/management/loyalty-reports",
		]);
	});

	it("محكوم بصلاحية المكتب الأمامي، لا بنوع مستند محاسبي (§12)", () => {
		expect(loyaltyItems.length).toBeGreaterThan(0);
		for (const item of loyaltyItems) {
			expect(item.gate.kind, `${item.url} يجب أن يُحكَم بصلاحية مباشرة`).toBe("permission");
			expect(financeNavItemPermission(item)).toMatch(/^loyalty_/);
		}
	});

	/**
	 * الفخّ الذي فرض النوع الثالث: كل عضو في `FINANCE_RESOURCES` يدخل تلقائيًا في
	 * `FINANCE_DEFAULT_GRANT` الممنوح لكل دورٍ قائم. لو حُكم الولاء بذلك النوع لصار
	 * مرئيًّا للجميع — وهو نقيض مرساة §12 (المنح مقصور على `patients_owners.edit`).
	 */
	it("لا تُمنح صلاحيات الولاء لكل دور عبر منحة المالية الافتراضية", () => {
		for (const slug of FINANCE_DEFAULT_GRANT) expect(slug).not.toMatch(/^loyalty_/);
	});

	it("يظهر لحامل الصلاحية ويختفي لمن لا يملكها", () => {
		expect(visibleWith([PERMISSIONS.LOYALTY_SETTINGS_VIEW_FULL]).map((i) => i.url)).toEqual([
			"/management/loyalty-program",
		]);
		expect(visibleWith([PERMISSIONS.PATIENTS_OWNERS_VIEW_FULL])).toEqual([]);
		// حاملُ صلاحية التعديل وحدها لا يرى الصفّ: الرؤية تتبع صلاحية العرض
		expect(visibleWith([PERMISSIONS.LOYALTY_SETTINGS_EDIT])).toEqual([]);
	});

	it("صلاحيته ضمن ما يكشف مدخل «المالية»", () => {
		expect(FINANCE_NAV_READ_PERMISSIONS).toContain(PERMISSIONS.LOYALTY_SETTINGS_VIEW_FULL);
	});

	it("عنوان الصفحة يُشتقّ من مفتاح موجود — وإلّا ظهرت الصفحة بلا عنوان", () => {
		// `_pathless-layout.tsx` يحوّل آخر مقطع إلى `sidebar.items.<camelCase>`
		for (const [lang, bundle] of [
			["ar", arTranslations],
			["en", enTranslations],
		] as const) {
			const value = lookup(bundle as Record<string, unknown>, "sidebar.items.loyaltyProgram");
			expect(typeof value, `${lang}: مفتاح العنوان مفقود`).toBe("string");
			expect(String(value).trim()).not.toBe("");
		}
	});

	it("كل عنوان صفّ ومجموعة يُترجَم في اللغتين (مفاتيح التنقّل تبقى ثنائية، القاعدة ٥)", () => {
		const keys = [
			"finance.nav.groups.loyalty",
			...loyaltyItems.map((item: FinanceNavItem) => item.titleKey),
		];
		for (const key of keys) {
			for (const [lang, bundle] of [
				["ar", arTranslations],
				["en", enTranslations],
			] as const) {
				const value = lookup(bundle as Record<string, unknown>, key);
				expect(typeof value, `${lang}: ${key} مفقود`).toBe("string");
				expect(String(value).trim(), `${lang}: ${key} فارغ`).not.toBe("");
			}
		}
	});
});

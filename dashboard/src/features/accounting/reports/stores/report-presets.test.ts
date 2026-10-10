import { beforeEach, describe, expect, it } from "vitest";

import {
	selectPresets,
	useReportPresetsStore,
} from "@/features/accounting/reports/stores/report-presets.store";

/**
 * [P12.11] Preset behaviour that a user would notice going wrong. Pure — the store is plain
 * state, so this runs in the fast suite.
 */

describe("[P12.11] أعراض التقارير المحفوظة", () => {
	beforeEach(() => {
		useReportPresetsStore.setState({ presets: {} });
	});

	const save = (key: string, name: string, values: Record<string, string>) =>
		useReportPresetsStore.getState().savePreset(key, name, values);
	const presetsOf = (key: string) => useReportPresetsStore.getState().presets[key] ?? [];

	it("يحفظ الفلاتر باسم ويعيدها كما هي", () => {
		save("financial-statements", "الربع الأول", {
			tab: "pnl",
			fromDate: "2026-01-01",
			toDate: "2026-03-31",
		});
		const [preset] = presetsOf("financial-statements");
		expect(preset?.name).toBe("الربع الأول");
		expect(preset?.values.tab).toBe("pnl");
		expect(preset?.values.toDate).toBe("2026-03-31");
	});

	it("الحفظ باسم قائم يستبدله ولا يُنشئ توأمًا", () => {
		save("financial-statements", "عرضي", { tab: "bs" });
		save("financial-statements", "عرضي", { tab: "cf" });
		expect(presetsOf("financial-statements")).toHaveLength(1);
		expect(presetsOf("financial-statements")[0]?.values.tab, "الأحدث يفوز").toBe("cf");
	});

	it("الأسماء الفارغة أو المسافات وحدها لا تُحفَظ", () => {
		save("financial-statements", "   ", { tab: "bs" });
		expect(presetsOf("financial-statements")).toEqual([]);
	});

	it("التقارير معزولة: عرض تقرير لا يظهر في آخر", () => {
		save("financial-statements", "عرضي", { tab: "bs" });
		save("general-ledger", "عرضي", { account: "x" });
		expect(presetsOf("financial-statements")).toHaveLength(1);
		expect(presetsOf("general-ledger")).toHaveLength(1);
		expect(presetsOf("general-ledger")[0]?.values.account).toBe("x");
	});

	// انحدار: شاشة «القوائم المالية» كانت تنهار على الإنتاج بـReact #185 لكل مستخدم لم
	// يحفظ عرضًا بعد. السبب `?? []` داخل مُحدِّد الاشتراك: مصفوفة جديدة في كل نداء، وZustand 5
	// يقارن بـObject.is وحده، فلا تستقرّ المقارنة أبدًا. الشرط المحفوظ هنا هو الثبات المرجعي
	// لا محتوى المصفوفة — لأن المحتوى كان صحيحًا طوال الوقت.
	it("مُحدِّد تقرير بلا عروض يعيد المرجع نفسه في كل نداء", () => {
		const state = useReportPresetsStore.getState();
		const first = selectPresets("financial-statements")(state);
		const second = selectPresets("financial-statements")(state);

		expect(first).toEqual([]);
		expect(
			Object.is(first, second),
			"مرجع جديد كل نداء ⇒ حلقة تصيير لا نهائية (React #185)",
		).toBe(true);
	});

	it("الثبات المرجعي يشمل كل التقارير ويصمد بعد تغيّر تقرير آخر", () => {
		const before = selectPresets("general-ledger")(useReportPresetsStore.getState());
		save("financial-statements", "عرضي", { tab: "bs" });
		const after = selectPresets("general-ledger")(useReportPresetsStore.getState());

		expect(Object.is(before, after), "كتابةٌ في تقرير يجب ألّا تُغيّر مرجع تقرير فارغ آخر").toBe(
			true,
		);
	});

	it("الحذف يُزيل المقصود وحده", () => {
		save("financial-statements", "أ", { tab: "bs" });
		save("financial-statements", "ب", { tab: "pnl" });
		const target = presetsOf("financial-statements").find((row) => row.name === "أ");
		useReportPresetsStore.getState().deletePreset("financial-statements", target?.id ?? "");
		expect(presetsOf("financial-statements").map((row) => row.name)).toEqual(["ب"]);
	});
});

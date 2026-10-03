import { describe, expect, it } from "vitest";

import { CRM_NAV_ITEMS, CRM_NAV_READ_PERMISSIONS } from "@/features/crm/navigation/crm-nav";
import { PERMISSIONS } from "@/lib/permissions";
import arTranslations from "@/locales/ar/translation.json";
import enTranslations from "@/locales/en/translation.json";

/**
 * [CRM-P1] §11.1 lock. The sidebar group, its gating and this test all read `crm-nav.ts`, so
 * what these assert is what a user actually sees.
 */

/** Mirrors `app-sidebar.tsx`: a row shows when the user holds ANY of its read permissions. */
const visibleItems = (held: string[]) =>
	CRM_NAV_ITEMS.filter((item) => item.read.some((permission) => held.includes(permission)));

const lookup = (bundle: Record<string, unknown>, key: string): unknown =>
	key.split(".").reduce<unknown>((node, part) => {
		if (node && typeof node === "object" && part in node) {
			return (node as Record<string, unknown>)[part];
		}
		return undefined;
	}, bundle);

describe("[CRM-P1] «إدارة العملاء» nav config (§11.1)", () => {
	it("gates every destination — no ungated row can exist", () => {
		expect(CRM_NAV_ITEMS.length).toBeGreaterThan(0);
		for (const item of CRM_NAV_ITEMS) {
			expect(item.read.length, `${item.url} declares no permission`).toBeGreaterThan(0);
			for (const permission of item.read) {
				expect(
					Object.values(PERMISSIONS) as string[],
					`${item.url} → ${permission}`,
				).toContain(permission);
			}
		}
	});

	it("self-hides completely with zero CRM permissions (§11.1)", () => {
		// A user loaded with unrelated permissions must not learn the module exists.
		const outsider: string[] = [
			PERMISSIONS.APPOINTMENTS_VIEW_FULL,
			PERMISSIONS.PATIENTS_OWNERS_VIEW_FULL,
		];
		expect(visibleItems(outsider)).toEqual([]);
		expect(CRM_NAV_READ_PERMISSIONS.some((p) => outsider.includes(p))).toBe(false);
	});

	it("degrades to exactly the rows a narrow role can reach", () => {
		// Leads-only: sees العملاء المحتملون, never الصفقات or المهام.
		const leadsOnly = visibleItems([PERMISSIONS.CRM_LEADS_VIEW_LIMITED]);
		expect(leadsOnly.map((i) => i.url)).toEqual(["/crm/leads"]);

		// [CRM-P2] Deals-only: the row appears on its OWN permission, not on the leads one —
		// a deals reader who cannot see leads must still reach the deals board.
		const dealsOnly = visibleItems([PERMISSIONS.CRM_DEALS_VIEW_LIMITED]);
		expect(dealsOnly.map((i) => i.url)).toEqual(["/crm/deals"]);

		// Tasks-only: the mirror case, proving the rows are independently gated.
		const tasksOnly = visibleItems([PERMISSIONS.CRM_TASKS_VIEW_FULL]);
		expect(tasksOnly.map((i) => i.url)).toEqual(["/crm/tasks"]);

		// view_limited must reveal the row exactly as view_full does: they differ in SCOPE,
		// not in whether the screen exists. A regression here hides the screen from every
		// limited user, which is the kind of bug that looks like a permissions problem.
		expect(visibleItems([PERMISSIONS.CRM_LEADS_VIEW_FULL]).map((i) => i.url)).toEqual(
			visibleItems([PERMISSIONS.CRM_LEADS_VIEW_LIMITED]).map((i) => i.url),
		);
		expect(visibleItems([PERMISSIONS.CRM_DEALS_VIEW_FULL]).map((i) => i.url)).toEqual(
			visibleItems([PERMISSIONS.CRM_DEALS_VIEW_LIMITED]).map((i) => i.url),
		);
	});

	it("[CRM-P2] «الصفقات» is declared, in pipeline order, and gated by the deal doctype", () => {
		const deals = CRM_NAV_ITEMS.find((item) => item.url === "/crm/deals");
		expect(deals, "the deals row is missing").toBeTruthy();
		expect(deals?.phase).toBe("CRM-P2");
		expect(deals?.read).toEqual([
			PERMISSIONS.CRM_DEALS_VIEW_FULL,
			PERMISSIONS.CRM_DEALS_VIEW_LIMITED,
		]);
		// §11.1 lists leads → deals → tasks; the sidebar reads this array in order.
		// [CRM-P3] «قوالب البريد» follows them — a fifth row beyond §11.1's four, added by
		// owner decision (§17.2 row 15) because §9.1's templates master needs a screen.
		expect(CRM_NAV_ITEMS.map((item) => item.url)).toEqual([
			"/crm/leads",
			"/crm/deals",
			"/crm/tasks",
			// [CRM-P6] §11.1's fourth item, deferred from CRM-P1 until the §12 reports existed
			"/crm/reports",
			"/crm/email-templates",
			// [CRM-P4] §9.2's channel settings
			"/crm/whatsapp",
			// [CRM-P5] §10.1's response policies
			"/crm/sla-policies",
			// [CRM-P6] §2's five masters + §14's module switch — last, as the module's own settings
			"/crm/settings",
		]);
	});

	it("[CRM-P3] «قوالب البريد» is declared and gated by the settings grouping", () => {
		const templates = CRM_NAV_ITEMS.find((item) => item.url === "/crm/email-templates");
		expect(templates, "the email-templates row is missing").toBeTruthy();
		expect(templates?.phase).toBe("CRM-P3");
		// a master, so it follows §13's `crm_settings` grouping rather than a doctype of its own
		expect(templates?.read).toEqual([PERMISSIONS.CRM_SETTINGS_VIEW_FULL]);
		// and a user with only lead/deal rights must NOT see it
		expect(visibleItems([PERMISSIONS.CRM_LEADS_VIEW_FULL]).map((i) => i.url)).not.toContain(
			"/crm/email-templates",
		);
	});

	it("[CRM-P6] «الإعدادات» exists and is gated by the settings grouping", () => {
		// The masters shipped in CRM-P0 with routes and no screen; this row is the fix, so a
		// regression that drops it silently returns the module to an API-only setup path.
		const settings = CRM_NAV_ITEMS.find((item) => item.url === "/crm/settings");
		expect(settings, "the settings row is missing").toBeTruthy();
		expect(settings?.phase).toBe("CRM-P6");
		expect(settings?.read).toEqual([PERMISSIONS.CRM_SETTINGS_VIEW_FULL]);
		// a lead/deal reader must not reach the module switch
		expect(visibleItems([PERMISSIONS.CRM_LEADS_VIEW_FULL]).map((i) => i.url)).not.toContain(
			"/crm/settings",
		);
	});

	it("reveals the group for any CRM reader", () => {
		for (const permission of CRM_NAV_READ_PERMISSIONS) {
			expect(visibleItems([permission]).length, permission).toBeGreaterThan(0);
		}
	});

	it("every row's label resolves in BOTH locales (nav keys stay bilingual, rule 5)", () => {
		for (const item of CRM_NAV_ITEMS) {
			for (const [lang, bundle] of [
				["ar", arTranslations],
				["en", enTranslations],
			] as const) {
				const value = lookup(bundle as Record<string, unknown>, item.titleKey);
				expect(typeof value, `${lang}: ${item.titleKey} missing`).toBe("string");
				expect(String(value).trim(), `${lang}: ${item.titleKey} blank`).not.toBe("");
			}
		}
	});

	it("points every row at a distinct, absolute CRM route", () => {
		const urls = CRM_NAV_ITEMS.map((i) => i.url);
		expect(new Set(urls).size).toBe(urls.length);
		for (const url of urls) expect(url).toMatch(/^\/crm\//);
	});
});

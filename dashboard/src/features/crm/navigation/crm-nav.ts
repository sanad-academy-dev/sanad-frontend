import {
	IconAlarm,
	IconBrandWhatsapp,
	IconChartHistogram,
	IconChecklist,
	IconMail,
	IconSettings,
	IconTargetArrow,
	IconUsersPlus,
} from "@tabler/icons-react";
import type { ComponentType } from "react";

import { PERMISSIONS } from "@/lib/permissions";

/**
 * [CRM-P1] THE «إدارة العملاء» navigation config (BRD §11.1) — the single place every CRM
 * destination is declared, so the sidebar, its permission gating and the lock test all read
 * the same list instead of three drifting copies (the `finance-nav` precedent).
 *
 * §11.1 names four items: العملاء المحتملون · الصفقات · المهام · التقارير. Only the ones that
 * EXIST are declared here — a sidebar row pointing at a route that does not exist is not a
 * placeholder, it is a 404 the user finds before we do. Each phase adds its own row; the
 * `phase` field records where.
 *
 * [CRM-P6] «الإعدادات» closes the gap this comment carried since CRM-P3: CRM-P0's five
 * masters (§2) and the module switch itself (§14) shipped with HTTP routes and NO screen,
 * so enabling the module meant calling the API by hand. One screen holds all five plus §14.
 *
 * [CRM-P6] §11.1 is COMPLETE: «التقارير» landed with the §12 reports, which is what it was
 * waiting for. Nothing in §11.1 is stubbed or missing any more.
 *
 * [CRM-P4] «واتساب» is a SIXTH row, on the same reasoning: §9.2's channel needs somewhere
 * to paste the provider credentials, and rule 12 will not accept an API-only setup path.
 *
 * [CRM-P3] «قوالب البريد» is a FIFTH row, beyond §11.1's four (owner decision; §17.2 row
 * 15). §9.1 calls templates a MASTER, and a master nobody can edit is not a master — while
 * rule 12 requires the phase's walkthrough to run through the product's own surface, which
 * an API-only table cannot offer. The related finding it carried — CRM-P0's masters having
 * no screen at all — was CLOSED by «الإعدادات» below, which folds all five into one screen.
 */

export type CrmNavItem = {
	/** i18n key — nav labels stay bilingual (the `accounting.nav.*` precedent, rule 5). */
	titleKey: string;
	url: string;
	icon: ComponentType<{ className?: string }>;
	/**
	 * Every destination is gated. `read` lists the permissions that reveal the row: holding
	 * ANY of them is enough, because `view_limited` and `view_full` differ in SCOPE, not in
	 * whether the screen exists.
	 */
	read: string[];
	/** Which phase introduced the row, so the §11.1 gap is documented rather than looking accidental. */
	phase: "CRM-P1" | "CRM-P2" | "CRM-P3" | "CRM-P4" | "CRM-P5" | "CRM-P6";
};

export const CRM_NAV_ITEMS: CrmNavItem[] = [
	{
		titleKey: "crm.nav.leads",
		url: "/crm/leads",
		icon: IconUsersPlus,
		read: [PERMISSIONS.CRM_LEADS_VIEW_FULL, PERMISSIONS.CRM_LEADS_VIEW_LIMITED],
		phase: "CRM-P1",
	},
	{
		titleKey: "crm.nav.deals",
		url: "/crm/deals",
		icon: IconTargetArrow,
		read: [PERMISSIONS.CRM_DEALS_VIEW_FULL, PERMISSIONS.CRM_DEALS_VIEW_LIMITED],
		phase: "CRM-P2",
	},
	{
		titleKey: "crm.nav.tasks",
		url: "/crm/tasks",
		icon: IconChecklist,
		read: [PERMISSIONS.CRM_TASKS_VIEW_FULL, PERMISSIONS.CRM_TASKS_VIEW_LIMITED],
		phase: "CRM-P1",
	},
	{
		titleKey: "crm.nav.reports",
		url: "/crm/reports",
		icon: IconChartHistogram,
		// §12's numbers span the whole clinic, so the settings-grouping read gates them —
		// a holder of `view_limited` must not read totals that include what they cannot see
		read: [PERMISSIONS.CRM_SETTINGS_VIEW_FULL],
		phase: "CRM-P6",
	},
	{
		titleKey: "crm.nav.emailTemplates",
		url: "/crm/email-templates",
		icon: IconMail,
		// a master under the settings grouping (§13), so its own permission gates the row
		read: [PERMISSIONS.CRM_SETTINGS_VIEW_FULL],
		phase: "CRM-P3",
	},
	{
		titleKey: "crm.nav.whatsapp",
		url: "/crm/whatsapp",
		icon: IconBrandWhatsapp,
		// §9.2's channel settings — the same settings grouping as the templates master
		read: [PERMISSIONS.CRM_SETTINGS_VIEW_FULL],
		phase: "CRM-P4",
	},
	{
		titleKey: "crm.nav.slaPolicies",
		url: "/crm/sla-policies",
		icon: IconAlarm,
		// §10.1's policies are masters under the same settings grouping as the rest of §2
		read: [PERMISSIONS.CRM_SETTINGS_VIEW_FULL],
		phase: "CRM-P5",
	},
	{
		titleKey: "crm.nav.settings",
		url: "/crm/settings",
		icon: IconSettings,
		// §2's five masters + §14's module switch — the settings grouping's own permission
		read: [PERMISSIONS.CRM_SETTINGS_VIEW_FULL],
		phase: "CRM-P6",
	},
];

/**
 * Any one of these reveals the «إدارة العملاء» group. With none of them the group self-hides
 * entirely (§11.1) — a user with zero CRM permissions never learns the module exists.
 */
export const CRM_NAV_READ_PERMISSIONS: string[] = [
	...new Set(CRM_NAV_ITEMS.flatMap((item) => item.read)),
];

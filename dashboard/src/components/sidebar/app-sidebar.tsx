"use client";

import {
	IconAmbulance,
	IconBedFlat,
	IconBellRinging,
	IconBodyScan,
	IconCertificate,
	IconChecklist,
	IconCube,
	IconCurrencyDollar,
	IconFileDescription,
	IconHome2,
	IconInbox,
	IconMessage,
	IconPill,
	IconReportAnalytics,
	IconScissors,
	IconSettings,
	IconStethoscope,
	IconTrendingUp,
	IconUser,
	IconUsers,
	IconWorld,
} from "@tabler/icons-react";
import { useLocation, useSearch } from "@tanstack/react-router";
import type * as React from "react";
import { useCallback, useMemo } from "react";
import {
	LuCarrot,
	LuScissorsLineDashed,
	LuStethoscope,
	LuSyringe,
	LuTestTubeDiagonal,
	LuTruck,
} from "react-icons/lu";
import { NavSections } from "@/components/sidebar/nav-sections";
import { NavUser } from "@/components/sidebar/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { CRM_NAV_ITEMS, CRM_NAV_READ_PERMISSIONS } from "@/features/crm/navigation/crm-nav";
import {
	FINANCE_NAV_READ_PERMISSIONS,
	type FinanceNavItem,
} from "@/features/finance/navigation/finance-nav";
import {
	activeGroupKeyOf,
	resolveWorkspaceEntry,
	workspaceGroupLinks,
} from "@/features/finance/navigation/finance-workspace";
import { useFinanceWorkspaceStore } from "@/features/finance/navigation/finance-workspace.store";
import { useInboxUnreadCount } from "@/features/inbox/hooks/use-inbox-queries";
import { useTasksStats } from "@/features/tasks/hooks/use-tasks-stats";
import { useI18n } from "@/hooks/use-i18n";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";
import { accountingPermission } from "@sanad/contracts/accounting/permissions";

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const { t, isRtl } = useI18n();
	const { pathname } = useLocation();
	const side = isRtl ? "right" : "left";
	const dir = isRtl ? "rtl" : "ltr";
	const isActive = useCallback((url: string) => pathname === url, [pathname]);
	const { canView, hasAnyPermission, hasPermission } = usePermissions();
	const { stats: taskStats } = useTasksStats();
	const { unreadCount } = useInboxUnreadCount();
	// ONE money entry: revealed by any destination inside it — a legacy billing resource or
	// an accounting doctype `read` (NFR-5). The workspace header then shows only what they hold.
	const canSeeFinance = hasAnyPermission(FINANCE_NAV_READ_PERMISSIONS);
	// [CRM-P1] §11.1 — «إدارة العملاء» is its own top-level group and SELF-HIDES entirely for
	// a user holding no CRM permission: with none of these, the group never renders, so the
	// module is invisible rather than visible-but-empty.
	const canSeeCrm = hasAnyPermission(CRM_NAV_READ_PERMISSIONS);
	const crmItems = useMemo(
		() =>
			CRM_NAV_ITEMS.filter((item) => hasAnyPermission(item.read)).map((item) => ({
				title: t(item.titleKey),
				url: item.url,
				icon: <item.icon className="size-[14px]" />,
				// detail pages live under the list route — keep the row lit while inside one
				isActive: pathname.startsWith(item.url),
			})),
		[hasAnyPermission, t, pathname],
	);
	// [NAV-2] entering «المالية» lands on the last-visited (still-permitted) destination
	const lastGroupKey = useFinanceWorkspaceStore((s) => s.lastGroupKey);
	const lastByGroup = useFinanceWorkspaceStore((s) => s.lastByGroup);
	// [NAV-2] switching sub-workspaces lands on that group's remembered destination
	const financeItemVisible = useCallback(
		(item: FinanceNavItem) => {
			if (item.gate.kind === "accounting")
				return hasPermission(accountingPermission(item.gate.doctype, "read"));
			// [LY-P0] بوابةٌ على صلاحيةٍ مباشرة من كتالوج المكتب الأمامي (BRD §10.1/§12)
			if (item.gate.kind === "permission") return hasPermission(item.gate.permission);
			return canView(item.gate.resource);
		},
		[hasPermission, canView],
	);
	const financeEntry = useMemo(
		() => resolveWorkspaceEntry(lastGroupKey, lastByGroup, financeItemVisible),
		[lastGroupKey, lastByGroup, financeItemVisible],
	);
	/**
	 * [NAV-3] The sidebar owns the GROUPS (the workspace map); the header owns only the
	 * active group's tabs. Each group links to its remembered destination, falling back to
	 * its first permitted tab — the same `landingFor` the header used for group switching.
	 */
	const financeSearch = useSearch({ strict: false }) as { tab?: string };
	const activeFinanceGroup = activeGroupKeyOf(pathname, financeSearch.tab);
	const financeGroups = useMemo(() => {
		const links = workspaceGroupLinks(financeItemVisible, lastByGroup, activeFinanceGroup);
		return links?.map(({ titleKey, url, search, isActive: active }) => ({
			title: t(titleKey),
			url,
			search,
			isActive: active,
		}));
	}, [financeItemVisible, lastByGroup, t, activeFinanceGroup]);

	const sections = useMemo(
		() => [
			{
				items: [
					{
						title: t("sidebar.items.dashboard"),
						url: "/dashboard",
						icon: <IconHome2 className="size-[14px]" />,
						isActive: isActive("/dashboard"),
					},
					{
						title: t("sidebar.items.inbox"),
						url: "/inbox",
						icon: <IconInbox className="size-[14px]" />,
						isActive: isActive("/inbox"),
						badge: unreadCount || undefined,
					},
					{
						title: t("sidebar.items.tasks"),
						url: "/tasks",
						icon: <IconChecklist className="size-[14px]" />,
						isActive: isActive("/tasks"),
						badge: taskStats.pending + taskStats.inProgress || undefined,
					},
					{
						title: t("sidebar.items.appointments"),
						url: "/appointments",
						icon: <IconReportAnalytics className="size-[14px]" />,
						isActive: isActive("/appointments"),
					},
				],
			},
			{
				title: t("sidebar.sections.services"),
				items: [
					...(canView("patients_owners")
						? [
								{
									title: t("sidebar.items.patients"),
									url: "/services/patients",
									icon: <IconStethoscope className="size-[14px]" />,
									isActive: isActive("/services/patients"),
								},
								{
									title: t("sidebar.items.owners"),
									url: "/services/owners",
									icon: <IconUsers className="size-[14px]" />,
									isActive: isActive("/services/owners"),
								},
							]
						: []),
					{
						title: t("sidebar.items.staff"),
						url: "/services/staff",
						icon: <IconUser className="size-[14px]" />,
						isActive: isActive("/services/staff"),
					},
					{
						title: t("sidebar.items.training"),
						url: "/services/training",
						icon: <IconCertificate className="size-[14px]" />,
						isActive: isActive("/services/training"),
					},
				],
			},
			{
				title: t("sidebar.sections.care"),
				items: [
					{
						title: "التسجيل الرقمي",
						url: "/digital-registration",
						icon: <IconFileDescription className="size-[14px]" />,
						isActive: isActive("/digital-registration"),
					},
					/* {
						title: t("sidebar.items.labTests"),
						url: "/services/lab-tests",
						icon: <LuTestTubeDiagonal className="size-[14px]" />,
						isActive: isActive("/services/lab-tests"),
					},
					{
						title: t("sidebar.items.radiology"),
						url: "/services/radiology",
						icon: <IconBodyScan className="size-[14px]" />,
						isActive: isActive("/services/radiology"),
					},
					{
						title: t("sidebar.items.operations"),
						url: "/services/operations",
						icon: <LuScissorsLineDashed className="size-[14px]" />,
						isActive: isActive("/services/operations"),
					},
					{
						title: t("sidebar.items.vaccinations"),
						url: "/services/vaccinations",
						icon: <LuSyringe className="size-[14px]" />,
						isActive: isActive("/services/vaccinations"),
					},
					{
						title: t("sidebar.items.nutrition"),
						url: "/care/nutrition",
						icon: <LuCarrot className="size-[14px]" />,
						isActive: isActive("/care/nutrition"),
					},
					{
						title: t("sidebar.items.grooming"),
						url: "/care/grooming",
						icon: <IconScissors className="size-[14px]" />,
						isActive: isActive("/care/grooming"),
					},
					...(hasPermission(PERMISSIONS.PHARMACY_VIEW)
						? [
								{
									title: "الصيدلية",
									url: "/care/pharmacy",
									icon: <IconPill className="size-[14px]" />,
									isActive: isActive("/care/pharmacy"),
								},
							]
						: []),
					{
						// [E2] الطوارئ والفرز — نفس سابقة الصيدلية والتنويم: بلا منح افتراضي،
						// فمن لا يملك الصلاحية لا يرى المدخل أصلًا.
						title: "الطوارئ",
						url: "/care/emergency",
						icon: <IconAmbulance className="size-[14px]" />,
						isActive: isActive("/care/emergency"),
					},
					{
						// [IP1] التنويم — الوحدة الجديدة تتبع سابقة الصيدلية: بلا منح
						// افتراضي، فمن لا يملك الصلاحية لا يرى المدخل أصلًا.
						title: "التنويم",
						url: "/care/inpatients",
						icon: <IconBedFlat className="size-[14px]" />,
						isActive: isActive("/care/inpatients"),
					},
					{
						title: t("sidebar.items.mobileClinic"),
						url: "/care/mobile-clinic",
						icon: <LuTruck className="size-[14px]" />,
						isActive: isActive("/care/mobile-clinic"),
					}, */
				],
			},
			{
				title: t("sidebar.sections.management"),
				items: [
					{
						title: t("sidebar.items.messages"),
						url: "/management/messages",
						icon: <IconMessage className="size-[14px]" />,
						isActive: isActive("/management/messages"),
						badge: 4,
					},
					...(canSeeFinance
						? [
								{
									title: t("sidebar.items.finance"),
									url: financeEntry.url,
									search: financeEntry.search,
									icon: <IconCurrencyDollar className="size-[14px]" />,
									// ONE financial home: both halves of the area keep it highlighted
									isActive:
										pathname.startsWith("/management/finance") ||
										pathname.startsWith("/management/accounting"),
									// [NAV-3] the four groups live here; null ⇒ plain link (single-group user)
									...(financeGroups ? { subItems: financeGroups } : {}),
								},
							]
						: []),
					{
						title: t("sidebar.items.inventory"),
						url: "/management/inventory",
						icon: <IconCube className="size-[14px]" />,
						isActive: isActive("/management/inventory"),
					},
					{
						title: t("sidebar.items.marketing"),
						url: "/management/marketing",
						icon: <IconTrendingUp className="size-[14px]" />,
						isActive: isActive("/management/marketing"),
					},
					// [RC0] التذكيرات والاستدعاء — مبوّبة كبقية الوجهات المحميّة. موضعها
					// بعد التسويق مقصود: كلاهما تواصلٌ مع وليّ الأمر، والفرق أنّ هذا مُشغَّل
					// بالاستحقاق السريري لا بحملة.
					...(canView("reminders")
						? [
								{
									title: "التذكيرات والاستدعاء",
									url: "/management/reminders",
									icon: <IconBellRinging className="size-[14px]" />,
									isActive: isActive("/management/reminders"),
								},
							]
						: []),
					{
						title: t("sidebar.items.reports"),
						url: "/management/reports",
						icon: <IconWorld className="size-[14px]" />,
						// صفحة تفاصيل التقرير تعيش تحت المسار نفسه — تبقى «التقارير» مضيئة فيها
						isActive: pathname.startsWith("/management/reports"),
					},
					// خزانة مستندات الأكاديمية — مبوّبة كبقية الوجهات المحميّة؛ الترحيل الرجعي
					// يمنح القراءة لكل دور قائم فلا يفقد أحد الوصول يوم الترحيل
					...(canView("documents")
						? [
								{
									title: t("sidebar.items.documents"),
									url: "/management/documents",
									icon: <IconFileDescription className="size-[14px]" />,
									isActive: isActive("/management/documents"),
								},
							]
						: []),
					{
						title: t("sidebar.items.settings"),
						url: "/management/settings/clinic-information",
						icon: <IconSettings className="size-[14px]" />,
						isActive: isActive("/management/settings"),
					},
				],
			},
			// [CRM-P1] §11.1 — dropped entirely (not rendered empty) when the user holds no
			// CRM permission; `crmItems` is already filtered per row.
			/* ...(canSeeCrm && crmItems.length > 0
				? [{ title: t("sidebar.sections.crm"), items: crmItems }]
				: []), */
		],
		[
			canSeeCrm,
			crmItems,
			t,
			isActive,
			canView,
			taskStats,
			unreadCount,
			canSeeFinance,
			financeEntry,
			financeGroups,
			pathname,
			hasPermission,
		],
	);

	return (
		<Sidebar
			variant="inset"
			collapsible="icon"
			side={side}
			dir={dir}
			{...props}
		>
			<SidebarHeader className="">
				<SidebarMenu>
					<SidebarMenuItem className="px-1">
						<div className="flex items-center gap-2">
							<div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
								<LuStethoscope className="size-4" />
							</div>
							<div className="grid flex-1 text-start text-sm leading-tight">
								<span className="truncate text-primary font-bold text-lg">أكاديمية سند</span>
							</div>
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavSections sections={sections} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser />
			</SidebarFooter>
			{/* سحب الحافة الداخلية يفتح/يغلق الشريط — بدون تغيير حرّ للعرض */}
			<SidebarRail />
		</Sidebar>
	);
}

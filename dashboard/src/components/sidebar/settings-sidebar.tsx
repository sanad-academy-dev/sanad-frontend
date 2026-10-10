"use client";

import {
	IconBell,
	IconBolt,
	IconBriefcase,
	IconBuildingHospital,
	IconCalendar,
	IconCircleDot,
	IconClock,
	IconCreditCardPay,
	IconFileInvoice,
	IconLock,
	IconPaw,
	IconPlugConnected,
	IconShield,
	IconSparkles,
	IconStethoscope,
	IconTools,
	IconUsers,
	IconVaccine,
} from "@tabler/icons-react";
import { Link, useLocation } from "@tanstack/react-router";
import type * as React from "react";
import { useCallback, useMemo } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useI18n } from "@/hooks/use-i18n";

export function SettingsSidebar(props: React.ComponentProps<typeof Sidebar>) {
	const { t, isRtl } = useI18n();
	const { pathname } = useLocation();
	const side = isRtl ? "right" : "left";
	const dir = isRtl ? "rtl" : "ltr";
	const isActive = useCallback((url: string) => pathname === url, [pathname]);

	const sections = useMemo(
		() => [
			{
				items: [
					{
						title: t("settings.sidebar.items.clinicInformation"),
						url: "/management/settings/clinic-information",
						icon: <IconBuildingHospital className="size-[14px]" />,
						isActive: isActive("/management/settings/clinic-information"),
					},
					{
						title: t("settings.sidebar.items.notifications"),
						url: "/management/settings/notifications",
						icon: <IconBell className="size-[14px]" />,
						isActive: isActive("/management/settings/notifications"),
					},
					{
						title: t("settings.sidebar.items.securityAccess"),
						url: "/management/settings/security-access",
						icon: <IconLock className="size-[14px]" />,
						isActive: isActive("/management/settings/security-access"),
					},
					{
						title: t("settings.sidebar.items.integrationsAccounts"),
						url: "/management/settings/integrations-accounts",
						icon: <IconPlugConnected className="size-[14px]" />,
						isActive: isActive("/management/settings/integrations-accounts"),
					},
				],
			},
			{
				title: t("settings.sidebar.items.features"),
				items: [
					{
						title: t("settings.sidebar.items.cases"),
						url: "/management/settings/cases",
						icon: <IconCircleDot className="size-[14px]" />,
						isActive: isActive("/management/settings/cases"),
					},
					{
						title: t("settings.sidebar.items.specialties"),
						url: "/management/settings/specialties",
						icon: <IconBriefcase className="size-[14px]" />,
						isActive: isActive("/management/settings/specialties"),
					},
					{
						title: t("settings.sidebar.items.services"),
						url: "/management/settings/services",
						icon: <IconTools className="size-[14px]" />,
						isActive: isActive("/management/settings/services"),
					},
					{
						title: t("settings.sidebar.items.branchesTeams"),
						url: "/management/settings/branches-teams",
						icon: <IconUsers className="size-[14px]" />,
						isActive: isActive("/management/settings/branches-teams"),
					},
					{
						title: t("settings.sidebar.items.attendance"),
						url: "/management/settings/attendance",
						icon: <IconClock className="size-[14px]" />,
						isActive: isActive("/management/settings/attendance"),
					},
					{
						title: "الذكاء الاصطناعي والوكلاء",
						url: "/management/settings/ai-agents",
						icon: <IconSparkles className="size-[14px]" />,
						isActive: isActive("/management/settings/ai-agents"),
					},
					{
						title: t("settings.sidebar.items.automation"),
						url: "/management/settings/automation",
						icon: <IconBolt className="size-[14px]" />,
						isActive: isActive("/management/settings/automation"),
					},
					{
						title: t("settings.sidebar.items.digitalPayments"),
						url: "/management/settings/digital-payments",
						icon: <IconCreditCardPay className="size-[14px]" />,
						isActive: isActive("/management/settings/digital-payments"),
					},
					// [NAV-4] «إعدادات الحسابات» moved into the «المالية» workspace
					// (الإعدادات المالية → إعدادات المحاسبة). Listing it here too would jump the
					// user out of the settings shell — the same defect in reverse.
				],
			},
			{
				title: t("settings.sidebar.sections.system"),
				items: [
					{
						title: t("settings.sidebar.items.medicalProtocols"),
						url: "/management/settings/medical-protocols",
						icon: <IconStethoscope className="size-[14px]" />,
						isActive: isActive("/management/settings/medical-protocols"),
					},
					{
						title: t("settings.sidebar.items.scheduling"),
						url: "/management/settings/scheduling",
						icon: <IconCalendar className="size-[14px]" />,
						isActive: isActive("/management/settings/scheduling"),
					},
					{
						title: "السلالات",
						url: "/management/settings/animals",
						icon: <IconPaw className="size-[14px]" />,
						isActive: isActive("/management/settings/animals"),
					},
					{
						title: t("settings.sidebar.items.drugStandards"),
						url: "/management/settings/drug-standards",
						icon: <IconVaccine className="size-[14px]" />,
						isActive: isActive("/management/settings/drug-standards"),
					},
					{
						title: t("settings.sidebar.items.rolesPermissions"),
						url: "/management/settings/roles-permissions",
						icon: <IconShield className="size-[14px]" />,
						isActive: isActive("/management/settings/roles-permissions"),
					},
					{
						title: t("settings.sidebar.items.subscriptionInvoices"),
						url: "/management/settings/subscription-invoices",
						icon: <IconFileInvoice className="size-[14px]" />,
						isActive: isActive("/management/settings/subscription-invoices"),
					},
				],
			},
		],
		[t, isActive],
	);

	return (
		<Sidebar
			collapsible="none"
			side={side}
			dir={dir}
			className="border-e border-sidebar-border"
			{...props}
		>
			<SidebarContent className="min-h-0 flex-1 overflow-y-auto overscroll-contain pt-2">
				{sections.map((section, sectionIndex) => (
					<SidebarGroup
						key={section.title ?? `section-${sectionIndex}`}
						className="px-3 py-1"
					>
						{section.title && (
							<SidebarGroupLabel className="mb-2 px-4 text-[10px] font-semibold text-[#9B9B9D]">
								{section.title}
							</SidebarGroupLabel>
						)}
						<SidebarGroupContent>
							<SidebarMenu className="gap-1">
								{section.items.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											isActive={item.isActive}
											className="h-7 rounded-[4px] px-2.5 text-[11px] font-semibold text-[#08090A] bg-transparent hover:bg-[#F0F0F0] hover:text-[#08090A] data-[active=true]:bg-[#F0F0F0] data-[active=true]:text-[#08090A]"
										>
											<Link
												to={item.url}
												className="flex items-center gap-2"
											>
												{item.icon}
												<span>{item.title}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
		</Sidebar>
	);
}

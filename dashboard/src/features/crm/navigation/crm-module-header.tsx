// تبويبات وحدة إدارة العملاء تُحقَن في الهيدر العلوي (جنب اسم الوحدة) عبر portal —
// نفس بنية `staff-header.tsx` وقيمها البصرية حرفيًا، لأنّ الشريطين يظهران في المكان
// نفسه من الشاشة وأيّ فارق بينهما يُرى مباشرة (قرار وليّ الأمر: الثلاثي يُطابَق حرفيًا).
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { CRM_NAV_ITEMS } from "@/features/crm/navigation/crm-nav";
import { useI18n } from "@/hooks/use-i18n";
import { usePageHeaderTakeover } from "@/hooks/use-page-header-takeover";
import { usePermissions } from "@/hooks/use-permissions";
import { cn } from "@/lib/utils";

/**
 * [UI] The «إدارة العملاء» header strip — the module name plus its destinations, mirroring
 * «الموارد البشرية».
 *
 * The derived title is SUPPRESSED: the layout builds it from the last path segment, which
 * would print the page's own name here (and, for `/crm/tasks`, «مهامي» — the personal inbox,
 * because `/tasks` owns that key). The module name is what belongs beside the tabs.
 *
 * Rows are filtered by the SAME permissions as the sidebar group (`CRM_NAV_ITEMS[].read`),
 * so this strip can never offer a destination the sidebar hides.
 */
export function CrmModuleHeader({ active }: { active: string }) {
	const { t } = useI18n();
	const { hasAnyPermission } = usePermissions();
	const setTitleSuppressed = usePageHeaderTakeover((state) => state.setTitleSuppressed);
	const [slot, setSlot] = useState<HTMLElement | null>(null);

	useEffect(() => {
		setSlot(document.getElementById("page-header-slot"));
	}, []);

	useEffect(() => {
		setTitleSuppressed(true);
		return () => setTitleSuppressed(false);
	}, [setTitleSuppressed]);

	if (!slot) return null;

	const items = CRM_NAV_ITEMS.filter((item) => hasAnyPermission(item.read));

	return createPortal(
		<div
			className="flex items-center gap-[12px]"
			dir="rtl"
		>
			<span className="font-semibold text-base text-foreground">{t("crm.nav.group")}</span>

			{/* فاصل بين اسم الوحدة والتبويبات — مطابق لشاشة الموارد البشرية */}
			<span className="h-[18px] w-px bg-[#E5E7EB]" />

			<nav className="flex items-center gap-[3.49px]">
				{items.map((item) => {
					const isActive = active === item.url;
					return (
						<Link
							key={item.url}
							to={item.url}
							className={cn(
								"flex h-[25px] items-center justify-center gap-[4px] rounded-[4px] px-[14px] text-[11px] font-medium leading-[16px]",
								isActive
									? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"
									: "text-[#6B7280]",
							)}
						>
							{t(item.titleKey)}
						</Link>
					);
				})}
			</nav>
		</div>,
		slot,
	);
}

import { useNavigate } from "@tanstack/react-router";

import { MembersTab } from "@/features/accounting/memberships/components/members-tab";
import { PlansTab } from "@/features/accounting/memberships/components/plans-tab";
import { cn } from "@/lib/utils";

/**
 * [MI-P1] ONE «العضويات» hub (MI BRD §11 — inside المالية, no new sidebar group).
 * Two tabs in MI-P1: plans + members. The entitlements view arrives with the MI-P2
 * pricing seam — until units can actually be consumed, a standalone tab would show a
 * table of zeros and teach operators to ignore it.
 */

export const MEMBERSHIP_TABS = [
	{ value: "members", label: "الأعضاء" },
	{ value: "plans", label: "الخطط" },
] as const;

export type MembershipTab = (typeof MEMBERSHIP_TABS)[number]["value"];
export const isMembershipTab = (value: unknown): value is MembershipTab =>
	MEMBERSHIP_TABS.some((tab) => tab.value === value);

export const MembershipsPage = ({
	tab,
	enrollOwnerId,
	enrollPlanId,
}: {
	tab: MembershipTab;
	/** [CRM-P2] §7.3 deep-link prefill, passed straight through to the members tab. */
	enrollOwnerId?: string;
	enrollPlanId?: string;
}) => {
	const navigate = useNavigate();
	const setTab = (next: MembershipTab) =>
		navigate({ to: "/management/accounting/memberships", search: { tab: next } });

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			{/* العنوان يأتي من رأس التخطيط (sidebar.items.memberships)؛ الوصف يبقى لأنّه يشرح
			    آلية مالية غير بديهية — المرجع معيار للبنية لا ذريعة لحذف محتوى مفيد */}
			<div className="px-4 pt-3">
				<p className="text-muted-foreground text-sm">
					خطط عضويات أولياء الأمور ورسومها الدورية: التسجيل يُصدر فاتورة عبر محرك الاشتراكات، والسداد
					هو ما يُفعّل العضوية — المزايا تُطبَّق على التسعير في المرحلة القادمة.
				</p>
			</div>

			{/* the hub's in-page tab strip (§7.8 hub rule) — the same pill treatment */}
			<nav
				className="flex flex-wrap items-center gap-[3.49px] border-t px-4 py-2"
				dir="rtl"
			>
				{MEMBERSHIP_TABS.map((entry) => (
					<button
						key={entry.value}
						type="button"
						onClick={() => setTab(entry.value)}
						className={cn(
							"flex h-[25px] items-center justify-center rounded-[4px] px-[14px] font-medium text-[11px] leading-[16px]",
							tab === entry.value
								? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"
								: "text-[#6B7280]",
						)}
					>
						{entry.label}
					</button>
				))}
			</nav>

			{tab === "members" && (
				<MembersTab
					enrollOwnerId={enrollOwnerId}
					enrollPlanId={enrollPlanId}
				/>
			)}
			{tab === "plans" && <PlansTab />}
		</div>
	);
};

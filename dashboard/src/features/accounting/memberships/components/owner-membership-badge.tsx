import { Badge } from "@/components/ui/badge";
import { MEMBERSHIP_STATUS_META } from "@/features/accounting/memberships/components/membership-status-meta";
import { useOwnerMembership } from "@/features/accounting/memberships/hooks/use-memberships";
import { formatDisplayDate } from "@/features/accounting/utils/format-amount";

/**
 * [MI-P1] The owner-profile membership badge (§2.7): tier name + status chip + a one-line
 * benefits summary while benefits apply (ACTIVE/PAST_DUE — grace keeps them, §5.2).
 * Renders nothing when the owner has no live membership, so it is safe to mount
 * unconditionally.
 *
 * [MI-P6] §11 specifies the chip as "tier, status, **remaining units**" — so the period
 * and the live entitlement counters join it. They come from the SAME `by-owner` payload
 * the badge already fetched (`MembershipDetailResponse` carries `entitlements`), so the
 * richer card costs no extra request.
 */

const BENEFIT_WORD: Record<string, string> = {
	SERVICE_DISCOUNT: "خصم دورة",
	PRODUCT_DISCOUNT: "خصم منتجات",
	INCLUDED_UNITS: "وحدات مشمولة",
	PRIORITY_BOOKING: "أولوية حجز",
	PERK: "امتياز",
};

export const OwnerMembershipBadge = ({ ownerId }: { ownerId: string }) => {
	const { membership } = useOwnerMembership(ownerId);
	if (!membership) return null;

	const meta = MEMBERSHIP_STATUS_META[membership.status];
	const benefitsApply = membership.status === "ACTIVE" || membership.status === "PAST_DUE";
	const summary = benefitsApply
		? membership.benefits
				.map((benefit) => benefit.labelAr ?? BENEFIT_WORD[benefit.benefitType])
				.filter(Boolean)
				.join(" · ")
		: null;

	// §11 «remaining units» — only the rows that actually grant units say anything
	const units = membership.entitlements
		.map((entitlement) => ({
			label:
				entitlement.benefit.service?.name ?? entitlement.benefit.labelAr ?? "وحدات مشمولة",
			left: entitlement.unitsGranted - entitlement.unitsConsumed,
			granted: entitlement.unitsGranted,
		}))
		.filter((row) => row.granted > 0);

	return (
		<div className="flex flex-col gap-1.5 rounded-md border bg-muted/30 px-3 py-2">
			<div className="flex flex-wrap items-center gap-2">
				<span className="font-medium text-sm">عضوية «{membership.plan.name}»</span>
				<Badge variant={meta.variant}>{meta.label}</Badge>
				{summary && <span className="text-muted-foreground text-xs">{summary}</span>}
			</div>
			{benefitsApply && (
				<div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-muted-foreground text-xs">
					<span
						className="tabular-nums"
						dir="ltr"
					>
						{formatDisplayDate(membership.currentPeriodStart)} →{" "}
						{formatDisplayDate(membership.currentPeriodEnd)}
					</span>
					{units.map((row) => (
						<span
							key={row.label}
							className="tabular-nums"
						>
							{row.label}: متبقٍ {row.left} من {row.granted}
						</span>
					))}
				</div>
			)}
		</div>
	);
};

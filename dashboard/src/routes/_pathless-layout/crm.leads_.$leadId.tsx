import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AssigneePicker } from "@/features/crm/components/assignee-picker";
import { ConvertLeadDialog } from "@/features/crm/components/convert-lead-dialog";
import { LeadStatusPill } from "@/features/crm/components/lead-status-pill";
import { LeadTimeline } from "@/features/crm/components/lead-timeline";
import { SlaResponseControl } from "@/features/crm/components/sla-response-control";
import {
	useAssignLead,
	useCrmLead,
	useMarkLeadResponded,
} from "@/features/crm/hooks/use-crm-leads";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";

/**
 * [CRM-P1] §11.4 — the lead page: header (name, status pill, assignee) · details panel ·
 * the §8.3 timeline with composer tabs. The layout is FIXED in v1; the reference's layout
 * builder is [P2] (§17.2 row 4).
 *
 * The `leads_` segment opts OUT of the list route's layout (TanStack's trailing-underscore
 * escape). Without it this page nests under `/crm/leads`, inherits its required `view`
 * search param, and every link to a lead would have to carry `?view=` — which is the list
 * screen's state, not this one's.
 */
export const Route = createFileRoute("/_pathless-layout/crm/leads_/$leadId")({
	component: CrmLeadPage,
});

const Detail = ({
	label,
	value,
	ltr,
}: {
	label: string;
	value?: string | null;
	ltr?: boolean;
}) => (
	<div className="flex items-baseline gap-2 py-1">
		<span className="text-[11px] text-muted-foreground">{label}</span>
		<span
			dir={ltr ? "ltr" : undefined}
			className="text-[12px] font-medium"
		>
			{value && String(value).length > 0 ? value : "—"}
		</span>
	</div>
);

function CrmLeadPage() {
	const { leadId } = Route.useParams();
	const { lead, isLoading } = useCrmLead(leadId);
	const { hasPermission } = usePermissions();
	const { assignLead, isAssigning } = useAssignLead();
	const { markResponded, isMarkingResponded } = useMarkLeadResponded();
	const [convertOpen, setConvertOpen] = useState(false);

	if (isLoading) {
		return <p className="p-8 text-center text-[12px] text-muted-foreground">جارٍ التحميل...</p>;
	}
	if (!lead) {
		return (
			<p className="p-8 text-center text-[12px] text-muted-foreground">
				العميل المحتمل غير موجود
			</p>
		);
	}

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
			<header className="flex flex-wrap items-center gap-3">
				<h1 className="text-[15px] font-semibold">{lead.fullName}</h1>
				<LeadStatusPill
					name={lead.status.name}
					color={lead.status.color}
				/>
				<span className="text-[11px] text-muted-foreground">{lead.code}</span>
				{/* §11.4 — الترويسة تحمل الشارة كما ينصّ عليه، ومعها فعلُها (§10.3) */}
				<SlaResponseControl
					responseBy={lead.responseBy}
					firstRespondedAt={lead.firstRespondedAt}
					canEdit={hasPermission(PERMISSIONS.CRM_LEADS_EDIT)}
					isPending={isMarkingResponded}
					onMarkResponded={() => markResponded(lead.id)}
				/>
				{/* §3.2 — الإسناد يدويّ في v1، وهذا سطحه الوحيد في المنتج */}
				<AssigneePicker
					value={lead.ownerUserId}
					valueName={lead.ownerUser?.name ?? null}
					canAssign={hasPermission(PERMISSIONS.CRM_LEADS_ASSIGN)}
					disabled={isAssigning}
					onAssign={(ownerUserId) => assignLead({ id: lead.id, ownerUserId })}
				/>
				<div className="ms-auto flex items-center gap-2">
					{/* BR-C3.5 — a converted lead is read-only and points at its deal instead */}
					{lead.convertedDealId ? (
						<Button
							asChild
							size="sm"
							variant="outline"
							className="h-8 text-[12px]"
						>
							<Link
								to="/crm/deals/$dealId"
								params={{ dealId: lead.convertedDealId }}
							>
								فتح الصفقة
							</Link>
						</Button>
					) : hasPermission(PERMISSIONS.CRM_DEALS_CREATE) ? (
						// §5 — converting creates a deal, so it is gated by the DEAL permission
						<Button
							size="sm"
							className="h-8 text-[12px]"
							onClick={() => setConvertOpen(true)}
						>
							تحويل إلى صفقة
						</Button>
					) : null}
				</div>
			</header>

			<div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[20rem_1fr]">
				<Card className="h-fit">
					<CardHeader>
						<CardTitle className="text-[13px]">التفاصيل</CardTitle>
					</CardHeader>
					<CardContent className="pt-0">
						<Detail
							label="الجوال"
							value={lead.mobile}
							ltr
						/>
						<Detail
							label="هاتف آخر"
							value={lead.phone}
							ltr
						/>
						<Detail
							label="البريد"
							value={lead.email}
							ltr
						/>
						<Detail
							label="المدينة"
							value={lead.city}
						/>
						<Detail
							label="العنوان"
							value={lead.address}
						/>
						<Detail
							label="المصدر"
							value={lead.source?.name}
						/>
						<Detail
							label="نوع الطفل"
							value={lead.petSpecies}
						/>
						<Detail
							label="عدد الأطفال"
							value={
								lead.petCount === null || lead.petCount === undefined
									? null
									: String(lead.petCount)
							}
						/>
						{/* BR-C3.3 — a lost lead must carry its reason, so the page shows it plainly */}
						{lead.lostReason ? (
							<Detail
								label="سبب الفقد"
								value={lead.lostReason.name}
							/>
						) : null}
						{lead.lostNotes ? (
							<Detail
								label="ملاحظات الفقد"
								value={lead.lostNotes}
							/>
						) : null}
					</CardContent>
				</Card>

				<Card className="min-h-0">
					<CardHeader>
						<CardTitle className="text-[13px]">النشاط</CardTitle>
					</CardHeader>
					<CardContent className="min-h-0 overflow-auto">
						<LeadTimeline leadId={lead.id} />
					</CardContent>
				</Card>
			</div>

			<ConvertLeadDialog
				leadId={lead.id}
				leadName={lead.fullName}
				open={convertOpen}
				onOpenChange={setConvertOpen}
			/>
		</div>
	);
}

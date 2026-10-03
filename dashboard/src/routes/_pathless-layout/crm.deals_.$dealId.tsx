import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import { AssigneePicker } from "@/features/crm/components/assignee-picker";
import { DealProductsEditor } from "@/features/crm/components/deal-products-editor";
import { DealWinDialog } from "@/features/crm/components/deal-win-dialog";
import { LeadStatusPill } from "@/features/crm/components/lead-status-pill";
import { LeadTimeline } from "@/features/crm/components/lead-timeline";
import { SlaResponseControl } from "@/features/crm/components/sla-response-control";
import {
	useAssignDeal,
	useCrmDeal,
	useMarkDealResponded,
	useSetDealProbability,
} from "@/features/crm/hooks/use-crm-deals";
import { usePermissions } from "@/hooks/use-permissions";
import { PERMISSIONS } from "@/lib/permissions";

/**
 * [CRM-P2] §11.5 — the deal page: the lead page's fixed layout PLUS the three things a deal
 * has and a lead does not — the products editor (§6), probability/expected value (BR-C4.2),
 * and the win button (§7).
 *
 * The `deals_` segment opts OUT of the list route's layout (TanStack's trailing-underscore
 * escape). Without it this page nests under `/crm/deals`, inherits its required `view`
 * search param, and every link to a deal would have to carry the list screen's state.
 */
export const Route = createFileRoute("/_pathless-layout/crm/deals_/$dealId")({
	component: CrmDealPage,
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
			className="font-medium text-[12px]"
		>
			{value && String(value).length > 0 ? value : "—"}
		</span>
	</div>
);

function CrmDealPage() {
	const { dealId } = Route.useParams();
	const { deal, isLoading } = useCrmDeal(dealId);
	const { setProbability, isSettingProbability } = useSetDealProbability();
	const { hasPermission } = usePermissions();
	const [winOpen, setWinOpen] = useState(false);
	const [probabilityDraft, setProbabilityDraft] = useState<string | null>(null);

	const canEdit = hasPermission(PERMISSIONS.CRM_DEALS_EDIT);
	const { assignDeal, isAssigning } = useAssignDeal();
	const { markResponded, isMarkingResponded } = useMarkDealResponded();

	if (isLoading) {
		return <p className="p-8 text-center text-[12px] text-muted-foreground">جارٍ التحميل...</p>;
	}
	if (!deal) {
		return (
			<p className="p-8 text-center text-[12px] text-muted-foreground">الصفقة غير موجودة</p>
		);
	}

	const isWon = deal.status.kind === "WON";

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-4 p-4">
			<header className="flex flex-wrap items-center gap-3">
				<h1 className="font-semibold text-[15px]">{deal.fullName}</h1>
				<LeadStatusPill
					name={deal.status.name}
					color={deal.status.color}
				/>
				<span className="text-[11px] text-muted-foreground">{deal.code}</span>
				{/* §11.4 — الترويسة تحمل الشارة كما ينصّ عليه، ومعها فعلُها (§10.3) */}
				<SlaResponseControl
					responseBy={deal.responseBy}
					firstRespondedAt={deal.firstRespondedAt}
					canEdit={canEdit}
					isPending={isMarkingResponded}
					onMarkResponded={() => markResponded(deal.id)}
				/>
				{/* §3.2 — الإسناد يدويّ في v1، وهذا سطحه الوحيد في المنتج */}
				<AssigneePicker
					value={deal.ownerUserId}
					valueName={deal.ownerUser?.name ?? null}
					canAssign={hasPermission(PERMISSIONS.CRM_DEALS_ASSIGN)}
					disabled={isAssigning}
					onAssign={(ownerUserId) => assignDeal({ id: deal.id, ownerUserId })}
				/>
				<div className="ms-auto flex items-center gap-2">
					{deal.wonOwner ? (
						// §7.2 — after the win the deal points at the Owner it handed off to
						<span className="text-[11px] text-muted-foreground">
							وليّ الأمر: {deal.wonOwner.name} ({deal.wonOwner.code})
						</span>
					) : null}
					{canEdit && !isWon ? (
						<Button
							size="sm"
							className="h-8 text-[12px]"
							onClick={() => setWinOpen(true)}
						>
							كسب الصفقة
						</Button>
					) : null}
				</div>
			</header>

			<div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[20rem_1fr]">
				<div className="space-y-4">
					<Card className="h-fit">
						<CardHeader>
							<CardTitle className="text-[13px]">التفاصيل</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<Detail
								label="الجوال"
								value={deal.mobile}
								ltr
							/>
							<Detail
								label="البريد"
								value={deal.email}
								ltr
							/>
							<Detail
								label="المدينة"
								value={deal.city}
							/>
							<Detail
								label="نوع الطفل"
								value={deal.petSpecies}
							/>
							{/* §5 — snapshot copied at conversion; on a direct deal it is the one
							    the creator picked. Either way it is the deal's own column now. */}
							<Detail
								label="المصدر"
								value={deal.source?.name ?? null}
							/>
							{deal.lead ? (
								<div className="flex items-baseline gap-2 py-1">
									<span className="text-[11px] text-muted-foreground">أصل الصفقة</span>
									<Link
										to="/crm/leads/$leadId"
										params={{ leadId: deal.lead.id }}
										className="font-medium text-[12px] hover:underline"
									>
										{deal.lead.code}
									</Link>
								</div>
							) : null}
							{deal.lostReason ? (
								<Detail
									label="سبب الفقد"
									value={deal.lostReason.name}
								/>
							) : null}
						</CardContent>
					</Card>

					<Card className="h-fit">
						<CardHeader>
							<CardTitle className="text-[13px]">القيمة والتوقّع</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3 pt-0">
							<Detail
								label="قيمة الصفقة"
								value={formatAmount(String(deal.dealValue))}
							/>
							<Detail
								label="القيمة المتوقّعة"
								value={formatAmount(String(deal.expectedValue))}
							/>
							{/* BR-C4.2 — editing the probability RAISES the override flag, and the
							    flag is what stops the next stage move from re-defaulting it. */}
							<div className="flex flex-wrap items-center gap-2">
								<span className="text-[11px] text-muted-foreground">نسبة النجاح</span>
								<Input
									dir="ltr"
									inputMode="numeric"
									className="h-8 w-20 text-start text-[12px]"
									disabled={!canEdit || isSettingProbability}
									value={probabilityDraft ?? String(Number(deal.probability))}
									onChange={(event) => setProbabilityDraft(event.target.value)}
								/>
								<span className="text-[11px] text-muted-foreground">٪</span>
								{canEdit ? (
									<>
										<Button
											type="button"
											size="sm"
											variant="outline"
											className="h-8 text-[12px]"
											disabled={isSettingProbability || probabilityDraft === null}
											onClick={() => {
												void setProbability({
													id: deal.id,
													probability: Number(probabilityDraft),
												});
												setProbabilityDraft(null);
											}}
										>
											حفظ
										</Button>
										<Button
											type="button"
											size="sm"
											variant="ghost"
											className="h-8 text-[12px]"
											disabled={isSettingProbability || !deal.probabilityOverridden}
											onClick={() => {
												void setProbability({ id: deal.id, reset: true });
												setProbabilityDraft(null);
											}}
										>
											إعادة الافتراضي
										</Button>
									</>
								) : null}
							</div>
							{deal.probabilityOverridden ? (
								<p className="text-[11px] text-muted-foreground">
									النسبة معدَّلة يدويًا — لن تتغيّر تلقائيًا عند نقل المرحلة
								</p>
							) : null}
						</CardContent>
					</Card>
				</div>

				<div className="min-h-0 space-y-4">
					<Card>
						<CardHeader>
							<CardTitle className="text-[13px]">البنود</CardTitle>
						</CardHeader>
						<CardContent>
							<DealProductsEditor
								deal={deal}
								canEdit={canEdit}
							/>
						</CardContent>
					</Card>

					<Card className="min-h-0">
						<CardHeader>
							<CardTitle className="text-[13px]">النشاط</CardTitle>
						</CardHeader>
						<CardContent className="min-h-0 overflow-auto">
							<LeadTimeline
								leadId={deal.id}
								referenceType="DEAL"
							/>
						</CardContent>
					</Card>
				</div>
			</div>

			<DealWinDialog
				deal={deal}
				open={winOpen}
				onOpenChange={setWinOpen}
			/>
		</div>
	);
}

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { MEMBERSHIP_STATUS_META } from "@/features/accounting/memberships/components/membership-status-meta";
import {
	useCancelMembership,
	useMembership,
	useMembershipPlans,
	useSchedulePlanChange,
} from "@/features/accounting/memberships/hooks/use-memberships";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";

/**
 * [MI-P1] Member detail sheet: snapshot, current benefits (read-only), current-period
 * entitlements ([MI-P2]: consumed is live — it moves at payment per BR-M5.3.1), the backing
 * invoice reference, cancel with a MANDATORY reason (BR-M5.2.1), and the BR-M5.4.2
 * schedule-plan-change. The cancel confirm states §17-O2 verbatim: no automatic refund.
 */

const BENEFIT_LABEL: Record<string, string> = {
	SERVICE_DISCOUNT: "خصم دورة",
	PRODUCT_DISCOUNT: "خصم منتجات",
	INCLUDED_UNITS: "وحدات مشمولة",
	PRIORITY_BOOKING: "أولوية حجز",
	PERK: "امتياز",
};

const INVOICE_STATUS: Record<string, string> = {
	UNPAID: "غير مدفوعة",
	PAID: "مدفوعة",
	PARTLY_PAID: "مدفوعة جزئيًا",
	OVERDUE: "متأخرة",
};

export const MemberDetailSheet = ({
	membershipId,
	onOpenChange,
}: {
	/** null = closed */
	membershipId: string | null;
	onOpenChange: (open: boolean) => void;
}) => {
	const { membership, isLoading } = useMembership(membershipId);
	const { plans } = useMembershipPlans("ACTIVE");
	const { cancel, isPending: cancelling } = useCancelMembership();
	const { scheduleChange, isPending: scheduling } = useSchedulePlanChange();
	const [cancelOpen, setCancelOpen] = useState(false);
	const [reason, setReason] = useState("");
	const [targetPlanId, setTargetPlanId] = useState("");

	const terminal =
		membership && ["CANCELLED", "EXPIRED"].includes(membership.status as string);

	return (
		<Sheet
			open={membershipId !== null}
			onOpenChange={onOpenChange}
		>
			<SheetContent
				side="left"
				dir="rtl"
				className="w-full gap-0 overflow-y-auto p-0 sm:max-w-xl!"
			>
				<SheetHeader className="border-b p-4">
					<SheetTitle>
						{membership ? (
							<span className="flex items-center gap-2">
								عضوية {membership.owner.name}
								<Badge variant={MEMBERSHIP_STATUS_META[membership.status].variant}>
									{MEMBERSHIP_STATUS_META[membership.status].label}
								</Badge>
							</span>
						) : (
							"العضوية"
						)}
					</SheetTitle>
				</SheetHeader>

				{isLoading || !membership ? (
					<p className="p-4 text-muted-foreground text-sm">جارٍ التحميل…</p>
				) : (
					<div className="flex flex-col gap-4 p-4">
						{/* snapshot (AR-M2) */}
						<div className="grid grid-cols-2 gap-2 rounded-md border p-3 text-sm">
							<span className="text-muted-foreground">الخطة</span>
							<span>
								{membership.plan.name}
								{membership.scheduledPlan && (
									<span className="text-muted-foreground text-xs">
										{" "}
										← «{membership.scheduledPlan.name}» عند التجديد
									</span>
								)}
							</span>
							<span className="text-muted-foreground">الرقم</span>
							<span>{membership.code}</span>
							<span className="text-muted-foreground">الرسم (لقطة وقت التسجيل)</span>
							<span>{formatAmount(membership.feeSnapshot.toString())}</span>
							<span className="text-muted-foreground">الفترة الحالية</span>
							<span>
								{formatDisplayDate(membership.currentPeriodStart)} ←{" "}
								{formatDisplayDate(membership.currentPeriodEnd)}
							</span>
							<span className="text-muted-foreground">أيام السماح</span>
							<span>{membership.graceDaysSnapshot}</span>
							<span className="text-muted-foreground">التجديد</span>
							<span>{membership.autoRenewSnapshot ? "تلقائي" : "فترة واحدة"}</span>
							{membership.cancelReason && (
								<>
									<span className="text-muted-foreground">سبب الإلغاء</span>
									<span>{membership.cancelReason}</span>
								</>
							)}
						</div>

						{/* backing invoice */}
						{membership.currentInvoice && (
							<div className="rounded-md border p-3 text-sm">
								<p className="mb-1 font-medium">فاتورة الفترة الحالية</p>
								<p>
									{membership.currentInvoice.documentNo ??
										membership.currentInvoice.salesInvoiceId}{" "}
									—{" "}
									{INVOICE_STATUS[membership.currentInvoice.status] ??
										membership.currentInvoice.status}
									{Number(membership.currentInvoice.outstandingAmount) > 0 && (
										<>
											{" · "}المتبقي:{" "}
											<b>{formatAmount(membership.currentInvoice.outstandingAmount)}</b>
										</>
									)}
								</p>
								<p className="mt-1 text-muted-foreground text-xs">
									التحصيل من «سندات القبض والصرف» — سداد الفاتورة هو ما يُفعّل العضوية.
								</p>
							</div>
						)}

						{/* benefits (read-only snapshots) */}
						<div className="rounded-md border p-3 text-sm">
							<p className="mb-2 font-medium">المزايا (لقطة — تعديل الخطة لا يغيّرها)</p>
							{membership.benefits.length === 0 ? (
								<p className="text-muted-foreground">لا مزايا على هذه العضوية.</p>
							) : (
								<ul className="flex flex-col gap-1">
									{membership.benefits.map((benefit) => (
										<li key={benefit.id}>
											<Badge
												variant="outline"
												className="me-2"
											>
												{BENEFIT_LABEL[benefit.benefitType] ?? benefit.benefitType}
											</Badge>
											{benefit.service?.name}
											{benefit.discountPercent != null && ` ${benefit.discountPercent}%`}
											{benefit.discountAmount != null &&
												` ${formatAmount(benefit.discountAmount.toString())}`}
											{benefit.unitsPerPeriod != null &&
												` — ${benefit.unitsPerPeriod} وحدة/فترة`}
											{benefit.labelAr}
										</li>
									))}
								</ul>
							)}
						</div>

						{/* [MI-P2] entitlements are LIVE: consumed moves at payment (BR-M5.3.1) */}
						{membership.entitlements.length > 0 && (
							<div className="rounded-md border p-3 text-sm">
								<p className="mb-2 font-medium">استحقاقات الفترة الحالية</p>
								<ul className="flex flex-col gap-1">
									{membership.entitlements.map((entitlement) => (
										<li key={entitlement.id}>
											{entitlement.benefit.labelAr ?? "وحدات مشمولة"} — المستهلك{" "}
											{entitlement.unitsConsumed} من {entitlement.unitsGranted}
										</li>
									))}
								</ul>
								<p className="mt-1 text-muted-foreground text-xs">
									الاستهلاك يبدأ مع محرك المزايا في المرحلة القادمة — حاليًا يبقى صفرًا.
								</p>
							</div>
						)}

						{/* actions */}
						{!terminal && (
							<div className="flex flex-col gap-3 border-t pt-3">
								<div className="flex items-end gap-2">
									<div className="flex-1">
										<Label className="mb-1 block text-sm">
											تغيير الخطة عند التجديد القادم
										</Label>
										<Select
											value={targetPlanId || undefined}
											onValueChange={setTargetPlanId}
										>
											<SelectTrigger>
												<SelectValue placeholder="اختر الخطة الهدف" />
											</SelectTrigger>
											<SelectContent dir="rtl">
												{plans
													.filter((plan) => plan.id !== membership.planId)
													.map((plan) => (
														<SelectItem
															key={plan.id}
															value={plan.id}
														>
															{plan.name} — {formatAmount(plan.fee.toString())}
														</SelectItem>
													))}
											</SelectContent>
										</Select>
									</div>
									<Button
										variant="outline"
										disabled={!targetPlanId || scheduling}
										onClick={() =>
											scheduleChange({ id: membership.id, planId: targetPlanId }).then(() =>
												setTargetPlanId(""),
											)
										}
									>
										جدولة
									</Button>
								</div>

								<Button
									variant="destructive"
									onClick={() => setCancelOpen(true)}
								>
									إلغاء العضوية…
								</Button>
							</div>
						)}
					</div>
				)}

				{/* cancel confirm — reason mandatory (BR-M5.2.1), O2 stated verbatim */}
				<Dialog
					open={cancelOpen}
					onOpenChange={setCancelOpen}
				>
					<DialogContent dir="rtl">
						<DialogHeader>
							<DialogTitle>إلغاء العضوية</DialogTitle>
							<DialogDescription>
								تتوقف المزايا فورًا. لا يتم استرداد أي مبلغ تلقائيًا؛ الاسترداد إجراء يدوي من
								شاشة الفاتورة.
							</DialogDescription>
						</DialogHeader>
						<Label htmlFor="cancel-reason">سبب الإلغاء (إلزامي)</Label>
						<Textarea
							id="cancel-reason"
							value={reason}
							onChange={(e) => setReason(e.target.value)}
							placeholder="طلب وليّ الأمر / انتقال / …"
						/>
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setCancelOpen(false)}
							>
								تراجع
							</Button>
							<Button
								variant="destructive"
								disabled={!reason.trim() || cancelling || !membership}
								onClick={() =>
									membership &&
									cancel({ id: membership.id, reason: reason.trim() }).then(() => {
										setCancelOpen(false);
										setReason("");
									})
								}
							>
								تأكيد الإلغاء
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</SheetContent>
		</Sheet>
	);
};

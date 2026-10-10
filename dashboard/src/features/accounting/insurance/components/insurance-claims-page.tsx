import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TableCell } from "@/components/ui/table";
import {
	DataTable,
	TabIntro,
	TabShell,
} from "@/features/accounting/extended/components/extended-shared";
import {
	useAdjudicateClaim,
	useCancelInsuranceClaim,
	useInsuranceClaim,
	useInsuranceClaims,
	useResolveClaimRejection,
	useSubmitInsuranceClaim,
} from "@/features/accounting/insurance/hooks/use-insurance-claims";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";
import type { InsuranceClaimStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

/**
 * [MI-P4] «المطالبات التأمينية» (MI §9, §11) — the claim register + detail with the
 * submit/draft-cancel actions. The one-line scope statement under the title is mandatory
 * (§7.1 coexistence with the dunning «المطالبات») — they are different documents entirely.
 *
 * [MI-P5] the rest of §9.3 lives in the detail sheet: the insurer's answer (FR-I9.3), the
 * BR-I9.4 fork for whatever it rejected, and a settlement panel that says plainly that
 * money arrives through a سند قبض (§10.4) — there is no "mark as settled" button, because
 * SETTLED is derived from the ledger and a button would let it lie.
 */

const STATUS_META: Record<
	InsuranceClaimStatus,
	{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
	DRAFT: { label: "مسودة", variant: "outline" },
	SUBMITTED: { label: "مُرسلة", variant: "default" },
	APPROVED: { label: "معتمدة", variant: "default" },
	PARTIALLY_APPROVED: { label: "معتمدة جزئيًا", variant: "secondary" },
	REJECTED: { label: "مرفوضة", variant: "destructive" },
	SETTLED: { label: "مُسوّاة", variant: "secondary" },
	CANCELLED: { label: "ملغاة", variant: "secondary" },
};

const FILTERS: { value: InsuranceClaimStatus | "all"; label: string }[] = [
	{ value: "all", label: "الكل" },
	{ value: "DRAFT", label: "مسودة" },
	{ value: "SUBMITTED", label: "مُرسلة" },
	{ value: "PARTIALLY_APPROVED", label: "معتمدة جزئيًا" },
	{ value: "REJECTED", label: "مرفوضة" },
	{ value: "SETTLED", label: "مُسوّاة" },
];

export const InsuranceClaimsPage = () => {
	const [status, setStatus] = useState<InsuranceClaimStatus | "all">("all");
	const { claims, isLoading } = useInsuranceClaims(status === "all" ? undefined : { status });
	const [openId, setOpenId] = useState<string | null>(null);
	const { claim } = useInsuranceClaim(openId);
	const { submitClaim, isPending: isSubmitting } = useSubmitInsuranceClaim();
	const { cancelClaim, isPending: isCancelling } = useCancelInsuranceClaim();
	const { adjudicate, isPending: isAdjudicating } = useAdjudicateClaim();
	const { resolveRejection, isPending: isResolving } = useResolveClaimRejection();
	const [approvedAmount, setApprovedAmount] = useState("");
	const [insurerReference, setInsurerReference] = useState("");
	const [rejectionReason, setRejectionReason] = useState("");

	const openClaim = (id: string) => {
		setApprovedAmount("");
		setInsurerReference("");
		setRejectionReason("");
		setOpenId(id);
	};

	const rejectedRemainder =
		claim && claim.approvedAmount !== null
			? Number(claim.claimedAmount) - Number(claim.approvedAmount)
			: 0;
	// BR-I9.4 — a rejected remainder with no recorded destination is the ONE state the
	// operator must resolve; the screen refuses to let it become invisible
	const awaitingResolution =
		claim !== null &&
		(claim.status === "REJECTED" || claim.status === "PARTIALLY_APPROVED") &&
		claim.rejectionResolution === null &&
		rejectedRemainder > 0;

	return (
		<div className="flex min-h-0 flex-1 flex-col overflow-hidden">
			<div className="px-4 pt-3">
				<h1 className="font-medium text-lg">المطالبات التأمينية</h1>
				<p className="text-muted-foreground text-sm">
					مطالبات شركات التأمين عن الفواتير المقسومة — غير «المطالبات» (متابعة متأخرات
					العملاء): هذه ذمم على المؤمِّن تُرسل وتُسوّى عبر سندات القبض.
				</p>
			</div>

			<TabIntro
				title="سجل المطالبات"
				hint="الإرسال هو الحدث النظامي: يأخذ رقم CLM- ويستهلك سقف البوليصة ويجعل الفاتورة مؤهلة للترحيل بقيد الدافعَين. إلغاء المسودة يعيد الفاتورة على وليّ الأمر كاملة."
			/>
			<div className="flex items-center gap-1.5 border-b px-4 py-2">
				{FILTERS.map((entry) => (
					<button
						key={entry.value}
						type="button"
						onClick={() => setStatus(entry.value)}
						className={cn(
							"flex h-[25px] items-center justify-center rounded-[4px] px-[14px] font-medium text-[11px]",
							status === entry.value
								? "border-[0.75px] border-[#E5E7EB] bg-[#F9FAFB] text-[#1F2937]"
								: "text-[#6B7280]",
						)}
					>
						{entry.label}
					</button>
				))}
			</div>
			<TabShell>
				<DataTable
					headers={[
						{ label: "المطالبة" },
						{ label: "شركة التأمين", className: "w-40" },
						{ label: "الطفل / وليّ الأمر", className: "w-44" },
						{ label: "الفاتورة", className: "w-28" },
						{ label: "المُطالَب به", className: "w-28 text-end" },
						{ label: "تاريخ الدورة", className: "w-28" },
						{ label: "الحالة", className: "w-24" },
					]}
					rows={claims}
					isLoading={isLoading}
					emptyMessage="لا مطالبات بعد. المطالبة تُنشأ من شاشة الدفع حين يكون للطفل بوليصة سارية."
					rowKey={(row) => row.id}
					renderRow={(row) => (
						<>
							<TableCell>
								<button
									type="button"
									className="font-medium text-primary hover:underline"
									onClick={() => openClaim(row.id)}
								>
									{row.documentNo ?? "مسودة"}
								</button>
							</TableCell>
							<TableCell>{row.insurer.name}</TableCell>
							<TableCell>
								{row.patient.name}
								<span className="ms-1 text-muted-foreground text-xs">({row.owner.name})</span>
							</TableCell>
							<TableCell>{row.invoice.code}</TableCell>
							<TableCell className="text-end tabular-nums">
								{formatAmount(row.claimedAmount.toString())}
							</TableCell>
							<TableCell className="text-xs tabular-nums">
								{formatDisplayDate(row.serviceDate)}
							</TableCell>
							<TableCell>
								<Badge variant={STATUS_META[row.status].variant}>
									{STATUS_META[row.status].label}
								</Badge>
							</TableCell>
						</>
					)}
				/>
			</TabShell>

			<Sheet
				open={openId !== null}
				onOpenChange={(open) => !open && setOpenId(null)}
			>
				<SheetContent
					side="left"
					className="w-[520px] overflow-y-auto sm:max-w-[520px]"
					dir="rtl"
				>
					<SheetHeader>
						<SheetTitle>
							{claim?.documentNo ?? "مطالبة (مسودة)"} — {claim?.insurer.name ?? ""}
						</SheetTitle>
					</SheetHeader>
					{claim && (
						<div className="flex flex-col gap-4 p-4 text-sm">
							<div className="grid grid-cols-2 gap-2">
								<span className="text-muted-foreground">الحالة</span>
								<Badge
									className="w-fit"
									variant={STATUS_META[claim.status].variant}
								>
									{STATUS_META[claim.status].label}
								</Badge>
								<span className="text-muted-foreground">رقم البوليصة</span>
								<span dir="ltr">{claim.policyNumberSnapshot}</span>
								<span className="text-muted-foreground">الفاتورة</span>
								<span>
									{claim.invoice.code} — إجمالي {formatAmount(claim.invoice.total.toString())}
								</span>
								<span className="text-muted-foreground">حصة وليّ الأمر (copay)</span>
								<span className="tabular-nums">
									{claim.invoice.copayShare
										? formatAmount(claim.invoice.copayShare.toString())
										: "—"}
								</span>
								<span className="text-muted-foreground">المُطالَب به</span>
								<span className="font-semibold tabular-nums">
									{formatAmount(claim.claimedAmount.toString())}
								</span>
							</div>

							<Separator />
							<p className="font-medium">سطور المطالبة (لقطة لحظة الإنشاء)</p>
							<div className="flex flex-col gap-1 text-xs">
								{claim.lines.map((line) => (
									<div
										key={line.id}
										className="flex items-center justify-between gap-2"
									>
										<span className="min-w-0 truncate">{line.description}</span>
										<span className="shrink-0 tabular-nums">
											{formatAmount(line.lineTotal.toString())} ×{" "}
											{Number(line.coveragePercent)}% ={" "}
											{formatAmount(line.insurerAmount.toString())}
										</span>
									</div>
								))}
							</div>

							{claim.status === "SUBMITTED" && (
								<>
									<Separator />
									<p className="font-medium">جواب شركة التأمين (FR-I9.3)</p>
									<div className="flex flex-col gap-2">
										<Label
											className="text-xs"
											htmlFor="claim-approved"
										>
											المبلغ المعتمد — صفر يعني رفضًا كاملًا
										</Label>
										<Input
											id="claim-approved"
											inputMode="decimal"
											dir="ltr"
											className="text-end"
											placeholder={claim.claimedAmount.toString()}
											value={approvedAmount}
											onChange={(event) => setApprovedAmount(event.target.value)}
											disabled={isAdjudicating}
										/>
										<Label
											className="text-xs"
											htmlFor="claim-ref"
										>
											مرجع الشركة
										</Label>
										<Input
											id="claim-ref"
											dir="ltr"
											value={insurerReference}
											onChange={(event) => setInsurerReference(event.target.value)}
											disabled={isAdjudicating}
										/>
										<Label
											className="text-xs"
											htmlFor="claim-reason"
										>
											سبب الرفض — إلزامي عند اعتماد أقل من المُطالَب به
										</Label>
										<Input
											id="claim-reason"
											value={rejectionReason}
											onChange={(event) => setRejectionReason(event.target.value)}
											disabled={isAdjudicating}
										/>
										<Button
											size="sm"
											className="w-fit"
											disabled={isAdjudicating || approvedAmount.trim() === ""}
											onClick={() =>
												void adjudicate({
													id: claim.id,
													approvedAmount: approvedAmount.trim(),
													insurerReference,
													rejectionReason,
												})
											}
										>
											تسجيل النتيجة
										</Button>
									</div>
								</>
							)}

							{awaitingResolution && (
								<>
									<Separator />
									<p className="font-medium">
										المبلغ المرفوض {formatAmount(rejectedRemainder.toFixed(2))} — أين يذهب؟
										(BR-I9.4)
									</p>
									<p className="text-muted-foreground text-xs">
										هذا مالٌ كسبته الأكاديمية فعلًا، فله وجهة واحدة من اثنتين لا ثالث لهما.
									</p>
									<div className="flex items-center gap-2">
										<Button
											size="sm"
											disabled={isResolving}
											onClick={() =>
												void resolveRejection({ id: claim.id, resolution: "REBILL_OWNER" })
											}
										>
											إعادة تحميله على وليّ الأمر
										</Button>
										<Button
											size="sm"
											variant="outline"
											disabled={isResolving}
											onClick={() =>
												void resolveRejection({ id: claim.id, resolution: "WRITE_OFF" })
											}
										>
											شطبه
										</Button>
									</div>
								</>
							)}

							{claim.rejectionResolution !== null && (
								<p className="rounded-md bg-muted p-2 text-xs">
									{claim.rejectionResolution === "REBILL_OWNER"
										? "المبلغ المرفوض أُعيد تحميله على وليّ الأمر (§10.3a) — رصيد مفتوح على ذمته يُحصَّل بسند قبض، والفاتورة نفسها لا تُفتح من جديد."
										: "المبلغ المرفوض شُطب على حساب الشطب (§10.3b)."}
								</p>
							)}

							{(claim.status === "APPROVED" ||
								claim.status === "PARTIALLY_APPROVED" ||
								claim.status === "SETTLED") && (
								<>
									<Separator />
									<div className="grid grid-cols-2 gap-2">
										<span className="text-muted-foreground">المعتمد</span>
										<span className="tabular-nums">
											{claim.approvedAmount
												? formatAmount(claim.approvedAmount.toString())
												: "—"}
										</span>
										<span className="text-muted-foreground">المحصَّل من الشركة</span>
										<span className="tabular-nums">
											{formatAmount(claim.settledAmount.toString())}
										</span>
										{claim.insurerReference && (
											<>
												<span className="text-muted-foreground">مرجع الشركة</span>
												<span dir="ltr">{claim.insurerReference}</span>
											</>
										)}
									</div>
									<p className="text-muted-foreground text-xs">
										التحصيل يتم بسند قبض على طرف «شركة التأمين» يُخصَّص على هذه المطالبة (§10.4)؛
										وحالة «مُسوّاة» تُشتق من الدفتر حين يصفر المستحق — لا تُضبط يدويًا.
									</p>
								</>
							)}

							{claim.status === "DRAFT" && (
								<>
									<Separator />
									<div className="flex items-center gap-2">
										<Button
											size="sm"
											disabled={isSubmitting}
											onClick={() => void submitClaim(claim.id)}
										>
											إرسال المطالبة
										</Button>
										<Button
											size="sm"
											variant="outline"
											disabled={isCancelling}
											onClick={() => void cancelClaim(claim.id)}
										>
											إلغاء (تعود الفاتورة على وليّ الأمر)
										</Button>
									</div>
									<p className="text-muted-foreground text-xs">
										الإرسال يعني أن المطالبة سُلّمت للشركة (ورقيًا أو عبر بوابتها) — عندها يُخصَّص
										رقمها ويُستهلك سقف البوليصة ويُرحَّل قيد الدافعَين.
									</p>
								</>
							)}
						</div>
					)}
				</SheetContent>
			</Sheet>
		</div>
	);
};

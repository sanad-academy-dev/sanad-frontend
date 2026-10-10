import { useEffect, useState } from "react";

import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AccountingFormSheet } from "@/features/accounting/components/accounting-form-sheet";
import {
	useCreateRepost,
	useRepostCandidates,
} from "@/features/accounting/extended/hooks/use-extended";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";

/**
 * [P12.15] Build a repost request (FR-6.9).
 *
 * THE REASON FIELD COMES FIRST AND IS A TEXTAREA, not an afterthought input at the bottom.
 * The server already refuses an empty reason; putting it at the top, sized for a sentence,
 * is the difference between «تصحيح» and a sentence a reader six months from now can act on.
 * Reposting rewrites what the ledger says about a document someone already approved — the
 * sentence IS the audit trail.
 *
 * ONE DOCTYPE PER REQUEST. The candidate list is per type, and mixing types in one request
 * would mean a picker that cannot show a meaningful amount column. Nothing stops a second
 * request for a second type, and each still reposts in its own transaction.
 *
 * CREATING A REQUEST TOUCHES NOTHING. The sheet says so in its description, because the
 * natural reading of a submit button on a screen called «إعادة الترحيل» is that the ledger
 * has just moved. It has not: the request is queued, and «تشغيل» in the row is what reverses
 * and rebuilds.
 */

const VOUCHER_TYPES = [
	{ value: "sales_invoice", label: "فاتورة مبيعات" },
	{ value: "purchase_invoice", label: "فاتورة مشتريات" },
	{ value: "journal_entry", label: "قيد يومية" },
	{ value: "payment_entry", label: "سند دفع/قبض" },
] as const;

type VoucherType = (typeof VOUCHER_TYPES)[number]["value"];

export const RepostSheet = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { createRepost, isPending } = useCreateRepost();
	const [reason, setReason] = useState("");
	const [voucherType, setVoucherType] = useState<VoucherType>("sales_invoice");
	const [selected, setSelected] = useState<string[]>([]);

	const { candidates, isLoading } = useRepostCandidates(open ? voucherType : null);

	useEffect(() => {
		if (!open) return;
		setReason("");
		setVoucherType("sales_invoice");
		setSelected([]);
	}, [open]);

	const reasonInvalid = reason.trim() === "";
	const blocked = reasonInvalid || selected.length === 0;

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (blocked) return;
		createRepost({
			reason: reason.trim(),
			vouchers: selected.map((voucherId) => ({
				voucherType,
				voucherId,
				voucherNo: candidates.find((row) => row.voucherId === voucherId)?.voucherNo ?? null,
			})),
		});
		onOpenChange(false);
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title="طلب إعادة ترحيل"
			description="يُنشئ الطلب فقط — لا يُمَسّ الدفتر حتى تضغط «تشغيل» على السطر. عندها تُعكس القيود الأصلية وتُبنى من جديد، والأصل يبقى ظاهرًا مع عكسه."
			onSubmit={onSubmit}
			isSaving={isPending}
			submitLabel="إنشاء الطلب"
			submitDisabled={blocked}
			wide
		>
			<Field data-invalid={reasonInvalid}>
				<Label>
					السبب <span className="text-rose-500">*</span>
				</Label>
				<Textarea
					value={reason}
					onChange={(event) => setReason(event.target.value)}
					placeholder="مثال: صُحّح حساب الإيراد للأصناف الجراحية من «إيرادات متنوّعة» إلى «إيرادات العمليات»، والفواتير أدناه رُحّلت قبل التصحيح."
					rows={3}
					aria-invalid={reasonInvalid}
					disabled={isPending}
				/>
				<p className="text-muted-foreground text-xs">
					السبب إلزامي ويظهر كاملًا في قائمة الطلبات — هو الدليل الوحيد على أن الرصيد تغيّر
					بقرار، لا صدفةً.
				</p>
			</Field>

			<Field>
				<Label>نوع المستند</Label>
				<Select
					value={voucherType}
					onValueChange={(value) => {
						setVoucherType(value as VoucherType);
						// تبديل النوع يُفرغ الاختيار: مُعرِّفات النوع السابق لا تنتمي إلى الجديد
						setSelected([]);
					}}
					disabled={isPending}
				>
					<SelectTrigger className="w-full">
						<SelectValue />
					</SelectTrigger>
					<SelectContent dir="rtl">
						{VOUCHER_TYPES.map((entry) => (
							<SelectItem
								key={entry.value}
								value={entry.value}
							>
								{entry.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<p className="text-muted-foreground text-xs">
					طلب واحد لنوع واحد. أنشئ طلبًا آخر لنوع آخر — كلٌّ يُعاد ترحيله في معاملة مستقلّة.
				</p>
			</Field>

			<Field>
				<Label>
					المستندات <span className="text-rose-500">*</span>
				</Label>
				{isLoading ? (
					<p className="py-4 text-center text-muted-foreground text-sm">جارٍ التحميل…</p>
				) : candidates.length === 0 ? (
					<p className="py-4 text-center text-muted-foreground text-sm">
						لا مستندات مُرحَّلة من هذا النوع. إعادة الترحيل تخصّ المُرحَّل وحده — المسودّة لم تُرحّل
						شيئًا، والملغى عكسُه مقصود.
					</p>
				) : (
					<div className="max-h-80 space-y-1 overflow-y-auto rounded-[4px] border p-2">
						{candidates.map((row) => {
							const checked = selected.includes(row.voucherId);
							return (
								<label
									key={row.voucherId}
									htmlFor={`repost-${row.voucherId}`}
									className="flex cursor-pointer items-center gap-2 rounded-[4px] px-1.5 py-1 text-xs hover:bg-muted/50"
								>
									<Checkbox
										id={`repost-${row.voucherId}`}
										checked={checked}
										onCheckedChange={(next) =>
											setSelected((prev) =>
												next === true
													? [...prev, row.voucherId]
													: prev.filter((id) => id !== row.voucherId),
											)
										}
										disabled={isPending}
									/>
									<span className="truncate font-medium">
										{row.voucherNo ?? row.voucherId}
									</span>
									<span className="text-muted-foreground">
										{formatDisplayDate(row.postingDate)}
									</span>
									{row.label ? (
										<span className="truncate text-muted-foreground">{row.label}</span>
									) : null}
									<span className="ms-auto tabular-nums">{formatAmount(row.amount)}</span>
								</label>
							);
						})}
					</div>
				)}
				<p className="text-muted-foreground text-xs">المختار {selected.length}</p>
			</Field>
		</AccountingFormSheet>
	);
};

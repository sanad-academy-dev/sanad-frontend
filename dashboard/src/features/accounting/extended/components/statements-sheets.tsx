import { useEffect, useState } from "react";

import { DateField } from "@/components/common/date-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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
	type PsoaCustomerInput,
	useCreatePsoaConfig,
	usePsoaPreview,
	useSendStatements,
} from "@/features/accounting/extended/hooks/use-extended";
import { useParties } from "@/features/accounting/parties/hooks/use-parties";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";

/**
 * [P12.15] The statement-of-accounts config form, and the preview→send flow the tab promises.
 *
 * TWO PIECES, AND THE ORDER BETWEEN THEM IS THE POINT. Saving a config sends nothing; the
 * only way to send is through the preview, which shows exactly what each customer will
 * receive. That mirrors the server's own preview/send split (a read permission and a submit
 * permission), and it exists because an emailed statement cannot be recalled — the cost of a
 * wrong period or a wrong customer list is paid in a customer's inbox, not in a rollback.
 *
 * EMAIL IS TYPED PER CUSTOMER, not looked up. The party registry (C6) carries accounting
 * fields, not contact details, and a statement that silently went to the wrong address would
 * be worse than one that was never sent. A customer left without an email is not an error: the
 * send skips them and says so, which is the honest outcome.
 */

const REPORT_TYPES = [
	{ value: "PARTY_LEDGER", label: "حركة الطرف" },
	{ value: "RECEIVABLE_AGEING", label: "أعمار الديون" },
] as const;

const FREQUENCIES = [
	{ value: "MANUAL", label: "يدوي" },
	{ value: "WEEKLY", label: "أسبوعي" },
	{ value: "MONTHLY", label: "شهري" },
	{ value: "QUARTERLY", label: "ربعي" },
] as const;

type ReportType = (typeof REPORT_TYPES)[number]["value"];
type Frequency = (typeof FREQUENCIES)[number]["value"];

/* ── create ───────────────────────────────────────────────────────────────────────────── */

export const PsoaConfigSheet = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { parties } = useParties();
	const { createConfig, isPending } = useCreatePsoaConfig();

	const [title, setTitle] = useState("");
	const [reportType, setReportType] = useState<ReportType>("PARTY_LEDGER");
	const [frequency, setFrequency] = useState<Frequency>("MONTHLY");
	const [fromDate, setFromDate] = useState("");
	const [toDate, setToDate] = useState("");
	const [subject, setSubject] = useState("");
	const [bodyText, setBodyText] = useState("");
	const [selected, setSelected] = useState<Record<string, string>>({});

	const customers = parties.filter((party) => party.partyType === "Owner");

	useEffect(() => {
		if (!open) return;
		setTitle("");
		setReportType("PARTY_LEDGER");
		setFrequency("MONTHLY");
		setFromDate("");
		setToDate("");
		setSubject("");
		setBodyText("");
		setSelected({});
	}, [open]);

	const chosen = Object.keys(selected);
	const titleInvalid = title.trim() === "";
	// نافذة ثابتة إمّا كاملة أو غائبة: طرف واحد منها يجعل الفترة غامضة
	const windowInvalid = Boolean(fromDate) !== Boolean(toDate);
	const blocked = titleInvalid || chosen.length === 0 || windowInvalid;

	const toggle = (partyId: string, next: boolean) =>
		setSelected((prev) => {
			if (!next) {
				const { [partyId]: _removed, ...rest } = prev;
				return rest;
			}
			return { ...prev, [partyId]: prev[partyId] ?? "" };
		});

	const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (blocked) return;
		const rows: PsoaCustomerInput[] = chosen.map((partyId) => ({
			partyType: "Owner",
			partyId,
			email: selected[partyId].trim() || null,
		}));
		createConfig({
			title: title.trim(),
			reportType,
			frequency,
			fromDate: fromDate || null,
			toDate: toDate || null,
			subject: subject.trim() || null,
			bodyText: bodyText.trim() || null,
			customers: rows,
			enabled: true,
		});
		onOpenChange(false);
	};

	return (
		<AccountingFormSheet
			open={open}
			onOpenChange={onOpenChange}
			title="تهيئة كشف حساب"
			description="تحفظ من يتلقّى الكشف وأيّ عرض وأيّ فترة. الحفظ لا يُرسل شيئًا — الإرسال يمرّ بالمعاينة."
			onSubmit={onSubmit}
			isSaving={isPending}
			submitLabel="حفظ"
			submitDisabled={blocked}
			wide
		>
			<Field data-invalid={titleInvalid}>
				<Label>
					العنوان <span className="text-rose-500">*</span>
				</Label>
				<Input
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					placeholder="مثال: كشوف العملاء الشهرية"
					aria-invalid={titleInvalid}
					disabled={isPending}
				/>
			</Field>

			<div className="grid grid-cols-2 gap-3">
				<Field>
					<Label>العرض</Label>
					<Select
						value={reportType}
						onValueChange={(value) => setReportType(value as ReportType)}
						disabled={isPending}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent dir="rtl">
							{REPORT_TYPES.map((entry) => (
								<SelectItem
									key={entry.value}
									value={entry.value}
								>
									{entry.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
				<Field>
					<Label>التكرار</Label>
					<Select
						value={frequency}
						onValueChange={(value) => setFrequency(value as Frequency)}
						disabled={isPending}
					>
						<SelectTrigger className="w-full">
							<SelectValue />
						</SelectTrigger>
						<SelectContent dir="rtl">
							{FREQUENCIES.map((entry) => (
								<SelectItem
									key={entry.value}
									value={entry.value}
								>
									{entry.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</Field>
			</div>

			<Field data-invalid={windowInvalid}>
				<Label>نافذة ثابتة (اختيارية)</Label>
				<div className="grid grid-cols-2 gap-3">
					<DateField
						value={fromDate}
						onChange={setFromDate}
						placeholder="من تاريخ"
						invalid={windowInvalid}
						triggerDisabled={isPending}
					/>
					<DateField
						value={toDate}
						onChange={setToDate}
						placeholder="إلى تاريخ"
						invalid={windowInvalid}
						triggerDisabled={isPending}
					/>
				</div>
				<p className="text-muted-foreground text-xs">
					{windowInvalid
						? "النافذة الثابتة تحتاج طرفيها معًا — طرف واحد يجعل الفترة غامضة."
						: "اتركها فارغة لتُشتقّ الفترة من التكرار وموضع تاريخ التشغيل في التقويم، فتتلاصق الكشوف المتتالية بلا فجوة."}
				</p>
			</Field>

			<Field>
				<Label>موضوع الرسالة</Label>
				<Input
					value={subject}
					onChange={(event) => setSubject(event.target.value)}
					placeholder="اختياري"
					disabled={isPending}
				/>
			</Field>

			<Field>
				<Label>نصّ الرسالة</Label>
				<Textarea
					value={bodyText}
					onChange={(event) => setBodyText(event.target.value)}
					placeholder="اختياري"
					rows={3}
					disabled={isPending}
				/>
			</Field>

			<Field>
				<Label>
					العملاء <span className="text-rose-500">*</span>
				</Label>
				{customers.length === 0 ? (
					<p className="py-4 text-center text-muted-foreground text-sm">
						لا عملاء مسجّلون في الأطراف.
					</p>
				) : (
					<div className="max-h-72 space-y-1 overflow-y-auto rounded-[4px] border p-2">
						{customers.map((party) => {
							const checked = party.partyId in selected;
							return (
								<div
									key={party.partyId}
									className="flex items-center gap-2 rounded-[4px] px-1.5 py-1 text-xs"
								>
									<Checkbox
										checked={checked}
										onCheckedChange={(next) => toggle(party.partyId, next === true)}
										disabled={isPending}
									/>
									<span className="w-40 shrink-0 truncate">{party.name}</span>
									<Input
										dir="ltr"
										type="email"
										placeholder="البريد الإلكتروني — بدونه يُتخطّى عند الإرسال"
										className="h-7 flex-1 text-xs"
										value={selected[party.partyId] ?? ""}
										onChange={(event) =>
											setSelected((prev) => ({
												...prev,
												[party.partyId]: event.target.value,
											}))
										}
										disabled={isPending || !checked}
									/>
								</div>
							);
						})}
					</div>
				)}
				<p className="text-muted-foreground text-xs">المختار {chosen.length}</p>
			</Field>
		</AccountingFormSheet>
	);
};

/* ── preview → send ───────────────────────────────────────────────────────────────────── */

export const PsoaPreviewDialog = ({
	psoaId,
	title,
	onClose,
}: {
	psoaId: string | null;
	title: string;
	onClose: () => void;
}) => {
	const { statements, isLoading, error } = usePsoaPreview(psoaId);
	const { sendStatements, isPending } = useSendStatements();

	return (
		<Dialog
			open={Boolean(psoaId)}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		>
			<DialogContent
				dir="rtl"
				className="max-h-[80vh] overflow-y-auto sm:max-w-2xl"
			>
				<DialogHeader>
					<DialogTitle>معاينة «{title}»</DialogTitle>
					<DialogDescription>
						هذا ما سيصل كل عميل. راجعه قبل الإرسال — الكشف المُرسَل لا يُستعاد.
					</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<p className="py-8 text-center text-muted-foreground text-sm">جارٍ بناء الكشوف…</p>
				) : error ? (
					<p className="py-8 text-center text-destructive text-sm">{error.message}</p>
				) : statements.length === 0 ? (
					<p className="py-8 text-center text-muted-foreground text-sm">
						لا كشوف — التهيئة بلا عملاء.
					</p>
				) : (
					<div className="space-y-3">
						{statements.map((statement) => (
							<div
								key={`${statement.partyType}:${statement.partyId}`}
								className="rounded-[4px] border p-3"
							>
								<div className="flex flex-wrap items-center gap-2">
									<span className="font-medium text-sm">{statement.partyName}</span>
									<span
										dir="ltr"
										className="text-muted-foreground text-xs"
									>
										{statement.email ?? "— بلا بريد، سيُتخطّى —"}
									</span>
									<span className="ms-auto text-muted-foreground text-xs">
										{formatDisplayDate(statement.fromDate)} —{" "}
										{formatDisplayDate(statement.toDate)}
									</span>
								</div>
								<div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
									<span className="text-muted-foreground">{statement.lines.length} سطرًا</span>
									{statement.bucketLabels.map((label, index) => (
										<span key={label}>
											{label}:{" "}
											<span className="tabular-nums">
												{formatAmount(statement.bucketTotals[index])}
											</span>
										</span>
									))}
									<span className="ms-auto font-medium">
										الرصيد{" "}
										<span className="tabular-nums">
											{formatAmount(statement.closingBalance)}
										</span>
									</span>
								</div>
							</div>
						))}
					</div>
				)}

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={onClose}
						disabled={isPending}
					>
						إغلاق
					</Button>
					<Button
						type="button"
						disabled={isPending || isLoading || !psoaId || statements.length === 0}
						onClick={() => {
							if (!psoaId) return;
							sendStatements(psoaId).then(onClose, () => undefined);
						}}
					>
						إرسال الآن
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

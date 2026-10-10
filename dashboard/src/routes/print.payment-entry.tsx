import { IconPrinter } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { usePaymentEntry } from "@/features/accounting/payment-entries/hooks/use-payment-entries";
import { formatAmount, formatDisplayDate } from "@/features/accounting/utils/format-amount";

/**
 * [P7.9] سند القبض/الصرف — the AR/RTL print layout, mirroring the P5.9 architecture:
 * a chrome-free top-level route (`?id=`) rendering a clean A4 sheet — clinic header,
 * bilingual title per the payment type, party + bank-reference block, the settled
 * references table, deductions, and the stored Arabic in_words (never re-derived
 * client-side). Drafts print with a watermark. The receipt (سند قبض) is the document
 * handed to the payer — this route IS the M2 print deliverable.
 */

const day = (value: unknown) => formatDisplayDate(String(value));

const TITLE: Record<string, { ar: string; en: string }> = {
	RECEIVE: { ar: "سند قبض", en: "Receipt Voucher" },
	PAY: { ar: "سند صرف", en: "Payment Voucher" },
	INTERNAL_TRANSFER: { ar: "سند تحويل داخلي", en: "Internal Transfer" },
};

function PrintPaymentEntry() {
	const { id } = Route.useSearch();
	const { entry, isLoading } = usePaymentEntry(id);

	if (isLoading || !entry) {
		return (
			<div className="flex min-h-svh items-center justify-center text-muted-foreground">
				{isLoading ? "جارٍ التحميل..." : "السند غير موجود"}
			</div>
		);
	}

	const title = TITLE[entry.paymentType] ?? TITLE.RECEIVE;
	const isTransfer = entry.paymentType === "INTERNAL_TRANSFER";

	return (
		<div
			dir="rtl"
			className="mx-auto max-w-3xl bg-white p-8 text-black print:p-0"
		>
			{/* screen-only toolbar */}
			<div className="mb-4 flex justify-end print:hidden">
				<Button onClick={() => window.print()}>
					<IconPrinter className="size-4" />
					طباعة
				</Button>
			</div>

			{entry.docstatus === "DRAFT" ? (
				<p className="mb-2 rounded border border-dashed p-2 text-center text-sm">
					مسودة — بلا أثر دفتري
				</p>
			) : null}

			{/* header */}
			<header className="border-b-2 border-black pb-3 text-center">
				<h1 className="font-bold text-xl">{entry.clinic.name}</h1>
				<p className="mt-1 font-semibold text-lg">
					{title?.ar} — {title?.en}
				</p>
			</header>

			{/* meta */}
			<section className="mt-4 grid grid-cols-2 gap-2 text-sm">
				<div>
					{!isTransfer ? (
						<p>
							<span className="font-semibold">
								{entry.paymentType === "RECEIVE" ? "استلمنا من: " : "صرفنا إلى: "}
							</span>
							{entry.partyName ?? entry.partyId}
						</p>
					) : null}
					{entry.modeOfPayment ? (
						<p>
							<span className="font-semibold">وسيلة الدفع: </span>
							{entry.modeOfPayment.modeOfPaymentName}
						</p>
					) : null}
					{entry.referenceNo ? (
						<p>
							<span className="font-semibold">رقم المرجع: </span>
							<span dir="ltr">{entry.referenceNo}</span>
							{entry.referenceDate ? (
								<span dir="ltr"> — {day(entry.referenceDate)}</span>
							) : null}
						</p>
					) : null}
				</div>
				<div className="text-start">
					<p>
						<span className="font-semibold">رقم المستند: </span>
						<span dir="ltr">{entry.documentNo ?? "—"}</span>
					</p>
					<p>
						<span className="font-semibold">التاريخ: </span>
						<span dir="ltr">{day(entry.postingDate)}</span>
					</p>
				</div>
			</section>

			{/* amount block */}
			<section className="mt-4 rounded border border-black p-3">
				<div className="flex items-baseline justify-between">
					<span className="font-semibold">المبلغ:</span>
					<span
						className="font-bold text-lg tabular-nums"
						dir="ltr"
					>
						{formatAmount(entry.paidAmount.toString())} ر.س
					</span>
				</div>
				{entry.inWords ? (
					<p className="mt-1 text-sm">
						<span className="font-semibold">وقدره: </span>
						{entry.inWords}
					</p>
				) : null}
				<div className="mt-2 grid grid-cols-2 gap-1 text-sm">
					<p>
						<span className="font-semibold">
							{isTransfer
								? "من حساب: "
								: entry.paymentType === "RECEIVE"
									? "أُودع في: "
									: "صُرف من: "}
						</span>
						{entry.paymentType === "RECEIVE" || isTransfer
							? isTransfer
								? entry.paidFrom.accountName
								: entry.paidTo.accountName
							: entry.paidFrom.accountName}
					</p>
					{isTransfer ? (
						<p>
							<span className="font-semibold">إلى حساب: </span>
							{entry.paidTo.accountName}
						</p>
					) : null}
				</div>
			</section>

			{/* settled references */}
			{entry.references.length > 0 ? (
				<section className="mt-4">
					<h2 className="mb-1 font-semibold text-sm">سُدِّد عن المستندات التالية</h2>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-black border-y bg-neutral-100">
								<th className="p-1 text-start">المستند</th>
								<th className="p-1 text-start">الاستحقاق</th>
								<th className="p-1 text-end">إجمالي المستند</th>
								<th className="p-1 text-end">المخصص</th>
							</tr>
						</thead>
						<tbody>
							{entry.references.map((row) => (
								<tr
									key={row.id}
									className="border-b"
								>
									<td
										className="p-1"
										dir="ltr"
									>
										{row.referenceNo ?? row.referenceId}
									</td>
									<td
										className="p-1"
										dir="ltr"
									>
										{row.dueDate ? day(row.dueDate) : "—"}
									</td>
									<td
										className="p-1 text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.totalAmount.toString())}
									</td>
									<td
										className="p-1 text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.allocatedAmount.toString())}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			) : null}

			{/* deductions */}
			{entry.deductions.length > 0 ? (
				<section className="mt-4">
					<h2 className="mb-1 font-semibold text-sm">الخصومات</h2>
					<table className="w-full border-collapse text-sm">
						<tbody>
							{entry.deductions.map((row) => (
								<tr
									key={row.id}
									className="border-b"
								>
									<td className="p-1">{row.account.accountName}</td>
									<td
										className="p-1 text-end tabular-nums"
										dir="ltr"
									>
										{formatAmount(row.amount.toString())}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			) : null}

			{/* totals strip */}
			<section className="mt-4 grid grid-cols-3 gap-2 border-black border-t pt-2 text-sm">
				<p>
					<span className="font-semibold">المخصص: </span>
					<span
						className="tabular-nums"
						dir="ltr"
					>
						{formatAmount(entry.totalAllocatedAmount.toString())}
					</span>
				</p>
				<p>
					<span className="font-semibold">غير المخصص: </span>
					<span
						className="tabular-nums"
						dir="ltr"
					>
						{formatAmount(entry.unallocatedAmount.toString())}
					</span>
				</p>
				{entry.remarks ? (
					<p className="col-span-3">
						<span className="font-semibold">ملاحظات: </span>
						{entry.remarks}
					</p>
				) : null}
			</section>

			{/* signatures */}
			<section className="mt-10 grid grid-cols-3 gap-4 text-center text-sm">
				<div>
					<p className="border-black border-t pt-1">المحاسب</p>
				</div>
				<div>
					<p className="border-black border-t pt-1">المدير المالي</p>
				</div>
				<div>
					<p className="border-black border-t pt-1">
						{entry.paymentType === "RECEIVE" ? "الدافع" : "المستلم"}
					</p>
				</div>
			</section>
		</div>
	);
}

export const Route = createFileRoute("/print/payment-entry")({
	component: PrintPaymentEntry,
	ssr: false,
	validateSearch: (search: Record<string, unknown>): { id: string } => ({
		id: String(search.id ?? ""),
	}),
});

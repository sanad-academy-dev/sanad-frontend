import { IconPrinter } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useSalesInvoice } from "@/features/accounting/sales-invoices/hooks/use-sales-invoices";
import { useAccountsSettings } from "@/features/accounting/settings/hooks/use-accounts-settings";

/**
 * [P5.9] الفاتورة الضريبية — the AR/RTL print layout (BRD §7.2 print + NFR-6).
 *
 * A chrome-free top-level route (`?id=`) so the browser's print dialog gets a clean A4
 * sheet: clinic header, bilingual title, customer block, item grid, tax summary, totals
 * with the stored Arabic in_words (P0.6 — never re-derived client-side), and the payment
 * schedule / inclusive-tax note per the §19 print flags. Data must already be SUBMITTED —
 * drafts print with a watermark.
 */

const day = (value: unknown) => String(value).slice(0, 10);

function PrintSalesInvoice() {
	const { id } = Route.useSearch();
	const { invoice, isLoading } = useSalesInvoice(id);
	const { settings } = useAccountsSettings();

	if (isLoading || !invoice) {
		return (
			<div className="flex min-h-svh items-center justify-center text-muted-foreground">
				{isLoading ? "جارٍ التحميل..." : "الفاتورة غير موجودة"}
			</div>
		);
	}

	const showSchedule =
		settings?.show_payment_schedule_in_print !== false && invoice.schedule.length > 0;
	const showInclusiveNote =
		settings?.show_inclusive_tax_in_print !== false &&
		invoice.taxes.some((row) => row.includedInPrintRate);
	const payable = invoice.disableRoundedTotal ? invoice.grandTotal : invoice.roundedTotal;

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

			{invoice.docstatus === "DRAFT" ? (
				<p className="mb-2 rounded border border-dashed p-2 text-center text-sm">
					مسودة — بلا أثر دفتري
				</p>
			) : null}

			{/* header */}
			<header className="border-b-2 border-black pb-3 text-center">
				<h1 className="font-bold text-xl">{invoice.clinic.name}</h1>
				<p className="mt-1 font-semibold text-lg">
					{invoice.isReturn ? "إشعار دائن — Credit Note" : "فاتورة ضريبية — Tax Invoice"}
				</p>
			</header>

			{/* meta */}
			<section className="mt-4 grid grid-cols-2 gap-2 text-sm">
				<div>
					<p>
						<span className="font-semibold">العميل: </span>
						{invoice.partyName ?? invoice.partyId}
					</p>
					{invoice.poNo ? (
						<p>
							<span className="font-semibold">أمر الشراء: </span>
							<span dir="ltr">{invoice.poNo}</span>
						</p>
					) : null}
					{invoice.isReturn && invoice.returnAgainst?.documentNo ? (
						<p>
							<span className="font-semibold">مرتجع عن: </span>
							<span dir="ltr">{invoice.returnAgainst.documentNo}</span>
						</p>
					) : null}
				</div>
				<div className="text-start">
					<p>
						<span className="font-semibold">رقم المستند: </span>
						<span dir="ltr">{invoice.documentNo ?? "(مسودة)"}</span>
					</p>
					<p>
						<span className="font-semibold">تاريخ الترحيل: </span>
						<span dir="ltr">{day(invoice.postingDate)}</span>
					</p>
					{invoice.dueDate ? (
						<p>
							<span className="font-semibold">تاريخ الاستحقاق: </span>
							<span dir="ltr">{day(invoice.dueDate)}</span>
						</p>
					) : null}
				</div>
			</section>

			{/* items */}
			<table className="mt-4 w-full border-collapse text-sm">
				<thead>
					<tr className="border-black border-y bg-neutral-100">
						<th className="p-1.5 text-start">#</th>
						<th className="p-1.5 text-start">الصنف</th>
						<th className="p-1.5 text-end">الكمية</th>
						<th className="p-1.5 text-end">السعر</th>
						<th className="p-1.5 text-end">الصافي</th>
					</tr>
				</thead>
				<tbody>
					{invoice.items.map((item, index) => (
						<tr
							key={item.id}
							className="border-neutral-300 border-b"
						>
							<td className="p-1.5">{index + 1}</td>
							<td className="p-1.5">
								{item.itemName}
								{item.description ? (
									<span className="block text-neutral-500 text-xs">{item.description}</span>
								) : null}
							</td>
							<td
								className="p-1.5 text-end"
								dir="ltr"
							>
								{item.qty.toString()}
							</td>
							<td
								className="p-1.5 text-end"
								dir="ltr"
							>
								{item.rate.toString()}
							</td>
							<td
								className="p-1.5 text-end"
								dir="ltr"
							>
								{item.netAmount.toString()}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{showInclusiveNote ? (
				<p className="mt-1 text-neutral-600 text-xs">
					* أسعار السطور المعلَّمة «شاملة» تتضمن الضريبة؛ الصافي أعلاه بعد فصلها (§8).
				</p>
			) : null}

			{/* taxes + totals */}
			<section className="mt-4 flex justify-start">
				<table className="w-72 border-collapse text-sm">
					<tbody>
						<tr>
							<td className="p-1 font-semibold">الصافي</td>
							<td
								className="p-1 text-end"
								dir="ltr"
							>
								{invoice.netTotal.toString()}
							</td>
						</tr>
						{invoice.taxes.map((row) => (
							<tr key={row.id}>
								<td className="p-1">{row.description}</td>
								<td
									className="p-1 text-end"
									dir="ltr"
								>
									{row.taxAmountAfterDiscountAmount.toString()}
								</td>
							</tr>
						))}
						{Number(invoice.discountAmount) !== 0 ? (
							<tr>
								<td className="p-1">الخصم</td>
								<td
									className="p-1 text-end"
									dir="ltr"
								>
									-{invoice.discountAmount.toString()}
								</td>
							</tr>
						) : null}
						<tr className="border-black border-t">
							<td className="p-1 font-semibold">الإجمالي</td>
							<td
								className="p-1 text-end"
								dir="ltr"
							>
								{invoice.grandTotal.toString()}
							</td>
						</tr>
						{!invoice.disableRoundedTotal ? (
							<tr>
								<td className="p-1 font-semibold">الإجمالي بعد التقريب</td>
								<td
									className="p-1 text-end font-semibold"
									dir="ltr"
								>
									{invoice.roundedTotal.toString()}
								</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</section>

			{/* in_words — the stored NFR-6 Arabic tafqit */}
			{invoice.inWords ? (
				<p className="mt-3 rounded border border-neutral-300 p-2 text-sm">
					<span className="font-semibold">فقط: </span>
					{invoice.inWords}
				</p>
			) : null}

			{/* payment schedule */}
			{showSchedule ? (
				<section className="mt-4">
					<h2 className="mb-1 font-semibold text-sm">جدول الدفعات</h2>
					<table className="w-full border-collapse text-sm">
						<thead>
							<tr className="border-black border-y bg-neutral-100">
								<th className="p-1.5 text-start">الوصف</th>
								<th className="p-1.5 text-start">تاريخ الاستحقاق</th>
								<th className="p-1.5 text-end">النسبة</th>
								<th className="p-1.5 text-end">المبلغ</th>
							</tr>
						</thead>
						<tbody>
							{invoice.schedule.map((row) => (
								<tr
									key={row.id}
									className="border-neutral-300 border-b"
								>
									<td className="p-1.5">{row.description ?? "—"}</td>
									<td
										className="p-1.5"
										dir="ltr"
									>
										{day(row.dueDate)}
									</td>
									<td
										className="p-1.5 text-end"
										dir="ltr"
									>
										{row.invoicePortion.toString()}%
									</td>
									<td
										className="p-1.5 text-end"
										dir="ltr"
									>
										{row.paymentAmount.toString()}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</section>
			) : null}

			<footer className="mt-6 border-neutral-300 border-t pt-2 text-center text-neutral-500 text-xs">
				المبلغ المستحق: <span dir="ltr">{payable.toString()}</span> {invoice.currencyCode} —
				حُرّرت آليًا من دفتر الأستاذ (§7.2)
			</footer>
		</div>
	);
}

export const Route = createFileRoute("/print/sales-invoice")({
	ssr: false,
	validateSearch: (search: Record<string, unknown>): { id: string } => ({
		id: typeof search.id === "string" ? search.id : "",
	}),
	component: PrintSalesInvoice,
});

import { IconReceipt, IconScissors } from "@tabler/icons-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { PaymentModal } from "@/features/appointments/components/invoice/payment-modal";
import { PaymentSuccessModal } from "@/features/appointments/components/invoice/payment-success-modal";
import { useGroomingMutations } from "@/features/care/grooming/hooks/use-grooming";
import { PaymentMethod } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type {
	AppointmentResponse,
	AppointmentServiceResponse,
} from "@/server/appointments/appointments.type";
import type { GroomingSessionDetail } from "@/server/grooming/grooming.type";
import type { InvoiceResponse } from "@/server/invoices/invoices.type";

// تبويب فاتورة الجلسة — نفس بنية تبويب فاتورة الأشعّة: بطاقات في الأعلى، شريط
// إجمالي بزرّ السداد، ثم جدول البنود.
//
// الفرق الجوهري: فاتورة التجميل تُصدَر تلقائيًا عند «جاهز للاستلام»، وقبل ذلك
// قد لا تكون موجودة أصلًا. صفحةٌ تكتفي بقول «لم تُصدر» تترك المستخدم عالقًا،
// فالزرّ هنا يُصدرها عند الطلب (دفعة مقدَّمة، أو وليّ أمر يريد الرقم قبل أن يغادر).

const money = (value: unknown) =>
	`${Number(value ?? 0).toLocaleString("en-US", { maximumFractionDigits: 2 })} ر.س`;

export function GroomingInvoiceTab({ session }: { session: GroomingSessionDetail }) {
	const invoice = session.invoice;
	const { issueInvoice, payInvoice, isPayingInvoice } = useGroomingMutations();
	const [payOpen, setPayOpen] = useState(false);
	const [successInvoice, setSuccessInvoice] = useState<InvoiceResponse | null>(null);

	const total = Number(invoice?.total ?? session.quoteTotal);
	const amountPaid = Number(invoice?.amountPaid ?? 0);
	const remaining = Math.max(0, total - amountPaid);
	const isPaid = invoice?.status === "PAID";
	const isPartial = amountPaid > 0 && !isPaid;

	const lines = [
		...session.items.map((item) => ({
			id: item.id,
			name: item.nameSnapshot,
			kind: "دورة",
			amount: Number(item.priceSnapshot) * item.quantity,
		})),
		...session.adjustments.map((adj) => ({
			id: adj.id,
			name: adj.labelSnapshot,
			kind: Number(adj.amount) < 0 ? "خصم" : "رسم",
			amount: Number(adj.amount),
		})),
		...session.products
			.filter((p) => p.billable)
			.map((p) => ({
				id: p.id,
				name: p.nameSnapshot,
				kind: "مستهلك",
				amount: Number(p.priceSnapshot) * Number(p.quantity),
			})),
	];

	const handlePay = async (value: number) => {
		try {
			const paid = await payInvoice({
				id: session.id,
				amountPaid: value,
				paymentMethod: PaymentMethod.CASH,
			});
			if (paid.status === "PAID") setSuccessInvoice(paid as unknown as InvoiceResponse);
			setPayOpen(false);
		} catch {
			// التوست يُدار داخل الخطّاف
		}
	};

	return (
		<div
			className="flex flex-col gap-6 p-4"
			dir="rtl"
		>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
						<IconScissors className="size-3.5" />
						<span>عدد البنود</span>
					</div>
					<p className="mt-2 font-semibold text-2xl tabular-nums">{lines.length}</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
						<IconReceipt className="size-3.5" />
						<span>رقم الفاتورة</span>
					</div>
					<p className="mt-2 font-semibold text-2xl tabular-nums">
						{invoice ? (
							invoice.code
						) : (
							<span className="text-lg text-muted-foreground">لم تُصدر بعد</span>
						)}
					</p>
					{invoice && (
						<p className="mt-1 truncate text-muted-foreground text-xs">
							المسدَّد: {money(amountPaid)}
						</p>
					)}
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center justify-between gap-2">
						<p className="text-muted-foreground text-xs">المتبقّي</p>
						<Badge
							variant="outline"
							className={cn(
								"rounded-full px-2 py-0.5 text-[11px]",
								isPaid
									? "border-emerald-200 bg-emerald-50 text-emerald-700"
									: isPartial
										? "border-amber-200 bg-amber-50 text-amber-700"
										: "border-rose-200 bg-rose-50 text-rose-700",
							)}
						>
							{isPaid ? "مسدَّدة" : isPartial ? "مسدَّدة جزئيًا" : "غير مسدَّدة"}
						</Badge>
					</div>
					<p className="mt-2 font-semibold text-2xl tabular-nums">{money(remaining)}</p>
				</div>
			</div>

			{/* الإجمالي وزرّ الإجراء — إصدار الفاتورة أوّلًا، ثم سدادها */}
			<div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4">
				<div>
					<p className="text-muted-foreground text-xs">
						{invoice ? "إجمالي الفاتورة" : "التسعيرة الحالية"}
					</p>
					<p className="mt-2 font-semibold text-2xl tabular-nums">{money(total)}</p>
					{invoice && Number(invoice.total) !== Number(session.quoteTotal) && (
						<p className="mt-1 text-muted-foreground text-xs tabular-nums">
							التسعيرة {money(session.quoteTotal)} — أعِد الإصدار لتحديث الفاتورة
						</p>
					)}
				</div>

				<div className="flex items-center gap-2">
					{!isPaid && session.items.length > 0 && (
						<Button
							type="button"
							size="sm"
							variant={invoice ? "outline" : "default"}
							className="gap-1.5"
							disabled={isPayingInvoice}
							onClick={() => {
								void issueInvoice(session.id).catch(() => {});
							}}
						>
							<IconReceipt className="size-3.5" />
							{invoice ? "تحديث الفاتورة" : "إصدار الفاتورة"}
						</Button>
					)}
					{invoice && !isPaid && (
						<Button
							type="button"
							size="sm"
							className="gap-1.5"
							disabled={isPayingInvoice}
							onClick={() => setPayOpen(true)}
						>
							<IconReceipt className="size-3.5" />
							{isPartial ? "تسجيل دفعة" : "تحصيل الفاتورة"}
						</Button>
					)}
				</div>
			</div>

			<div className="flex flex-col gap-3">
				<h3 className="font-semibold text-base">بنود الفاتورة</h3>
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start">البند</TableHead>
								<TableHead className="text-center">النوع</TableHead>
								<TableHead className="text-center">المبلغ</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{lines.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={3}
										className="text-center text-muted-foreground text-sm"
									>
										لا بنود على هذه الجلسة
									</TableCell>
								</TableRow>
							)}
							{lines.map((line) => (
								<TableRow key={line.id}>
									<TableCell className="font-medium text-sm">{line.name}</TableCell>
									<TableCell className="text-center">
										<Badge
											variant="outline"
											className="text-[10px]"
										>
											{line.kind}
										</Badge>
									</TableCell>
									<TableCell className="text-center text-sm tabular-nums">
										{money(line.amount)}
									</TableCell>
								</TableRow>
							))}
							{invoice && (
								<>
									<TableRow>
										<TableCell
											colSpan={2}
											className="text-start text-muted-foreground text-sm"
										>
											ضريبة القيمة المضافة ({Number(invoice.vatRate)}%)
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{money(invoice.vatAmount)}
										</TableCell>
									</TableRow>
									<TableRow className="font-medium">
										<TableCell
											colSpan={2}
											className="text-start"
										>
											الإجمالي
										</TableCell>
										<TableCell className="text-center tabular-nums">
											{money(invoice.total)}
										</TableCell>
									</TableRow>
								</>
							)}
						</TableBody>
					</Table>
				</div>

				{!invoice && (
					<p className="rounded-md border bg-muted/30 p-3 text-muted-foreground text-xs">
						تُصدر فاتورة الجلسة تلقائيًا عند نقلها إلى «جاهز للاستلام» — أو أصدرها الآن من الزرّ
						أعلاه إن أردت تحصيل دفعة مقدَّمة.
					</p>
				)}
			</div>

			{invoice && payOpen && (
				<PaymentModal
					open={payOpen}
					onClose={() => setPayOpen(false)}
					invoice={invoice as unknown as InvoiceResponse}
					subject={{
						heading: "طلب دفع فاتورة تجميل",
						ownerName: session.owner?.name ?? "—",
						date: session.scheduledAt,
						lines: lines.map((line) => ({
							id: line.id,
							name: line.name,
							badge: line.kind,
							amountLabel: money(line.amount),
						})),
					}}
					onPay={handlePay}
					isPaying={isPayingInvoice}
					defaultAmount={remaining}
				/>
			)}

			{successInvoice && (
				<PaymentSuccessModal
					open={!!successInvoice}
					onClose={() => setSuccessInvoice(null)}
					invoice={successInvoice}
					// بنود الجلسة بشكل بنود الزيارة — قالب طباعة واحد للمصادر كلها
					services={
						lines.map((line) => ({
							id: line.id,
							quantity: 1,
							priceSnapshot: line.amount,
							paidAt: successInvoice.paidAt,
							service: { name: line.name },
						})) as unknown as AppointmentServiceResponse[]
					}
					appointment={
						{
							startsAt: session.scheduledAt,
							consultationFeeSnapshot: null,
							consultationType: null,
							owner: { name: session.owner?.name ?? "—" },
							patient: { name: session.patient.name },
						} as unknown as AppointmentResponse
					}
					ownerName={session.owner?.name ?? "—"}
					patientName={session.patient.name}
					servicesLabel="بنود الجلسة"
				/>
			)}
		</div>
	);
}

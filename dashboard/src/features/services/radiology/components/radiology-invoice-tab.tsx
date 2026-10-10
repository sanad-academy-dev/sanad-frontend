import { IconBodyScan, IconReceipt } from "@tabler/icons-react";
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
import { usePayRadiologyInvoice } from "@/features/services/radiology/hooks/use-radiology-mutations";
import { PaymentMethod, RadiologyStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type {
	AppointmentResponse,
	AppointmentServiceResponse,
} from "@/server/appointments/appointments.type";
import { sectionAmount } from "@sanad/contracts/runtime/server/invoices/invoice-sections";
import type { InvoiceResponse } from "@/server/invoices/invoices.type";
import {
	RADIOLOGY_PAYMENT_META,
	type RadiologyOrderResponse,
	radiologyPaymentStatus,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";

// تبويب فاتورة الطلب — نفس بنية تبويب فاتورة التحاليل ونفس نافذة الدفع:
// بطاقات في الأعلى، شريط إجمالي بزر "دفع الكل"، ثم جدول البنود وفيه زر سداد
// لكل فحص على حدة. الفاتورة بوابة: لا يغادر الطلب الطلبات قبل سدادها كاملةً.

/** Decimal يصل من الخادم ككائن/نص — نحوّله بالنص لتفادي فقد الدقة */
const formatMoney = (value: unknown) => {
	const n = Number(value ?? 0);
	return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0";
};

export function RadiologyInvoiceTab({ order }: { order: RadiologyOrderResponse }) {
	const invoice = order.invoice;
	const payment = radiologyPaymentStatus(order);
	const paymentMeta = RADIOLOGY_PAYMENT_META[payment];
	const { payInvoice, isPending } = usePayRadiologyInvoice();

	// البند الجاري سداده: معرّف فحص، أو "ALL" لدفعة على الفاتورة كلها
	const [payTarget, setPayTarget] = useState<string | null>(null);
	const [successInvoice, setSuccessInvoice] = useState<InvoiceResponse | null>(null);

	// البنود الملغاة لا تُحاسَب — المجموع يطابق ما يحسبه الخادم
	const billable = order.items.filter((item) => item.status !== RadiologyStatus.CANCELLED);
	const subtotal = billable.reduce((sum, item) => sum + Number(item.priceSnapshot), 0);
	const total = Number(invoice?.total ?? 0);
	const amountPaid = Number(invoice?.amountPaid ?? 0);
	const remaining = Math.max(0, total - amountPaid);
	const isPaid = payment === "PAID";
	// المربوط بإقامة يُحاسَب على فاتورتها — لا زرّ سداد هنا
	const onStayInvoice = payment === "INPATIENT";
	const isPartial = amountPaid > 0 && !isPaid;
	const canPay = !onStayInvoice && !!invoice && !isPaid && billable.length > 0;

	// حصة الفحص من الإجمالي (بعد الخصم والضريبة) — نفس صيغة الخادم،
	// فلا يظهر للمستخدم رقم ويُخصم منه رقم آخر
	const itemAmount = (price: unknown) =>
		Math.min(sectionAmount(Number(price ?? 0), subtotal, total), remaining);

	const target = payTarget && payTarget !== "ALL" ? payTarget : null;
	const targetItem = target ? billable.find((item) => item.id === target) : null;

	const handlePay = async (
		value: number,
		insurance?: { apply: boolean; excludedLineRefs: string[] },
	) => {
		try {
			const paid = await payInvoice({
				id: order.id,
				amountPaid: value,
				paymentMethod: PaymentMethod.CASH,
				itemId: targetItem?.id,
				insurance,
			});
			if (paid.status === "PAID") setSuccessInvoice(paid as unknown as InvoiceResponse);
			setPayTarget(null);
		} catch {
			// التوست يُدار داخل الخطّاف
		}
	};

	return (
		<div
			className="flex flex-col gap-6 overflow-y-auto p-6"
			dir="rtl"
		>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<IconBodyScan className="size-3.5" />
						<span>عدد الفحوصات</span>
					</div>
					<p className="mt-2 text-2xl font-semibold tabular-nums">{billable.length}</p>
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
						<IconReceipt className="size-3.5" />
						<span>رقم الفاتورة</span>
					</div>
					<p className="mt-2 text-2xl font-semibold tabular-nums">
						{invoice ? (
							invoice.code
						) : (
							<span className="text-lg text-muted-foreground">لم تُصدر بعد</span>
						)}
					</p>
					{invoice && (
						<p className="mt-1 truncate text-xs text-muted-foreground">
							المسدَّد: {formatMoney(amountPaid)} ر.س
						</p>
					)}
				</div>

				<div className="rounded-lg border bg-card p-4">
					<div className="flex items-center justify-between gap-2">
						<p className="text-xs text-muted-foreground">المتبقّي</p>
						<Badge
							variant="outline"
							className={cn("rounded-full px-2 py-0.5 text-[11px]", paymentMeta.className)}
						>
							{paymentMeta.label}
						</Badge>
					</div>
					<p className="mt-2 text-2xl font-semibold tabular-nums">
						{formatMoney(remaining)} ر.س
					</p>
				</div>
			</div>

			{/* الإجمالي — سداد الفاتورة كلها دفعة واحدة */}
			<div className="flex items-center justify-between gap-3 rounded-lg border bg-card p-4">
				<div>
					<p className="text-xs text-muted-foreground">إجمالي الفاتورة</p>
					<p className="mt-2 text-2xl font-semibold tabular-nums">
						{formatMoney(invoice?.subtotal ?? subtotal)} ر.س
					</p>
					{isPartial && (
						<p className="mt-1 text-xs tabular-nums text-muted-foreground">
							مدفوع {formatMoney(amountPaid)} من {formatMoney(total)} ر.س
						</p>
					)}
				</div>

				{canPay && (
					<Button
						type="button"
						size="sm"
						className="gap-1.5"
						onClick={() => setPayTarget("ALL")}
						disabled={isPending}
					>
						<IconReceipt className="size-3.5" />
						{isPartial ? "تسجيل دفعة" : "دفع الكل"}
					</Button>
				)}
			</div>

			{/* بنود الفاتورة — فحوصات الطلب بلقطات أسعارها وقت الطلب، ولكلٍّ سداده */}
			<div className="flex flex-col gap-3">
				<div className="flex items-center justify-between">
					<h3 className="text-base font-semibold">الفحوصات</h3>
					{!invoice && (
						<span className="text-xs text-muted-foreground">
							تُصدر الفاتورة تلقائيًا مع الطلب
						</span>
					)}
				</div>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="text-start">الفحص</TableHead>
								<TableHead className="text-center">العدد</TableHead>
								<TableHead className="text-center">الحالة</TableHead>
								<TableHead className="text-center">الإجمالي</TableHead>
								<TableHead className="text-center">الإجراءات</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{billable.length === 0 && (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center text-sm text-muted-foreground"
									>
										لا توجد بنود على هذه الفاتورة
									</TableCell>
								</TableRow>
							)}
							{billable.map((item) => {
								const itemPaid = item.paidAt !== null;
								return (
									<TableRow key={item.id}>
										<TableCell className="text-sm font-medium">{item.service.name}</TableCell>
										<TableCell className="text-center text-sm text-muted-foreground">
											1
										</TableCell>
										<TableCell className="text-center">
											<Badge
												variant="outline"
												className={cn(
													"rounded-full text-xs",
													itemPaid
														? "border-emerald-200 bg-emerald-50 text-emerald-700"
														: "border-rose-200 bg-rose-50 text-rose-700",
												)}
											>
												{itemPaid ? "مدفوعة" : "غير مدفوعة"}
											</Badge>
										</TableCell>
										<TableCell className="text-center text-sm tabular-nums">
											{formatMoney(item.priceSnapshot)} ر.س
										</TableCell>
										<TableCell className="text-center">
											{!itemPaid && canPay && (
												<Button
													type="button"
													size="sm"
													variant="outline"
													className="gap-1.5"
													onClick={() => setPayTarget(item.id)}
													disabled={isPending}
												>
													<IconReceipt className="size-3.5" />
													دفع
												</Button>
											)}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>

				{!invoice && (
					<p className="rounded-md border bg-muted/30 p-3 text-xs text-muted-foreground">
						لم تُصدر فاتورة لهذا الطلب بعد — لا يمكن المضيّ في أي فحص قبل إصدارها وسدادها.
					</p>
				)}
			</div>

			{invoice && payTarget && (
				<PaymentModal
					open={!!payTarget}
					onClose={() => setPayTarget(null)}
					invoice={invoice as unknown as InvoiceResponse}
					subject={{
						heading: "طلب دفع فاتورة أشعة",
						ownerName: order.owner.name,
						ownerId: order.owner.id,
						date: order.createdAt,
						lines: billable.map((item) => ({
							id: item.id,
							name: item.service.name,
							badge: "فحص",
							amountLabel: `${formatMoney(item.priceSnapshot)} ر.س`,
						})),
					}}
					onPay={handlePay}
					isPaying={isPending}
					defaultAmount={targetItem ? itemAmount(targetItem.priceSnapshot) : remaining}
					sectionLabel={targetItem?.service.name}
				/>
			)}

			{successInvoice && (
				<PaymentSuccessModal
					open={!!successInvoice}
					onClose={() => setSuccessInvoice(null)}
					invoice={successInvoice}
					// بنود الأشعة بشكل بنود الزيارة — نفس ما تفعله صفحة المالية
					// لفواتير الأشعة، فتُطبع الفاتورة بقالب واحد للمصادر كلها
					services={
						billable.map((item) => ({
							id: item.id,
							quantity: 1,
							priceSnapshot: item.priceSnapshot,
							paidAt: item.paidAt,
							service: { name: item.service.name },
						})) as unknown as AppointmentServiceResponse[]
					}
					appointment={
						{
							startsAt: order.createdAt,
							consultationFeeSnapshot: null,
							consultationType: null,
							owner: { name: order.owner.name },
							patient: { name: order.patient.name },
						} as unknown as AppointmentResponse
					}
					ownerName={order.owner.name}
					patientName={order.patient.name}
					servicesLabel="الفحوصات"
				/>
			)}
		</div>
	);
}

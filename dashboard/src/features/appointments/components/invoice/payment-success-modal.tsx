import { IconDownload, IconPrinter } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { printInvoice } from "@/features/appointments/components/invoice/print-invoice";
import type {
	AppointmentProductResponse,
	AppointmentResponse,
	AppointmentServiceResponse,
} from "@/server/appointments/appointments.type";
import type { InvoiceResponse } from "@/server/invoices/invoices.type";

const FALLBACK_CASH_LABEL = "كاش";

function paymentMethodLabel(method: InvoiceResponse["paymentMethod"]) {
	if (method === "CASH") return FALLBACK_CASH_LABEL;
	return "—";
}

// يتحمّل Decimal ونصًّا ورقمًا وقيمًا فارغة (null/undefined) — بعض الفواتير قد تُرجع
// حقلًا مفقودًا؛ Number() يحوّل Decimal عبر valueOf ويعطي NaN للقيم الفارغة فنعيد "0"
const formatMoney = (value: unknown) => {
	const n = value == null ? 0 : Number(value);
	return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0";
};

// الكمية المحاسَبة = الكمية − المجانية (صفر إن كان الصنف مجانيًا بالكامل)
const billableProductQty = (p: {
	quantity: number;
	freeQuantity: number;
	fullyFree: boolean;
}) => (p.fullyFree ? 0 : Math.max(0, p.quantity - p.freeQuantity));

interface PaymentSuccessModalProps {
	open: boolean;
	onClose: () => void;
	invoice: InvoiceResponse;
	services: AppointmentServiceResponse[];
	products?: AppointmentProductResponse[];
	appointment?: AppointmentResponse;
	ownerName: string;
	patientName: string;
	/** عنوان قسم البنود — «التحاليل» في فاتورة طلب التحاليل بدل «الدورات» */
	servicesLabel?: string;
}

export function PaymentSuccessModal({
	open,
	onClose,
	invoice,
	services,
	products = [],
	appointment,
	ownerName,
	patientName,
	servicesLabel = "الدورات",
}: PaymentSuccessModalProps) {
	const paidDateLabel = invoice.paidAt
		? new Intl.DateTimeFormat("ar-SA", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}).format(new Date(invoice.paidAt))
		: "";

	// رسم الكشف من اللقطة المأخوذة عند الحجز (نفس ما فوتره الخادم)
	const consultationFee = Number(appointment?.consultationFeeSnapshot ?? 0);

	// البنود مفصولة بأقسامها كما في تبويب الفاتورة: الكشف ثم الدورات ثم الأصناف.
	// القسم الفارغ لا يظهر أصلًا، فلا ترويسة بلا بنود تحتها.
	const sections: {
		key: string;
		title: string;
		total: number;
		rows: { id: string; name: string; amountLabel: string }[];
	}[] = [
		...(consultationFee > 0
			? [
					{
						key: "consultation",
						title: "الكشف",
						total: consultationFee,
						rows: [
							{
								id: "consultation",
								name: appointment?.consultationType?.name ?? "كشف",
								amountLabel: `${formatMoney(consultationFee)} ر.س`,
							},
						],
					},
				]
			: []),
		...(services.length > 0
			? [
					{
						key: "services",
						title: servicesLabel,
						total: services.reduce(
							(sum, row) => sum + Number(row.priceSnapshot) * row.quantity,
							0,
						),
						rows: services.map((row) => ({
							id: row.id,
							name: row.service.name,
							amountLabel: `${formatMoney(Number(row.priceSnapshot) * row.quantity)} ر.س`,
						})),
					},
				]
			: []),
		...(products.length > 0
			? [
					{
						key: "products",
						title: "الأدوية والمستلزمات",
						total: products.reduce(
							(sum, row) => sum + Number(row.priceSnapshot) * billableProductQty(row),
							0,
						),
						rows: products.map((row) => ({
							id: row.id,
							name: row.nameSnapshot,
							// الصنف المجاني بالكامل يظهر بلا مبلغ بدل صفر يوهم بخطأ سعر
							amountLabel:
								billableProductQty(row) === 0
									? "مجاني"
									: `${formatMoney(Number(row.priceSnapshot) * billableProductQty(row))} ر.س`,
						})),
					},
				]
			: []),
	];

	// الطباعة والتحميل يفتحان الفاتورة في نافذة منفصلة ويستدعيان حوار الطباعة؛
	// التحميل = «حفظ كـ PDF» من نفس الحوار.
	const handlePrint = () =>
		printInvoice({ invoice, services, products, appointment, ownerName, patientName });

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => !o && onClose()}
		>
			<DialogContent
				// لوحة جانبية على اليسار تملأ المحور الرأسي مع هامش بسيط (بدل التوسيط)
				// flex-col بدل الشبكة: جسم قابل للتمرير + تذييل ثابت أسفل اللوحة
				className="start-auto top-2 bottom-2 left-2 flex h-auto max-h-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden p-0 rtl:translate-x-0 sm:max-w-md"
				dir="rtl"
			>
				<div className="flex flex-1 flex-col gap-5 overflow-y-auto p-5">
					<div className="flex flex-col items-center gap-3 pt-2 text-center">
						<img
							src="/Bold Duotone/School/Diploma Verified.png"
							alt=""
							className="size-24"
						/>
						<h3 className="text-base font-semibold">تم الدفع بنجاح</h3>
						<div className="flex flex-col items-center gap-1">
							<p className="text-xs text-muted-foreground">المبلغ</p>
							<p className="text-2xl font-bold tabular-nums">
								{formatMoney(invoice.total)} ر.س
							</p>
						</div>
						<div className="flex flex-col items-center gap-1">
							<p className="text-xs text-muted-foreground">
								العميل: {ownerName} • الطفل: {patientName}
							</p>
							<p className="text-xs text-muted-foreground">
								معرف الفاتورة: {invoice.code} • {paidDateLabel}
							</p>
						</div>
					</div>

					<div className="flex flex-col gap-4 rounded-lg border bg-card p-4">
						<div className="flex flex-col gap-3">
							<h4 className="text-sm font-semibold">ملخص الدورة</h4>
							{sections.map((section) => (
								<div
									key={section.key}
									className="flex flex-col gap-2.5"
								>
									<Separator />
									<div className="flex items-center justify-between gap-2">
										<p className="text-xs font-bold text-muted-foreground">{section.title}</p>
										<span className="text-xs font-semibold tabular-nums">
											{formatMoney(section.total)} ر.س
										</span>
									</div>
									{section.rows.map((row) => (
										<div
											key={row.id}
											className="flex items-center justify-between gap-2 ps-2 text-sm"
										>
											<span className="min-w-0 truncate font-medium">{row.name}</span>
											<span className="shrink-0 text-xs text-muted-foreground tabular-nums">
												{row.amountLabel}
											</span>
										</div>
									))}
								</div>
							))}
						</div>

						<div className="flex flex-col gap-3">
							<Separator />
							<div className="flex flex-col gap-2 text-sm">
								<div className="flex items-center justify-between">
									<span>المجموع الفرعي</span>
									<span className="tabular-nums">{formatMoney(invoice.subtotal)} ر.س</span>
								</div>
								<div className="flex items-center justify-between">
									<span>ضريبة القيمة المضافة ({invoice.vatRate?.toString() ?? "0"}%)</span>
									<span className="tabular-nums">{formatMoney(invoice.vatAmount)} ر.س</span>
								</div>
								{(invoice.membershipAdjustments?.length ?? 0) > 0 && (
									<div className="flex items-center justify-between text-emerald-700">
										{/* [MI-P2] BR-M6.7: تسويات العضوية على تفاصيل الفاتورة */}
										<span>خصم العضوية</span>
										<span className="tabular-nums">
											-
											{formatMoney(
												invoice.membershipAdjustments.reduce(
													(sum, row) => sum + Number(row.amount),
													0,
												),
											)}{" "}
											ر.س
										</span>
									</div>
								)}
								<div className="flex items-center justify-between">
									<span>الخصم</span>
									<span className="tabular-nums">{formatMoney(invoice.discount)} ر.س</span>
								</div>
								<div className="flex items-center justify-between">
									<span>وسيلة الدفع</span>
									<span>{paymentMethodLabel(invoice.paymentMethod)}</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="flex items-center gap-2 border-t px-4 py-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="gap-1.5"
						onClick={handlePrint}
					>
						<IconPrinter className="size-3.5" />
						طباعة الفاتورة
					</Button>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="gap-1.5"
						onClick={handlePrint}
					>
						<IconDownload className="size-3.5" />
						تحميل الفاتورة
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

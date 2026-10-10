import {
	IconArrowsDiagonal,
	IconBone,
	IconBrandWhatsapp,
	IconChevronLeft,
	IconCircleCheckFilled,
	IconPrinter,
	IconWriting,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { usePaySale } from "@/features/inventory/hooks/use-create-sale";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { cn } from "@/lib/utils";
import type { PaymentMethod, SaleResponse } from "@/server/sales/sales.type";

const fmt = (n: unknown) =>
	`${Number(n).toLocaleString("ar-SA", { minimumFractionDigits: 2 })} ر.س`;
const dateFmt = new Intl.DateTimeFormat("ar-SA", {
	dateStyle: "long",
	timeStyle: "short",
});

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
	CASH: "كاش",
	CARD: "بطاقة",
	TRANSFER: "تحويل",
};

// نصّ رسالة نجاح الدفع حسب وسيلة الدفع (مطابق Figma)
const PAID_VIA: Record<PaymentMethod, string> = {
	CASH: "نقدًا",
	CARD: "عبر بطاقة ائتمانية",
	TRANSFER: "عبر تحويل بنكي",
};

// توست نجاح الدفع — أخضر مع علامة صح وزر إغلاق (مطابق Figma)
const showInvoicePaidToast = (method: PaymentMethod) =>
	toast.custom(
		(t) => (
			<div
				dir="rtl"
				className="flex w-[345px] items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-1 py-3 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]"
			>
				<button
					type="button"
					onClick={() => toast.dismiss(t)}
					className="flex size-5 shrink-0 items-center justify-center rounded-[4px] opacity-40"
					aria-label="إغلاق"
				>
					<IconX className="size-3 text-[#9B9B9D]" />
				</button>
				<span className="flex-1 text-right text-[13px] font-medium tracking-[-0.08px] text-[#008A2E]">
					تمت دفع الفاتورة بنجاح {PAID_VIA[method]}
				</span>
				<IconCircleCheckFilled className="size-5 shrink-0 text-[#008A2E]" />
			</div>
		),
		{ duration: 4000 },
	);

const initials = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0])
		.join("");

export function InvoiceModal({
	sale,
	onClose,
}: {
	sale: SaleResponse | null;
	onClose: () => void;
}) {
	const { clinicInfo } = useClinicInfo();
	const { paySale, isPending } = usePaySale();

	if (!sale) return null;

	const isPaid = sale.status === "PAID";
	const customer = sale.customerName?.trim() || "عميل نقدي";

	const handlePay = async () => {
		if (isPaid) return;
		try {
			const paid = await paySale({ saleId: sale.id, paymentMethod: sale.paymentMethod });
			showInvoicePaidToast(paid.paymentMethod);
			onClose();
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "فشل دفع الفاتورة");
		}
	};

	return (
		<Dialog
			open={!!sale}
			onOpenChange={(o) => !o && onClose()}
		>
			<DialogContent
				showCloseButton={false}
				dir="rtl"
				id="invoice-print-area"
				className="max-w-[742px] gap-0 overflow-hidden rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white p-0 ring-0 sm:max-w-[742px]"
			>
				{/* عنوان/وصف مخفيان لإمكانية الوصول (يمنعان تحذير Radix) */}
				<DialogTitle className="sr-only">فاتورة مبيعات {sale.code}</DialogTitle>
				<DialogDescription className="sr-only">
					تفاصيل فاتورة المبيعات وحالة الدفع
				</DialogDescription>

				{/* ─── شريط علوي: مسار/عنوان الفاتورة (يمين) + أدوات (يسار) ─── */}
				<div className="flex items-center justify-between border-b border-[#E5E5E5] px-3 py-[7.5px] print:hidden">
					{/* مسار/عنوان الفاتورة — يمين */}
					<div className="flex items-center gap-2">
						<span className="text-[10px] font-bold text-[#08090A]">فاتورة مبيعات</span>
						<span className="flex size-[15px] items-center justify-center rounded-full bg-[#F5F5F6] text-[9px] text-[#A3A8B0]">
							{initials(customer)}
						</span>
						<span className="text-[10px] font-bold text-[#08090A]">{customer}</span>
						<IconChevronLeft className="size-3 text-[#A3A8B0]" />
						<span className="font-mono text-[11px] text-[#A0A09B]">{sale.code}</span>
					</div>

					{/* أدوات النافذة — يسار */}
					<div className="flex items-center gap-1.5">
						<span className="flex size-[17px] items-center justify-center rounded-[4px] text-[#9B9B9D]">
							<IconArrowsDiagonal className="size-3" />
						</span>
						<button
							type="button"
							onClick={onClose}
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-[#F5F5F6]"
							aria-label="إغلاق"
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				</div>

				{/* ─── جسم الفاتورة ─── */}
				<div className="flex max-h-[70vh] flex-col gap-6 overflow-y-auto p-4">
					{/* من / إلى */}
					<div className="flex items-start justify-between gap-6">
						{/* من: الأكاديمية — "من:" والنصّ بأقصى اليمين، والأيقونة في أقصى اليمين */}
						<div
							dir="rtl"
							className="flex flex-col gap-2 text-right"
						>
							<p className="text-[12px] font-bold text-[#08090A]">من:</p>
							<div className="flex items-start gap-2">
								<div className="flex size-[50px] shrink-0 items-center justify-center rounded-[4px] bg-[#F5F5F6]">
									<IconBone className="size-6 text-[#A3A8B0]" />
								</div>
								<div className="flex flex-col gap-1 text-right">
									<p className="text-[14px] font-medium text-[#08090A]">
										{clinicInfo?.name || "الأكاديمية"}
									</p>
									<p className="text-[12px] font-medium text-[#5C5C5E]">
										{[clinicInfo?.city, clinicInfo?.address].filter(Boolean).join("، ") || "—"}
									</p>
									{clinicInfo?.taxRegistryNumber && (
										<p className="text-[12px] font-medium text-[#5C5C5E]">
											الرقم الضريبي: {clinicInfo.taxRegistryNumber}
										</p>
									)}
								</div>
							</div>
						</div>

						{/* إلى: العميل — محاذاة كاملة لليمين (RTL) */}
						<div
							dir="rtl"
							className="flex w-[238px] flex-col items-stretch gap-1.5 text-right"
						>
							<p className="text-[12px] font-bold text-[#08090A]">إلي:</p>
							<p className="text-[12px]">
								<span className="text-[11px] text-[#9B9B9D]">العميل: </span>
								<span className="font-medium text-[#08090A]">{customer}</span>
							</p>
							<p className="text-[12px]">
								<span className="text-[11px] text-[#9B9B9D]">التاريخ والوقت: </span>
								<span className="font-medium text-[#5C5C5E]">
									{dateFmt.format(new Date(sale.createdAt))}
								</span>
							</p>
							<div className="flex items-center justify-start gap-1">
								<span className="text-[11px] text-[#9B9B9D]">الحالة:</span>
								<span
									className={cn(
										"rounded-[4px] px-[4.5px] py-[1.5px] text-[8px] font-medium",
										isPaid
											? "bg-emerald-500/[0.14] text-emerald-600"
											: "bg-[#F59E0B]/[0.14] text-[#F59E0B]",
									)}
								>
									{isPaid ? "مدفوعة" : "انتظار الدفع"}
								</span>
							</div>
						</div>
					</div>

					<div className="h-px w-full bg-[#EBEBEF]" />

					{/* الأصناف */}
					<div className="flex flex-col gap-3">
						<p className="text-[12px] font-bold text-[#08090A]">الأصناف</p>
						<div className="overflow-hidden rounded-[4px] border-[0.75px] border-[#E5E5E5]">
							<table
								className="w-full text-right"
								dir="rtl"
							>
								<thead>
									<tr className="border-b border-[#D8D8D8] text-[12px] font-semibold text-[#5C5C5E]">
										<th className="px-3 py-2 text-right font-semibold">الصنف</th>
										<th className="px-3 py-2 text-right font-semibold">الكمية</th>
										<th className="px-3 py-2 text-right font-semibold">السعر</th>
										<th className="px-3 py-2 text-right font-semibold">الإجمالي</th>
									</tr>
								</thead>
								<tbody>
									{sale.items.map((it) => (
										<tr
											key={it.id}
											className="border-b border-[#D8D8D8] text-[11px] font-semibold text-[#1E1E1E] last:border-0"
										>
											<td className="px-3 py-2">{it.name}</td>
											<td className="px-3 py-2 tabular-nums">{it.quantity}</td>
											<td className="px-3 py-2 tabular-nums">{fmt(it.unitPrice)}</td>
											<td className="px-3 py-2 tabular-nums">{fmt(it.lineTotal)}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>

					{/* صندوق الإجماليات */}
					<div className="rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-[#F1F7FF] p-[15px]">
						<div className="flex flex-col gap-2">
							<div className="flex items-center justify-between text-[12px] text-[#08090A]">
								<span>المجموع الفرعي</span>
								<span className="tabular-nums">{fmt(sale.subtotal)}</span>
							</div>
							{/* [P12B.3] سطور الضريبة كما طُبِّقت وقت البيع (لقطة القالب). كان هنا
							    سطر واحد بنسبة `sale.taxRate` — وهي الآن نسبة مشتقّة للعرض، تجمع
							    سطرين مختلفين في رقم واحد لو كان القالب بسطرين. */}
							{sale.taxes.length > 0 ? (
								sale.taxes.map((row) => (
									<div
										key={row.id}
										className="flex items-center justify-between text-[12px] text-[#08090A]"
									>
										<span>
											{row.description} ({Number(row.rate)}%)
										</span>
										<span className="tabular-nums">{fmt(row.taxAmount)}</span>
									</div>
								))
							) : (
								<div className="flex items-center justify-between text-[12px] text-[#08090A]">
									<span>الضريبة</span>
									<span className="tabular-nums">{fmt(sale.taxAmount)}</span>
								</div>
							)}
							<div className="flex items-center justify-between text-[12px] text-[#08090A]">
								<span>
									الخصم
									{sale.discountCode ? ` (${sale.discountCode})` : ""}
								</span>
								<span className="tabular-nums">{fmt(sale.discount)}</span>
							</div>
							<div className="flex items-center justify-between text-[12px] text-[#08090A]">
								<span>وسيلة الدفع</span>
								<span>{PAYMENT_LABEL[sale.paymentMethod]}</span>
							</div>
						</div>
						<div className="mt-2 flex items-center justify-between border-t border-[#E5E5E5] pt-2 text-[13px] font-bold text-[#08090A]">
							<span>الإجمالي</span>
							<span className="tabular-nums">{fmt(sale.total)}</span>
						</div>
					</div>
				</div>

				{/* ─── تذييل: التوقيع/الطباعة (يمين) + الدفع/الواتساب (يسار) ─── */}
				<div className="flex items-center justify-between border-t border-[#E5E5E5] px-3 py-[7.5px] print:hidden">
					{/* يمين */}
					<div className="flex items-center gap-2">
						<button
							type="button"
							className="flex h-[23px] items-center gap-1 rounded-[4px] border border-[#CFCFCF] bg-white px-2.5 text-[11px] font-semibold text-[#5C5C5E]"
						>
							<IconWriting className="size-3.5" />
							إرسال للتوقيع
						</button>
						<button
							type="button"
							onClick={() => window.print()}
							className="flex h-[23px] items-center gap-1 rounded-[4px] border border-[#CFCFCF] bg-white px-2.5 text-[11px] font-semibold text-[#5C5C5E]"
						>
							<IconPrinter className="size-3.5" />
							طباعة
						</button>
					</div>

					{/* يسار */}
					<div className="flex items-center gap-2.5">
						<div className="flex items-center gap-1">
							<Switch className="h-[15px] w-[30px]" />
							<span className="flex items-center gap-1 text-[10px] text-[#737373]">
								<IconBrandWhatsapp className="size-3.5" />
								إشعار عبر الواتساب
							</span>
						</div>
						<button
							type="button"
							onClick={handlePay}
							disabled={isPaid || isPending}
							className="flex h-[25px] items-center gap-2 rounded-[4px] bg-[#4F6AE0] px-3 text-[11px] font-semibold primaryhover:bg-[#4F6AE0]/90 disabled:opacity-50"
						>
							<span className="rounded-[4px] bg-white/20 px-[3px] py-[1.5px] text-[8px]">
								⌘↵
							</span>
							{isPaid ? "مدفوعة" : "دفع الفاتورة"}
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

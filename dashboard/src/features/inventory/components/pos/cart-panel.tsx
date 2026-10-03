import {
	IconCash,
	IconCreditCard,
	IconPercentage,
	IconPlus,
	IconRotateClockwise,
	IconShoppingBag,
	IconTransfer,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { OwnerMembershipBadge } from "@/features/accounting/memberships/components/owner-membership-badge";
import { usePatientsByOwner } from "@/features/appointments/hooks/use-patients-by-owner";
import { InvoiceModal } from "@/features/inventory/components/pos/invoice-modal";
import { RefundSaleDialog } from "@/features/inventory/components/pos/refund-sale-dialog";
import { useCreateSale, useRefundSale } from "@/features/inventory/hooks/use-create-sale";
import { useSaleQuote } from "@/features/inventory/hooks/use-sale-quote";
import { useSales } from "@/features/inventory/hooks/use-sales";
import { type SelectedRef, useCartStore } from "@/features/inventory/stores/cart.store";
import { RedemptionControl } from "@/features/loyalty/components/redemption-control";
import { useOwners } from "@/features/services/patients/hooks/use-owners";
import { cn } from "@/lib/utils";
import type { PaymentMethod, SaleResponse, SaleStatus } from "@/server/sales/sales.type";

const fmt = (n: number) => `${n.toLocaleString("ar-SA", { minimumFractionDigits: 2 })} ر.س`;
const initials = (name: string) =>
	name
		.trim()
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0])
		.join("");

const PAYMENT_METHODS: { value: PaymentMethod; label: string; icon: typeof IconCash }[] = [
	{ value: "CASH", label: "كاش", icon: IconCash },
	{ value: "CARD", label: "بطاقة", icon: IconCreditCard },
	{ value: "TRANSFER", label: "تحويل", icon: IconTransfer },
];

// [P12B.2] السجل كان يعرض المبلغ والكود وعدد الأصناف فقط — بلا حالة. بعد وجود
// الإرجاع صار ذلك ضارًّا: فاتورة مُرتجَعة تبدو كفاتورة قائمة بنفس المبلغ.
const SALE_STATUS_META: Record<SaleStatus, { label: string; className: string }> = {
	PENDING: { label: "بانتظار الدفع", className: "bg-amber-50 text-amber-700" },
	PAID: { label: "مدفوعة", className: "bg-emerald-50 text-emerald-700" },
	REFUNDED: { label: "مُرتجَعة", className: "bg-orange-50 text-orange-800" },
};

// توست حذف السلة مع زر تراجع (مطابق Figma)
const showCartClearedToast = (onUndo: () => void) =>
	toast.custom(
		(t) => (
			<div
				dir="rtl"
				className="flex w-[356px] items-center justify-between gap-3.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 py-1.5 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]"
			>
				<div className="flex items-center gap-1.5">
					<IconTrash className="size-4 shrink-0 text-[#DC2626]" />
					<span className="text-[10px] font-semibold text-[#08090A]">
						تم حذف السلة بنجاح...
					</span>
				</div>
				<button
					type="button"
					onClick={() => {
						onUndo();
						toast.dismiss(t);
					}}
					className="shrink-0 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 py-1 text-[11px] font-medium text-[#08090A]"
				>
					تراجع
				</button>
			</div>
		),
		{ position: "bottom-left", duration: 6000 },
	);

export function CartPanel() {
	const [tab, setTab] = useState<"cart" | "history">("cart");
	const [payment, setPayment] = useState<PaymentMethod>("CASH");
	const [discountOpen, setDiscountOpen] = useState(false);
	const [paymentOpen, setPaymentOpen] = useState(false);
	const [discountMode, setDiscountMode] = useState<"amount" | "percent">("amount");
	const [discountInput, setDiscountInput] = useState("");
	const [invoiceSale, setInvoiceSale] = useState<SaleResponse | null>(null);
	// [P12B.2] الفاتورة المستهدَفة بالإرجاع — الكائن لا المعرّف، ليعرض الحوار كودها
	const [refundTarget, setRefundTarget] = useState<SaleResponse | null>(null);
	const {
		items,
		discount,
		discountCode,
		customer,
		patient,
		increment,
		decrement,
		remove,
		setDiscount,
		setDiscountCode,
		setCustomer,
		setPatient,
		clear,
		restore,
	} = useCartStore();
	const [redeemPoints, setRedeemPoints] = useState(0);
	const { createSale, isPending } = useCreateSale();
	const { refundSale, isPending: isRefunding } = useRefundSale();
	const { sales } = useSales();
	const { owners } = useOwners();
	const { patients } = usePatientsByOwner(customer?.id);

	/**
	 * الرسالة تُعرض من `refundSale` عبر toast.promise؛ ما يلزم هنا هو ابتلاع الرفض
	 * حتى لا يصير رفضًا غير مُعالَج — مع إبقاء الحوار مفتوحًا عند الفشل ليعيد المستخدم
	 * المحاولة بدل أن يظنّ الإرجاع قد تمّ.
	 */
	const handleRefundConfirm = async (reason: string) => {
		if (!refundTarget) return;
		try {
			await refundSale(refundTarget.id, reason);
			setRefundTarget(null);
		} catch {
			// الخطأ معروض في التوست
		}
	};

	const handleClearCart = () => {
		if (items.length === 0) return;
		const snapshot = { items, discount, discountCode, customer, patient };
		clear();
		setDiscountInput("");
		setDiscountOpen(false);
		setRedeemPoints(0);
		showCartClearedToast(() => restore(snapshot));
	};

	const subtotal = items.reduce((s, it) => s + it.unitPrice * it.quantity, 0);
	// قيمة الخصم رقمية (مبلغ/نسبة)؛ أمّا القيمة النصّية فتُعامَل ككود خصم (ملصق فقط)
	const trimmedDiscount = discountInput.trim();
	const isCode = trimmedDiscount !== "" && Number.isNaN(Number(trimmedDiscount));
	const discountAmount = isCode
		? 0
		: discountMode === "percent"
			? (subtotal * (Number(discountInput) || 0)) / 100
			: Number(discountInput) || 0;
	// [P12B.3] الضريبة والإجمالي من الخادم — محرّك §8 نفسه الذي سيُسعّر البيع.
	// المجموع والخصم يبقيان محليَّين: هما مدخلا المستخدم، ويظهران فورًا بلا انتظار شبكة.
	const { quote, isQuoting, quoteError } = useSaleQuote({
		items: items.map((it) => ({
			inventoryItemId: it.id,
			name: it.name,
			unitPrice: it.unitPrice,
			quantity: it.quantity,
		})),
		discount: discountAmount,
		partyId: customer?.id ?? null,
		redeemPoints,
	});
	const total = quote ? Number(quote.totals.total) : null;

	// مزامنة مبلغ الخصم المحسوب مع المتجر (يُرسَل عند إنشاء الفاتورة)
	useEffect(() => {
		setDiscount(discountAmount);
	}, [discountAmount, setDiscount]);

	// [LY-P2] تبديل العميل يُصفّر النقاط: رقمٌ باقٍ من عميلٍ سابق كان سيُرسَل باسم
	// الجديد، فيرفضه الخادم في أحسن الحالات ويخصم من رصيد غيره في أسوئها.
	// biome-ignore lint/correctness/useExhaustiveDependencies: يتبع هوية العميل وحدها
	useEffect(() => {
		setRedeemPoints(0);
	}, [customer?.id]);

	const handleCheckout = async () => {
		if (items.length === 0) return;
		const noteParts = [patient && `الطفل: ${patient.name}`].filter(Boolean);
		const sale = await createSale({
			items: items.map((it) => ({
				inventoryItemId: it.id,
				name: it.name,
				unitPrice: it.unitPrice,
				quantity: it.quantity,
			})),
			discount,
			discountCode: discountCode || undefined,
			partyId: customer?.id ?? null,
			redeemPoints: redeemPoints || undefined,
			paymentMethod: payment,
			customerName: customer?.name || undefined,
			notes: noteParts.length ? noteParts.join(" · ") : undefined,
		});
		// تظهر الفاتورة بحالة "انتظار الدفع"؛ تُفرَّغ السلة بعد الإنشاء
		setInvoiceSale(sale);
		clear();
		setDiscountInput("");
		setDiscountOpen(false);
		setRedeemPoints(0);
	};

	return (
		<>
			<InvoiceModal
				sale={invoiceSale}
				onClose={() => setInvoiceSale(null)}
			/>
			<RefundSaleDialog
				open={refundTarget !== null}
				onClose={() => setRefundTarget(null)}
				onConfirm={(reason) => void handleRefundConfirm(reason)}
				isPending={isRefunding}
				saleCode={refundTarget?.code ?? ""}
			/>
			<div
				className="flex w-[406px] shrink-0 flex-col border-r border-[#E5E5E5]"
				dir="rtl"
			>
				{/* تبويبات السلة / السجل */}
				<div className="flex h-[54px] items-center gap-1.5 px-3">
					<button
						type="button"
						onClick={() => setTab("cart")}
						className={cn(
							"flex items-center gap-2 rounded-[4px] border-[0.75px] px-2 py-1 text-[11px] font-medium",
							tab === "cart"
								? "border-[#CFCFCF] bg-[#EBEBEB] text-[#1F2937]"
								: "border-transparent text-[#5C5C5E]",
						)}
					>
						<span className="flex size-[14px] items-center justify-center rounded-full bg-[#4F6AE0] text-[9px] font-bold text-white">
							{items.length}
						</span>
						السلة
					</button>
					{tab === "cart" && items.length > 0 && (
						<button
							type="button"
							onClick={handleClearCart}
							className="rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 py-1 text-[11px] font-medium text-[#DC2626]"
						>
							حذف
						</button>
					)}
					<button
						type="button"
						onClick={() => setTab("history")}
						className={cn(
							"rounded-[4px] border-[0.75px] px-2 py-1 text-[11px] font-medium",
							tab === "history"
								? "border-[#CFCFCF] bg-[#EBEBEB] text-[#1F2937]"
								: "border-[#CFCFCF] text-[#5C5C5E]",
						)}
					>
						السجل
					</button>
				</div>

				<div className="h-px w-full bg-[#EBEBEF]" />

				{tab === "history" ? (
					/* ─── السجل ─── */
					<div className="flex-1 overflow-y-auto p-3">
						{sales.length === 0 ? (
							<p className="pt-10 text-center text-sm text-muted-foreground">
								لا توجد مبيعات بعد
							</p>
						) : (
							<div className="flex flex-col gap-2">
								{sales.map((s) => {
									const meta = SALE_STATUS_META[s.status];
									const isRefunded = s.status === "REFUNDED";
									return (
										<div
											key={s.id}
											className="flex items-center justify-between rounded-[4px] border border-[#E5E5E5] px-3 py-2"
										>
											{/* RTL: أوّل عنصر في DOM يقع يمينًا */}
											<div className="flex flex-col items-start gap-1">
												<span
													className={cn(
														"text-sm font-semibold",
														isRefunded
															? "text-muted-foreground line-through"
															: "text-emerald-600",
													)}
												>
													{fmt(Number(s.total))}
												</span>
												<span
													className={cn(
														"rounded-[3px] px-1.5 py-px text-[10px] font-medium",
														meta.className,
													)}
												>
													{meta.label}
												</span>
											</div>
											<div className="flex flex-col items-end gap-1">
												<span className="font-mono text-xs text-muted-foreground">
													{s.code}
												</span>
												<span className="text-[10px] text-muted-foreground">
													{s.items.length} عنصر
												</span>
												{s.status === "PAID" ? (
													<button
														type="button"
														onClick={() => setRefundTarget(s)}
														className="flex items-center gap-1 text-[10px] font-medium text-destructive hover:underline"
													>
														<IconRotateClockwise className="size-3" />
														إرجاع
													</button>
												) : null}
												{isRefunded && s.refundReason ? (
													<span
														className="max-w-40 truncate text-[10px] text-muted-foreground"
														title={s.refundReason}
													>
														{s.refundReason}
													</span>
												) : null}
											</div>
										</div>
									);
								})}
							</div>
						)}
					</div>
				) : (
					/* ─── السلة ─── */
					<>
						{/* اختيار عميل + ربط بطفل */}
						<div className="flex flex-col gap-2 px-3 pt-3">
							<div className="border-b border-[#EBEBEF] pb-2">
								<EntityPicker
									label="اختيار عميل"
									searchPlaceholder="اختر عميل..."
									selected={customer}
									options={owners}
									emptyText="لا يوجد عملاء"
									onSelect={(c) => {
										setCustomer(c);
										setPatient(null);
									}}
									onClear={() => {
										setCustomer(null);
										setPatient(null);
									}}
								/>
								{/* [MI-P2] شارة عضوية العميل المختار — لا تعرض شيئًا لغير الأعضاء */}
								{customer && <OwnerMembershipBadge ownerId={customer.id} />}
							</div>
							<EntityPicker
								label="ربط بطفل"
								searchPlaceholder="اختر طفل..."
								selected={patient}
								options={patients}
								emptyText={customer ? "لا يوجد أطفال لهذا العميل" : "اختر عميلًا أولًا"}
								disabled={!customer}
								onSelect={setPatient}
								onClear={() => setPatient(null)}
							/>
						</div>

						<div className="flex-1 overflow-y-auto p-3">
							{items.length === 0 ? (
								<div className="flex flex-col items-center gap-2 pt-20 text-center">
									<IconShoppingBag className="size-6 text-[#9B9B9D]" />
									<p className="text-[14px] font-bold text-[#08090A]">السلة فارغة</p>
									<p className="text-[12px] text-[#08090A]">
										أضف أول منتج للفاتورة بالنقر عليه
									</p>
								</div>
							) : (
								<div className="flex flex-col gap-2">
									{items.map((it) => (
										<div
											key={it.id}
											className="flex flex-col gap-[3px] rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-[#6366F1]/[0.08] px-1.5 py-[4.5px]"
										>
											{/* الاسم (يمين) + زر الحذف (يسار) */}
											<div className="flex items-center justify-between gap-2">
												<span className="truncate text-[11px] font-medium text-[#08090A]">
													{it.name}
												</span>
												<button
													type="button"
													onClick={() => remove(it.id)}
													className="shrink-0 text-[#EF4444]"
												>
													<IconTrash className="size-4" />
												</button>
											</div>

											{/* سعر الوحدة × الكمية */}
											<span className="text-right text-[11px] text-[#9B9B9D]">
												{fmt(it.unitPrice)} ×{it.quantity}
											</span>

											{/* عدّاد الكمية (يسار) + إجمالي السطر (يمين) */}
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-[5px] text-[11px] tabular-nums text-[#08090A]">
													<button
														type="button"
														onClick={() => decrement(it.id)}
														className="px-1 leading-none"
													>
														-
													</button>
													<span className="text-[#9B9B9D]">
														{String(it.quantity).padStart(2, "0")}
													</span>
													<button
														type="button"
														onClick={() => increment(it.id)}
														className="px-1 leading-none"
													>
														+
													</button>
												</div>
												<span className="text-[11px] font-medium tabular-nums text-[#08090A]">
													{fmt(it.unitPrice * it.quantity)}
												</span>
											</div>

											{/* تحذير تجاوز المخزون المتاح */}
											{it.quantity > it.maxStock && (
												<div className="mt-[9px] rounded-[4px] bg-[#FFFBEA] px-2 py-[7px]">
													<p className="text-right text-[12px] leading-tight text-[#C34E00]">
														الكمية المطلوبة تتجاوز المخزون المتاح
													</p>
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>

						{/* ─── الإجماليات + الدفع ─── */}
						<div className="flex flex-col gap-2 border-t border-[#EBEBEF] p-3">
							{/* الخصم */}
							<div className="flex items-center justify-between border-b border-[#EBEBEF] pb-2 text-[12px]">
								<span className="text-[#9B9B9D]">الخصم</span>
								{discountOpen ? (
									<div className="flex items-center gap-1.5">
										{/* زر تطبيق الكود — يظهر فقط حين تكون القيمة نصًّا (كود خصم) */}
										{isCode ? (
											<button
												type="button"
												onClick={() => setDiscountCode(trimmedDiscount)}
												className={cn(
													"flex h-[23px] items-center justify-center rounded-[4px] px-3 text-[12px] font-bold text-white",
													discountCode === trimmedDiscount ? "bg-emerald-500" : "bg-[#5B6ABF]",
												)}
											>
												{discountCode === trimmedDiscount ? "مطبّق" : "تطبيق"}
											</button>
										) : (
											discountAmount > 0 && (
												<span className="text-[9px] text-[#DC2626]">
													-{fmt(discountAmount)}
												</span>
											)
										)}
										<input
											type="text"
											inputMode="decimal"
											value={discountInput}
											onChange={(e) => {
												setDiscountInput(e.target.value);
												if (discountCode) setDiscountCode(null);
											}}
											placeholder="00"
											className="h-[23px] w-[88px] rounded-[4px] border-[0.75px] border-[#E5E5E5] px-2 text-right text-[11px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
										/>
										<button
											type="button"
											onClick={() => setDiscountMode("percent")}
											title="نسبة مئوية"
											className={cn(
												"flex h-[23px] w-[27px] items-center justify-center rounded-[4px] border-[0.75px]",
												discountMode === "percent"
													? "border-[#6366F1] text-[#6366F1]"
													: "border-[#E5E5E5] text-[#9B9B9D]",
											)}
										>
											<IconPercentage className="size-3.5" />
										</button>
										<button
											type="button"
											onClick={() => setDiscountMode("amount")}
											title="مبلغ ثابت"
											className={cn(
												"flex h-[23px] w-[27px] items-center justify-center rounded-[4px] border-[0.75px] text-[9px] font-medium",
												discountMode === "amount"
													? "border-[#6366F1] text-[#6366F1]"
													: "border-[#E5E5E5] text-[#9B9B9D]",
											)}
										>
											ر.س
										</button>
									</div>
								) : (
									<button
										type="button"
										onClick={() => setDiscountOpen(true)}
										className="flex h-[18px] w-[21px] items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[#08090A]"
									>
										<IconPlus className="size-3" />
									</button>
								)}
							</div>

							{/* وسيلة الدفع */}
							<div className="flex items-center justify-between border-b border-[#EBEBEF] pb-2 text-[12px]">
								<span className="font-semibold text-[#1E1E1E]">وسيلة الدفع</span>
								{paymentOpen ? (
									<div className="flex items-center gap-1">
										{PAYMENT_METHODS.map((m) => {
											const Icon = m.icon;
											const active = payment === m.value;
											return (
												<button
													key={m.value}
													type="button"
													onClick={() => setPayment(m.value)}
													className={cn(
														"flex h-[23px] items-center justify-center gap-1 rounded-[4px] border-[0.75px] px-2 text-[11px] font-medium",
														active
															? "border-[#5B6ABF] text-[#6366F1]"
															: "border-[#E5E5E5] text-[#9B9B9D]",
													)}
												>
													<Icon className="size-3.5" />
													{m.label}
												</button>
											);
										})}
									</div>
								) : (
									<button
										type="button"
										onClick={() => setPaymentOpen(true)}
										className="flex h-[18px] w-[21px] items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[#08090A]"
									>
										<IconPlus className="size-3" />
									</button>
								)}
							</div>

							<div className="flex items-center justify-between text-[10px] font-bold text-[#5C5C5E]">
								<span>المجموع</span>
								<span className="tabular-nums">{fmt(subtotal)}</span>
							</div>
							{/* [MI-P2] BR-M6.4: خصم العضوية قبل الضريبة — من المحرّك نفسه لا حساب محلي */}
							{quote?.membership && (
								<div className="flex items-center justify-between text-[10px] font-bold text-emerald-700">
									<span>خصم العضوية</span>
									<span className="tabular-nums">
										-{fmt(Number(quote.membership.discountTotal))}
									</span>
								</div>
							)}
							{quote?.membership?.couponSuppressed && (
								<p className="text-[10px] text-[#C34E00]">
									خصم العضوية أكبر من القسيمة — طُبّق وحده (لا تراص)
								</p>
							)}
							{/* [P12B.3] سطر لكل سطر ضريبة في القالب المُطبَّق، بنسبته الحقيقية —
							    بدل ملصق «(15%)» واحد ثابت لا يعرف ما تُحصّله الأكاديمية فعلًا */}
							{quote?.taxRows.map((row) => (
								<div
									key={row.idx}
									className="flex items-center justify-between text-[10px] font-bold text-[#5C5C5E]"
								>
									<span>
										{row.description} ({Number(row.rate)}%)
									</span>
									<span className="tabular-nums">{fmt(Number(row.taxAmount))}</span>
								</div>
							))}

							{/* [LY-P2] §10.4 — ضابط الاستبدال فوق الإجمالي مباشرةً: القرار يُتّخذ
							    حيث يُقرأ أثره، والخصم يعود من الخادم في نفس التسعيرة */}
							<RedemptionControl
								ownerId={customer?.id ?? null}
								value={redeemPoints}
								onChange={setRedeemPoints}
								discountLabel={quote?.loyalty ? fmt(Number(quote.loyalty.discount)) : null}
								disabled={isPending}
								enabled={items.length > 0}
							/>

							{quoteError ? (
								<p className="text-[10px] font-bold text-destructive">{quoteError}</p>
							) : null}

							<div className="flex items-center justify-between text-[13px] font-bold text-[#08090A]">
								<span>الإجمالي</span>
								<span className="tabular-nums">{total === null ? "—" : fmt(total)}</span>
							</div>

							<Button
								onClick={handleCheckout}
								// لا بيع بلا تسعير: سلة غير مُسعَّرة (أو تسعير فاشل لغياب
								// قالب ضريبة) لا يجوز أن تمرّ — الخادم يرفضها على أي حال
								disabled={isPending || items.length === 0 || isQuoting || quote === null}
								className="h-[30px] w-full gap-1.5 rounded-[4px] bg-[#5B6ABF] text-[12px] font-bold primaryhover:bg-[#5B6ABF]/90 disabled:bg-[#5B6ABF]/40"
							>
								إتمام الدفع
							</Button>
						</div>
					</>
				)}
			</div>
		</>
	);
}

// صف اختيار العميل / الطفل — التسمية يمينًا وزر (+) يسارًا مع قائمة بحث
function EntityPicker({
	label,
	searchPlaceholder,
	selected,
	options,
	emptyText,
	disabled,
	onSelect,
	onClear,
}: {
	label: string;
	searchPlaceholder: string;
	selected: SelectedRef | null;
	options: { id: string; name: string; code?: string }[];
	emptyText: string;
	disabled?: boolean;
	onSelect: (ref: SelectedRef) => void;
	onClear: () => void;
}) {
	const [open, setOpen] = useState(false);
	const [query, setQuery] = useState("");
	const q = query.trim().toLowerCase();
	const filtered = q ? options.filter((o) => o.name.toLowerCase().includes(q)) : options;

	return (
		<div className="flex items-center justify-between">
			<span className="text-[11px] font-semibold text-[#1E1E1E]">
				{selected ? selected.name : label}
			</span>
			{selected ? (
				<button
					type="button"
					onClick={onClear}
					className="flex h-[18px] w-[21px] items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[#08090A]"
				>
					<IconX className="size-3" />
				</button>
			) : (
				<Popover
					open={open}
					onOpenChange={setOpen}
				>
					<PopoverTrigger asChild>
						<button
							type="button"
							disabled={disabled}
							className="flex h-[18px] w-[21px] items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] text-[#08090A] disabled:opacity-40"
						>
							<IconPlus className="size-3" />
						</button>
					</PopoverTrigger>
					<PopoverContent
						dir="rtl"
						align="end"
						sideOffset={6}
						collisionPadding={8}
						className="w-[252px] rounded-[4px] border border-[#E5E5E5] p-2.5 shadow-[0px_4px_12px_rgba(0,0,0,0.12)]"
					>
						{/* العنوان / البحث */}
						<div className="px-[9px] py-[5px]">
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder={searchPlaceholder}
								className="w-full bg-transparent text-right text-[11px] text-[#08090A] outline-none placeholder:text-[#08090A]"
							/>
						</div>
						<div className="-mx-2.5 my-1.5 h-px bg-[#E5E5E5]" />
						{/* القائمة */}
						<div className="flex max-h-[200px] flex-col gap-1 overflow-y-auto">
							{filtered.length === 0 ? (
								<p className="px-2 py-3 text-center text-[12px] text-muted-foreground">
									{emptyText}
								</p>
							) : (
								filtered.map((o) => (
									<button
										key={o.id}
										type="button"
										onClick={() => {
											onSelect({ id: o.id, name: o.name });
											setOpen(false);
											setQuery("");
										}}
										className="flex w-full items-center justify-start gap-2 rounded-[4px] px-2 py-2 hover:bg-[#F2F2F2]"
									>
										<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#4F6AE0] text-[9px] text-white">
											{initials(o.name)}
										</span>
										<span className="text-[12px] font-medium text-black">{o.name}</span>
									</button>
								))
							)}
						</div>
					</PopoverContent>
				</Popover>
			)}
		</div>
	);
}

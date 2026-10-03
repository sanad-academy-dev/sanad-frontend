import { IconBuilding, IconReceipt } from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	type InsuranceSelection,
	InsuranceSplitPanel,
} from "@/features/accounting/insurance/components/insurance-split-panel";
import { OwnerMembershipBadge } from "@/features/accounting/memberships/components/owner-membership-badge";
import { OwnerOpenBalanceChip } from "@/features/accounting/memberships/components/owner-open-balance-chip";
import { RedemptionControl } from "@/features/loyalty/components/redemption-control";
import { useInvoiceLoyaltyPreview } from "@/features/loyalty/hooks/use-redemption";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import type { InvoiceResponse } from "@/server/invoices/invoices.type";

const DASH = "—";

const formatMoney = (value: string | number) => {
	const n = typeof value === "string" ? Number(value) : value;
	return Number.isFinite(n) ? n.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "0";
};

/** سطر واحد في جدول بنود النافذة — يبنيه كل تبويب فاتورة من بنوده */
export type PaymentLine = {
	id: string;
	name: string;
	badge?: string;
	amountLabel: string;
};

/**
 * مصدر الفاتورة بشكل محايد: زيارة أو طلب تحاليل. النافذة لا تعرف أيهما،
 * فتبقى نافذة دفع واحدة للاثنين بدل نسختين تتفرّقان مع الوقت.
 */
export type PaymentSubject = {
	heading: string;
	ownerName: string;
	/** [MI-P2] لعرض شارة العضوية بجانب العميل — اختياري لأن بعض المصادر لا تحمله */
	ownerId?: string;
	date: Date | string;
	lines: PaymentLine[];
};

/** ما تحتاجه النافذة من الفاتورة فقط — يصدُق على فاتورة الزيارة وفاتورة التحاليل */
type PaymentInvoice = Pick<
	InvoiceResponse,
	"code" | "subtotal" | "vatRate" | "vatAmount" | "discount" | "total" | "amountPaid"
> &
	Partial<Pick<InvoiceResponse, "id" | "membershipAdjustments">>;

interface PaymentModalProps {
	open: boolean;
	onClose: () => void;
	invoice: PaymentInvoice;
	subject: PaymentSubject;
	onPay: (
		amountPaid: number,
		insurance?: { apply: boolean; excludedLineRefs: string[] },
		redeemPoints?: number,
	) => Promise<void> | void;
	isPaying: boolean;
	defaultAmount?: number;
	/** اسم البند/القسم عند سداده وحده — المبلغ حينها مستحقّه ولا يُحرَّر */
	sectionLabel?: string;
	/**
	 * [LY-P2] §10.4 — يُرسَم ضابط الاستبدال فقط حين يمرّره المستدعي إلى مسارٍ يشرّفه.
	 *
	 * ليس تزيينًا: هذا الحوار يخدم سبعة مواضع، وفواتير التحاليل والأشعة والتجميل
	 * والتنويم تُسدَّد بدوالّ مستقلّة لم تُوصَّل بالاستبدال. ضابطٌ يظهر فيها كان سيَعِد
	 * بخصمٍ لن يقع. العَلَم هنا هو ما يجعل الوعد مطابقًا للمسار خلفه.
	 */
	allowRedemption?: boolean;
}

export function PaymentModal({
	open,
	onClose,
	invoice,
	subject,
	onPay,
	isPaying,
	defaultAmount,
	sectionLabel,
	allowRedemption = false,
}: PaymentModalProps) {
	const { lang } = useI18n();
	const { clinicInfo } = useClinicInfo();
	const [paymentMethod, setPaymentMethod] = useState<"CASH">("CASH");
	const [discountUi, setDiscountUi] = useState("0");
	const [whatsappToggle, setWhatsappToggle] = useState(false);
	const [cashAmountUi, setCashAmountUi] = useState("");

	// [MI-P4] قسمة التأمين (BR-I9.1.2): عند تفعيلها يُحصَّل من وليّ الأمر حصته فقط
	const [insurance, setInsurance] = useState<InsuranceSelection>(null);

	// [LY-P2] §10.4 — النقاط وأثرها؛ الأثر من الخادم لا من حسابٍ محلّي
	const [redeemPoints, setRedeemPoints] = useState(0);
	const { preview, refusal } = useInvoiceLoyaltyPreview(
		allowRedemption ? invoice.id : null,
		redeemPoints,
	);
	// الإجمالي المعروض يتبع المعاينة متى صحّت — وإلّا فالإجمالي المحفوظ كما هو
	const effectiveTotal = preview ? Number(preview.total) : Number(invoice.total);

	const remaining = insurance
		? Math.max(Number(insurance.copayShare) - Number(invoice.amountPaid), 0)
		: effectiveTotal - Number(invoice.amountPaid);

	useEffect(() => {
		if (open) {
			setPaymentMethod("CASH");
			setDiscountUi(formatMoney(String(invoice.discount ?? 0)));
			setCashAmountUi((defaultAmount ?? remaining).toFixed(2));
		}
	}, [open, invoice.discount, remaining, defaultAmount]);

	useEffect(() => {
		if (!open) {
			setInsurance(null);
			// [LY-P2] حوارٌ يُغلق ثم يُفتح على فاتورةٍ أخرى يجب ألّا يحمل نقاط سابقتها
			setRedeemPoints(0);
		}
	}, [open]);

	const cashAmount = Number(cashAmountUi.replace(/,/g, ""));
	// فاتورة مغطّاة تأمينيًا بالكامل: حصة وليّ الأمر صفر — الدفع بصفر مقبول لإتمام المطالبة
	const isValidAmount =
		Number.isFinite(cashAmount) &&
		cashAmount <= remaining &&
		(cashAmount > 0 || (insurance !== null && remaining === 0));

	const fromName = clinicInfo?.name ?? DASH;
	const fromLocation =
		clinicInfo?.city || clinicInfo?.address
			? [clinicInfo?.city, clinicInfo?.address].filter(Boolean).join("، ")
			: DASH;
	const taxNumber = clinicInfo?.taxRegistryNumber ?? DASH;

	const dateLocale = lang === "ar" ? "ar-SA" : "en-US";
	const startsAt = new Date(subject.date);
	const dateLabel = new Intl.DateTimeFormat(dateLocale, {
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(startsAt);
	const timeLabel = new Intl.DateTimeFormat(dateLocale, {
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	}).format(startsAt);

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => !o && !isPaying && onClose()}
		>
			<DialogContent
				className="max-h-[92vh] overflow-y-auto sm:max-w-3xl"
				dir="rtl"
			>
				<DialogTitle className="sr-only">دفع الفاتورة</DialogTitle>
				<div className="flex items-center justify-between border-b pb-3">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold">{subject.heading}</span>
						<span className="text-sm">›</span>
						<span className="text-sm font-semibold">{subject.ownerName}</span>
					</div>
					<span className="text-xs text-muted-foreground tabular-nums">
						{invoice.code ? `INV-${invoice.code.replace(/^INV-/, "")}` : DASH}
					</span>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<p className="mb-2 text-xs text-muted-foreground">من:</p>
						<div className="flex items-start gap-2">
							<div className="flex size-9 items-center justify-center rounded-md border bg-muted/30">
								<IconBuilding className="size-4 text-muted-foreground" />
							</div>
							<div className="text-sm">
								<p className="font-semibold">{fromName}</p>
								<p className="text-muted-foreground">{fromLocation}</p>
								<p className="text-muted-foreground">الرقم الضريبي: {taxNumber}</p>
							</div>
						</div>
					</div>

					<div>
						<p className="mb-2 text-xs text-muted-foreground">إلى:</p>
						<div className="text-sm space-y-1">
							<p>
								<span className="text-muted-foreground">العميل: </span>
								<span className="font-semibold">{subject.ownerName}</span>
							</p>
							<p>
								<span className="text-muted-foreground">التاريخ والوقت: </span>
								<span className="tabular-nums">
									{dateLabel} - {timeLabel}
								</span>
							</p>
							<p>
								<span className="text-muted-foreground">الحالة: </span>
								<Badge
									variant="outline"
									className="rounded-full border-amber-200 bg-amber-50 px-2 py-0.5 text-amber-700"
								>
									انتظار الدفع
								</Badge>
							</p>
							{subject.ownerId && <OwnerMembershipBadge ownerId={subject.ownerId} />}
							{/* [MI-P6] الرصيد المفتوح أمام الكاشير قبل أن يغادر العميل — لا يُقرأ من
							    الفاتورة (قد تكون مدفوعة ومع ذلك على وليّ الأمر ذمة، قرار MI-P5 §10.3a) */}
							{subject.ownerId && <OwnerOpenBalanceChip ownerId={subject.ownerId} />}
							{/* [LY-P2] §10.4 — الاستبدال عند مقعد الدفع، ورفضُ §6.2 تحته نصًّا */}
							{allowRedemption && (
								<div className="flex flex-col gap-1">
									<RedemptionControl
										ownerId={subject.ownerId}
										value={redeemPoints}
										onChange={setRedeemPoints}
										discountLabel={preview ? `${formatMoney(preview.discount)} ر.س` : null}
										disabled={isPaying}
									/>
									{refusal ? <p className="text-destructive text-xs">{refusal}</p> : null}
								</div>
							)}
						</div>
					</div>
				</div>

				<Separator />

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div>
						<h4 className="mb-2 text-sm font-semibold">بنود الفاتورة</h4>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead className="text-right">البند</TableHead>
										<TableHead className="text-center">الحالة</TableHead>
										<TableHead className="text-center">السعر</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{subject.lines.map((line) => (
										<TableRow key={line.id}>
											<TableCell className="text-sm font-medium">{line.name}</TableCell>
											<TableCell className="text-center">
												{line.badge && (
													<Badge
														variant="secondary"
														className="rounded-sm text-xs"
													>
														{line.badge}
													</Badge>
												)}
											</TableCell>
											<TableCell className="text-center text-sm tabular-nums">
												{line.amountLabel}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>

						{/* [MI-P4] لوحة قسمة التأمين — لا تظهر لسداد قسم بعينه (المطالبة على الفاتورة كاملة) */}
						{!sectionLabel && (
							<div className="mt-4">
								<InsuranceSplitPanel
									invoiceId={invoice.id}
									onSelectionChange={setInsurance}
								/>
							</div>
						)}

						<h4 className="mt-6 mb-2 text-sm font-semibold">ملخص الدفع</h4>
						<div className="rounded-lg bg-primary/5 p-4 text-sm">
							<div className="flex items-center justify-between">
								<span>المجموع الفرعي</span>
								<span className="tabular-nums">
									{formatMoney(String(invoice.subtotal ?? 0))} ر.س
								</span>
							</div>
							<div className="mt-2 flex items-center justify-between">
								<span>ضريبة القيمة المضافة ({String(invoice.vatRate ?? 0)}%)</span>
								<span className="tabular-nums">
									{formatMoney(String(invoice.vatAmount ?? 0))} ر.س
								</span>
							</div>
							{(invoice.membershipAdjustments?.length ?? 0) > 0 && (
								<div className="mt-2 flex items-center justify-between text-emerald-700">
									{/* [MI-P2] BR-M6.7: مجموع تسويات العضوية — يفسّر فارق الإجمالي عن مجموع البنود */}
									<span>
										خصم العضوية
										{invoice.membershipAdjustments?.some(
											(row) => row.benefitType === "INCLUDED_UNITS",
										) && " (وحدات مشمولة)"}
									</span>
									<span className="tabular-nums">
										-
										{formatMoney(
											(invoice.membershipAdjustments ?? []).reduce(
												(sum, row) => sum + Number(row.amount),
												0,
											),
										)}{" "}
										ر.س
									</span>
								</div>
							)}
							<div className="mt-2 flex items-center justify-between">
								<Label
									htmlFor="invoice-discount"
									className="text-sm font-normal"
								>
									الخصم
								</Label>
								<Input
									id="invoice-discount"
									type="text"
									className="h-7 w-24 text-center tabular-nums"
									value={discountUi}
									onChange={(e) => setDiscountUi(e.target.value)}
									disabled
								/>
							</div>
							{Number(invoice.amountPaid) > 0 && (
								<div className="mt-2 flex items-center justify-between text-emerald-700">
									<span>مدفوع مسبقًا</span>
									<span className="tabular-nums">
										{formatMoney(String(invoice.amountPaid ?? 0))} ر.س
									</span>
								</div>
							)}
							<div className="mt-2 flex items-center justify-between">
								<span>وسيلة الدفع</span>
								<span>كاش</span>
							</div>
							<Separator className="my-3" />
							<div className="flex items-center justify-between text-base font-semibold">
								<span>المتبقي</span>
								<span className="tabular-nums">{formatMoney(remaining)} ر.س</span>
							</div>
						</div>
					</div>

					<div>
						<h4 className="mb-2 text-sm font-semibold">طرق الدفع</h4>
						<RadioGroup
							value={paymentMethod}
							onValueChange={(v) => setPaymentMethod(v as "CASH")}
							className="flex flex-col gap-2"
							dir="rtl"
						>
							<div
								className={cn(
									"flex cursor-pointer flex-col gap-3 rounded-md border p-3",
									paymentMethod === "CASH" && "border-primary bg-primary/5",
								)}
							>
								<div className="flex items-center justify-between">
									<span className="text-sm font-medium">كاش</span>
									<RadioGroupItem value="CASH" />
								</div>
								{paymentMethod === "CASH" && (
									<div className="flex flex-col gap-1">
										<div className="flex items-center justify-between">
											<Label
												htmlFor="cash-amount"
												className="text-xs text-muted-foreground"
											>
												المبلغ المدفوع (ر.س)
											</Label>
											{/* سداد قسم بعينه: المبلغ مستحق القسم يحسبه الخادم — لا يُحرَّر */}
											{sectionLabel ? (
												<span className="text-[11px] text-muted-foreground">
													مستحق قسم {sectionLabel}
												</span>
											) : (
												<button
													type="button"
													onClick={() => setCashAmountUi(remaining.toFixed(2))}
													className="text-[11px] text-primary hover:underline"
												>
													المبلغ كاملاً ({formatMoney(remaining)} ر.س)
												</button>
											)}
										</div>
										<Input
											id="cash-amount"
											type="number"
											min={0.01}
											max={remaining}
											step={0.01}
											value={cashAmountUi}
											onChange={(e) => setCashAmountUi(e.target.value)}
											readOnly={!!sectionLabel}
											className={cn(
												"h-8 text-center tabular-nums",
												sectionLabel && "bg-muted text-muted-foreground",
											)}
											placeholder={remaining.toFixed(2)}
										/>
										{!sectionLabel && !isValidAmount && cashAmountUi !== "" && (
											<p className="text-xs text-destructive">
												{cashAmount <= 0
													? "أدخل مبلغًا أكبر من صفر"
													: `الحد الأقصى ${formatMoney(remaining)} ر.س`}
											</p>
										)}
									</div>
								)}
							</div>
							<div className="flex cursor-not-allowed items-center justify-between rounded-md border p-3 opacity-50">
								<div className="flex flex-col">
									<span className="text-sm font-medium">بطاقة ائتمان</span>
									<span className="text-[11px] text-muted-foreground">
										نقبل بطاقات: فيزا، ماستركارد، مدي باي
									</span>
								</div>
								<RadioGroupItem
									value="CARD"
									disabled
								/>
							</div>
							<div className="flex cursor-not-allowed items-center justify-between rounded-md border p-3 opacity-50">
								<span className="text-sm font-medium">بنك</span>
								<RadioGroupItem
									value="BANK"
									disabled
								/>
							</div>
						</RadioGroup>
					</div>
				</div>

				<Separator />

				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled
						>
							طباعة
						</Button>
						<Button
							type="button"
							variant="outline"
							size="sm"
							disabled
						>
							إرسال للتوقيع
						</Button>
					</div>
					<div className="flex items-center gap-3">
						<label className="flex cursor-not-allowed items-center gap-2 opacity-60">
							<input
								type="checkbox"
								className="size-4"
								checked={whatsappToggle}
								onChange={(e) => setWhatsappToggle(e.target.checked)}
								disabled
							/>
							<span className="text-xs">إشعار عبر الواتساب</span>
						</label>
						<Button
							type="button"
							onClick={() =>
								void onPay(
									cashAmount,
									insurance
										? { apply: true, excludedLineRefs: insurance.excludedLineRefs }
										: undefined,
									redeemPoints || undefined,
								)
							}
							disabled={isPaying || !isValidAmount}
							className="gap-2"
						>
							<IconReceipt className="size-4" />
							{cashAmount < remaining ? "دفع جزئي" : "دفع الفاتورة"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

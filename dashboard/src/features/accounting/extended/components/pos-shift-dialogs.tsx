import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	useCloseShift,
	useCurrentShift,
	useOpenShift,
	usePosProfiles,
	useShiftExpectation,
} from "@/features/accounting/extended/hooks/use-pos-shift";
import { fromNano, toNano } from "@/features/accounting/utils/amount-strings";
import { formatAmount } from "@/features/accounting/utils/format-amount";
import type { PaymentMethod } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

/**
 * [P12.15] Open and close a POS shift — §16's custody story, finally reachable.
 *
 * Both are DIALOGS, not sheets: each is a short numeric form the cashier fills standing at
 * the till with the drawer open, and a side sheet that slides over the product grid is the
 * wrong shape for something you do before you can sell anything at all.
 *
 * THE COUNT IS BLIND TO NOTHING, BUT IT IS NOT PREFILLED. The close dialog shows the expected
 * figure beside each field — hiding it would make the cashier's count unverifiable at the
 * moment it matters — but it never types the expectation INTO the field. A prefilled count is
 * not a count; it is a default that a tired cashier confirms, and the whole feature exists to
 * catch the shifts where the drawer and the system disagree.
 *
 * THE DIFFERENCE IS SHOWN LIVE, per method and in total, so the cashier recounts before
 * submitting rather than discovering a rejected close after the fact (the profile's write-off
 * limit refuses a large gap server-side, BR §16).
 */

const METHODS: { key: PaymentMethod; label: string }[] = [
	{ key: "CASH", label: "نقدًا" },
	{ key: "CARD", label: "بطاقة" },
	{ key: "TRANSFER", label: "حوالة" },
];

const AMOUNT_PATTERN = /^-?\d+(\.\d{1,9})?$/;
/** the server takes an amount STRING (C2 — no JS floats); an empty field means zero */
const toAmount = (value: string) => {
	const trimmed = value.trim();
	if (trimmed === "") return "0";
	return AMOUNT_PATTERN.test(trimmed) ? trimmed : null;
};

type AmountMap = Record<PaymentMethod, string>;
const EMPTY_AMOUNTS: AmountMap = { CASH: "", CARD: "", TRANSFER: "" };

/* ── open ─────────────────────────────────────────────────────────────────────────────── */

export const OpenShiftDialog = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { profiles, isLoading } = usePosProfiles();
	const { openShift, isPending } = useOpenShift();
	const [profileId, setProfileId] = useState("");
	const [amounts, setAmounts] = useState<AmountMap>(EMPTY_AMOUNTS);

	const usable = profiles.filter((profile) => !profile.disabled);

	useEffect(() => {
		if (!open) return;
		setProfileId("");
		setAmounts(EMPTY_AMOUNTS);
	}, [open]);

	// ملف واحد فقط؟ اخترْه — سؤالٌ بجوابٍ واحد ليس سؤالًا. مشتقٌّ لا محفوظ في حالة، فإعادة
	// جلب القائمة في الخلفية لا تمحو ما اختاره الكاشير ولا ما كتبه في حقول العهدة
	const effectiveProfileId = profileId || (usable.length === 1 ? usable[0].id : "");

	const invalid = METHODS.some((method) => toAmount(amounts[method.key]) === null);

	const submit = () => {
		const balances = METHODS.map((method) => ({
			paymentMethod: method.key,
			amount: toAmount(amounts[method.key]) ?? "0",
		}));
		openShift({ profileId: effectiveProfileId, balances }).then(
			() => onOpenChange(false),
			() => undefined, // toast.promise تملك رسالة الخطأ؛ الحوار يبقى مفتوحًا للتصحيح
		);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="sm:max-w-md"
			>
				<DialogHeader>
					<DialogTitle>فتح وردية</DialogTitle>
					<DialogDescription>
						أدخل رصيد الدرج الافتتاحي لكل وسيلة. كل بيع بعد الفتح يُنسب إلى هذه الوردية، ويُقارَن
						المجموع بما تعدّه عند الإقفال.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					<div className="space-y-1.5">
						<Label>ملف نقطة البيع</Label>
						<Select
							value={effectiveProfileId}
							onValueChange={setProfileId}
							disabled={isPending || isLoading}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="اختر الملف…" />
							</SelectTrigger>
							<SelectContent dir="rtl">
								{usable.map((profile) => (
									<SelectItem
										key={profile.id}
										value={profile.id}
									>
										{profile.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{!isLoading && usable.length === 0 ? (
							<p className="text-destructive text-xs">
								لا ملفات نقطة بيع مفعّلة. يُنشأ الملف من «المحاسبة ← العمليات الممتدّة ← ورديات
								نقطة البيع».
							</p>
						) : null}
					</div>

					<div className="space-y-2">
						<Label>العهدة الافتتاحية</Label>
						{METHODS.map((method) => (
							<div
								key={method.key}
								className="flex items-center gap-3"
							>
								<span className="w-16 text-muted-foreground text-sm">{method.label}</span>
								<Input
									dir="ltr"
									inputMode="decimal"
									placeholder="0"
									className="flex-1 text-end tabular-nums"
									value={amounts[method.key]}
									aria-invalid={toAmount(amounts[method.key]) === null}
									onChange={(event) =>
										setAmounts((prev) => ({ ...prev, [method.key]: event.target.value }))
									}
									disabled={isPending}
								/>
							</div>
						))}
						<p className="text-muted-foreground text-xs">
							اترك الحقل فارغًا إن لم يكن في الدرج شيء من تلك الوسيلة — يُقرأ صفرًا.
						</p>
					</div>
				</div>

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						onClick={submit}
						disabled={isPending || !effectiveProfileId || invalid}
					>
						فتح الوردية
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

/* ── close ────────────────────────────────────────────────────────────────────────────── */

export const CloseShiftDialog = ({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) => {
	const { shift } = useCurrentShift();
	const openingId = shift?.id ?? null;
	const { expectation, isLoading } = useShiftExpectation(open ? openingId : null);
	const { closeShift, isPending } = useCloseShift();
	const [counted, setCounted] = useState<AmountMap>(EMPTY_AMOUNTS);

	useEffect(() => {
		if (open) setCounted(EMPTY_AMOUNTS);
	}, [open]);

	// الوسائل المعروضة = ما فُتحت به الوردية أو بيع به فيها؛ لا نطلب عدّ وسيلة لم تُستخدم
	const rows = expectation.map((row) => {
		const raw = counted[row.paymentMethod] ?? "";
		const parsed = toAmount(raw);
		return {
			...row,
			raw,
			parsed,
			// C2: الفرق يُحسب بوحدات النانو الصحيحة، لا بطرح عددين عشريّين — العرض المباشر
			// يجب أن يطابق ما سيحسبه الخادم بالضبط، وإلّا اختلف الرقم الذي أكّده الكاشير
			differenceNano: parsed === null ? null : toNano(parsed) - toNano(row.expectedAmount),
		};
	});
	const invalid = rows.some((row) => row.parsed === null);
	const totalDifferenceNano = rows.reduce((sum, row) => sum + (row.differenceNano ?? 0n), 0n);

	const submit = () => {
		if (!openingId) return;
		closeShift({
			openingId,
			counted: rows.map((row) => ({
				paymentMethod: row.paymentMethod,
				countedAmount: row.parsed ?? "0",
			})),
		}).then(
			() => onOpenChange(false),
			() => undefined,
		);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				className="sm:max-w-lg"
			>
				<DialogHeader>
					<DialogTitle>إقفال الوردية</DialogTitle>
					<DialogDescription>
						عُدّ الدرج وأدخل ما وجدته فعلًا لكل وسيلة. المتوقَّع معروض بجانب كل حقل للمقارنة، ولا
						يُملأ نيابةً عنك — العدّ الذي يؤكّد رقمًا جاهزًا ليس عدًّا.
					</DialogDescription>
				</DialogHeader>

				{isLoading ? (
					<p className="py-6 text-center text-muted-foreground text-sm">
						جارٍ حساب المتوقَّع في الدرج…
					</p>
				) : rows.length === 0 ? (
					<p className="py-6 text-center text-muted-foreground text-sm">
						لا عهدة ولا مبيعات في هذه الوردية — أقفلها بلا فرق.
					</p>
				) : (
					<div className="space-y-3">
						<div className="grid grid-cols-[4rem_1fr_1fr_5rem] items-center gap-2 text-muted-foreground text-xs">
							<span>الوسيلة</span>
							<span className="text-end">المتوقَّع</span>
							<span className="text-end">المعدود</span>
							<span className="text-end">الفرق</span>
						</div>
						{rows.map((row) => (
							<div
								key={row.paymentMethod}
								className="grid grid-cols-[4rem_1fr_1fr_5rem] items-center gap-2"
							>
								<span className="text-sm">
									{METHODS.find((method) => method.key === row.paymentMethod)?.label ??
										row.paymentMethod}
								</span>
								<span className="text-end text-muted-foreground text-sm tabular-nums">
									{formatAmount(row.expectedAmount)}
								</span>
								<Input
									dir="ltr"
									inputMode="decimal"
									placeholder="0"
									className="text-end tabular-nums"
									value={row.raw}
									aria-invalid={row.parsed === null}
									onChange={(event) =>
										setCounted((prev) => ({
											...prev,
											[row.paymentMethod]: event.target.value,
										}))
									}
									disabled={isPending}
								/>
								<span
									className={cn(
										"text-end text-sm tabular-nums",
										row.differenceNano === null || row.differenceNano === 0n
											? "text-muted-foreground"
											: "font-medium text-destructive",
									)}
								>
									{row.differenceNano === null
										? "—"
										: formatAmount(fromNano(row.differenceNano))}
								</span>
							</div>
						))}
						<div className="flex items-center justify-between border-t pt-3 text-sm">
							<span className="font-medium">إجمالي الفرق</span>
							<span
								className={cn(
									"font-medium tabular-nums",
									totalDifferenceNano === 0n ? "text-muted-foreground" : "text-destructive",
								)}
							>
								{invalid ? "—" : formatAmount(fromNano(totalDifferenceNano))}
							</span>
						</div>
						{!invalid && totalDifferenceNano !== 0n ? (
							<p className="text-muted-foreground text-xs">
								الفرق يُرحَّل إلى حساب فروق الدرج على ملف نقطة البيع. تجاوزه حدّ الشطب يُرفض الإقفال
								— العجز الكبير قرار إداري لا قيد صامت.
							</p>
						) : null}
					</div>
				)}

				<DialogFooter>
					<Button
						type="button"
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isPending}
					>
						إلغاء
					</Button>
					<Button
						type="button"
						onClick={submit}
						disabled={isPending || isLoading || invalid || !openingId}
					>
						إقفال الوردية
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

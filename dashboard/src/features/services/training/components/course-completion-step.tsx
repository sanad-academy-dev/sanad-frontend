import {
	IconAward,
	IconBook,
	IconCash,
	IconFileText,
	IconGift,
	IconLock,
	IconRepeat,
	IconRosetteDiscountCheck,
	IconSelector,
	IconStar,
	IconUsers,
	IconWorld,
} from "@tabler/icons-react";
import { type ReactNode, useEffect, useState } from "react";

import { Field, FieldContent, FieldLabel, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { CertificatePreviewDialog } from "@/features/services/training/components/certificate-preview-dialog";
import { useCompletionSettings } from "@/features/services/training/hooks/use-completion-settings";
import { useUpdateCourse } from "@/features/services/training/hooks/use-courses";
import { cn } from "@/lib/utils";
import type { CourseDetailResponse, ReEnrollMode } from "@sanad/contracts/runtime/server/training/training.type";

type Settings = {
	certificateEnabled: boolean;
	certReferencePattern: string | null;
	certValidityDays: number | null;
	certSignatureName: string | null;
	certPassMark: number | null;
	reEnrollMode: ReEnrollMode;
	reEnrollDays: number | null;
	gamificationPoints: number;
	reviewEnabled: boolean;
};

export type CourseAccessMode = "PUBLIC" | "ENROLLED" | "PRIVATE";
export type CoursePricingMode = "COURSE" | "PER_LESSON";

const CURRENCY_OPTIONS = [
	{ label: "جنيه مصري", value: "EGP" },
	{ label: "ريال سعودي", value: "SAR" },
	{ label: "دولار أمريكي", value: "USD" },
	{ label: "درهم إماراتي", value: "AED" },
];

const num = (v: string): number | null => (v === "" ? null : Number(v));

// بطاقة قابلة للتفعيل — عند التفعيل يتمدّد المحتوى ويُبرز الحدّ بتناسق تام مع ثيم النظام
function ToggleCard({
	icon,
	title,
	subtitle,
	enabled,
	onToggle,
	children,
}: {
	icon: ReactNode;
	title: string;
	subtitle: string;
	enabled: boolean;
	onToggle: (v: boolean) => void;
	children?: ReactNode;
}) {
	return (
		<div
			className={cn(
				"flex flex-col rounded-lg border bg-card transition-colors",
				enabled ? "border-foreground/25" : "border-border",
			)}
		>
			{/* في RTL أول عنصر يمين: الأيقونة ← النص ← المفتاح يسارًا */}
			<div className="flex items-center gap-3 p-3">
				<span
					className={cn(
						"flex size-9 shrink-0 items-center justify-center rounded-lg",
						enabled
							? "bg-foreground/[0.06] text-foreground"
							: "bg-muted text-muted-foreground",
					)}
				>
					{icon}
				</span>
				<div className="flex min-w-0 flex-1 flex-col">
					<span className="text-[13px] font-bold text-foreground">{title}</span>
					<span className="text-[11px] text-muted-foreground">{subtitle}</span>
				</div>
				<Switch
					checked={enabled}
					onCheckedChange={onToggle}
				/>
			</div>
			{enabled && children && (
				<div className="flex flex-col gap-3 border-t border-border p-3">{children}</div>
			)}
		</div>
	);
}

function Labeled({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex flex-col gap-1.5">
			<span className="text-[12px] font-medium text-foreground">{label}</span>
			{children}
		</div>
	);
}

// استخراج البيانات الأولية من metadata المحفوظة في institution إن وجدت
function parseMeta(institutionStr?: string | null): {
	accessType?: CourseAccessMode;
	currency?: string;
	pricingMode?: CoursePricingMode;
	name?: string;
} {
	if (!institutionStr) return {};
	try {
		if (institutionStr.startsWith("{")) {
			return JSON.parse(institutionStr);
		}
	} catch {}
	return { name: institutionStr };
}

// الخطوة الأخيرة — «الإكمال والنشر»: الرسوم والوصول + إعدادات ما بعد الإكمال
export function CourseCompletionStep({
	course,
	courseId,
	price: controlledPrice,
	onPriceChange,
	accessType: controlledAccessType,
	onAccessTypeChange,
	currency: controlledCurrency,
	onCurrencyChange,
}: {
	course: CourseDetailResponse | undefined;
	courseId: string;
	price?: number | undefined;
	onPriceChange?: (v: number | undefined) => void;
	accessType?: CourseAccessMode;
	onAccessTypeChange?: (v: CourseAccessMode) => void;
	currency?: string;
	onCurrencyChange?: (v: string) => void;
}) {
	const { saveCompletion } = useCompletionSettings(courseId);
	const { updateCourse } = useUpdateCourse(courseId);

	const initialMeta = parseMeta(course?.institution);

	// حالة السعر والرسوم
	const initialPrice =
		controlledPrice !== undefined ? controlledPrice : (course?.trainingCost ?? undefined);
	const [priceValue, setPriceValue] = useState<number | undefined>(initialPrice);
	const [isPaid, setIsPaid] = useState<boolean>(() => {
		if (initialPrice != null && initialPrice > 0) return true;
		return false;
	});

	// طريقة التسعير: بالدورة كاملة أو لكل درس
	const [pricingMode, setPricingMode] = useState<CoursePricingMode>(
		initialMeta.pricingMode ?? "COURSE",
	);

	// حالة الدورة مجانية ونوع الوصول
	const [isFree, setIsFree] = useState<boolean>(() => {
		if (initialPrice != null && initialPrice > 0) return false;
		return true;
	});
	const [accessType, setAccessType] = useState<CourseAccessMode>(
		controlledAccessType ?? initialMeta.accessType ?? "PUBLIC",
	);
	const [currency, setCurrency] = useState<string>(
		controlledCurrency ?? initialMeta.currency ?? "EGP",
	);

	// عدد الدروس بالدورة لحساب الإجمالي التقديري في حال التسعير بالدرس
	const lessonsCount =
		course?.units?.reduce((acc, u) => acc + (u.lessons?.length || 0), 0) ?? 0;

	// تزامن القيم الممررة من الخارج إن تغيّرت
	useEffect(() => {
		if (controlledPrice !== undefined) {
			setPriceValue(controlledPrice);
			if (controlledPrice > 0) {
				setIsPaid(true);
				setIsFree(false);
			} else if (controlledPrice === 0) {
				setIsPaid(false);
				setIsFree(true);
			}
		}
	}, [controlledPrice]);

	useEffect(() => {
		if (controlledAccessType) setAccessType(controlledAccessType);
	}, [controlledAccessType]);

	useEffect(() => {
		if (controlledCurrency) setCurrency(controlledCurrency);
	}, [controlledCurrency]);

	// حساب ضريبة القيمة المضافة 15% والإجمالي
	const numPrice = Number(priceValue) || 0;
	const vatAmount = Math.round(numPrice * 0.15);
	const totalAmount = numPrice + vatAmount;
	const displayTotal = numPrice > 0 ? totalAmount : "00";

	// حفظ ميتاداتا المؤسسة ونوع الوصول والعملة وطريقة التسعير
	const persistCourseSettings = (opts: {
		cost?: number | null;
		acc?: CourseAccessMode;
		curr?: string;
		pMode?: CoursePricingMode;
	}) => {
		const nextAcc = opts.acc ?? accessType;
		const nextCurr = opts.curr ?? currency;
		const nextMode = opts.pMode ?? pricingMode;
		const metaPayload = JSON.stringify({
			accessType: nextAcc,
			currency: nextCurr,
			pricingMode: nextMode,
			name: initialMeta.name || undefined,
		});

		const payload: { trainingCost?: number | null; institution: string } = {
			institution: metaPayload,
		};
		if (opts.cost !== undefined) {
			payload.trainingCost = opts.cost;
		}

		updateCourse(payload).catch(() => null);
	};

	// تفعيل / تعطيل خيار رسوم الدورة
	const handleTogglePaid = (checked: boolean) => {
		setIsPaid(checked);
		if (checked) {
			setIsFree(false);
			const nextPrice = priceValue && priceValue > 0 ? priceValue : 100;
			setPriceValue(nextPrice);
			onPriceChange?.(nextPrice);
			persistCourseSettings({ cost: nextPrice });
		} else {
			setPriceValue(undefined);
			onPriceChange?.(undefined);
			persistCourseSettings({ cost: 0 });
		}
	};

	// تغيير طريقة التسعير (بالدورة كاملة أو لكل درس)
	const handlePricingModeChange = (mode: CoursePricingMode) => {
		setPricingMode(mode);
		persistCourseSettings({ pMode: mode });
	};

	// تعديل قيمة السعر
	const handlePriceChange = (valStr: string) => {
		const clean = valStr.trim();
		const parsed = clean === "" ? undefined : Math.max(0, Number.parseInt(clean, 10) || 0);
		setPriceValue(parsed);
		onPriceChange?.(parsed);
		persistCourseSettings({ cost: parsed ?? 0 });
	};

	// تعديل العملة
	const handleCurrencyChange = (newCurr: string) => {
		setCurrency(newCurr);
		onCurrencyChange?.(newCurr);
		persistCourseSettings({ curr: newCurr });
	};

	// تفعيل / تعطيل الدورة المجانية
	const handleToggleFree = (checked: boolean) => {
		setIsFree(checked);
		if (checked) {
			setIsPaid(false);
			setPriceValue(0);
			onPriceChange?.(0);
			persistCourseSettings({ cost: 0 });
		}
	};

	// تغيير نوع وصول الطلاب
	const handleAccessTypeChange = (mode: CourseAccessMode) => {
		setAccessType(mode);
		onAccessTypeChange?.(mode);
		persistCourseSettings({ acc: mode });
	};

	// إعدادات الإكمال (شهادة / إعادة تسجيل / تحفيز / تقييم)
	const cs = course?.completionSettings;
	const [s, setS] = useState<Settings>({
		certificateEnabled: cs?.certificateEnabled ?? false,
		certReferencePattern: cs?.certReferencePattern ?? null,
		certValidityDays: cs?.certValidityDays ?? null,
		certSignatureName: cs?.certSignatureName ?? null,
		certPassMark: cs?.certPassMark ?? null,
		reEnrollMode: cs?.reEnrollMode ?? "NONE",
		reEnrollDays: cs?.reEnrollDays ?? null,
		gamificationPoints: cs?.gamificationPoints ?? 0,
		reviewEnabled: cs?.reviewEnabled ?? false,
	});
	const [previewOpen, setPreviewOpen] = useState(false);

	// تحديث متفائل + حفظ فوري (autosave لكل تغيير)
	const patch = (p: Partial<Settings>) => {
		const next = { ...s, ...p };
		setS(next);
		saveCompletion(next);
	};

	return (
		<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-1 pt-2 pb-6">
			<div className="flex flex-col gap-0.5">
				<h2 className="text-[14px] font-bold text-foreground">الإكمال والنشر</h2>
				<p className="text-[11px] text-muted-foreground">
					حدّد تسعير الدورة ونوع وصول الطلاب إليها، وفعّل إعدادات ما بعد الإكمال (الشهادة،
					التحفيز، والتقييم).
				</p>
			</div>

			{/* 1) رسوم الدورة — يفتح للأسفل مع خيارات طريقة التسعير وحقول على اليمين */}
			<ToggleCard
				icon={<IconCash className="size-5" />}
				title="رسوم الدورة"
				subtitle="تحديد تكلفة ورسوم التسجيل في هذه الدورة"
				enabled={isPaid}
				onToggle={handleTogglePaid}
			>
				<div className="flex flex-col gap-3.5">
					{/* أ) اختيار طريقة التسعير: بالدورة بالكامل أو لكل درس */}
					<div className="flex flex-col gap-1.5">
						<span className="text-[12px] font-medium text-foreground">طريقة التسعير</span>
						<div className="flex items-center gap-2">
							<button
								type="button"
								onClick={() => handlePricingModeChange("COURSE")}
								className={cn(
									"flex items-center gap-2 rounded-lg border py-1.5 px-3.5 text-xs font-semibold transition-all cursor-pointer",
									pricingMode === "COURSE"
										? "border-primary bg-primary/10 text-primary shadow-2xs ring-1 ring-primary/20"
										: "border-border bg-background text-muted-foreground hover:bg-muted/40",
								)}
							>
								<IconBook className="size-4" />
								<span>الدورة بالكامل</span>
							</button>

							<button
								type="button"
								onClick={() => handlePricingModeChange("PER_LESSON")}
								className={cn(
									"flex items-center gap-2 rounded-lg border py-1.5 px-3.5 text-xs font-semibold transition-all cursor-pointer",
									pricingMode === "PER_LESSON"
										? "border-primary bg-primary/10 text-primary shadow-2xs ring-1 ring-primary/20"
										: "border-border bg-background text-muted-foreground hover:bg-muted/40",
								)}
							>
								<IconFileText className="size-4" />
								<span>بالدرس (لكل درس)</span>
							</button>
						</div>
					</div>

					{/* ب) حقول السعر والعملة والإجمالي — مصفوفة على اليمين */}
					<div className="flex flex-col gap-1.5">
						<span className="text-[12px] font-medium text-foreground">
							{pricingMode === "COURSE" ? "رسوم الدورة بالكامل" : "رسوم الدرس الواحد"}
						</span>
						<div className="flex flex-wrap items-center justify-start gap-2.5">
							{/* حقل السعر والعملة */}
							<div className="flex h-9 items-center rounded-lg border border-border bg-background px-2.5 shadow-2xs focus-within:border-foreground/40">
								<input
									type="number"
									min={0}
									value={priceValue === 0 ? "" : (priceValue ?? "")}
									onChange={(e) => handlePriceChange(e.target.value)}
									placeholder="00"
									className="w-20 bg-transparent text-center text-xs font-semibold text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
								/>
								<div className="mx-2 h-4 w-px bg-border" />
								<div className="relative flex items-center">
									<select
										value={currency}
										onChange={(e) => handleCurrencyChange(e.target.value)}
										className="cursor-pointer appearance-none bg-transparent pr-1 pl-4 text-[11px] font-medium text-foreground outline-none"
									>
										{CURRENCY_OPTIONS.map((c) => (
											<option
												key={c.value}
												value={c.value}
											>
												{c.label}
											</option>
										))}
									</select>
									<IconSelector className="pointer-events-none absolute left-0 size-3 text-muted-foreground" />
								</div>
							</div>

							{/* صندوق الإجمالي */}
							<div className="flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-muted/70 px-3 text-xs text-muted-foreground">
								<span className="font-bold text-foreground">{displayTotal}</span>
								<span className="text-[11px]">
									{pricingMode === "COURSE" ? "الإجمالي مع الضريبة" : "الإجمالي لكل درس"}
								</span>
							</div>
						</div>

						{/* توضيح ضريبة القيمة المضافة والإجمالي التقديري */}
						<div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground pt-0.5">
							<span>ضريبة القيمة المضافة (15%) = تُحسب وتُضاف تلقائياً إلى الإجمالي</span>
							{pricingMode === "PER_LESSON" && lessonsCount > 0 && numPrice > 0 && (
								<span className="font-medium text-primary">
									(إجمالي تقديري للدورة بحسب {lessonsCount} دروس:{" "}
									{(totalAmount * lessonsCount).toLocaleString("ar-EG")}{" "}
									{currency === "EGP" ? "ج.م" : currency})
								</span>
							)}
						</div>
					</div>
				</div>
			</ToggleCard>

			{/* 2) الدورة مجانية تماماً — مع أيقونة وثيم موحّد */}
			<ToggleCard
				icon={<IconGift className="size-5" />}
				title="الدورة مجانية تماماً"
				subtitle="يتمكن الطلاب من التسجيل بدون دفع"
				enabled={isFree}
				onToggle={handleToggleFree}
			>
				<div className="flex flex-col gap-2.5">
					<span className="text-[12px] font-bold text-foreground">نوع وصول الطلاب</span>
					<div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
						{/* أ) عام */}
						<button
							type="button"
							onClick={() => handleAccessTypeChange("PUBLIC")}
							className={cn(
								"flex flex-col justify-between gap-3 rounded-xl border p-3 text-right transition-all cursor-pointer min-h-[88px]",
								accessType === "PUBLIC"
									? "border-[#22c55e] bg-[#f0fdf4] dark:bg-emerald-950/20 shadow-2xs ring-1 ring-[#22c55e]/20"
									: "border-border/80 bg-background hover:border-foreground/20 hover:bg-muted/20",
							)}
						>
							<div className="flex items-center justify-start">
								<IconWorld
									className={cn(
										"size-5",
										accessType === "PUBLIC" ? "text-[#16a34a]" : "text-muted-foreground",
									)}
								/>
							</div>
							<div className="flex flex-col">
								<span className="text-[12px] font-bold text-foreground">عام</span>
								<span className="text-[10.5px] text-muted-foreground leading-tight">
									يظهر في الكتالوج للجميع
								</span>
							</div>
						</button>

						{/* ب) للمسجلين */}
						<button
							type="button"
							onClick={() => handleAccessTypeChange("ENROLLED")}
							className={cn(
								"flex flex-col justify-between gap-3 rounded-xl border p-3 text-right transition-all cursor-pointer min-h-[88px]",
								accessType === "ENROLLED"
									? "border-[#22c55e] bg-[#f0fdf4] dark:bg-emerald-950/20 shadow-2xs ring-1 ring-[#22c55e]/20"
									: "border-border/80 bg-background hover:border-foreground/20 hover:bg-muted/20",
							)}
						>
							<div className="flex items-center justify-start">
								<IconUsers
									className={cn(
										"size-5",
										accessType === "ENROLLED" ? "text-[#16a34a]" : "text-muted-foreground",
									)}
								/>
							</div>
							<div className="flex flex-col">
								<span className="text-[12px] font-bold text-foreground">للمسجلين</span>
								<span className="text-[10.5px] text-muted-foreground leading-tight">
									يظهر لطلاب أكاديميتك فقط عند الدخول
								</span>
							</div>
						</button>

						{/* ج) خاص */}
						<button
							type="button"
							onClick={() => handleAccessTypeChange("PRIVATE")}
							className={cn(
								"flex flex-col justify-between gap-3 rounded-xl border p-3 text-right transition-all cursor-pointer min-h-[88px]",
								accessType === "PRIVATE"
									? "border-[#22c55e] bg-[#f0fdf4] dark:bg-emerald-950/20 shadow-2xs ring-1 ring-[#22c55e]/20"
									: "border-border/80 bg-background hover:border-foreground/20 hover:bg-muted/20",
							)}
						>
							<div className="flex items-center justify-start">
								<IconLock
									className={cn(
										"size-5",
										accessType === "PRIVATE" ? "text-[#16a34a]" : "text-muted-foreground",
									)}
								/>
							</div>
							<div className="flex flex-col">
								<span className="text-[12px] font-bold text-foreground">خاص</span>
								<span className="text-[10.5px] text-muted-foreground leading-tight">
									مش معروض ومش للبيع — إنت اللي بتضيف الطلاب له
								</span>
							</div>
						</button>
					</div>
				</div>
			</ToggleCard>

			{/* 3) الشهادة */}
			<ToggleCard
				icon={<IconRosetteDiscountCheck className="size-5" />}
				title="الشهادة"
				subtitle="إصدار شهادة إتمام لكل متدرّب يكمل الدورة"
				enabled={s.certificateEnabled}
				onToggle={(v) => patch({ certificateEnabled: v })}
			>
				<div className="grid grid-cols-2 gap-3">
					<Labeled label="الرقم المرجعي">
						<Input
							value={s.certReferencePattern ?? ""}
							onChange={(e) => patch({ certReferencePattern: e.target.value || null })}
							placeholder="مثال: VET-CERT"
							className="h-9 text-[12px]"
						/>
					</Labeled>
					<Labeled label="فترة الصلاحية (أيام)">
						<Input
							type="number"
							min={0}
							value={s.certValidityDays ?? ""}
							onChange={(e) => patch({ certValidityDays: num(e.target.value) })}
							placeholder="مثال: 365"
							className="h-9 text-[12px]"
						/>
					</Labeled>
					<Labeled label="التوقيع باسم">
						<Input
							value={s.certSignatureName ?? ""}
							onChange={(e) => patch({ certSignatureName: e.target.value || null })}
							placeholder="مدير التدريب"
							className="h-9 text-[12px]"
						/>
					</Labeled>
					<Labeled label="نسبة النجاح %">
						<Input
							type="number"
							min={0}
							max={100}
							value={s.certPassMark ?? ""}
							onChange={(e) => patch({ certPassMark: num(e.target.value) })}
							placeholder="مثال: 80"
							className="h-9 text-[12px]"
						/>
					</Labeled>
				</div>
				<div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
					يمكنك معاينة الشهادة
					<button
						type="button"
						onClick={() => setPreviewOpen(true)}
						className="font-semibold text-primary"
					>
						معاينة القالب
					</button>
				</div>
			</ToggleCard>

			{/* 4) إعادة التسجيل */}
			<ToggleCard
				icon={<IconRepeat className="size-5" />}
				title="إعادة التسجيل"
				subtitle="إعادة تسجيل الموظف تلقائيًا بعد فترة"
				enabled={s.reEnrollMode !== "NONE"}
				onToggle={(v) =>
					patch({
						reEnrollMode: v ? "AFTER_COMPLETION" : "NONE",
						reEnrollDays: v ? (s.reEnrollDays ?? 30) : s.reEnrollDays,
					})
				}
			>
				<RadioGroup
					dir="rtl"
					value={s.reEnrollMode}
					onValueChange={(v) => patch({ reEnrollMode: v as ReEnrollMode })}
					className="flex flex-col gap-2.5"
				>
					<FieldLabel htmlFor="reenroll-after">
						<Field orientation="horizontal">
							<FieldContent>
								<FieldTitle className="flex flex-wrap items-center gap-1.5 text-[12px]">
									بعد الإكمال بـ
									<Input
										type="number"
										min={0}
										aria-label="أيام بعد الإكمال"
										value={s.reEnrollDays ?? ""}
										onChange={(e) => patch({ reEnrollDays: num(e.target.value) })}
										className="h-8 w-16 text-center text-[12px]"
									/>
									أيام
								</FieldTitle>
							</FieldContent>
							<RadioGroupItem
								value="AFTER_COMPLETION"
								id="reenroll-after"
							/>
						</Field>
					</FieldLabel>
					<FieldLabel htmlFor="reenroll-before">
						<Field orientation="horizontal">
							<FieldContent>
								<FieldTitle className="flex flex-wrap items-center gap-1.5 text-[12px]">
									قبل انتهاء الشهادة بـ
									<Input
										type="number"
										min={0}
										aria-label="أيام قبل انتهاء الشهادة"
										value={s.reEnrollDays ?? ""}
										onChange={(e) => patch({ reEnrollDays: num(e.target.value) })}
										className="h-8 w-16 text-center text-[12px]"
									/>
									أيام
								</FieldTitle>
							</FieldContent>
							<RadioGroupItem
								value="BEFORE_EXPIRY"
								id="reenroll-before"
							/>
						</Field>
					</FieldLabel>
				</RadioGroup>
			</ToggleCard>

			{/* 5) التحفيز */}
			<ToggleCard
				icon={<IconAward className="size-5" />}
				title="التحفيز"
				subtitle="منح نقاط عند إكمال الدورة"
				enabled={s.gamificationPoints > 0}
				onToggle={(v) => patch({ gamificationPoints: v ? 10 : 0 })}
			>
				<div className="flex items-center gap-2 text-[12px] text-foreground">
					مكافأة إكمال الدورة:
					<Input
						type="number"
						min={0}
						aria-label="نقاط مكافأة الإكمال"
						value={s.gamificationPoints || ""}
						onChange={(e) => patch({ gamificationPoints: Number(e.target.value) || 0 })}
						className="h-8 w-20 text-center text-[12px]"
					/>
					نقطة
				</div>
			</ToggleCard>

			{/* 6) تقييم الدورة */}
			<ToggleCard
				icon={<IconStar className="size-5" />}
				title="تقييم الدورة"
				subtitle="السماح للمتدربين بتقييم الدورة وترك ملاحظات"
				enabled={s.reviewEnabled}
				onToggle={(v) => patch({ reviewEnabled: v })}
			/>

			<CertificatePreviewDialog
				open={previewOpen}
				onOpenChange={setPreviewOpen}
				courseName={course?.name ?? ""}
				signatureName={s.certSignatureName}
				passMark={s.certPassMark}
				referencePattern={s.certReferencePattern}
			/>
		</div>
	);
}

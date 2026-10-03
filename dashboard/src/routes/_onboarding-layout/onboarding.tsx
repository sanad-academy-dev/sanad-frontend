import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconArrowLeft,
	IconArrowRight,
	IconBrandWhatsapp,
	IconCalendar,
	IconCurrencyDirham,
	IconCurrencyPound,
	IconCurrencyRiyal,
	IconFileInvoice,
	IconPackage,
	IconPaw,
	IconStethoscope,
	IconUser,
	IconUserPlus,
} from "@tabler/icons-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod/v4";

import { Button } from "@/components/ui/button";
import { Field, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { env } from "@/env";
import { useOnboarding } from "@/features/onboarding/hooks/use-onboarding";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { useUpdateClinicInfo } from "@/features/settings/services/hooks/use-update-clinic-info";
import { useI18n } from "@/hooks/use-i18n";
import type { Language } from "@/lib/data/constants";
import { SLUG_MAX_LENGTH, SLUG_MIN_LENGTH } from "@/lib/reserved-slugs";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_onboarding-layout/onboarding")({
	component: RouteComponent,
});

// ─── Constants ───────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

const BOOKING_BASE_URL = `${env.VITE_API_URL.replace(/\/$/, "")}/book/`;

const COUNTRIES = [
	{
		code: "SA",
		nameAr: "السعودية",
		flag: "🇸🇦",
		timezone: "Asia/Riyadh",
		calendarType: "HIJRI" as const,
		currencyCode: "SAR",
		currencySymbol: "﷼",
		workDays: ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"] as string[],
	},
	{
		code: "AE",
		nameAr: "الامارات",
		flag: "🇦🇪",
		timezone: "Asia/Dubai",
		calendarType: "GREGORIAN" as const,
		currencyCode: "AED",
		currencySymbol: "د.إ",
		workDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"] as string[],
	},
	{
		code: "QA",
		nameAr: "قطر",
		flag: "🇶🇦",
		timezone: "Asia/Qatar",
		calendarType: "GREGORIAN" as const,
		currencyCode: "QAR",
		currencySymbol: "﷼",
		workDays: ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"] as string[],
	},
	{
		code: "EG",
		nameAr: "مصر",
		flag: "🇪🇬",
		timezone: "Africa/Cairo",
		calendarType: "GREGORIAN" as const,
		currencyCode: "EGP",
		currencySymbol: "ج.م",
		workDays: ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"] as string[],
	},
] as const;

const CURRENCY_ICONS = {
	SAR: IconCurrencyRiyal,
	AED: IconCurrencyDirham,
	QAR: IconCurrencyRiyal,
	EGP: IconCurrencyPound,
} as const;

const SPECIALTY_OPTIONS = [
	{ value: "VET_CLINIC", label: "أكاديمية" },
	{ value: "VET_HOSPITAL", label: "مستشفى بيطري" },
	{ value: "GROOMING_CENTER", label: "مركز Grooming" },
	{ value: "MOBILE_SERVICES", label: "دورات متنقلة" },
	{ value: "SPECIALIZED_SURGERY", label: "جراحة متخصصة" },
	{ value: "MULTI_SERVICES", label: "متعدد الدورات" },
] as const;

const GOAL_OPTIONS = [
	{ value: "APPOINTMENTS_MANAGEMENT", label: "إدارة الزيارات" },
	{ value: "PATIENTS_MANAGEMENT", label: "إدارة الأطفال / أولياء الأمور" },
	{ value: "INVENTORY_MANAGEMENT", label: "إدارة المخزون / الموردين" },
	{ value: "BILLING_MANAGEMENT", label: "إدارة الفوترة" },
	{ value: "REVENUE_IMPROVEMENT", label: "تحسين الإيرادات" },
	{ value: "WORKFLOW_AUTOMATION", label: "أتمتة سير العمل / المهام" },
	{ value: "PAPERWORK_REDUCTION", label: "تقليل الأعمال الورقية" },
	{ value: "CUSTOMER_EXPERIENCE", label: "تحسين تجربة العملاء" },
] as const;

const SIZE_OPTIONS = [
	{ value: "SOLO", label: "أكاديمية فردية", subtitle: "1-2 مدرّب" },
	{ value: "SMALL", label: "أكاديمية صغيرة", subtitle: "3-10 مدرّب" },
	{ value: "MEDIUM", label: "أكاديمية متوسطة", subtitle: "11-20 مدرّب" },
	{ value: "MEDICAL_CENTER", label: "مركز طبي", subtitle: "أكثر من 20 مدرّب" },
	{ value: "HOSPITAL", label: "مستشفى", subtitle: "أكثر من 40 مدرّب" },
] as const;

const ANIMAL_OPTIONS = [
	{ value: "dogs", label: "كلاب" },
	{ value: "cats", label: "قطط" },
	{ value: "birds", label: "طيور" },
	{ value: "horses", label: "خيول" },
	{ value: "livestock", label: "مواشي" },
	{ value: "exotic", label: "أطفال غريبة" },
	{ value: "other", label: "أخرى" },
] as const;

const MONTHLY_OPTIONS = [
	{ value: "UNDER_50", label: "أقل من 50" },
	{ value: "RANGE_50_100", label: "50 - 100" },
	{ value: "RANGE_101_250", label: "101 - 250" },
	{ value: "OVER_1000", label: "أكثر من 1,000" },
] as const;

const BRANCH_OPTIONS = [
	{ value: "false", label: "فرع واحد" },
	{ value: "true", label: "أكثر من فرع" },
] as const;

const DELIVERY_OPTIONS = [
	{ value: "IN_CLINIC", label: "في الأكاديمية" },
	{ value: "REMOTE", label: "عن بعد" },
	{ value: "MOBILE_CLINIC", label: "أكاديمية متنقلة" },
	{ value: "ALL", label: "الكل" },
] as const;

const REFERRAL_OPTIONS = [
	{ value: "FRIEND", label: "من صديق / زميل" },
	{ value: "GOOGLE", label: "بحث جوجل (محرك بحث آخر)" },
	{ value: "TWITTER", label: "X (تويتر)" },
	{ value: "LINKEDIN", label: "لينكدإن" },
	{ value: "BLOG", label: "مدونة / مقال" },
	{ value: "NEWSLETTER", label: "نشرة بريدية" },
	{ value: "PODCAST", label: "بودكاست" },
	{ value: "OTHER", label: "أخرى" },
] as const;

// ─── Schemas ─────────────────────────────────────────────────────────────────

const clinicInfoSchema = z.object({
	name: z.string({ error: "اسم الأكاديمية مطلوب" }).min(1, "اسم الأكاديمية مطلوب"),
	slug: z
		.string()
		.min(SLUG_MIN_LENGTH, `الرابط يجب أن يكون ${SLUG_MIN_LENGTH} أحرف على الأقل`)
		.max(SLUG_MAX_LENGTH, `الرابط يجب أن يكون ${SLUG_MAX_LENGTH} حرفًا كحد أقصى`)
		.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "أحرف إنجليزية صغيرة وأرقام وشرطات فقط")
		.optional()
		.or(z.literal("")),
});
type ClinicInfoFormValues = z.infer<typeof clinicInfoSchema>;

const profileSchema = z.object({
	specialtyType: z.string({ error: "التخصص الرئيسي مطلوب" }).min(1, "التخصص الرئيسي مطلوب"),
	mainGoal: z.string({ error: "الهدف الرئيسي مطلوب" }).min(1, "الهدف الرئيسي مطلوب"),
	clinicSize: z.string().optional(),
	animalTypes: z.string().optional(),
	monthlyVisits: z.string().optional(),
	monthlyPatients: z.string().optional(),
	multiBranch: z.string().optional(),
	serviceDelivery: z.string().optional(),
});
type ProfileFormValues = z.infer<typeof profileSchema>;

const referralSchema = z.object({
	referralSource: z.string({ error: "هذا الحقل مطلوب" }).min(1, "هذا الحقل مطلوب"),
});
type ReferralFormValues = z.infer<typeof referralSchema>;

// ─── Shared UI Atoms ─────────────────────────────────────────────────────────

function StepDots({ current }: { current: number }) {
	return (
		<div
			className="flex items-center gap-6"
			dir="rtl"
		>
			{Array.from({ length: TOTAL_STEPS }).map((_, i) => (
				<div
					key={i}
					className={cn(
						"size-2.5 rounded-full transition-colors",
						i <= current ? "bg-primary" : "bg-border",
					)}
				/>
			))}
		</div>
	);
}

function NavButtons({
	onNext,
	onBack,
	isPending,
	nextLabel = "التالي",
	hideBack = false,
}: {
	onNext?: () => void;
	onBack?: () => void;
	isPending?: boolean;
	nextLabel?: string;
	hideBack?: boolean;
}) {
	const { isRtl } = useI18n();
	const ArrowNext = isRtl ? IconArrowLeft : IconArrowRight;
	const ArrowBack = isRtl ? IconArrowRight : IconArrowLeft;

	return (
		<div className="flex items-center gap-3 w-full">
			{!hideBack && onBack && (
				<Button
					type="button"
					variant="outline"
					onClick={onBack}
					disabled={isPending}
					className="h-10 w-24 rounded-md border text-xs font-medium gap-1"
				>
					{nextLabel === "التالي" && <ArrowBack className="size-3.5" />}
					السابق
				</Button>
			)}

			<Button
				type={onNext ? "button" : "submit"}
				onClick={onNext}
				disabled={isPending}
				className="flex-1 h-10 rounded-md bg-primary text-primary-foreground text-xs font-medium gap-1.5"
			>
				{nextLabel}
				<ArrowNext className="size-3.5" />
			</Button>
		</div>
	);
}

// ─── Browser Mockup ──────────────────────────────────────────────────────────

function BrowserMockup({
	children,
	dir,
}: {
	children?: React.ReactNode;
	dir?: "rtl" | "ltr";
}) {
	return (
		<div className="border border-border rounded-md overflow-hidden w-[520px] shrink-0">
			{/* Tab bar — browser chrome stays LTR regardless of content direction */}
			<div className="border-b border-border bg-background px-4 py-3 flex items-center gap-2">
				<div className="flex gap-2">
					<div className="size-3 rounded-full bg-[#ff6467]" />
					<div className="size-3 rounded-full bg-[#fdc700]" />
					<div className="size-3 rounded-full bg-primary" />
				</div>
				<div className="flex-1 mx-4">
					<div className="border border-border rounded-[4px] bg-background px-4 py-2">
						<p className="text-xs text-left! text-muted-foreground font-mono truncate">
							.../{env.VITE_API_URL.replace(/\/$/, "")}
						</p>
					</div>
				</div>
			</div>
			{/* Content — direction-aware */}
			<div
				className="bg-muted/30 p-8 min-h-[320px]"
				dir={dir}
			>
				{children ?? (
					<div className="flex flex-col gap-3">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="bg-muted/60 rounded-md h-12 flex items-center justify-between px-4"
							>
								<div className="h-3 w-24 rounded-full bg-primary/30" />
								<div className="h-3 w-20 rounded-full bg-muted-foreground/20" />
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}

function SettingsMockupRow({ label, value }: { label: string; value?: ReactNode }) {
	return (
		<div className="bg-muted/60 rounded-md h-14 flex items-center justify-between px-4">
			<p className="text-sm font-medium">{label}</p>
			<span className="text-xs text-muted-foreground">{value}</span>
		</div>
	);
}

// ─── Step 0: Clinic Info ─────────────────────────────────────────────────────

function ClinicInfoStep({ onNext }: { onNext: () => void }) {
	const { saveClinicInfo, isClinicInfoPending } = useOnboarding();
	const { clinicInfo } = useClinicInfo();
	const [slugConflict, setSlugConflict] = useState<string[] | null>(null);

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<ClinicInfoFormValues>({
		resolver: zodResolver(clinicInfoSchema),
		defaultValues: {
			name: clinicInfo?.name ?? "",
			slug: clinicInfo?.slug ?? "",
		},
	});

	const nameValue = watch("name") ?? "";

	const onSubmit = async (data: ClinicInfoFormValues) => {
		setSlugConflict(null);
		try {
			await saveClinicInfo({
				name: data.name,
				slug: data.slug || undefined,
			});
			onNext();
		} catch (err: unknown) {
			const e = err as Error & { suggestions?: string[] };
			if (e.suggestions !== undefined) {
				setSlugConflict(e.suggestions);
				toast.error(
					e.suggestions.length > 0
						? "هذا الرابط مستخدم — اختر أحد البدائل المقترحة أدناه"
						: "هذا الرابط مستخدم بالفعل — اختر رابطًا مختلفًا",
				);
			} else {
				toast.error("فشل حفظ معلومات الأكاديمية، حاول مرة أخرى");
			}
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex items-center gap-20"
			dir="rtl"
		>
			{/* Browser mockup */}
			<BrowserMockup>
				<div className="flex flex-col gap-4">
					{/* App header row */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="size-8 rounded-md bg-primary" />
							<span className="text-sm font-medium text-foreground">
								{nameValue || "sanad"}
							</span>
						</div>

						<div className="flex items-center gap-3">
							<div className="h-9 w-20 rounded-md bg-muted" />
							<div className="h-9 w-16 rounded-md bg-primary" />
						</div>
					</div>
					{/* Content placeholder */}
					<div className="h-10 rounded-md bg-muted/60" />
					<div className="h-10 rounded-md bg-muted/60" />
					<div className="h-10 rounded-md bg-muted/60" />
					<div className="h-10 rounded-md bg-muted/60" />
				</div>
			</BrowserMockup>

			{/* Form panel */}
			<div className="flex flex-col gap-14 items-center w-[480px] shrink-0">
				<div className="flex flex-col gap-6 w-full">
					<div className="text-center space-y-1.5">
						<p className="font-bold text-sm">هلا هلا 👋 أخبرنا عن أكاديميتك</p>
						<p className="text-xs text-muted-foreground">
							نريد أن نتعرف عليك أكثر وعلى منشأتك لإعداد حسابك
						</p>
					</div>

					<div className="bg-background border border-border rounded-[4px] shadow-sm py-3 px-5 flex flex-col gap-4">
						{/* Clinic name */}
						<Field data-invalid={!!errors.name}>
							<label
								htmlFor="onboarding-clinic-name"
								className="text-xs text-right block"
							>
								اسم الأكاديمية <span className="text-destructive">*</span>
							</label>
							<Input
								id="onboarding-clinic-name"
								placeholder="مثال: أكاديمية سند"
								className="h-9 text-xs text-right"
								dir="rtl"
								{...register("name")}
							/>
							<FieldError errors={[errors.name]} />
						</Field>

						{/* Subdomain */}
						<Field data-invalid={!!errors.slug || slugConflict !== null}>
							<label
								htmlFor="onboarding-clinic-slug"
								className="text-xs text-right block"
							>
								رابط النطاق الفرعي
							</label>
							<div
								className="flex items-center gap-2 h-9 border border-input rounded-md px-3 focus-within:ring-1 focus-within:ring-ring text-xs"
								dir="ltr"
							>
								<span className="shrink-0 text-muted-foreground whitespace-nowrap">
									{BOOKING_BASE_URL}
								</span>
								<input
									id="onboarding-clinic-slug"
									className="flex-1 bg-transparent outline-none min-w-0"
									placeholder="clinic-name"
									dir="ltr"
									maxLength={SLUG_MAX_LENGTH}
									{...register("slug", {
										setValueAs: (v) => (typeof v === "string" ? v.toLowerCase() : v || ""),
									})}
								/>
							</div>

							{/* Slug conflict error with suggestions */}
							{slugConflict !== null ? (
								<div className="flex flex-col gap-1.5">
									<p className="text-xs text-destructive text-right">
										هذا الرابط مستخدم لصالح أكاديمية أخرى
										{slugConflict.length > 0 ? " — بدائل متاحة:" : " — اختر رابطًا مختلفًا"}
									</p>
									{slugConflict.length > 0 && (
										<div className="flex items-center gap-2 justify-end flex-wrap">
											{slugConflict.map((s) => (
												<button
													key={s}
													type="button"
													onClick={() => {
														setValue("slug", s);
														setSlugConflict(null);
													}}
													className="text-[10px] border border-border rounded-sm px-2 py-0.5 hover:bg-muted font-mono"
												>
													{s}
												</button>
											))}
										</div>
									)}
								</div>
							) : (
								<FieldError errors={[errors.slug]} />
							)}
						</Field>
					</div>

					<NavButtons
						onNext={undefined}
						isPending={isClinicInfoPending}
						hideBack
						nextLabel="التالي"
					/>
				</div>

				<StepDots current={0} />
			</div>
		</form>
	);
}

// ─── Step 1: Country ─────────────────────────────────────────────────────────

function CountryStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
	const { updateClinicInfo, isPending } = useUpdateClinicInfo();
	const [selected, setSelected] = useState<string>("SA");

	const country = COUNTRIES.find((c) => c.code === selected) ?? COUNTRIES[0];

	const handleNext = async () => {
		try {
			await updateClinicInfo({
				countryCode: country.code as string,
				timezone: country.timezone,
				calendarType: country.calendarType,
				currencyCode: country.currencyCode as "SAR" | "AED" | "QAR" | "EGP",
			});
			onNext();
		} catch {
			toast.error("فشل حفظ إعدادات الدولة");
		}
	};

	return (
		<div
			className="flex items-center gap-20"
			dir="rtl"
		>
			{/* Browser mockup showing settings */}
			<BrowserMockup>
				<div className="flex flex-col gap-3">
					<SettingsMockupRow
						label="العملة"
						value={(() => {
							const Icon = CURRENCY_ICONS[country.currencyCode];
							return <Icon className="size-4" />;
						})()}
					/>
					<SettingsMockupRow
						label="التقويم"
						value={country.calendarType === "HIJRI" ? "هجري" : "ميلادي"}
					/>
					<SettingsMockupRow
						label="التاريخ"
						value={new Date().toLocaleDateString("ar-SA", {
							calendar: country.calendarType === "HIJRI" ? "islamic" : "gregory",
						})}
					/>
					<SettingsMockupRow
						label="المنطقة الزمنية"
						value={country.timezone}
					/>
					<SettingsMockupRow
						label="أيام العمل المناسبة"
						value={`${country.workDays.length} أيام اسبوعيا`}
					/>
				</div>
			</BrowserMockup>

			<div className="flex flex-col gap-14 items-center w-[480px] shrink-0">
				<div className="flex flex-col gap-6 w-full">
					<div className="text-center space-y-1.5">
						<p className="font-bold text-sm">اختر دولتك</p>
						<p className="text-xs text-muted-foreground text-right">
							اختر دولتك، وسيتولى النظام تلقائيًا ضبط العملة والتقويم والتاريخ والمنطقة الزمنية
							وأيام العمل المناسبة
						</p>
					</div>

					<div className="bg-background border border-border rounded-[4px] shadow-sm py-3 px-5">
						<div className="flex items-center justify-center gap-2.5">
							{COUNTRIES.map((c) => (
								<button
									key={c.code}
									type="button"
									onClick={() => setSelected(c.code)}
									className={cn(
										"flex flex-col items-center gap-4 w-24 p-2.5 rounded-md border transition-colors",
										selected === c.code
											? "border-primary bg-primary/5"
											: "border-border bg-background hover:bg-muted/50",
									)}
								>
									<div className="flex h-10 items-center justify-center text-3xl">
										{c.flag}
									</div>
									<span className="text-sm font-medium">{c.nameAr}</span>
								</button>
							))}
						</div>
					</div>

					<NavButtons
						onNext={handleNext}
						onBack={onBack}
						isPending={isPending}
					/>
				</div>

				<StepDots current={1} />
			</div>
		</div>
	);
}

// ─── Step 2: Language ────────────────────────────────────────────────────────

function LanguageStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
	const { lang, setLang } = useI18n();
	const [selected, setSelected] = useState<Language>(lang as Language);

	const handleNext = () => {
		setLang(selected);
		onNext();
	};

	return (
		<div
			className="flex items-center gap-20"
			dir="rtl"
		>
			<BrowserMockup dir={selected === "ar" ? "rtl" : "ltr"}>
				<div className="flex flex-col gap-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<div
							key={i}
							className="bg-muted/60 rounded-md h-12 flex items-center justify-between px-4"
						>
							<div className="h-3 w-24 rounded-full bg-primary/30" />
							<div className="h-3 w-16 rounded-full bg-muted-foreground/20" />
						</div>
					))}
				</div>
			</BrowserMockup>

			<div className="flex flex-col gap-14 items-center w-[480px] shrink-0">
				<div className="flex flex-col gap-8 w-full">
					<div className="text-center space-y-2">
						<p className="text-xl font-bold">اختر لغتك</p>
						<p className="text-base text-muted-foreground">
							يمكنك التبديل بين اللغات من أيقونة الكرة الأرضية في الإعدادات أو في أعلى الشاشة.
						</p>
					</div>

					<div className="flex items-center">
						{(["ar", "en"] as Language[]).map((code, i) => (
							<button
								key={code}
								type="button"
								onClick={() => setSelected(code)}
								className={cn(
									"flex flex-col items-center gap-4 w-[226px] h-[155px] border overflow-hidden transition-colors",
									i === 0 ? "rounded-r-[4px]" : "rounded-l-[4px]",
									selected === code
										? "border-primary bg-background"
										: "bg-muted/40 border-border hover:bg-muted/60",
								)}
							>
								{/* App screenshot placeholder */}
								<div
									className={cn(
										"w-full flex-1 bg-card border-b border-border flex items-center justify-center relative overflow-hidden",
										selected === code && "border-primary",
									)}
								>
									<div
										className={cn(
											"absolute inset-2 rounded-sm bg-muted/50 flex flex-col gap-1 p-2",
											code === "en" ? "" : "items-end",
										)}
									>
										<div className="h-2 w-16 rounded-full bg-primary/40" />
										<div className="h-1.5 w-10 rounded-full bg-muted-foreground/30" />
										<div className="h-1.5 w-14 rounded-full bg-muted-foreground/20" />
									</div>
								</div>
								<span className="text-sm font-medium pb-3">
									{code === "ar" ? "العربية" : "الإنجليزية"}
								</span>
							</button>
						))}
					</div>

					<NavButtons
						onNext={handleNext}
						onBack={onBack}
					/>
				</div>

				<StepDots current={2} />
			</div>
		</div>
	);
}

// ─── Step 3: Profile Questionnaire ───────────────────────────────────────────

function SelectField({
	label,
	required,
	placeholder = "اختر...",
	options,
	value,
	onChange,
	error,
}: {
	label: string;
	required?: boolean;
	placeholder?: string;
	options: readonly { value: string; label: string; subtitle?: string }[];
	value: string | undefined;
	onChange: (v: string) => void;
	error?: { message?: string };
}) {
	return (
		<Field
			data-invalid={!!error}
			className="flex flex-col gap-1.5"
		>
			<div className="text-xs text-right">
				{label}
				{required && <span className="text-destructive me-1">*</span>}
			</div>
			<Select
				value={value ?? ""}
				onValueChange={onChange}
				dir="rtl"
			>
				<SelectTrigger className="h-9 text-xs text-right justify-end border-input [&>svg]:ms-auto [&>svg]:me-0">
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent align="end">
					{options.map((o) => (
						<SelectItem
							key={o.value}
							value={o.value}
							className="text-xs text-right"
						>
							<div className="text-right">
								<p>{o.label}</p>
								{o.subtitle && (
									<p className="text-[10px] text-muted-foreground">{o.subtitle}</p>
								)}
							</div>
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<FieldError errors={[error]} />
		</Field>
	);
}

function ProfileStep({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
	const { saveProfile, isProfilePending } = useOnboarding();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
	});

	const onSubmit = async (data: ProfileFormValues) => {
		try {
			await saveProfile({
				specialtyType:
					data.specialtyType as import("@/generated/prisma/client").ClinicSpecialtyType,
				mainGoal: data.mainGoal as import("@/generated/prisma/client").ClinicMainGoal,
				clinicSize: data.clinicSize as
					| import("@/generated/prisma/client").ClinicSizeType
					| undefined,
				animalTypes: data.animalTypes ? [data.animalTypes] : [],
				monthlyVisits: data.monthlyVisits as
					| import("@/generated/prisma/client").MonthlyRangeType
					| undefined,
				monthlyPatients: data.monthlyPatients as
					| import("@/generated/prisma/client").MonthlyRangeType
					| undefined,
				multiBranch: data.multiBranch !== undefined ? data.multiBranch === "true" : undefined,
				serviceDelivery: data.serviceDelivery as
					| import("@/generated/prisma/client").ServiceDeliveryType
					| undefined,
			});
			onNext();
		} catch {
			toast.error("فشل حفظ بيانات الأكاديمية");
		}
	};

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-14 items-center w-[480px]"
		>
			<div className="flex flex-col gap-6 w-full">
				<div className="text-center space-y-1.5">
					<p className="font-bold text-sm">هلا هلا 👋 اختر تخصصك الرئيسي</p>
					<p className="text-xs text-muted-foreground">ساعدنا في تخصيص تجربتك</p>
				</div>

				<div className="bg-background border border-border rounded-[4px] shadow-sm py-3 px-5 flex flex-col gap-4">
					{/* Specialty + Goal (full width) */}
					<Controller
						name="specialtyType"
						control={control}
						render={({ field }) => (
							<SelectField
								label="التخصص الرئيسي"
								required
								options={SPECIALTY_OPTIONS}
								value={field.value}
								onChange={field.onChange}
								error={errors.specialtyType}
							/>
						)}
					/>
					<Controller
						name="mainGoal"
						control={control}
						render={({ field }) => (
							<SelectField
								label="هدفك الرئيسي"
								required
								options={GOAL_OPTIONS}
								value={field.value}
								onChange={field.onChange}
								error={errors.mainGoal}
							/>
						)}
					/>

					{/* Two-column grid for remaining fields */}
					<div className="grid grid-cols-2 gap-3">
						<Controller
							name="clinicSize"
							control={control}
							render={({ field }) => (
								<SelectField
									label="حجم أكاديميتك؟"
									options={SIZE_OPTIONS}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						<Controller
							name="animalTypes"
							control={control}
							render={({ field }) => (
								<SelectField
									label="نوع الأطفال التي تخدمها؟"
									options={ANIMAL_OPTIONS}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						<Controller
							name="monthlyVisits"
							control={control}
							render={({ field }) => (
								<SelectField
									label="متوسط الزيارات شهريًا؟"
									options={MONTHLY_OPTIONS}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						<Controller
							name="monthlyPatients"
							control={control}
							render={({ field }) => (
								<SelectField
									label="متوسط الأطفال شهريًا؟"
									options={MONTHLY_OPTIONS}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						<Controller
							name="multiBranch"
							control={control}
							render={({ field }) => (
								<SelectField
									label="لديك أكثر من فرع؟"
									options={BRANCH_OPTIONS}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
						<Controller
							name="serviceDelivery"
							control={control}
							render={({ field }) => (
								<SelectField
									label="طرق تقديم الدورة؟"
									options={DELIVERY_OPTIONS}
									value={field.value}
									onChange={field.onChange}
								/>
							)}
						/>
					</div>
				</div>

				<NavButtons
					onNext={undefined}
					onBack={onBack}
					isPending={isProfilePending}
				/>
			</div>

			<StepDots current={3} />
		</form>
	);
}

// ─── Step 4: Referral + Social ────────────────────────────────────────────────

function ReferralSocialStep({ onBack }: { onBack: () => void }) {
	const navigate = useNavigate();
	const { saveProfile, completeOnboarding, isProfilePending, isCompletePending } =
		useOnboarding();
	const { clinicInfo } = useClinicInfo();
	const [subStep, setSubStep] = useState<"referral" | "social">("referral");
	const isPending = isProfilePending || isCompletePending;

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<ReferralFormValues>({
		resolver: zodResolver(referralSchema),
	});

	const onReferralSubmit = async (data: ReferralFormValues) => {
		try {
			await saveProfile({
				referralSource:
					data.referralSource as import("@/generated/prisma/client").ReferralSource,
			});
			setSubStep("social");
		} catch {
			toast.error("فشل حفظ البيانات");
		}
	};

	const handleComplete = async () => {
		try {
			await completeOnboarding();
			navigate({ to: "/dashboard" });
		} catch {
			toast.error("فشل إكمال الإعداد");
		}
	};

	if (subStep === "social") {
		const SETUP_STEPS = [
			{
				Icon: IconUser,
				title: "أضف أول وليّ أمر",
				description: "أنشئ أول سجل لوليّ أمر طفل وابدأ بناء قاعدة عملائك.",
			},
			{
				Icon: IconPaw,
				title: "أضف أول طفل",
				description: "سجّل أول طفل أليف مع بياناته الطبية وسلالته.",
			},
			{
				Icon: IconUserPlus,
				title: "ادعُ موظفيك",
				description: "أضف المدرّبين وموظفي الاستقبال وعيّن الأدوار والصلاحيات.",
			},
			{
				Icon: IconStethoscope,
				title: "أنشئ أول دورة",
				description: "أضف دورات الكشف والتطعيم والجراحة والجرومينج.",
			},
			{
				Icon: IconBrandWhatsapp,
				title: "اربط واتساب",
				description: "فعّل الإشعارات والتذكيرات ورسائل الزيارات عبر واتساب.",
			},
			{
				Icon: IconCalendar,
				title: "أنشئ أول زيارة",
				description: "ابدأ جدولة الزيارات وإدارة الطابور والاستقبال.",
			},
			{
				Icon: IconFileInvoice,
				title: "أنشئ أول فاتورة",
				description: "أنشئ أول فاتورة واختبر دورة الدفع الكاملة.",
			},
			{
				Icon: IconPackage,
				title: "أضف أول منتج أو دواء",
				description: "ابدأ إدارة المخزون والوصفات الطبية.",
			},
		] as const;

		return (
			<div className="flex flex-col gap-8 items-center w-full max-w-[900px]">
				<div
					className="flex flex-col gap-2 items-center text-center"
					dir="rtl"
				>
					<p className="font-bold text-xl">
						مرحبًا بك في {clinicInfo?.name ?? "أكاديمية سند"} أنت جاهز للإنطلاق
					</p>
					<p className="text-sm text-muted-foreground max-w-[460px]">
						ابدأ في استكشاف منصتنا المدعومة بـ AI، وتعلّم أساسياتها بسرعة من خلال خطوات إعداد
						بسيطة
					</p>
				</div>

				<div
					className="border border-border rounded-md overflow-hidden w-full"
					dir="rtl"
				>
					{[SETUP_STEPS.slice(0, 4), SETUP_STEPS.slice(4)].map((row, rowIdx) => (
						<div
							key={rowIdx}
							className={cn("grid grid-cols-4", rowIdx === 0 && "border-b border-border")}
						>
							{row.map(({ Icon, title, description }, colIdx) => (
								<div
									key={title}
									className={cn(
										"flex flex-col gap-3 items-start p-6",
										colIdx !== 3 && "border-l border-border",
									)}
								>
									<Icon className="size-5 text-foreground" />
									<div className="flex flex-col gap-1.5 text-right w-full">
										<p className="text-sm font-semibold text-foreground">{title}</p>
										<p className="text-xs text-muted-foreground">{description}</p>
									</div>
								</div>
							))}
						</div>
					))}
				</div>

				<Button
					className="w-[460px] h-10 rounded-[4px] bg-primary text-primary-foreground text-sm font-medium"
					onClick={handleComplete}
					disabled={isPending}
				>
					ابدأ الآن
				</Button>
			</div>
		);
	}

	return (
		<form
			onSubmit={handleSubmit(onReferralSubmit)}
			className="flex flex-col gap-14 items-center w-[480px]"
		>
			<div className="flex flex-col gap-6 w-full">
				<div className="text-center space-y-1.5">
					<p className="font-bold text-sm">هلا هلا 👋 أين تعرفت علينا؟</p>
					<p className="text-xs text-muted-foreground">آخر خطوة لإكمال الإعداد</p>
				</div>

				<div className="bg-background border border-border rounded-[4px] shadow-sm py-3 px-5">
					<Controller
						name="referralSource"
						control={control}
						render={({ field }) => (
							<SelectField
								label="أين سمعت عنا؟"
								options={REFERRAL_OPTIONS}
								value={field.value}
								onChange={field.onChange}
								error={errors.referralSource}
							/>
						)}
					/>
				</div>

				<NavButtons
					onNext={undefined}
					onBack={onBack}
					isPending={isProfilePending}
				/>
			</div>

			<StepDots current={4} />
		</form>
	);
}

// ─── Root Component ───────────────────────────────────────────────────────────

function RouteComponent() {
	const [step, setStep] = useState(0);

	const isSplitLayout = step <= 2;

	return (
		<div
			className={cn(
				"flex min-h-dvh items-center justify-center p-8",
				isSplitLayout ? "gap-0" : "",
			)}
		>
			{step === 0 && <ClinicInfoStep onNext={() => setStep(1)} />}
			{step === 1 && (
				<CountryStep
					onNext={() => setStep(2)}
					onBack={() => setStep(0)}
				/>
			)}
			{step === 2 && (
				<LanguageStep
					onNext={() => setStep(3)}
					onBack={() => setStep(1)}
				/>
			)}
			{step === 3 && (
				<ProfileStep
					onNext={() => setStep(4)}
					onBack={() => setStep(2)}
				/>
			)}
			{step === 4 && <ReferralSocialStep onBack={() => setStep(3)} />}
		</div>
	);
}

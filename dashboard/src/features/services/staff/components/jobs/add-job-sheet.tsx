import {
	IconArrowLeft,
	IconArrowRight,
	IconBarcode,
	IconBrandFacebook,
	IconBrandLinkedin,
	IconBrandX,
	IconBriefcase,
	IconBuildingCommunity,
	IconCalendar,
	IconCalendarEvent,
	IconClipboardText,
	IconClock,
	IconCopy,
	IconCurrencyDollar,
	IconDeviceFloppy,
	IconInfoCircle,
	IconMapPin,
	IconShare,
	IconUser,
	IconUsers,
	IconUsersGroup,
	IconWorld,
	IconX,
} from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";
import { type ComponentType, Fragment, type ReactNode, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// خطوات النموذج (RTL: الخطوة الأولى على اليمين)
const STEPS: { label: string; icon: ComponentType<{ className?: string }> }[] = [
	{ label: "معلومات الوظيفة", icon: IconClipboardText },
	{ label: "مديري التوظيف", icon: IconUsersGroup },
	{ label: "نشر الوظيفة", icon: IconShare },
];

// مديري توظيف (بيانات عيّنة مطابقة للتصميم)
const HIRING_MANAGERS = [
	{ id: "1", name: "محمد الصالح", role: "مدير التنمية البشرية", active: 3 },
	{ id: "2", name: "محمد الصالح", role: "مدير التنمية البشرية", active: 3 },
	{ id: "3", name: "محمد الصالح", role: "مدير التنمية البشرية", active: 3 },
	{ id: "4", name: "محمد الصالح", role: "مدير التنمية البشرية", active: 3 },
];

export type JobForm = {
	title: string;
	department: string;
	closeDate: string;
	employmentType: string;
	positions: string;
	workEnv: string;
	country: string;
	city: string;
	salaryMin: string;
	salaryMax: string;
	currency: string;
	payType: string;
	description: string;
	undisclosed: boolean;
};

const EMPTY_FORM: JobForm = {
	title: "",
	department: "",
	closeDate: "",
	employmentType: "",
	positions: "",
	workEnv: "",
	country: "",
	city: "",
	salaryMin: "",
	salaryMax: "",
	currency: "",
	payType: "",
	description: "",
	undisclosed: false,
};

// تسمية الحقل: النص + شارة "مطلوب" + أيقونة معلومات
function FieldLabel({ label, required = true }: { label: string; required?: boolean }) {
	return (
		<div className="flex items-center gap-1.5">
			<span className="text-[11px] font-medium text-[#08090A]">{label}</span>
			{required && (
				<span className="rounded-[4px] bg-[#DC2626]/[0.06] px-[4.5px] py-[1.5px] text-[8px] font-medium text-[#DC2626]">
					مطلوب
				</span>
			)}
			<IconInfoCircle className="size-2.5 text-[#9B9B9D] opacity-50" />
		</div>
	);
}

// حقل قائمة منسدلة
function SelectField({
	label,
	placeholder,
	options = [],
	value,
	onChange,
}: {
	label: string;
	placeholder: string;
	options?: string[];
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="flex flex-1 flex-col items-start gap-1.5">
			<FieldLabel label={label} />
			<Select
				dir="rtl"
				value={value || undefined}
				onValueChange={onChange}
			>
				<SelectTrigger
					className={cn(
						"h-[34px] w-full text-[11px]",
						value ? "text-[#08090A]" : "text-[#9B9B9D]",
					)}
				>
					<SelectValue placeholder={placeholder} />
				</SelectTrigger>
				<SelectContent dir="rtl">
					{(options.length > 0 ? options : ["—"]).map((o) => (
						<SelectItem
							key={o}
							value={o}
						>
							{o}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}

// حقل إدخال
function InputField({
	label,
	placeholder,
	type = "text",
	value,
	onChange,
}: {
	label: string;
	placeholder: string;
	type?: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="flex flex-1 flex-col items-start gap-1.5">
			<FieldLabel label={label} />
			<Input
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="h-[34px] w-full text-right text-[11px] placeholder:text-[#9B9B9D]"
			/>
		</div>
	);
}

// حقل تاريخ (Popover + Calendar) — نفس تصميم منتقي التاريخ في باقي النظام
function DateField({
	label,
	placeholder,
	value,
	onChange,
}: {
	label: string;
	placeholder: string;
	value: string;
	onChange: (v: string) => void;
}) {
	return (
		<div className="flex flex-1 flex-col items-start gap-1.5">
			<FieldLabel label={label} />
			<Popover>
				<PopoverTrigger asChild>
					<button
						type="button"
						className="flex h-[34px] w-full items-center justify-between rounded-[4px] border border-input px-2.5"
					>
						<span className={cn("text-[11px]", value ? "text-[#08090A]" : "text-[#9B9B9D]")}>
							{value
								? format(new Date(`${value}T00:00:00`), "d MMMM yyyy", { locale: arSA })
								: placeholder}
						</span>
						<IconCalendar className="size-4 shrink-0 text-[#9B9B9D]" />
					</button>
				</PopoverTrigger>
				<PopoverContent
					align="end"
					dir="rtl"
					className="w-[445px] rounded-[4px] p-0 shadow-xl"
				>
					<div className="flex flex-col gap-2 px-6 py-1.5">
						<Calendar
							mode="single"
							locale={arSA}
							weekStartsOn={1}
							showOutsideDays
							selected={value ? new Date(`${value}T00:00:00`) : undefined}
							onSelect={(d) => d && onChange(format(d, "yyyy-MM-dd"))}
							formatters={{
								formatWeekdayName: (d) =>
									d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2),
							}}
							className="w-full p-0 [--cell-radius:9999px] [--cell-size:--spacing(10)]"
							classNames={{
								month_caption:
									"flex h-(--cell-size) w-full items-center justify-center text-base font-medium text-[#08090A]",
								weekday: "flex-1 text-[14px] font-normal text-[#667085] select-none",
								day: "group/day relative aspect-square h-full w-full rounded-full p-0 text-center select-none",
							}}
						/>
						<div className="flex justify-end border-t border-[#EBEBEF] pt-1.5">
							<button
								type="button"
								onClick={() => onChange("")}
								className="px-2 py-1 text-[14px] text-[#121217] hover:text-[#6366F1]"
							>
								إعادة الضبط
							</button>
						</div>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}

// ترويسة قسم: العنوان يمين + عناصر إضافية يسار
function SectionHeader({ title, extra }: { title: string; extra?: ReactNode }) {
	return (
		<div className="flex w-full items-center justify-between">
			<span className="text-[14px] font-bold text-[#1A1A18]">{title}</span>
			<div className="flex items-center gap-3">
				{extra}
				<IconInfoCircle className="size-[18px] text-[#6B6B67]" />
			</div>
		</div>
	);
}

export function AddJobSheet({
	open,
	onClose,
	onPublish,
}: {
	open: boolean;
	onClose: () => void;
	onPublish?: (job: JobForm) => void;
}) {
	const [step, setStep] = useState(1);
	const [form, setForm] = useState<JobForm>(EMPTY_FORM);
	const [selectedManagers, setSelectedManagers] = useState<Set<string>>(new Set());
	const [visibility, setVisibility] = useState("عام");
	const [platforms, setPlatforms] = useState<Set<string>>(new Set(["linkedin"]));

	const set =
		<K extends keyof JobForm>(key: K) =>
		(v: JobForm[K]) =>
			setForm((f) => ({ ...f, [key]: v }));

	// صلاحية الخطوة الأولى: كل الحقول المطلوبة مملوءة
	const salaryOk =
		form.undisclosed ||
		(!!form.salaryMin && !!form.salaryMax && !!form.currency && !!form.payType);
	const step1Valid =
		!!form.title &&
		!!form.department &&
		!!form.closeDate &&
		!!form.employmentType &&
		!!form.positions &&
		!!form.workEnv &&
		!!form.country &&
		!!form.city &&
		!!form.description &&
		salaryOk;

	const close = () => {
		setStep(1);
		onClose();
	};

	const toggleManager = (id: string) =>
		setSelectedManagers((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	const togglePlatform = (id: string) =>
		setPlatforms((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});

	// ملخّص القيم المُدخلة (الخطوة الثالثة)
	const salaryText = form.undisclosed
		? "غير مُفصح عنه"
		: [[form.salaryMin, form.salaryMax].filter(Boolean).join(" - "), form.currency]
				.filter(Boolean)
				.join(" ");
	const managersText = HIRING_MANAGERS.filter((m) => selectedManagers.has(m.id))
		.map((m) => m.name)
		.join(" - ");
	const DETAILS: {
		label: string;
		value: string;
		icon: ComponentType<{ className?: string }>;
	}[] = [
		{ label: "المسمى الوظيفي", value: form.title, icon: IconUser },
		{ label: "القسم", value: form.department, icon: IconBuildingCommunity },
		{
			label: "تاريخ إغلاق التقديم",
			value: form.closeDate
				? format(new Date(`${form.closeDate}T00:00:00`), "d MMMM yyyy", { locale: arSA })
				: "",
			icon: IconCalendarEvent,
		},
		{ label: "نوع التوظيف", value: form.employmentType, icon: IconClock },
		{
			label: "عدد الوظائف المتاحة",
			value: form.positions ? `${form.positions} وظائف` : "",
			icon: IconBriefcase,
		},
		{ label: "نوع بيئة العمل", value: form.workEnv, icon: IconWorld },
		{ label: "الدولة", value: form.country, icon: IconMapPin },
		{ label: "المدينة", value: form.city, icon: IconMapPin },
		{ label: "نطاق الراتب", value: salaryText, icon: IconCurrencyDollar },
		{ label: "الدفع", value: form.payType, icon: IconClock },
		{ label: "مديري التوظيف", value: managersText, icon: IconUsers },
	];

	const VISIBILITY_OPTIONS = [
		{ key: "عام", desc: "تظهر في صفحة الوظائف ومنصات التوظيف" },
		{ key: "داخلي", desc: "تظهر للموظفين داخل المنشأة فقط" },
		{ key: "رابط خاص", desc: "تتم مشاركتها عبر رابط مباشر فقط" },
	];

	const PLATFORMS: {
		key: string;
		label: string;
		icon: ComponentType<{ className?: string }>;
		color: string;
	}[] = [
		{ key: "linkedin", label: "لينكدإن", icon: IconBrandLinkedin, color: "#0A66C2" },
		{ key: "x", label: "أكس (تويتر)", icon: IconBrandX, color: "#08090A" },
		{ key: "facebook", label: "فيسبوك", icon: IconBrandFacebook, color: "#1877F2" },
	];

	return (
		<Sheet
			open={open}
			onOpenChange={(o) => {
				if (!o) close();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[775px]!"
			>
				{/* الهيدر */}
				<div
					className="flex items-center justify-between border-b px-4 py-2"
					dir="rtl"
				>
					<SheetTitle className="text-[13px] font-bold text-[#08090A]">
						إضافة وظيفة جديدة
					</SheetTitle>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={close}
						type="button"
					>
						<IconX className="size-3.5 text-[#9B9B9D]" />
					</Button>
				</div>

				{/* الخطوات (Stepper) — يمتد على عرض الدايالوج بالكامل */}
				<div
					className="flex items-center gap-2 border-b border-[#E5E5E5] px-6 py-3"
					dir="rtl"
				>
					{STEPS.map((s, i) => {
						const StepIcon = s.icon;
						const reached = i <= step - 1;
						return (
							<Fragment key={s.label}>
								<div className="flex shrink-0 flex-col items-center gap-1.5">
									<span
										className={cn(
											"flex size-8 items-center justify-center rounded-full",
											reached ? "bg-[#506AE0] text-white" : "bg-[#F9FAFB] text-[#6B6B67]",
										)}
									>
										<StepIcon className="size-[18px]" />
									</span>
									<span
										className={cn(
											"whitespace-nowrap text-[10px]",
											reached ? "font-semibold text-[#1A1A18]" : "text-[#6B6B67]",
										)}
									>
										{s.label}
									</span>
								</div>
								{i < STEPS.length - 1 && (
									<span
										className={cn(
											"mb-5 h-0.5 flex-1",
											i < step ? "bg-[#506AE0]" : "bg-[#DEDEDE]",
										)}
									/>
								)}
							</Fragment>
						);
					})}
				</div>

				{/* محتوى الخطوة الأولى */}
				{step === 1 && (
					<div
						className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 py-4"
						dir="rtl"
					>
						{/* تفاصيل الوظيفة */}
						<section className="flex flex-col gap-3">
							<SectionHeader title="تفاصيل الوظيفة" />
							<div className="grid grid-cols-2 gap-3">
								<SelectField
									label="المسمى الوظيفي"
									placeholder="اختر المسمى الوظيفي"
									options={["مدرّب", "فني مختبر", "ممرض", "موظف استقبال"]}
									value={form.title}
									onChange={set("title")}
								/>
								<SelectField
									label="القسم"
									placeholder="اختر القسم"
									options={["الطوارئ", "الجراحة", "التنمية البشرية", "المختبر"]}
									value={form.department}
									onChange={set("department")}
								/>
								<DateField
									label="تاريخ إغلاق التقديم"
									placeholder="اختر تاريخ إغلاق التقديم"
									value={form.closeDate}
									onChange={set("closeDate")}
								/>
								<SelectField
									label="نوع التوظيف"
									placeholder="اختر نوع التوظيف"
									options={["دوام كامل", "دوام جزئي", "عقد مؤقت", "تدريب"]}
									value={form.employmentType}
									onChange={set("employmentType")}
								/>
								<InputField
									label="عدد الوظائف المتاحة"
									placeholder="ادخل عدد الوظائف المتاحة"
									type="number"
									value={form.positions}
									onChange={set("positions")}
								/>
								<SelectField
									label="نوع بيئة العمل"
									placeholder="اختر بيئة العمل"
									options={["حضوري", "عن بُعد", "هجين"]}
									value={form.workEnv}
									onChange={set("workEnv")}
								/>
							</div>
						</section>

						<span className="h-px w-full bg-[#E5E5E5]" />

						{/* الموقع */}
						<section className="flex flex-col gap-3">
							<SectionHeader title="الموقع" />
							<div className="grid grid-cols-2 gap-3">
								<SelectField
									label="الدولة"
									placeholder="اختر الدولة"
									options={["السعودية", "الإمارات", "الأردن", "مصر"]}
									value={form.country}
									onChange={set("country")}
								/>
								<SelectField
									label="المدينة"
									placeholder="اختر المدينة"
									options={["الرياض", "جدة", "الدمام", "مكة"]}
									value={form.city}
									onChange={set("city")}
								/>
							</div>
						</section>

						<span className="h-px w-full bg-[#E5E5E5]" />

						{/* الراتب */}
						<section className="flex flex-col gap-3">
							<SectionHeader
								title="الراتب"
								extra={
									<div className="flex items-center gap-1.5 text-[12px] text-[#737373]">
										تفضيل عدم الإفصاح
										<Checkbox
											className="size-[18px]"
											checked={form.undisclosed}
											onCheckedChange={(c) => set("undisclosed")(c === true)}
										/>
									</div>
								}
							/>
							{!form.undisclosed && (
								<>
									<div className="flex flex-col items-start gap-1.5">
										<FieldLabel label="نطاق الراتب" />
										<div className="grid w-full grid-cols-2 gap-3">
											<Input
												type="number"
												placeholder="الحد الأدنى"
												value={form.salaryMin}
												onChange={(e) => set("salaryMin")(e.target.value)}
												className="h-[34px] text-right text-[11px] placeholder:text-[#9B9B9D]"
											/>
											<Input
												type="number"
												placeholder="الحد الأعلى"
												value={form.salaryMax}
												onChange={(e) => set("salaryMax")(e.target.value)}
												className="h-[34px] text-right text-[11px] placeholder:text-[#9B9B9D]"
											/>
										</div>
									</div>
									<div className="grid grid-cols-2 gap-3">
										<SelectField
											label="العملة"
											placeholder="اختر العملة"
											options={["ر.س", "د.إ", "د.أ", "ج.م", "USD"]}
											value={form.currency}
											onChange={set("currency")}
										/>
										<InputField
											label="الدفع"
											placeholder="مثال: شهري, اسبوعي"
											value={form.payType}
											onChange={set("payType")}
										/>
									</div>
								</>
							)}
						</section>

						<span className="h-px w-full bg-[#E5E5E5]" />

						{/* وصف الوظيفة والمتطلبات */}
						<section className="flex flex-col gap-3">
							<SectionHeader title="وصف الوظيفة والمتطلبات" />
							<div className="flex flex-col items-start gap-1.5">
								<FieldLabel label="الوصف" />
								<Textarea
									placeholder="اكتب الوصف ..."
									value={form.description}
									onChange={(e) => set("description")(e.target.value)}
									className="min-h-[120px] w-full resize-none text-right text-[11px] placeholder:text-[#9B9B9D]"
								/>
							</div>
						</section>
					</div>
				)}

				{/* محتوى الخطوة الثانية — مديري التوظيف */}
				{step === 2 && (
					<div
						className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-4"
						dir="rtl"
					>
						<SectionHeader title="مديري التوظيف" />

						{/* اختيار مدير التوظيف */}
						<div className="flex flex-col items-start gap-1.5">
							<FieldLabel label="مديري التوظيف" />
							<Select dir="rtl">
								<SelectTrigger className="h-[34px] w-full text-[11px] text-[#9B9B9D]">
									<SelectValue placeholder="اختر مديري التوظيف" />
								</SelectTrigger>
								<SelectContent dir="rtl">
									{HIRING_MANAGERS.map((m) => (
										<SelectItem
											key={m.id}
											value={m.id}
										>
											{m.name} — {m.role}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						{/* جدول مديري التوظيف */}
						<div className="flex flex-col gap-2">
							<span className="text-[14px] font-bold text-[#1A1A18]">مديري التوظيف</span>
							<table className="w-full table-fixed border-collapse">
								<thead>
									<tr className="border-b border-[#F5F5F6]">
										<th className="h-[34px] px-3 text-right text-[12px] font-medium text-[#5C5C5E]">
											الاجمالي
										</th>
										<th className="h-[34px] px-3 text-center text-[12px] font-medium text-[#5C5C5E]">
											الوظيفة
										</th>
										<th className="h-[34px] px-3 text-center text-[12px] font-medium text-[#5C5C5E]">
											الاعمال النشطة
										</th>
										<th className="h-[34px] w-[52px] px-3" />
									</tr>
								</thead>
								<tbody>
									{HIRING_MANAGERS.map((m) => (
										<tr
											key={m.id}
											className="border-b border-[#F5F5F6]"
										>
											<td className="h-[34px] px-3">
												<div className="flex items-center justify-start gap-1.5">
													<span className="flex size-[18px] items-center justify-center rounded-full bg-[#F4F4F4] text-[#6B6B67]">
														<IconUser className="size-3" />
													</span>
													<span className="text-[12px] text-[#08090A]">{m.name}</span>
												</div>
											</td>
											<td className="h-[34px] px-3 text-center text-[12px] text-[#08090A]">
												{m.role}
											</td>
											<td className="h-[34px] px-3 text-center text-[12px] text-[#08090A] tabular-nums">
												{m.active}
											</td>
											<td className="h-[34px] px-3 text-left">
												<Checkbox
													className="size-[18px]"
													checked={selectedManagers.has(m.id)}
													onCheckedChange={() => toggleManager(m.id)}
												/>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>

						{/* صندوق معلومات هذه المرحلة */}
						<div className="flex flex-col items-start gap-1.5 rounded-[4px] border border-[#506AE0] bg-[#506AE0]/[0.05] p-3">
							<div className="flex items-center gap-1.5">
								<IconInfoCircle className="size-3 text-[#506AE0]" />
								<span className="text-[12px] font-medium text-[#506AE0]">حول هذه المرحلة</span>
							</div>
							<p className="pl-[18px] text-right text-[12px] leading-[18px] text-[#1A1A18]">
								تعيين مدير توظيف لمراجعة المرشحين، واختيار القائمة المختصرة، وإدارة المقابلات،
								لضمان عملية اختيار فعالة. لن يكون هذا مرئيًا للمتقدمين أو مذكورًا في الوصف
								الوظيفي
							</p>
						</div>
					</div>
				)}

				{/* محتوى الخطوة الثالثة — نشر الوظيفة */}
				{step === 3 && (
					<div
						className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4"
						dir="rtl"
					>
						{/* بطاقة ملخّص التفاصيل */}
						<div className="flex flex-col gap-1 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-3">
							<span className="pb-1 text-right text-[12px] font-semibold text-[#08090A]">
								التفاصيل
							</span>
							{DETAILS.map((d) => {
								const RowIcon = d.icon;
								return (
									<div
										key={d.label}
										className="flex items-center justify-between py-1"
									>
										<div className="flex items-center gap-1">
											<RowIcon className="size-3.5 text-[#737373]" />
											<span className="text-[14px] text-[#737373]">{d.label}</span>
										</div>
										<span className="text-[14px] font-medium text-[#08090A]">
											{d.value || "—"}
										</span>
									</div>
								);
							})}

							<span className="my-1 h-px w-full bg-[#E5E5E5]" />

							<span className="pb-1 text-right text-[12px] font-semibold text-[#08090A]">
								وصف الوظيفة والمتطلبات
							</span>
							<p className="whitespace-pre-wrap text-right text-[12px] leading-[18px] text-[#08090A]">
								{form.description || "—"}
							</p>
						</div>

						{/* مستوى الظهور + منصات النشر */}
						<div className="flex flex-col gap-3 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-3">
							{/* مستوى الظهور */}
							<span className="text-right text-[12px] font-semibold text-[#08090A]">
								مستوي الظهور
							</span>
							<div className="grid grid-cols-3 gap-2">
								{VISIBILITY_OPTIONS.map((v) => {
									const selected = visibility === v.key;
									return (
										<button
											key={v.key}
											type="button"
											onClick={() => setVisibility(v.key)}
											className={cn(
												"flex flex-col items-start gap-1 rounded-[4px] border p-3 text-right transition-colors",
												selected
													? "border-[#506AE0] bg-[#506AE0]/[0.05]"
													: "border-[#E5E5E5] bg-white",
											)}
										>
											<div className="flex w-full items-center justify-between">
												<span className="text-[14px] font-semibold text-[#08090A]">
													{v.key}
												</span>
												<span
													className={cn(
														"flex size-4 items-center justify-center rounded-full border",
														selected ? "border-[#506AE0]" : "border-[#E5E5E5]",
													)}
												>
													{selected && <span className="size-2 rounded-full bg-[#506AE0]" />}
												</span>
											</div>
											<span className="text-[12px] leading-[18px] text-[#6B6B67]">
												{v.desc}
											</span>
										</button>
									);
								})}
							</div>

							{/* منصات النشر */}
							<span className="mt-1 text-right text-[12px] font-semibold text-[#08090A]">
								منصات النشر
							</span>
							<div className="flex flex-col gap-2">
								{PLATFORMS.map((p) => {
									const PlatIcon = p.icon;
									const selected = platforms.has(p.key);
									return (
										<button
											key={p.key}
											type="button"
											onClick={() => togglePlatform(p.key)}
											className={cn(
												"flex items-center justify-between rounded-[4px] border p-3 transition-colors",
												selected
													? "border-[#506AE0] bg-[#506AE0]/[0.05]"
													: "border-[#E5E5E5] bg-white",
											)}
										>
											<span className="flex items-center gap-2">
												<span style={{ color: p.color }}>
													<PlatIcon className="size-4" />
												</span>
												<span className="text-[13px] font-medium text-[#08090A]">
													{p.label}
												</span>
											</span>
											<span
												className={cn(
													"flex size-4 items-center justify-center rounded-full border",
													selected ? "border-[#506AE0]" : "border-[#E5E5E5]",
												)}
											>
												{selected && <span className="size-2 rounded-full bg-[#506AE0]" />}
											</span>
										</button>
									);
								})}
							</div>

							{/* رابط المشاركة */}
							<span className="mt-1 text-right text-[12px] font-semibold text-[#08090A]">
								رابط المشاركة
							</span>
							<div className="flex items-center gap-2">
								<Input
									readOnly
									value="www.website.com/username"
									className="h-[34px] flex-1 text-right text-[11px] text-[#6B6B67]"
								/>
								<button
									type="button"
									className="flex h-[34px] shrink-0 items-center gap-1.5 rounded-[4px] border border-black/[0.13] bg-white px-[18px] text-[14px] font-medium text-[#08090A]"
								>
									رمز QR
									<IconBarcode className="size-4" />
								</button>
								<button
									type="button"
									className="flex h-[34px] shrink-0 items-center gap-1.5 rounded-[4px] border border-[#E5E5E5] px-2.5 text-[11px] text-[#08090A]"
								>
									<IconCopy className="size-3.5" />
									نسخ
								</button>
							</div>
						</div>
					</div>
				)}

				{/* شريط الأزرار السفلي */}
				<div
					className="flex items-center justify-between gap-2 border-t px-4 py-2"
					dir="rtl"
				>
					{/* زر السابق (يظهر من الخطوة الثانية) */}
					{step > 1 ? (
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-9 gap-1.5 text-[12px]"
							onClick={() => setStep((s) => s - 1)}
						>
							السابق
							<IconArrowRight className="size-4" />
						</Button>
					) : (
						<span />
					)}

					{/* حفظ كمسودة + التالي */}
					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-9 gap-1.5 text-[12px]"
						>
							<IconDeviceFloppy className="size-4" />
							حفظ كمسودة
						</Button>
						<Button
							type="button"
							size="sm"
							className="h-9 gap-1.5 text-[12px] font-bold"
							disabled={
								step === 1 ? !step1Valid : step === 2 ? selectedManagers.size === 0 : false
							}
							onClick={() => {
								if (step < STEPS.length) {
									setStep((s) => s + 1);
									return;
								}
								onPublish?.(form);
								close();
							}}
						>
							{step === STEPS.length ? "نشر الوظيفة" : "التالي"}
							{step === STEPS.length ? (
								<IconShare className="size-4" />
							) : (
								<IconArrowLeft className="size-4" />
							)}
						</Button>
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

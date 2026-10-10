import { zodResolver } from "@hookform/resolvers/zod";
import {
	IconArrowLeft,
	IconBuilding,
	IconInfoCircle,
	IconShare3,
	IconVideo,
	IconX,
} from "@tabler/icons-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { DateField } from "@/components/common/date-field";
import { FieldLabel } from "@/components/common/field-label";
import { buildTimeOptions } from "@/components/common/time-select";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { BoardCandidate } from "@/features/services/staff/components/jobs/jobs-board";
import { useJobNotesStore } from "@/features/services/staff/stores/job-notes.store";
import {
	type CreateInterviewFormInput,
	createInterviewSchema,
	INTERVIEW_MODES,
} from "@/features/services/staff/types/jobs.types";
import {
	guestCallUrl,
	interviewRoomName,
} from "@/features/services/staff/utils/interview-room";
import { useSession } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

// مناطق زمنية مختصرة كما في التصميم — قائمة واجهة إلى حين ربط الـ backend
const TIMEZONES = [
	"(GMT+3:00) الرياض",
	"(GMT+3:00) جدة",
	"(GMT+4:00) دبي",
	"(GMT+8:00) بوسطن",
] as const;

const MODE_ICON = { call: IconVideo, onsite: IconBuilding } as const;

// قيم البداية لكل فتح جديد للحوار
const blankInterview = (): CreateInterviewFormInput => ({
	date: "",
	timezone: TIMEZONES[0],
	startTime: "",
	endTime: "",
	mode: "call",
	meetingUrl: "",
	reviewer: "",
	candidateId: "",
	note: "",
});

// حقل بحدود التصميم: h-34، حد 0.75px، الأيقونة على اليسار والقيمة على اليمين
const CONTROL =
	"relative flex h-[34px] w-full items-center gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[9.75px] py-[5.25px] text-[11px] font-medium text-[#08090A] outline-none focus-visible:border-[#4F6AE0] aria-invalid:border-destructive";

// فترات الوقت من مصدر السيستم الواحد (كل نصف ساعة) — القيمة دقائق من منتصف الليل
const TIME_OPTIONS = buildTimeOptions("H12");

const toHHmm = (minutes: number) =>
	`${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

const toMinutes = (hhmm: string) => {
	const [h, m] = hhmm.split(":").map(Number);
	return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : null;
};

// قائمة اختيار الوقت — بنفس شكل بقية قوائم الحوار: القيمة يمينًا والسهم يسارًا
function TimeDropdown({
	value,
	onChange,
	placeholder,
	invalid,
	disabled,
}: {
	value: string;
	onChange: (value: string) => void;
	placeholder: string;
	invalid?: boolean;
	disabled?: boolean;
}) {
	const minutes = value ? toMinutes(value) : null;

	return (
		<Select
			// Radix يفرض dir="ltr" على الزر، فتُقلب القيمة والسهم
			dir="rtl"
			value={minutes === null ? undefined : String(minutes)}
			onValueChange={(next) => onChange(toHHmm(Number(next)))}
			disabled={disabled}
		>
			<SelectTrigger
				aria-invalid={invalid}
				className={cn(CONTROL, "justify-between")}
			>
				<SelectValue placeholder={placeholder} />
			</SelectTrigger>
			<SelectContent>
				{TIME_OPTIONS.map((t) => (
					<SelectItem
						key={t.value}
						value={String(t.value)}
					>
						{t.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

// حوار «إنشاء مقابلة» — وسط الشاشة (Figma node 4073-451878)
export function InterviewDialog({
	candidate,
	candidates,
	onClose,
	onStartCall,
}: {
	// المرشّح المُنطلق منه — تُملأ به حقول «المرشح» و«المراجع»
	candidate: BoardCandidate | null;
	// خيارات قائمة «المرشح»
	candidates: BoardCandidate[];
	onClose: () => void;
	// مقابلة «عبر اتصال» تنتقل مباشرة إلى شاشة الاستعداد للمكالمة
	onStartCall?: (candidate: BoardCandidate) => void;
}) {
	const { data: session } = useSession();
	const { addNote } = useJobNotesStore();

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		reset,
		formState: { errors, isSubmitting, isValid },
	} = useForm<CreateInterviewFormInput>({
		resolver: zodResolver(createInterviewSchema),
		// onChange لتتحدّث isValid فورًا فيُفعَّل زر الإنشاء عند اكتمال الحقول المطلوبة
		mode: "onChange",
		defaultValues: blankInterview(),
	});

	// إعادة تهيئة النموذج لكل مرشّح يُفتح له الحوار (بدل values التي تُلغي ما يكتبه المستخدم)
	useEffect(() => {
		if (candidate) {
			reset({
				...blankInterview(),
				reviewer: candidate.reviewer ?? "",
				candidateId: candidate.id,
			});
		}
	}, [candidate, reset]);

	const mode = watch("mode");
	const selectedId = watch("candidateId");
	const meetingUrl = watch("meetingUrl");
	const reviewers = [...new Set(candidates.map((c) => c.reviewer).filter(Boolean))];

	// قاعة المقابلة ثابتة (الأكاديمية + كود الوظيفة + معرّف المرشّح)، والرابط يُبنى منها
	// محليًا فيظهر فورًا ولا يتعلّق بتهيئة دورة المكالمات.
	const clinicId = session?.session?.activeClinicId ?? null;
	const selected = candidates.find((c) => c.id === selectedId);

	useEffect(() => {
		if (!selected || !clinicId) return;
		const roomName = interviewRoomName(clinicId, selected.jobCode, selected.id);
		setValue("meetingUrl", guestCallUrl(roomName), { shouldValidate: true });
	}, [selected, clinicId, setValue]);

	const copyMeetingUrl = async () => {
		if (!meetingUrl) return;
		await navigator.clipboard.writeText(meetingUrl);
		toast.success("تم نسخ رابط الاجتماع");
	};

	const close = () => {
		reset();
		onClose();
	};

	// لا توجد نقطة نهاية للمقابلات بعد — نُسجّل المقابلة كملاحظة على المرشّح
	// حتى تظهر في تبويب «سجل النشاط» بدل أن يكون الزر بلا أثر.
	const onSubmit = (values: CreateInterviewFormInput) => {
		const target = candidates.find((c) => c.id === values.candidateId) ?? candidate;
		const modeLabel =
			INTERVIEW_MODES.find((m) => m.value === values.mode)?.label ?? values.mode;
		const lines = [
			`تم جدولة مقابلة ${modeLabel} للمرشّح ${target?.name ?? "—"}.`,
			`التاريخ: ${values.date} · من ${values.startTime} إلى ${values.endTime} (${values.timezone})`,
			`المراجع: ${values.reviewer}`,
			values.mode === "call" && values.meetingUrl ? `رابط الاجتماع: ${values.meetingUrl}` : "",
			values.note?.trim() ? `ملاحظة: ${values.note.trim()}` : "",
		].filter(Boolean);

		if (target) {
			addNote({
				scope: target.id,
				text: lines.join("\n"),
				author: session?.user?.name?.trim() || "أنا",
			});
		}
		toast.success("تم إنشاء المقابلة");
		close();
		// المقابلة عبر اتصال تفتح شاشة الاستعداد للمكالمة فورًا
		if (values.mode === "call" && target) onStartCall?.(target);
	};

	return (
		<Dialog
			open={!!candidate}
			onOpenChange={(next) => !next && close()}
		>
			<DialogContent
				showCloseButton={false}
				// مقاس الفيجما 775×1131 بحاشية 16px — والتذييل مثبّت أسفل الحوار
				className="flex h-[1131px] max-h-[calc(100vh-2rem)] flex-col gap-0 overflow-hidden rounded-[8px] p-4 sm:max-w-[775px]"
			>
				{/* الترويسة: العنوان يمينًا وزر الإغلاق يسارًا */}
				<div className="flex h-[44px] shrink-0 items-center justify-between border-b-[0.75px] border-[#E5E5E5]">
					<DialogTitle className="text-[13px] font-bold leading-[19.5px] text-[#08090A]">
						إنشاء مقابلة
					</DialogTitle>
					<button
						type="button"
						onClick={close}
						aria-label="إغلاق"
						className="flex size-[21px] items-center justify-center rounded-[4px] text-[#08090A] hover:bg-[#F5F5F5]"
					>
						<IconX className="size-[13px]" />
					</button>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="flex min-h-0 flex-1 flex-col gap-4 pt-4"
				>
					{/* عنوان القسم يمينًا وأيقونة المساعدة يسارًا */}
					<div className="flex items-start justify-between">
						<span className="text-[14px] font-bold tracking-[-0.4492px] text-[#1A1A18]">
							تفاصيل الوظيفة
						</span>
						<IconInfoCircle className="size-[18px] shrink-0 text-[#9B9B9D]" />
					</div>

					<div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto">
						{/* تاريخ المقابلة (يمين) · المنطقة الزمنية (يسار) */}
						<div className="flex items-start gap-3">
							<Controller
								name="date"
								control={control}
								render={({ field }) => (
									<Field
										className="flex-1"
										data-invalid={!!errors.date}
									>
										<FieldLabel required>
											<span className="text-[11px] font-medium leading-[16.5px]">
												تاريخ المقابلة
											</span>
										</FieldLabel>
										{/* منتقي التاريخ المشترك في السيستم (Popover + Calendar) */}
										<DateField
											value={field.value}
											onChange={field.onChange}
											placeholder="اختر تاريخ المقابلة"
											invalid={!!errors.date}
											triggerDisabled={isSubmitting}
											className={cn(CONTROL, "justify-between")}
										/>
										<FieldError errors={[errors.date]} />
									</Field>
								)}
							/>

							<Controller
								name="timezone"
								control={control}
								render={({ field }) => (
									<Field
										className="flex-1"
										data-invalid={!!errors.timezone}
									>
										<FieldLabel required>
											<span className="text-[11px] font-medium leading-[16.5px]">
												المنطقة الزمنية
											</span>
										</FieldLabel>
										<Select
											// Radix يفرض dir="ltr" على الزر، فتُقلب القيمة والسهم
											dir="rtl"
											value={field.value}
											onValueChange={field.onChange}
											disabled={isSubmitting}
										>
											<SelectTrigger
												aria-invalid={!!errors.timezone}
												className={cn(CONTROL, "justify-between")}
											>
												<SelectValue placeholder="اختر المنطقة الزمنية" />
											</SelectTrigger>
											<SelectContent>
												{TIMEZONES.map((tz) => (
													<SelectItem
														key={tz}
														value={tz}
													>
														{tz}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.timezone]} />
									</Field>
								)}
							/>
						</div>

						{/* وقت البدء (يمين) · وقت الانتهاء (يسار) */}
						<div className="flex items-start gap-3">
							<Controller
								name="startTime"
								control={control}
								render={({ field }) => (
									<Field
										className="flex-1"
										data-invalid={!!errors.startTime}
									>
										<FieldLabel required>
											<span className="text-[11px] font-medium leading-[16.5px]">
												وقت البدء
											</span>
										</FieldLabel>
										<TimeDropdown
											value={field.value}
											onChange={field.onChange}
											placeholder="اختر وقت البدء"
											invalid={!!errors.startTime}
											disabled={isSubmitting}
										/>
										<FieldError errors={[errors.startTime]} />
									</Field>
								)}
							/>

							<Controller
								name="endTime"
								control={control}
								render={({ field }) => (
									<Field
										className="flex-1"
										data-invalid={!!errors.endTime}
									>
										<FieldLabel required>
											<span className="text-[11px] font-medium leading-[16.5px]">
												وقت الانتهاء
											</span>
										</FieldLabel>
										<TimeDropdown
											value={field.value}
											onChange={field.onChange}
											placeholder="اختر وقت الانتهاء"
											invalid={!!errors.endTime}
											disabled={isSubmitting}
										/>
										<FieldError errors={[errors.endTime]} />
									</Field>
								)}
							/>
						</div>

						{/* طريقة الإجراء — «عبر اتصال» يمينًا و«في مقر الشركة» يساره */}
						<Controller
							name="mode"
							control={control}
							render={({ field }) => (
								<Field data-invalid={!!errors.mode}>
									<FieldLabel>
										<span className="text-[11px] font-medium leading-[16.5px]">
											طريقة الإجراء
										</span>
									</FieldLabel>
									<div className="flex items-center gap-2">
										{INTERVIEW_MODES.map((m) => {
											const Icon = MODE_ICON[m.value];
											const active = field.value === m.value;
											return (
												<button
													key={m.value}
													type="button"
													disabled={isSubmitting}
													onClick={() => field.onChange(m.value)}
													aria-pressed={active}
													className={cn(
														"flex items-center gap-1 rounded-[4px] px-2 py-1.5 text-[12px] font-medium transition-colors",
														active
															? "border border-[#4F6AE0] bg-[#4F6AE0]/[0.05] text-[#4F6AE0]"
															: "border border-transparent bg-[#F8F8F8] text-[#08090A]",
													)}
												>
													{m.label}
													<Icon className="size-3.5 shrink-0" />
												</button>
											);
										})}
									</div>
									<FieldError errors={[errors.mode]} />
								</Field>
							)}
						/>

						{/* رابط الاجتماع — يُولّده السيستم تلقائيًا وهو ثابت لكل مقابلة */}
						<Field data-invalid={!!errors.meetingUrl}>
							<FieldLabel required={mode === "call"}>
								<span className="text-[11px] font-medium leading-[16.5px]">رابط الاجتماع</span>
							</FieldLabel>
							<div className={CONTROL}>
								<button
									type="button"
									onClick={copyMeetingUrl}
									aria-label="نسخ رابط الاجتماع"
									className="order-last shrink-0 text-[#08090A] transition-colors hover:text-[#4F6AE0]"
								>
									<IconShare3 className="size-2.5" />
								</button>
								{/* جزيرة LTR: الرابط يُقرأ من اليسار، وللقراءة فقط لأنه مُولَّد */}
								<input
									type="url"
									dir="ltr"
									readOnly
									aria-invalid={!!errors.meetingUrl}
									className="w-full bg-transparent text-right text-[#4F6AE0] outline-none placeholder:text-[#9B9B9D]"
									{...register("meetingUrl")}
								/>
							</div>
							<FieldError errors={[errors.meetingUrl]} />
						</Field>

						{/* المرشح (يمين) · المراجع (يسار) */}
						<div className="flex items-start gap-3">
							<Controller
								name="candidateId"
								control={control}
								render={({ field }) => (
									<Field
										className="flex-1"
										data-invalid={!!errors.candidateId}
									>
										<FieldLabel required>
											<span className="text-[11px] font-medium leading-[16.5px]">المرشح</span>
										</FieldLabel>
										<Select
											// Radix يفرض dir="ltr" على الزر، فتُقلب القيمة والسهم
											dir="rtl"
											value={field.value}
											onValueChange={field.onChange}
											disabled={isSubmitting}
										>
											<SelectTrigger
												aria-invalid={!!errors.candidateId}
												className={cn(CONTROL, "justify-between")}
											>
												<SelectValue placeholder="اختر المرشح" />
											</SelectTrigger>
											<SelectContent>
												{candidates.map((c) => (
													<SelectItem
														key={c.id}
														value={c.id}
													>
														{c.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.candidateId]} />
									</Field>
								)}
							/>

							<Controller
								name="reviewer"
								control={control}
								render={({ field }) => (
									<Field
										className="flex-1"
										data-invalid={!!errors.reviewer}
									>
										<FieldLabel required>
											<span className="text-[11px] font-medium leading-[16.5px]">المراجع</span>
										</FieldLabel>
										<Select
											// Radix يفرض dir="ltr" على الزر، فتُقلب القيمة والسهم
											dir="rtl"
											value={field.value}
											onValueChange={field.onChange}
											disabled={isSubmitting}
										>
											<SelectTrigger
												aria-invalid={!!errors.reviewer}
												className={cn(CONTROL, "justify-between")}
											>
												<SelectValue placeholder="اختر المراجع" />
											</SelectTrigger>
											<SelectContent>
												{reviewers.map((r) => (
													<SelectItem
														key={r}
														value={r}
													>
														{r}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FieldError errors={[errors.reviewer]} />
									</Field>
								)}
							/>
						</div>

						{/* ملاحظة — غير مطلوبة */}
						<Field data-invalid={!!errors.note}>
							<FieldLabel>
								<span className="text-[11px] font-medium leading-[16.5px]">ملاحظة</span>
							</FieldLabel>
							<textarea
								rows={5}
								placeholder="أدخل ملاحظاتك هنا..."
								disabled={isSubmitting}
								className="h-[103px] w-full resize-none rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[9.75px] py-[5.25px] text-[11px] text-[#08090A] outline-none placeholder:text-[#9B9B9D] focus-visible:border-[#4F6AE0]"
								{...register("note")}
							/>
							<FieldError errors={[errors.note]} />
						</Field>
					</div>

					{/* التذييل: «إنشاء مقابلة» يمين المجموعة و«الغاء» على يساره، والمجموعة أقصى اليسار */}
					<div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#E5E5E5] pt-5">
						{/* لا يُفعَّل إلا باكتمال الحقول المطلوبة */}
						<button
							type="submit"
							disabled={!isValid || isSubmitting}
							className="flex items-center gap-1.5 rounded-[4px] bg-[#506AE0] px-[18px] py-2 text-[14px] font-medium tracking-[-0.0772px] primarytransition-colors hover:bg-[#506AE0]/90 disabled:cursor-not-allowed disabled:opacity-50"
						>
							إنشاء مقابلة
							<IconArrowLeft className="size-5 shrink-0" />
						</button>
						<button
							type="button"
							onClick={close}
							disabled={isSubmitting}
							className="flex items-center rounded-[6px] border border-black/[0.13] bg-[#F9FAFB] px-[18px] py-2 text-[14px] font-medium tracking-[-0.0772px] text-[#08090A] transition-colors hover:bg-[#F2F3F5]"
						>
							الغاء
						</button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

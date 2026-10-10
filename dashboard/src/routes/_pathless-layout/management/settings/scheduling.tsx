import { IconCheck, IconCopy, IconInfoCircle } from "@tabler/icons-react";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { Container, ContainerRow } from "@/components/common/container";
import { Spinner } from "@/components/common/spinner";
import { TimeSelect } from "@/components/common/time-select";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { env } from "@/env";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { SettingsPageWrapper } from "@/features/settings/components/settings-page-wrapper";
import {
	type BookingHourOptionValue,
	useSchedulingSettingsForms,
	type WeekdayValue,
} from "@/features/settings/scheduling/hooks/use-scheduling-settings-forms";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import { useUpdateClinicInfo } from "@/features/settings/services/hooks/use-update-clinic-info";
import { useI18n } from "@/hooks/use-i18n";
import { TIMEZONES } from "@/lib/data/time-zones";
import { SLUG_MAX_LENGTH, validateSlug } from "@/lib/reserved-slugs";
import { cn } from "@/lib/utils";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

const WORK_DAYS = [
	{ label: "سبت", value: "SATURDAY" },
	{ label: "جمعة", value: "FRIDAY" },
	{ label: "خميس", value: "THURSDAY" },
	{ label: "اربعاء", value: "WEDNESDAY" },
	{ label: "ثلاثاء", value: "TUESDAY" },
	{ label: "اثنين", value: "MONDAY" },
	{ label: "احد", value: "SUNDAY" },
] satisfies { label: string; value: WeekdayValue }[];

const CALENDAR_TYPES = [
	{ label: "ميلادي", value: "GREGORIAN" },
	{ label: "هجري", value: "HIJRI" },
] as const;

const TIME_FORMAT_OPTIONS = [
	{ label: "12", value: "H12" },
	{ label: "24", value: "H24" },
] as const;

const BOOKING_HOUR_OPTIONS = [
	{ label: "12", value: "H12" },
	{ label: "24", value: "H24" },
] satisfies { label: string; value: BookingHourOptionValue }[];

const APPOINTMENT_BUFFER_OPTIONS = [5, 10, 15, 20, 30, 45, 60];

const fieldWrapperClassName = "w-full max-w-[320px]";
const fieldClassName =
	"h-11 rounded-xl border-border/80 bg-background px-4 text-base shadow-none placeholder:text-muted-foreground/85";

export const Route = createFileRoute("/_pathless-layout/management/settings/scheduling")({
	component: RouteComponent,
});

function RouteComponent() {
	const { isRtl: isArabic } = useI18n();
	const { clinicInfo } = useClinicInfo();
	const timeFormat = clinicInfo?.timeFormat ?? "H12";

	const {
		workScheduleForm,
		customizationForm,
		bookingRulesForm,
		onSubmitWorkSchedule,
		onSubmitCustomization,
		onSubmitBookingRules,
		isLoading,
		isWorkScheduleSubmitting,
		isCustomizationSubmitting,
		isBookingRulesSubmitting,
	} = useSchedulingSettingsForms();

	const { updateClinicInfo, isPending: isSlugPending } = useUpdateClinicInfo();

	const {
		register: registerSlug,
		handleSubmit: handleSlugSubmit,
		getValues: getSlugValues,
		setValue: setSlugValue,
		reset: resetSlug,
		watch: watchSlug,
	} = useForm<{ slug: string }>({
		defaultValues: { slug: "" },
	});

	useEffect(() => {
		if (clinicInfo) resetSlug({ slug: clinicInfo.slug ?? "" });
	}, [clinicInfo, resetSlug]);

	const [copied, setCopied] = useState(false);
	// أصل الخادم الفعلي الذي تُقدَّم منه الصفحة — صفحة الحجز على نفس الأصل (/book/).
	// نبدأ بقيمة env كبديل أثناء الـ SSR ثم نصحّحها إلى الأصل الحقيقي بعد التحميل،
	// حتى يكون الرابط دائمًا مطابقًا للخادم مهما كان (لا رابط ثابت).
	const [origin, setOrigin] = useState("");
	const slugValue = watchSlug("slug") ?? "";
	const bookingBaseUrl = `${(origin || env.VITE_API_URL).replace(/\/$/, "")}/book/`;
	const fullBookingUrl = slugValue ? `${bookingBaseUrl}${slugValue}` : "";

	useEffect(() => {
		setOrigin(window.location.origin);
	}, []);

	const copyBookingUrl = async () => {
		if (!fullBookingUrl) return;

		const markCopied = () => {
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		};

		// المسار الحديث — متاح فقط في سياق آمن (HTTPS أو localhost)
		if (navigator.clipboard?.writeText) {
			try {
				await navigator.clipboard.writeText(fullBookingUrl);
				markCopied();
				return;
			} catch {
				// يفشل خارج السياق الآمن — نكمل للحل البديل
			}
		}

		// حل بديل يعمل على HTTP عبر textarea مؤقت + execCommand
		try {
			const textarea = document.createElement("textarea");
			textarea.value = fullBookingUrl;
			textarea.setAttribute("readonly", "");
			textarea.style.position = "fixed";
			textarea.style.top = "0";
			textarea.style.left = "0";
			textarea.style.opacity = "0";
			document.body.appendChild(textarea);
			textarea.focus();
			textarea.select();
			const ok = document.execCommand("copy");
			document.body.removeChild(textarea);
			if (ok) markCopied();
		} catch {
			// تعذّر النسخ — تجاهل بصمت
		}
	};

	const handleSlugBlur = () => {
		const raw = getSlugValues("slug") ?? "";
		const normalized = raw.toLowerCase().trim();
		if (!normalized || validateSlug(normalized)) {
			setSlugValue("slug", clinicInfo?.slug ?? "");
			return;
		}
		setSlugValue("slug", normalized);
		handleSlugSubmit((data) => updateClinicInfo({ slug: data.slug || undefined }))();
	};

	const schedulingEnabled = workScheduleForm.watch("schedulingEnabled");
	const onlineBookingEnabled = bookingRulesForm.watch("onlineBookingEnabled");

	// تفعيل الطابور على أي فرع = الحجوزات تمر عبر موافقة الطابور، فيُقفل الحجز الأونلاين
	const { branches } = useBranches();
	const queueActive = branches.some((b) => parseBranchSettings(b.settings).queue.enabled);

	// أقفِل الحجز الأونلاين تلقائيًا عندما يُفعَّل الطابور (متزامن مع منع الخادم للحجز الذاتي)
	useEffect(() => {
		if (queueActive && bookingRulesForm.getValues("onlineBookingEnabled")) {
			bookingRulesForm.setValue("onlineBookingEnabled", false);
			bookingRulesForm.handleSubmit(onSubmitBookingRules)();
		}
	}, [queueActive, bookingRulesForm, onSubmitBookingRules]);

	// الحجز الأونلاين يظهر مفعّلًا فقط إن كان مسموحًا (الطابور غير مفعّل)
	const onlineBookingVisible = onlineBookingEnabled && !queueActive;

	if (isLoading) {
		return (
			<SettingsPageWrapper>
				<Spinner />
			</SettingsPageWrapper>
		);
	}

	return (
		<SettingsPageWrapper>
			<form onSubmit={workScheduleForm.handleSubmit(onSubmitWorkSchedule)}>
				<Container
					title="الجدولة"
					description="تخصيص أيام عمل الأكاديمية / المركز / المستشفي."
				>
					<ContainerRow
						title="فعّل جدولة أيام العمل"
						subtitle="بمجرد النقر على زر، يمكنك تعيين الأيام والفترات."
						action={
							<Controller
								name="schedulingEnabled"
								control={workScheduleForm.control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={(checked) => {
											field.onChange(checked);
											workScheduleForm.handleSubmit(onSubmitWorkSchedule)();
										}}
										disabled={isWorkScheduleSubmitting}
									/>
								)}
							/>
						}
					/>

					<ContainerRow
						title="أيام العمل"
						subtitle="بمجرد النقر على زر، يمكنك تعيين الأيام والفترات."
						action={
							<Controller
								name="workDays"
								control={workScheduleForm.control}
								render={({ field }) => (
									<ToggleGroup
										type="multiple"
										value={field.value}
										onValueChange={(value) => {
											if (value.length === 0) return;
											field.onChange(value as WeekdayValue[]);
											workScheduleForm.handleSubmit(onSubmitWorkSchedule)();
										}}
										disabled={isWorkScheduleSubmitting || !schedulingEnabled}
										className="flex-wrap justify-end gap-2 bg-transparent"
									>
										{WORK_DAYS.map((day) => (
											<ToggleGroupItem
												key={day.value}
												value={day.value}
												className="size-12! rounded-full! border bg-white text-sm font-medium text-muted-foreground shadow-none! hover:bg-white data-[state=on]:border-primary/20 data-[state=on]:bg-primary data-[state=on]:primarydata-[state=on]:shadow-md data-[state=on]:hover:bg-primary data-[state=on]:hover:text-white"
											>
												{day.label}
											</ToggleGroupItem>
										))}
									</ToggleGroup>
								)}
							/>
						}
					/>

					<ContainerRow
						title="فعّل الفترات"
						subtitle="بمجرد النقر على زر، يمكنك تعيين الأيام والفترات."
						action={
							<Controller
								name="shiftsEnabled"
								control={workScheduleForm.control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={(checked) => {
											field.onChange(checked);
											workScheduleForm.handleSubmit(onSubmitWorkSchedule)();
										}}
										disabled={isWorkScheduleSubmitting || !schedulingEnabled}
									/>
								)}
							/>
						}
					/>

					<div>
						<ContainerRow
							title="صباحي"
							className="flex items-center gap-2"
							action={
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground text-xs">من</span>
									<Controller
										name="morningStartMinute"
										control={workScheduleForm.control}
										render={({ field }) => (
											<TimeSelect
												value={field.value}
												onValueChange={(value) => {
													field.onChange(value);
													workScheduleForm.handleSubmit(onSubmitWorkSchedule)();
												}}
												disabled={isWorkScheduleSubmitting || !schedulingEnabled}
												format={timeFormat}
											/>
										)}
									/>
									<span className="text-muted-foreground text-xs">إلى</span>
									<Controller
										name="morningEndMinute"
										control={workScheduleForm.control}
										render={({ field }) => (
											<TimeSelect
												value={field.value}
												onValueChange={(value) => {
													field.onChange(value);
													workScheduleForm.handleSubmit(onSubmitWorkSchedule)();
												}}
												disabled={isWorkScheduleSubmitting || !schedulingEnabled}
												format={timeFormat}
											/>
										)}
									/>
								</div>
							}
						/>

						<ContainerRow
							title="مسائي"
							className="flex items-center gap-2"
							action={
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground text-xs">من</span>
									<Controller
										name="eveningStartMinute"
										control={workScheduleForm.control}
										render={({ field }) => (
											<TimeSelect
												value={field.value}
												onValueChange={(value) => {
													field.onChange(value);
													workScheduleForm.handleSubmit(onSubmitWorkSchedule)();
												}}
												disabled={isWorkScheduleSubmitting || !schedulingEnabled}
												format={timeFormat}
											/>
										)}
									/>
									<span className="text-muted-foreground text-xs">إلى</span>
									<Controller
										name="eveningEndMinute"
										control={workScheduleForm.control}
										render={({ field }) => (
											<TimeSelect
												value={field.value}
												onValueChange={(value) => {
													field.onChange(value);
													workScheduleForm.handleSubmit(onSubmitWorkSchedule)();
												}}
												disabled={isWorkScheduleSubmitting || !schedulingEnabled}
												format={timeFormat}
											/>
										)}
									/>
								</div>
							}
						/>
					</div>
				</Container>
			</form>

			<form onSubmit={customizationForm.handleSubmit(onSubmitCustomization)}>
				<Container
					title="تخصيص"
					subtitle="ضبط التقويم واللغة والمنطقة الزمنية حسب موقعك."
				>
					<ContainerRow
						title="نوع التقويم"
						className="flex items-center gap-2"
						action={
							<Controller
								name="calendarType"
								control={customizationForm.control}
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={(value) => {
											field.onChange(value);
											customizationForm.handleSubmit(onSubmitCustomization)();
										}}
										disabled={isCustomizationSubmitting}
										dir="rtl"
									>
										<SelectTrigger
											size="sm"
											className="w-36 bg-white"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{CALENDAR_TYPES.map((type) => (
												<SelectItem
													key={type.value}
													value={type.value}
												>
													{type.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						}
					/>

					<ContainerRow
						title="تنسيق الوقت"
						subtitle="هذا إعداد داخلي ولن يؤثر على كيفية عرض الأوقات في التقويم."
						action={
							<Controller
								name="timeFormat"
								control={customizationForm.control}
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={(value) => {
											field.onChange(value);
											customizationForm.handleSubmit(onSubmitCustomization)();
										}}
										disabled={isCustomizationSubmitting}
										dir="rtl"
									>
										<SelectTrigger
											size="sm"
											className="w-36 bg-white"
										>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{TIME_FORMAT_OPTIONS.map((opt) => (
												<SelectItem
													key={opt.value}
													value={opt.value}
												>
													{opt.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						}
					/>

					<ContainerRow
						title="المنطقة الجغرافية"
						action={
							<Controller
								name="timezone"
								control={customizationForm.control}
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={(value) => {
											field.onChange(value);
											customizationForm.handleSubmit(onSubmitCustomization)();
										}}
										disabled={isCustomizationSubmitting}
									>
										<SelectTrigger
											className={cn(
												fieldClassName,
												fieldWrapperClassName,
												"h-11",
												isArabic ? "text-right" : "text-left",
											)}
										>
											<SelectValue placeholder="اختر المنطقة الزمنية" />
										</SelectTrigger>
										<SelectContent
											dir={isArabic ? "rtl" : "ltr"}
											className="w-fit"
										>
											{TIMEZONES.map((tz) => (
												<SelectItem
													key={tz.value}
													value={tz.value}
													dir={isArabic ? "rtl" : "ltr"}
													className={isArabic ? "text-right" : "text-left"}
												>
													{tz.label}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								)}
							/>
						}
					/>
				</Container>
			</form>

			<form onSubmit={bookingRulesForm.handleSubmit(onSubmitBookingRules)}>
				<Container
					title="إعدادات الحجز"
					subtitle="تحكّم في طريقة حجز الزيارات."
				>
					<ContainerRow
						title="فعّل إعدادات الحجز"
						subtitle="فعّل لتخصيص قواعد الحجز."
						action={
							<Controller
								name="bookingRulesEnabled"
								control={bookingRulesForm.control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={(checked) => {
											field.onChange(checked);
											bookingRulesForm.handleSubmit(onSubmitBookingRules)();
										}}
										disabled={isBookingRulesSubmitting}
									/>
								)}
							/>
						}
					/>

					<ContainerRow
						title="حجز الزيارات"
						subtitle="يسمح للموظفين بتحديد زيارات العملاء."
						action={
							<Controller
								name="appointmentBookingEnabled"
								control={bookingRulesForm.control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={(checked) => {
											field.onChange(checked);
											bookingRulesForm.handleSubmit(onSubmitBookingRules)();
										}}
										disabled={isBookingRulesSubmitting}
									/>
								)}
							/>
						}
					/>

					<ContainerRow
						title="الحجز عبر الإنترنت"
						subtitle={
							queueActive
								? "معطّل تلقائيًا لأن الطابور مفعّل — الحجوزات تمر عبر موافقة الطابور."
								: "يسمح للعملاء بتحديد الزيارات."
						}
						action={
							<Controller
								name="onlineBookingEnabled"
								control={bookingRulesForm.control}
								render={({ field }) => (
									<Switch
										checked={queueActive ? false : field.value}
										onCheckedChange={(checked) => {
											field.onChange(checked);
											bookingRulesForm.handleSubmit(onSubmitBookingRules)();
										}}
										disabled={isBookingRulesSubmitting || queueActive}
									/>
								)}
							/>
						}
					/>

					{onlineBookingVisible && (
						<ContainerRow
							title="رابط صفحة الحجز"
							badge={
								<TooltipProvider delayDuration={150}>
									<div className="inline-flex items-center gap-1">
										<Tooltip>
											<TooltipTrigger asChild>
												<button
													type="button"
													className="inline-flex size-4 items-center justify-center text-muted-foreground"
													aria-label="معلومات عن رابط الحجز"
												>
													<IconInfoCircle className="size-4" />
												</button>
											</TooltipTrigger>
											<TooltipContent>
												الرابط العام لصفحة حجز الزيارات الخاصة بأكاديميتك. شاركه مع عملائك.
											</TooltipContent>
										</Tooltip>
										<Tooltip open={copied || undefined}>
											<TooltipTrigger asChild>
												<button
													type="button"
													onClick={copyBookingUrl}
													disabled={!fullBookingUrl}
													className="inline-flex size-5 items-center justify-center rounded-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
													aria-label="نسخ الرابط"
												>
													{copied ? (
														<IconCheck className="size-3.5 text-[#16A34A]" />
													) : (
														<IconCopy className="size-3.5" />
													)}
												</button>
											</TooltipTrigger>
											<TooltipContent>{copied ? "تم النسخ" : "نسخ الرابط"}</TooltipContent>
										</Tooltip>
									</div>
								</TooltipProvider>
							}
							action={
								<div
									className={cn(fieldWrapperClassName, "flex items-center gap-2")}
									dir="ltr"
								>
									<span className="shrink-0 text-xs text-muted-foreground">
										{bookingBaseUrl}
									</span>
									<Input
										id="slug"
										placeholder="clinic-name"
										aria-label="رابط صفحة الحجز"
										dir="ltr"
										maxLength={SLUG_MAX_LENGTH}
										className={cn(fieldClassName, "flex-1")}
										{...registerSlug("slug", {
											setValueAs: (v) =>
												typeof v === "string" ? v.toLowerCase() : v || undefined,
										})}
										onBlur={handleSlugBlur}
										disabled={isSlugPending}
									/>
								</div>
							}
						/>
					)}

					<ContainerRow
						title="الحجز المزدوج"
						subtitle="سيتم تجاهل تعارض الزيارات بتداخل زياراتهم مما يسمح للمدرّبين لاستقبال أكثر من طفل في الوقت نفسه."
						action={
							<Controller
								name="doubleBookingEnabled"
								control={bookingRulesForm.control}
								render={({ field }) => (
									<Switch
										checked={field.value}
										onCheckedChange={(checked) => {
											field.onChange(checked);
											bookingRulesForm.handleSubmit(onSubmitBookingRules)();
										}}
										disabled={isBookingRulesSubmitting}
									/>
								)}
							/>
						}
					/>

					<ContainerRow
						title="فاصل بين الزيارات"
						subtitle="أعطي مدة راحة بين كل زيارة."
						action={
							<div className="flex items-center gap-2">
								<Controller
									name="appointmentBufferMinutes"
									control={bookingRulesForm.control}
									render={({ field }) => (
										<Select
											value={String(field.value)}
											onValueChange={(value) => {
												field.onChange(Number(value));
												bookingRulesForm.handleSubmit(onSubmitBookingRules)();
											}}
											disabled={isBookingRulesSubmitting}
											dir="rtl"
										>
											<SelectTrigger
												size="sm"
												className="w-40 bg-white"
											>
												<SelectValue />
											</SelectTrigger>
											<SelectContent>
												{APPOINTMENT_BUFFER_OPTIONS.map((minutes) => (
													<SelectItem
														key={minutes}
														value={String(minutes)}
													>
														{`الدقائق: ${minutes} دقائق`}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								<Controller
									name="appointmentBufferEnabled"
									control={bookingRulesForm.control}
									render={({ field }) => (
										<Switch
											checked={field.value}
											onCheckedChange={(checked) => {
												field.onChange(checked);
												bookingRulesForm.handleSubmit(onSubmitBookingRules)();
											}}
											disabled={isBookingRulesSubmitting}
										/>
									)}
								/>
							</div>
						}
					/>

					<ContainerRow
						title="مهلة تأكيد الحجز"
						subtitle="يُلغى الحجز إذا لم يتم تأكيده من العميل خلال هذه المدة."
						action={
							<div className="flex items-center gap-2">
								<Controller
									name="confirmationTimeoutHours"
									control={bookingRulesForm.control}
									render={({ field }) => (
										<BookingHourSelect
											value={field.value}
											onValueChange={(value) => {
												field.onChange(value);
												bookingRulesForm.handleSubmit(onSubmitBookingRules)();
											}}
											disabled={isBookingRulesSubmitting}
											prefix="تأكيد الحجز"
											className="w-44 bg-white"
										/>
									)}
								/>
								<Controller
									name="confirmationTimeoutEnabled"
									control={bookingRulesForm.control}
									render={({ field }) => (
										<Switch
											checked={field.value}
											onCheckedChange={(checked) => {
												field.onChange(checked);
												bookingRulesForm.handleSubmit(onSubmitBookingRules)();
											}}
											disabled={isBookingRulesSubmitting}
										/>
									)}
								/>
							</div>
						}
					/>

					<ContainerRow
						title="أدنى مدة للحجز المسبق"
						subtitle="لا يمكن حجز زيارة إذا كانت المدة المتبقية أقل من هذا الوقت."
						action={
							<div className="flex items-center gap-2">
								<Controller
									name="minimumBookingNoticeHours"
									control={bookingRulesForm.control}
									render={({ field }) => (
										<BookingHourSelect
											value={field.value}
											onValueChange={(value) => {
												field.onChange(value);
												bookingRulesForm.handleSubmit(onSubmitBookingRules)();
											}}
											disabled={isBookingRulesSubmitting}
											prefix="الحجز المسبق"
											className="w-52 bg-white"
										/>
									)}
								/>
								<Controller
									name="minimumBookingNoticeEnabled"
									control={bookingRulesForm.control}
									render={({ field }) => (
										<Switch
											checked={field.value}
											onCheckedChange={(checked) => {
												field.onChange(checked);
												bookingRulesForm.handleSubmit(onSubmitBookingRules)();
											}}
											disabled={isBookingRulesSubmitting}
										/>
									)}
								/>
							</div>
						}
					/>

					<ContainerRow
						title="أدنى مدة لتبديل الحجز"
						subtitle="لا يمكن تغيير نوع الزيارة إذا كانت المدة المتبقية على الموعد أقل من هذا الوقت."
						action={
							<div className="flex items-center gap-2">
								<Controller
									name="rescheduleNoticeHours"
									control={bookingRulesForm.control}
									render={({ field }) => (
										<BookingHourSelect
											value={field.value}
											onValueChange={(value) => {
												field.onChange(value);
												bookingRulesForm.handleSubmit(onSubmitBookingRules)();
											}}
											disabled={isBookingRulesSubmitting}
											prefix="تبديل الحجز"
											className="w-52 bg-white"
										/>
									)}
								/>
								<Controller
									name="rescheduleNoticeEnabled"
									control={bookingRulesForm.control}
									render={({ field }) => (
										<Switch
											checked={field.value}
											onCheckedChange={(checked) => {
												field.onChange(checked);
												bookingRulesForm.handleSubmit(onSubmitBookingRules)();
											}}
											disabled={isBookingRulesSubmitting}
										/>
									)}
								/>
							</div>
						}
					/>
				</Container>
			</form>
		</SettingsPageWrapper>
	);
}

function BookingHourSelect({
	value,
	onValueChange,
	disabled,
	prefix,
	className,
}: {
	value: BookingHourOptionValue;
	onValueChange: (value: BookingHourOptionValue) => void;
	disabled: boolean;
	prefix: string;
	className: string;
}) {
	return (
		<Select
			value={value}
			onValueChange={(nextValue) => onValueChange(nextValue as BookingHourOptionValue)}
			disabled={disabled}
			dir="rtl"
		>
			<SelectTrigger
				size="sm"
				className={className}
			>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				{BOOKING_HOUR_OPTIONS.map((option) => (
					<SelectItem
						key={option.value}
						value={option.value}
					>
						{`${prefix}: ${option.label} ساعة`}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

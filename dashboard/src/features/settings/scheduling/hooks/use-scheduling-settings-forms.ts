import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSchedulingSettings } from "@/features/settings/scheduling/hooks/use-scheduling-settings";
import { useUpdateSchedulingCustomization } from "@/features/settings/scheduling/hooks/use-update-scheduling-customization";
import { useUpdateSchedulingSettings } from "@/features/settings/scheduling/hooks/use-update-scheduling-settings";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import type { ClinicSchedulingSettingsResponse } from "@/server/scheduling/scheduling.type";
import type { ClinicSettingsResponse } from "@/server/settings/settings.type";

export type WeekdayValue = ClinicSchedulingSettingsResponse["workDays"][number];
export type BookingHourOptionValue =
	ClinicSchedulingSettingsResponse["confirmationTimeoutHours"];

export type WorkScheduleFormValues = Pick<
	ClinicSchedulingSettingsResponse,
	| "schedulingEnabled"
	| "workDays"
	| "shiftsEnabled"
	| "morningStartMinute"
	| "morningEndMinute"
	| "eveningStartMinute"
	| "eveningEndMinute"
>;

export type SchedulingCustomizationFormValues = Pick<
	ClinicSettingsResponse,
	"calendarType" | "timeFormat" | "timezone"
>;

export type BookingRulesFormValues = Pick<
	ClinicSchedulingSettingsResponse,
	| "bookingRulesEnabled"
	| "appointmentBookingEnabled"
	| "onlineBookingEnabled"
	| "doubleBookingEnabled"
	| "appointmentBufferEnabled"
	| "appointmentBufferMinutes"
	| "confirmationTimeoutEnabled"
	| "confirmationTimeoutHours"
	| "minimumBookingNoticeEnabled"
	| "minimumBookingNoticeHours"
	| "rescheduleNoticeEnabled"
	| "rescheduleNoticeHours"
>;

const defaultWorkScheduleValues: WorkScheduleFormValues = {
	schedulingEnabled: true,
	workDays: ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY"],
	shiftsEnabled: true,
	morningStartMinute: 480,
	morningEndMinute: 720,
	eveningStartMinute: 960,
	eveningEndMinute: 1200,
};

const defaultCustomizationValues: SchedulingCustomizationFormValues = {
	calendarType: "GREGORIAN",
	timeFormat: "H12",
	timezone: "Asia/Riyadh",
};

const defaultBookingRulesValues: BookingRulesFormValues = {
	bookingRulesEnabled: false,
	appointmentBookingEnabled: true,
	onlineBookingEnabled: false,
	doubleBookingEnabled: false,
	appointmentBufferEnabled: true,
	appointmentBufferMinutes: 10,
	confirmationTimeoutEnabled: true,
	confirmationTimeoutHours: "H12",
	minimumBookingNoticeEnabled: true,
	minimumBookingNoticeHours: "H12",
	rescheduleNoticeEnabled: true,
	rescheduleNoticeHours: "H12",
};

export const useSchedulingSettingsForms = () => {
	const { schedulingSettings, isLoading: isSchedulingLoading } = useSchedulingSettings();
	const { clinicInfo, isLoading: isClinicInfoLoading } = useClinicInfo();
	const { updateSchedulingSettings, isPending: isSchedulingPending } =
		useUpdateSchedulingSettings();
	const { updateSchedulingCustomization, isPending: isCustomizationPending } =
		useUpdateSchedulingCustomization();

	const workScheduleForm = useForm<WorkScheduleFormValues>({
		defaultValues: defaultWorkScheduleValues,
	});
	const customizationForm = useForm<SchedulingCustomizationFormValues>({
		defaultValues: defaultCustomizationValues,
	});
	const bookingRulesForm = useForm<BookingRulesFormValues>({
		defaultValues: defaultBookingRulesValues,
	});

	useEffect(() => {
		if (!schedulingSettings) return;

		workScheduleForm.reset({
			schedulingEnabled: schedulingSettings.schedulingEnabled,
			workDays: schedulingSettings.workDays,
			shiftsEnabled: schedulingSettings.shiftsEnabled,
			morningStartMinute: schedulingSettings.morningStartMinute,
			morningEndMinute: schedulingSettings.morningEndMinute,
			eveningStartMinute: schedulingSettings.eveningStartMinute,
			eveningEndMinute: schedulingSettings.eveningEndMinute,
		});

		bookingRulesForm.reset({
			bookingRulesEnabled: schedulingSettings.bookingRulesEnabled,
			appointmentBookingEnabled: schedulingSettings.appointmentBookingEnabled,
			onlineBookingEnabled: schedulingSettings.onlineBookingEnabled,
			doubleBookingEnabled: schedulingSettings.doubleBookingEnabled,
			appointmentBufferEnabled: schedulingSettings.appointmentBufferEnabled,
			appointmentBufferMinutes: schedulingSettings.appointmentBufferMinutes,
			confirmationTimeoutEnabled: schedulingSettings.confirmationTimeoutEnabled,
			confirmationTimeoutHours: schedulingSettings.confirmationTimeoutHours,
			minimumBookingNoticeEnabled: schedulingSettings.minimumBookingNoticeEnabled,
			minimumBookingNoticeHours: schedulingSettings.minimumBookingNoticeHours,
			rescheduleNoticeEnabled: schedulingSettings.rescheduleNoticeEnabled,
			rescheduleNoticeHours: schedulingSettings.rescheduleNoticeHours,
		});
	}, [schedulingSettings, workScheduleForm.reset, bookingRulesForm.reset]);

	useEffect(() => {
		if (!clinicInfo) return;

		customizationForm.reset({
			calendarType: clinicInfo.calendarType,
			timeFormat: clinicInfo.timeFormat,
			timezone: clinicInfo.timezone,
		});
	}, [clinicInfo, customizationForm.reset]);

	const onSubmitWorkSchedule = async (data: WorkScheduleFormValues) => {
		await updateSchedulingSettings(data);
	};

	const onSubmitCustomization = async (data: SchedulingCustomizationFormValues) => {
		await updateSchedulingCustomization(data);
	};

	const onSubmitBookingRules = async (data: BookingRulesFormValues) => {
		await updateSchedulingSettings(data);
	};

	const isWorkScheduleSubmitting =
		workScheduleForm.formState.isSubmitting || isSchedulingPending;
	const isCustomizationSubmitting =
		customizationForm.formState.isSubmitting || isCustomizationPending;
	const isBookingRulesSubmitting =
		bookingRulesForm.formState.isSubmitting || isSchedulingPending;

	return {
		workScheduleForm,
		customizationForm,
		bookingRulesForm,
		onSubmitWorkSchedule,
		onSubmitCustomization,
		onSubmitBookingRules,
		isLoading: isSchedulingLoading || isClinicInfoLoading,
		isWorkScheduleSubmitting,
		isCustomizationSubmitting,
		isBookingRulesSubmitting,
	};
};

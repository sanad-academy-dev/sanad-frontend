import { zodResolver } from "@hookform/resolvers/zod";
import { IconCalendarPlus } from "@tabler/icons-react";
import { useHotkey } from "@tanstack/react-hotkeys";
import { arSA, enUS } from "date-fns/locale";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldError } from "@/components/ui/field";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAppointmentSlots } from "@/features/appointments/hooks/use-appointment-slots";
import { useRescheduleAppointment } from "@/features/appointments/hooks/use-reschedule-appointment";
import { minutesToTimeLabel } from "@/features/appointments/utils/time";
import { useFormProgress } from "@/hooks/use-form-progress";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import {
	type RescheduleAppointmentFormInput,
	type RescheduleAppointmentFormValues,
	rescheduleAppointmentSchema,
} from "@sanad/contracts/runtime/server/appointments/appointments.type";

interface RescheduleAppointmentDialogProps {
	appointmentId: string;
	appointmentCode: string;
	patientName: string;
	staffId: string;
	durationMinutes: number;
	startsAt: Date;
	trigger?: ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

function startOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

function minuteOfDay(date: Date): number {
	return date.getHours() * 60 + date.getMinutes();
}

export function RescheduleAppointmentDialog({
	appointmentId,
	appointmentCode,
	patientName,
	staffId,
	durationMinutes,
	startsAt,
	trigger,
	open: controlledOpen,
	onOpenChange: controlledOnOpenChange,
}: RescheduleAppointmentDialogProps) {
	const { lang, isRtl } = useI18n();
	const dir = isRtl ? "rtl" : "ltr";
	const calendarLocale = lang === "ar" ? arSA : enUS;

	const { reschedule, isPending } = useRescheduleAppointment(appointmentId);

	const [internalOpen, setInternalOpen] = useState(false);
	const open = controlledOpen ?? internalOpen;
	const setOpen = controlledOnOpenChange ?? setInternalOpen;
	const [datePopoverOpen, setDatePopoverOpen] = useState(false);

	const initialDate = useMemo(() => startOfDay(startsAt), [startsAt]);
	const initialStartMinute = useMemo(() => minuteOfDay(startsAt), [startsAt]);

	const defaults = useMemo<RescheduleAppointmentFormInput>(
		() => ({
			date: initialDate,
			startMinute: initialStartMinute,
			comment: "",
		}),
		[initialDate, initialStartMinute],
	);

	const form = useForm<
		RescheduleAppointmentFormInput,
		unknown,
		RescheduleAppointmentFormValues
	>({
		resolver: zodResolver(rescheduleAppointmentSchema),
		mode: "onChange",
		defaultValues: defaults,
	});

	const values = form.watch();
	const formProgress = useFormProgress({ schema: rescheduleAppointmentSchema, values });

	const date = values.date;
	const startMinute = values.startMinute;

	useEffect(() => {
		if (open) form.reset(defaults);
	}, [open, defaults, form]);

	const { slots, isLoading: slotsLoading } = useAppointmentSlots({
		staffId,
		date,
		durationMinutes,
		excludeAppointmentId: appointmentId,
	});

	const dateLabel = date
		? new Intl.DateTimeFormat(isRtl ? "ar-SA" : "en-US", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}).format(date)
		: undefined;
	const timeLabel =
		typeof startMinute === "number" ? minutesToTimeLabel(startMinute, lang) : undefined;

	const hasChange =
		!!date && (date.getTime() !== initialDate.getTime() || startMinute !== initialStartMinute);

	const onSubmit = async (data: RescheduleAppointmentFormValues) => {
		const startsAtNext = new Date(data.date);
		startsAtNext.setHours(0, 0, 0, 0);
		startsAtNext.setMinutes(data.startMinute);

		await reschedule({ startsAt: startsAtNext, comment: data.comment });
		setOpen(false);
		form.reset(defaults);
	};

	const submitForm = form.handleSubmit(onSubmit);
	const isSubmitDisabled = isPending || !form.formState.isValid || !hasChange;

	useHotkey(
		"Mod+Enter",
		() => {
			if (isSubmitDisabled) return;
			void submitForm();
		},
		{ enabled: open },
	);

	return (
		<Dialog
			open={open}
			onOpenChange={setOpen}
		>
			{trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}

			<DialogContent
				dir={dir}
				className="p-0 gap-0 max-w-2xl!"
				showCloseButton={false}
			>
				<FormHeader
					variant="dialog"
					title="إعادة جدولة زيارة"
					identity={patientName ? { name: patientName, code: appointmentCode } : null}
					progress={formProgress}
					onClose={() => setOpen(false)}
				/>

				<form
					dir={dir}
					onSubmit={submitForm}
				>
					<div className="p-4">
						<Field data-invalid={!!form.formState.errors.comment}>
							<Label className="text-sm text-muted-foreground">أضف تعليقًا (اختياري)</Label>
							<Textarea
								className="min-h-24"
								placeholder="سبب إعادة الجدولة..."
								disabled={isPending}
								{...form.register("comment")}
							/>
							<FieldError errors={[form.formState.errors.comment]} />
						</Field>
					</div>

					<Separator />

					<div className="flex flex-wrap items-center justify-between gap-2 p-3.5">
						<Popover
							open={datePopoverOpen}
							onOpenChange={setDatePopoverOpen}
						>
							<PopoverTrigger asChild>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="h-9 gap-2"
								>
									<IconCalendarPlus className="size-4" />
									{dateLabel ? (
										<span className="truncate">
											{dateLabel}
											{timeLabel ? ` · ${timeLabel}` : ""}
										</span>
									) : (
										"تاريخ الزيارة"
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent
								align={isRtl ? "end" : "start"}
								dir={dir}
								className="w-[340px] space-y-1"
							>
								<Controller
									control={form.control}
									name="date"
									render={({ field }) => (
										<Calendar
											mode="single"
											className="w-full mb-0 pb-0"
											selected={field.value as Date | undefined}
											onSelect={(d) => {
												if (!d) return;
												field.onChange(d);
											}}
											locale={calendarLocale}
										/>
									)}
								/>

								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<Label className="text-xs font-medium">وقت الإتاحة</Label>
										<span className="text-xs text-muted-foreground">
											المدة: {durationMinutes} دقيقة
										</span>
									</div>
									<div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
										{slotsLoading ? (
											<p className="col-span-3 text-center text-xs text-muted-foreground py-3">
												جاري التحميل...
											</p>
										) : slots.length === 0 ? (
											<p className="col-span-3 text-center text-xs text-muted-foreground py-3">
												لا توجد أوقات متاحة
											</p>
										) : (
											slots.map((slot) => {
												const selected = startMinute === slot.startMinute;
												return (
													<Controller
														key={slot.startMinute}
														control={form.control}
														name="startMinute"
														render={({ field }) => (
															<Button
																type="button"
																variant={selected ? "default" : "outline"}
																size="sm"
																disabled={!slot.available}
																onClick={() => {
																	field.onChange(slot.startMinute);
																	setDatePopoverOpen(false);
																}}
																className={cn(
																	"h-9 text-xs flex-col gap-0.5",
																	!slot.available && "opacity-50",
																)}
															>
																{minutesToTimeLabel(slot.startMinute, lang)}
																{!slot.available && (
																	<span className="text-[10px]">غير متاح</span>
																)}
															</Button>
														)}
													/>
												);
											})
										)}
									</div>
								</div>
							</PopoverContent>
						</Popover>

						<div className="flex items-center gap-3">
							<div className="flex items-center gap-2">
								<Switch
									id="reschedule-email"
									checked={false}
									disabled
								/>
								<Label
									htmlFor="reschedule-email"
									className="text-sm text-muted-foreground"
								>
									إشعار عبر البريد
								</Label>
							</div>

							<Button
								type="submit"
								disabled={isSubmitDisabled}
							>
								<Kbd className="text-white">⌘↵</Kbd>
								<span>إعادة الجدولة</span>
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

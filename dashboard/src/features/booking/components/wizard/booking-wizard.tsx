import { IconCalendarEvent, IconChecks, IconChevronLeft, IconUser } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperNav,
	StepperSeparator,
	StepperTitle,
	StepperTrigger,
} from "@/components/ui/stepper";
import { Switch } from "@/components/ui/switch";
import { BookingWizardEmpty } from "@/features/booking/components/wizard/booking-wizard-empty";
import { Step1Appointment } from "@/features/booking/components/wizard/step-1-appointment/step-1-appointment";
import { Step2Owner } from "@/features/booking/components/wizard/step-2-owner/step-2-owner";
import { BookingSuccess } from "@/features/booking/components/wizard/step-3-review/booking-success";
import { Step3Review } from "@/features/booking/components/wizard/step-3-review/step-3-review";
import { useBookingSearchParams } from "@/features/booking/hooks/use-booking-search-params";
import { useCreatePublicBooking } from "@/features/booking/hooks/use-create-public-booking";
import { usePublicSlotsRange } from "@/features/booking/hooks/use-public-slots-range";
import { useBookingDraftStore } from "@/features/booking/stores/booking-draft.store";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import type {
	PublicClinicService,
	PublicClinicStaffResponse,
} from "@/server/public/public.type";
import {
	type BookingStep,
	type CreatePublicBookingResult,
	step1BookingSchema,
	step2BookingSchema,
} from "@sanad/contracts/runtime/server/public-bookings/public-bookings.type";

const STEPS = [
	{ step: 1, title: "الزيارة والتفاصيل", icon: IconCalendarEvent },
	{ step: 2, title: "معلومات وليّ الأمر / الطفل", icon: IconUser },
	{ step: 3, title: "المراجعة", icon: IconChecks },
] as const;

const RANGE_DAYS = 14;

const ymd = (d: Date): string => {
	const y = d.getFullYear();
	const m = String(d.getMonth() + 1).padStart(2, "0");
	const day = String(d.getDate()).padStart(2, "0");
	return `${y}-${m}-${day}`;
};

const addDays = (d: Date, n: number): Date => {
	const out = new Date(d);
	out.setDate(out.getDate() + n);
	return out;
};

type BookingWizardProps = {
	clinicSlug: string;
	selectedStaff: PublicClinicStaffResponse | null;
	selectedService: PublicClinicService | null;
};

type FieldErrors = Record<string, string | undefined>;

const zodIssuesToErrors = (
	issues: { path: PropertyKey[]; message: string }[],
): FieldErrors => {
	const out: FieldErrors = {};
	for (const issue of issues) {
		const path = issue.path.map(String).join(".");
		if (!out[path]) out[path] = issue.message;
	}
	return out;
};

export const BookingWizard = ({
	clinicSlug,
	selectedStaff,
	selectedService,
}: BookingWizardProps) => {
	const { search, setDate, setSlot, setStep } = useBookingSearchParams();

	const [rangeWindows, setRangeWindows] = useState(1);
	const [attachments, setAttachments] = useState<FileWithPreview[]>([]);
	const [step1Errors, setStep1Errors] = useState<FieldErrors>({});
	const [step2Errors, setStep2Errors] = useState<FieldErrors>({});
	const [success, setSuccess] = useState<CreatePublicBookingResult | null>(null);
	const [conflictMessage, setConflictMessage] = useState<string | null>(null);

	const draft = useBookingDraftStore(clinicSlug);
	const createBooking = useCreatePublicBooking();

	const today = useMemo(() => {
		const t = new Date();
		t.setHours(0, 0, 0, 0);
		return t;
	}, []);

	const from = useMemo(() => ymd(today), [today]);
	const to = useMemo(
		() => ymd(addDays(today, RANGE_DAYS * rangeWindows - 1)),
		[today, rangeWindows],
	);

	const { data, isFetching } = usePublicSlotsRange({
		slug: clinicSlug,
		staffId: selectedStaff?.id ?? null,
		serviceId: selectedService?.id ?? null,
		from: selectedStaff && selectedService ? from : null,
		to: selectedStaff && selectedService ? to : null,
	});

	const days = data?.days ?? [];
	const durationMinutes = data?.durationMinutes ?? selectedService?.durationMinutes ?? 30;

	const activeStep: BookingStep = (search.step ?? 1) as BookingStep;
	const selectedDate = search.date ?? null;
	const selectedSlot = search.slot ?? null;
	const hasDateAndSlot = selectedDate !== null && selectedSlot !== null;

	const step1Valid = useMemo(() => {
		return (
			hasDateAndSlot &&
			step1BookingSchema.safeParse({
				consultationTypeId: draft.consultationTypeId,
				reason: draft.reason,
				symptoms: draft.symptoms,
				clinicalNotes: draft.clinicalNotes,
				whatsappReminderEnabled: draft.whatsappReminderEnabled,
				isEmergency: draft.isEmergency,
			}).success
		);
	}, [
		hasDateAndSlot,
		draft.consultationTypeId,
		draft.reason,
		draft.symptoms,
		draft.clinicalNotes,
		draft.whatsappReminderEnabled,
		draft.isEmergency,
	]);

	const step2Valid = useMemo(
		() =>
			step2BookingSchema.safeParse({
				ownerName: draft.ownerName,
				ownerPhone: draft.ownerPhone,
				ownerEmail: draft.ownerEmail,
				patientName: draft.patientName,
				patientAnimalTypeId: draft.patientAnimalTypeId,
			}).success,
		[
			draft.ownerName,
			draft.ownerPhone,
			draft.ownerEmail,
			draft.patientName,
			draft.patientAnimalTypeId,
		],
	);

	const furthestStep: BookingStep = step2Valid ? 3 : step1Valid ? 2 : 1;

	useEffect(() => {
		if (activeStep > furthestStep) {
			setStep(furthestStep);
		}
	}, [activeStep, furthestStep, setStep]);

	useEffect(() => {
		if (!selectedStaff || !selectedService) {
			if (selectedDate || selectedSlot) {
				setDate(null);
			}
		}
	}, [selectedStaff, selectedService, selectedDate, selectedSlot, setDate]);

	if (!selectedStaff) {
		return <BookingWizardEmpty reason="no-staff" />;
	}
	if (!selectedService) {
		return <BookingWizardEmpty reason="no-service" />;
	}

	const handleSubmit = async () => {
		if (!selectedStaff || !selectedService || selectedDate === null || selectedSlot === null) {
			return;
		}
		setConflictMessage(null);
		const files = attachments
			.map((a) => (a.file instanceof File ? a.file : null))
			.filter((f): f is File => f !== null);
		try {
			const result = await createBooking.mutateAsync({
				clinicSlug,
				staffId: selectedStaff.id,
				serviceId: selectedService.id,
				date: selectedDate,
				startMinute: selectedSlot,
				consultationTypeId: draft.consultationTypeId,
				reason: draft.reason || undefined,
				symptoms: draft.symptoms || undefined,
				clinicalNotes: draft.clinicalNotes || undefined,
				whatsappReminderEnabled: draft.whatsappReminderEnabled,
				isEmergency: draft.isEmergency,
				ownerName: draft.ownerName,
				ownerPhone: draft.ownerPhone,
				ownerEmail: draft.ownerEmail || undefined,
				patientName: draft.patientName,
				patientAnimalTypeId: draft.patientAnimalTypeId,
				attachments: files,
			});
			draft.reset();
			setAttachments([]);
			setSuccess(result);
		} catch (err) {
			const e = err as { status?: number; message?: string };
			if (e.status === 409) {
				setConflictMessage(e.message ?? "الزيارة لم تعد متاحة، اختر وقتًا آخر");
				return;
			}
			if (e.status === 429) {
				toast.error(e.message ?? "حاول مرة أخرى بعد قليل");
				return;
			}
			toast.error(e.message ?? "تعذّر إرسال الطلب، حاول مرة أخرى");
		}
	};

	const handleConflictChangeSlot = () => {
		setConflictMessage(null);
		setSlot(null);
		setStep(1);
	};

	const handleNext = () => {
		if (activeStep === 1) {
			if (!hasDateAndSlot) return;
			const result = step1BookingSchema.safeParse({
				consultationTypeId: draft.consultationTypeId,
				reason: draft.reason,
				symptoms: draft.symptoms,
				clinicalNotes: draft.clinicalNotes,
				whatsappReminderEnabled: draft.whatsappReminderEnabled,
				isEmergency: draft.isEmergency,
			});
			if (!result.success) {
				setStep1Errors(zodIssuesToErrors(result.error.issues));
				return;
			}
			setStep1Errors({});
			setStep(2);
			return;
		}
		if (activeStep === 2) {
			const result = step2BookingSchema.safeParse({
				ownerName: draft.ownerName,
				ownerPhone: draft.ownerPhone,
				ownerEmail: draft.ownerEmail,
				patientName: draft.patientName,
				patientAnimalTypeId: draft.patientAnimalTypeId,
			});
			if (!result.success) {
				setStep2Errors(zodIssuesToErrors(result.error.issues));
				return;
			}
			setStep2Errors({});
			setStep(3);
			return;
		}
		if (activeStep === 3) {
			handleSubmit();
			return;
		}
	};

	const handlePrev = () => {
		if (activeStep === 2) setStep(1);
		else if (activeStep === 3) setStep(2);
	};

	const nextDisabled =
		(activeStep === 1 && !hasDateAndSlot) ||
		(activeStep === 2 && !hasDateAndSlot) ||
		isFetching ||
		createBooking.isPending;

	return (
		<>
			<BookingSuccess
				open={success !== null}
				onClose={() => {
					setSuccess(null);
					setDate(null);
					setStep(1);
				}}
			/>

			<Stepper
				value={activeStep}
				onValueChange={(step) => {
					if (step <= furthestStep) setStep(step as BookingStep);
				}}
				className="flex min-h-0 flex-1 flex-col overflow-hidden"
			>
				<div className="shrink-0 overflow-x-auto px-6 pt-6 pb-4 flex justify-center">
					<StepperNav className="mx-auto w-full max-w-lg flex-nowrap gap-3">
						{STEPS.map((s, idx) => {
							const Icon = s.icon;
							const isDisabled = s.step > furthestStep;
							return (
								<StepperItem
									key={s.step}
									step={s.step}
									disabled={isDisabled}
									className="relative w-28 shrink-0 items-start"
								>
									<StepperTrigger
										className="flex grow flex-col items-start justify-center gap-2.5 rounded-md"
										disabled={isDisabled}
									>
										<StepperIndicator className="size-8 border-2 data-[state=inactive]:border-border data-[state=inactive]:bg-transparent data-[state=inactive]:text-muted-foreground">
											<Icon className="size-4" />
										</StepperIndicator>
										<StepperTitle className="text-start text-sm font-semibold group-data-[state=inactive]/step:text-muted-foreground">
											{s.title}
										</StepperTitle>
									</StepperTrigger>
									{idx < STEPS.length - 1 && (
										<StepperSeparator className="absolute inset-x-0 start-9 top-4 m-0 group-data-[orientation=horizontal]/stepper-nav:w-[calc(100%-2rem)] group-data-[orientation=horizontal]/stepper-nav:flex-none group-data-[state=completed]/step:bg-primary" />
									)}
								</StepperItem>
							);
						})}
					</StepperNav>
				</div>

				<div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
					{activeStep === 1 && (
						<Step1Appointment
							clinicSlug={clinicSlug}
							staff={selectedStaff}
							days={days}
							durationMinutes={durationMinutes}
							selectedDate={selectedDate}
							selectedSlot={selectedSlot}
							onSelectDate={(d) => setDate(d)}
							onSelectSlot={(s) => setSlot(s)}
							onLoadMore={() => setRangeWindows((n) => n + 1)}
							canLoadMore={!isFetching}
							isLoadingMore={isFetching}
							attachments={attachments}
							onAttachmentsChange={setAttachments}
							disabled={isFetching}
							errors={step1Errors}
						/>
					)}
					{activeStep === 2 && (
						<Step2Owner
							clinicSlug={clinicSlug}
							errors={step2Errors}
						/>
					)}
					{activeStep === 3 && selectedDate !== null && selectedSlot !== null && (
						<Step3Review
							clinicSlug={clinicSlug}
							selectedStaff={selectedStaff}
							selectedService={selectedService}
							selectedDate={selectedDate}
							selectedSlot={selectedSlot}
							attachments={attachments}
							conflictMessage={conflictMessage}
							onEditAppointment={() => setStep(1)}
							onEditOwner={() => setStep(2)}
							onChangeSlot={handleConflictChangeSlot}
						/>
					)}
				</div>

				<div className="mt-auto flex shrink-0 items-center justify-between gap-2 border-t bg-background px-6 py-3">
					<div className="flex items-center gap-2">
						{activeStep > 1 && (
							<Button
								type="button"
								variant="outline"
								onClick={handlePrev}
							>
								السابق
							</Button>
						)}
					</div>

					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Checkbox
								id="booking-emergency"
								checked={draft.isEmergency}
								onCheckedChange={(v) => draft.setField("isEmergency", v === true)}
							/>
							<label htmlFor="booking-emergency">حالة طوارئ</label>
						</div>

						<div className="flex items-center gap-2 text-sm text-muted-foreground">
							<Switch
								id="booking-whatsapp"
								checked={draft.whatsappReminderEnabled}
								onCheckedChange={(v) => draft.setField("whatsappReminderEnabled", v)}
							/>
							<label htmlFor="booking-whatsapp">إشعار عبر الواتساب</label>
						</div>

						<Button
							type="button"
							onClick={handleNext}
							disabled={nextDisabled}
						>
							{activeStep === 3
								? createBooking.isPending
									? "جارٍ الإرسال..."
									: "ارسال الطلب"
								: "التالي"}
							<IconChevronLeft className="size-4" />
						</Button>
					</div>
				</div>
			</Stepper>
		</>
	);
};

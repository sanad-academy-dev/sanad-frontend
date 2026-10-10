import { IconHelpCircle } from "@tabler/icons-react";

import { Field, FieldError } from "@/components/ui/field";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AppointmentSelectedCard } from "@/features/booking/components/wizard/step-1-appointment/appointment-selected-card";
import { BookingAttachments } from "@/features/booking/components/wizard/step-1-appointment/booking-attachments";
import { DateStrip } from "@/features/booking/components/wizard/step-1-appointment/date-strip";
import { TimeGrid } from "@/features/booking/components/wizard/step-1-appointment/time-grid";
import { useBookingDraftStore } from "@/features/booking/stores/booking-draft.store";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import type { PublicClinicStaffResponse, PublicSlotDay } from "@/server/public/public.type";

type Step1AppointmentProps = {
	clinicSlug: string;
	staff: PublicClinicStaffResponse;
	days: PublicSlotDay[];
	durationMinutes: number;
	selectedDate: string | null;
	selectedSlot: number | null;
	onSelectDate: (date: string) => void;
	onSelectSlot: (startMinute: number) => void;
	onLoadMore: () => void;
	canLoadMore: boolean;
	isLoadingMore: boolean;
	attachments: FileWithPreview[];
	onAttachmentsChange: (files: FileWithPreview[]) => void;
	disabled?: boolean;
	errors: Record<string, string | undefined>;
};

export const Step1Appointment = ({
	clinicSlug,
	staff,
	days,
	durationMinutes,
	selectedDate,
	selectedSlot,
	onSelectDate,
	onSelectSlot,
	onLoadMore,
	canLoadMore,
	isLoadingMore,
	attachments,
	onAttachmentsChange,
	disabled,
	errors,
}: Step1AppointmentProps) => {
	const draft = useBookingDraftStore(clinicSlug);

	const currentDay = days.find((d) => d.date === selectedDate) ?? null;
	const hasDateAndSlot = selectedDate !== null && selectedSlot !== null;

	return (
		<div className="flex flex-col gap-5">
			<div className="flex items-start justify-between gap-2">
				<div className="flex flex-col gap-1">
					<h2 className="text-lg font-bold text-foreground">تفاصيل الزيارة</h2>
					<p className="text-sm text-muted-foreground">حدد زيارتك المفضلة وسبب الزيارة</p>
				</div>
				<button
					type="button"
					className="rounded-full p-1 text-muted-foreground hover:bg-muted"
					aria-label="مساعدة"
				>
					<IconHelpCircle className="size-5" />
				</button>
			</div>

			<DateStrip
				days={days}
				selectedDate={selectedDate}
				onSelect={onSelectDate}
				onLoadMore={onLoadMore}
				canLoadMore={canLoadMore}
				isLoading={isLoadingMore}
			/>

			{selectedDate && currentDay && (
				<TimeGrid
					slots={currentDay.slots}
					durationMinutes={durationMinutes}
					selectedSlot={selectedSlot}
					onSelect={onSelectSlot}
				/>
			)}

			{hasDateAndSlot && selectedDate !== null && selectedSlot !== null && (
				<>
					<AppointmentSelectedCard
						date={selectedDate}
						startMinute={selectedSlot}
						staffName={staff.name}
						staffPrefix={Boolean(staff.prefix)}
					/>

					<Field data-invalid={!!errors.consultationTypeId}>
						<label
							htmlFor="consultation-type"
							className="text-sm font-medium text-foreground"
						>
							سبب الزيارة <span className="text-destructive">*</span>
						</label>
						<Select
							value={draft.consultationTypeId || undefined}
							onValueChange={(value) => draft.setField("consultationTypeId", value)}
							disabled={disabled}
							dir="rtl"
						>
							<SelectTrigger
								id="consultation-type"
								aria-invalid={!!errors.consultationTypeId}
								className="w-full"
							>
								<SelectValue placeholder="اختر سبب الزيارة" />
							</SelectTrigger>
							<SelectContent>
								{staff.consultationTypes.map((c) => (
									<SelectItem
										key={c.id}
										value={c.id}
									>
										<span className="flex w-full items-center justify-between gap-2">
											<span>{c.name}</span>
											{c.price != null && (
												<span className="text-xs text-blue-500 tabular-nums">
													{c.price.toLocaleString()} ر.س
												</span>
											)}
										</span>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FieldError
							errors={
								errors.consultationTypeId ? [{ message: errors.consultationTypeId }] : []
							}
						/>
					</Field>

					<Field data-invalid={!!errors.symptoms}>
						<label
							htmlFor="symptoms"
							className="text-sm font-medium text-foreground"
						>
							الأعراض (إن وجدت)
						</label>
						<Textarea
							id="symptoms"
							placeholder="صف الأعراض التي يعاني منها ابنك الأليف..."
							rows={3}
							aria-invalid={!!errors.symptoms}
							disabled={disabled}
							value={draft.symptoms}
							onChange={(e) => draft.setField("symptoms", e.target.value)}
						/>
						<FieldError errors={errors.symptoms ? [{ message: errors.symptoms }] : []} />
					</Field>

					<Field data-invalid={!!errors.clinicalNotes}>
						<label
							htmlFor="clinicalNotes"
							className="text-sm font-medium text-foreground"
						>
							ملاحظات إضافية
						</label>
						<Textarea
							id="clinicalNotes"
							placeholder="أي ملاحظات أو طلبات خاصة..."
							rows={3}
							aria-invalid={!!errors.clinicalNotes}
							disabled={disabled}
							value={draft.clinicalNotes}
							onChange={(e) => draft.setField("clinicalNotes", e.target.value)}
						/>
						<FieldError
							errors={errors.clinicalNotes ? [{ message: errors.clinicalNotes }] : []}
						/>
					</Field>

					<BookingAttachments
						files={attachments}
						onChange={onAttachmentsChange}
						disabled={disabled}
					/>
				</>
			)}
		</div>
	);
};

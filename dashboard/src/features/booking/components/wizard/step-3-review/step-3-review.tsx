import { IconAlertTriangle, IconStethoscope, IconUserCircle } from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	ReviewRow,
	SectionCard,
} from "@/features/booking/components/wizard/step-3-review/section-card";
import { usePublicClinicAnimalTypes } from "@/features/booking/hooks/use-public-clinic-animal-types";
import { useBookingDraftStore } from "@/features/booking/stores/booking-draft.store";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import { getFileUrl } from "@/lib/file-url";
import type {
	PublicClinicService,
	PublicClinicStaffResponse,
} from "@/server/public/public.type";

const AR_WEEKDAY = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
const AR_MONTH = [
	"يناير",
	"فبراير",
	"مارس",
	"أبريل",
	"مايو",
	"يونيو",
	"يوليو",
	"أغسطس",
	"سبتمبر",
	"أكتوبر",
	"نوفمبر",
	"ديسمبر",
];

const parseYmd = (ymd: string): Date => {
	const [y, m, d] = ymd.split("-").map((p) => parseInt(p, 10));
	return new Date(y, m - 1, d);
};

const formatDate = (ymd: string): string => {
	const d = parseYmd(ymd);
	return `${AR_WEEKDAY[d.getDay()]}، ${d.getDate()} ${AR_MONTH[d.getMonth()]} ${d.getFullYear()}`;
};

const formatTime = (minute: number): string => {
	const h = Math.floor(minute / 60);
	const m = minute % 60;
	return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

type Step3ReviewProps = {
	clinicSlug: string;
	selectedStaff: PublicClinicStaffResponse;
	selectedService: PublicClinicService;
	selectedDate: string;
	selectedSlot: number;
	attachments: FileWithPreview[];
	conflictMessage: string | null;
	onEditAppointment: () => void;
	onEditOwner: () => void;
	onChangeSlot: () => void;
};

export const Step3Review = ({
	clinicSlug,
	selectedStaff,
	selectedService,
	selectedDate,
	selectedSlot,
	attachments,
	conflictMessage,
	onEditAppointment,
	onEditOwner,
	onChangeSlot,
}: Step3ReviewProps) => {
	const draft = useBookingDraftStore(clinicSlug);
	const { animalTypes } = usePublicClinicAnimalTypes(clinicSlug);

	const animalTypeName =
		animalTypes.find((t) => t.id === draft.patientAnimalTypeId)?.arName ?? "";
	const consultationTypeName =
		selectedStaff.consultationTypes.find((c) => c.id === draft.consultationTypeId)?.name ?? "";
	const staffName = selectedStaff.prefix ? `د. ${selectedStaff.name}` : selectedStaff.name;
	const staffSpec =
		selectedStaff.primarySpecialization?.name ??
		selectedStaff.secondarySpecialization?.name ??
		null;
	const avatarUrl = getFileUrl(selectedStaff.avatar);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-col gap-1">
				<h2 className="text-lg font-bold text-foreground">مراجعة الطلب</h2>
				<p className="text-sm text-muted-foreground">تأكد من صحة المعلومات قبل الإرسال</p>
			</div>

			{conflictMessage && (
				<div
					role="alert"
					className="flex items-start gap-3 rounded-xl border border-destructive/40 bg-destructive/5 p-4"
				>
					<IconAlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" />
					<div className="flex flex-1 flex-col gap-2">
						<p className="text-sm font-medium text-destructive">{conflictMessage}</p>
						<button
							type="button"
							onClick={onChangeSlot}
							className="self-start text-sm font-medium text-destructive underline"
						>
							اختر وقتًا آخر
						</button>
					</div>
				</div>
			)}

			<SectionCard
				title="المدرّب"
				icon={<IconUserCircle className="size-5" />}
			>
				<div className="flex items-center justify-start gap-3">
					<Avatar className="size-12">
						{avatarUrl && (
							<AvatarImage
								src={avatarUrl}
								alt={staffName}
							/>
						)}
						<AvatarFallback>{selectedStaff.name.charAt(0)}</AvatarFallback>
					</Avatar>

					<div className="flex flex-col items-end gap-0.5">
						<span className="font-semibold text-foreground">{staffName}</span>
						{staffSpec && <span className="text-sm text-muted-foreground">{staffSpec}</span>}
					</div>
				</div>
			</SectionCard>

			<SectionCard
				title="نوع الزيارة"
				icon={<IconStethoscope className="size-5" />}
			>
				<p className="text-start font-medium text-foreground">{selectedService.name}</p>
			</SectionCard>

			<SectionCard
				title="معلومات وليّ الأمر والطفل"
				onEdit={onEditOwner}
			>
				<ReviewRow
					label="وليّ الأمر"
					value={draft.ownerName}
				/>
				<ReviewRow
					label="الجوال"
					value={draft.ownerPhone}
				/>
				{draft.ownerEmail && (
					<ReviewRow
						label="البريد الإلكتروني"
						value={draft.ownerEmail}
					/>
				)}
				<ReviewRow
					label="الطفل"
					value={draft.patientName}
				/>
				<ReviewRow
					label="النوع"
					value={animalTypeName}
				/>
			</SectionCard>

			<SectionCard
				title="تفاصيل الزيارة"
				onEdit={onEditAppointment}
			>
				<ReviewRow
					label="التاريخ"
					value={formatDate(selectedDate)}
				/>
				<ReviewRow
					label="الوقت"
					value={formatTime(selectedSlot)}
				/>
				<ReviewRow
					label="السبب"
					value={consultationTypeName}
				/>
				{draft.symptoms && (
					<ReviewRow
						label="الأعراض"
						value={draft.symptoms}
					/>
				)}
				{draft.clinicalNotes && (
					<ReviewRow
						label="ملاحظات إضافية"
						value={draft.clinicalNotes}
					/>
				)}
				{attachments.length > 0 && (
					<ReviewRow
						label="المرفقات"
						value={
							<span className="flex flex-col items-end gap-0.5">
								{attachments.map((a) => (
									<span
										key={a.id}
										className="truncate max-w-[260px]"
									>
										{a.file.name}
									</span>
								))}
							</span>
						}
					/>
				)}
			</SectionCard>
		</div>
	);
};

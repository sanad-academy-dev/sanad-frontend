import { useEffect, useState } from "react";
import {
	IconCalendar,
	IconCalendarEvent,
	IconClock,
	IconCompass,
	IconMapPin,
	IconPlus,
	IconSchool,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useQuickUpdateRequest } from "../../hooks/use-digital-registration";
import { backendFetch } from "@/lib/backend-fetch";
import { REGISTRATION_TRACKS } from "../../utils/registration-tracks";

interface RequestBasicInfoGridProps {
	request: CampaignRequestItem;
	campaignId?: string;
	onOpenReschedule: () => void;
}

export function RequestBasicInfoGrid({

	request,
	campaignId = "",
	onOpenReschedule,
}: RequestBasicInfoGridProps) {
	const [classPopoverOpen, setClassPopoverOpen] = useState(false);
	const [trackPopoverOpen, setTrackPopoverOpen] = useState(false);
	const [classrooms, setClassrooms] = useState<Array<{ id: string; name: string; category?: string | null }>>([]);
	const quickUpdateMutation = useQuickUpdateRequest(campaignId);

	useEffect(() => {
		backendFetch("/api/classrooms")
			.then(async (response) => (response.ok ? response.json() : []))
			.then((items) => setClassrooms(Array.isArray(items) ? items.filter((item) => item?.name) : []))
			.catch(() => setClassrooms([]));
	}, []);

	const handleAssignClass = (classroom: { name: string; category?: string | null }) => {
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: { targetClass: classroom.name },
			},
			{
				onSuccess: () => {
				toast.success(`تم تعيين الفصل: ${classroom.name}`);
					setClassPopoverOpen(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل تعيين الفصل");
				},
			},
		);
	};

	const handleAssignTrack = (trackName: string) => {
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: { proposedTrack: trackName },
			},
			{
				onSuccess: () => {
					toast.success(`تم تعيين المسار: ${trackName}`);
					setTrackPopoverOpen(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل تعيين المسار");
				},
			},
		);
	};

	const { clinicInfo } = useClinicInfo();
	const clinicTimezone = clinicInfo?.timezone || DEFAULT_CLINIC_TIMEZONE;

	const birthDateFormatted = request.birthDate
		? new Date(request.birthDate).toLocaleDateString("ar-EG", {
				year: "numeric",
				month: "long",
				day: "numeric",
		  })
		: (request.ageLabel || "غير محدد");

	const appointmentTimeFormatted = request.appointmentDate
		? `${formatAppointmentDate(request.appointmentDate, clinicTimezone, "ar-EG", { month: "short", day: "numeric", weekday: undefined, year: undefined })} • ${formatAppointmentTime(request.appointmentDate, clinicTimezone, "ar-EG")}`
		: "قيد التحديد";

	return (
		<div
			className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 space-y-1.5 font-sans shadow-2xs"
			dir="rtl"
		>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
				{/* تاريخ الميلاد */}
				<div className="flex items-center justify-between py-0.5 border-b border-zinc-100 dark:border-zinc-800/60">
					<span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 text-[10px]">
						<IconCalendar className="size-3 text-zinc-400" />
						<span>تاريخ الميلاد</span>
					</span>
					<span className="font-bold text-zinc-900 dark:text-zinc-100 text-[10.5px]">
						{birthDateFormatted}
					</span>
				</div>

				{/* المسار المطلوب */}
				<div className="flex items-center justify-between py-0.5 border-b border-zinc-100 dark:border-zinc-800/60">
					<span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 text-[10px]">
						<IconCompass className="size-3 text-zinc-400" />
						<span>المسار المطلوب</span>
					</span>
					<span className="font-bold text-zinc-900 dark:text-zinc-100 text-[10.5px]">
						{request.proposedTrack || "مسار عام"}
					</span>
				</div>

				{/* موعد المقابلة مع وسم إعادة الجدولة */}
				<div className="flex items-center justify-between py-0.5 border-b border-zinc-100 dark:border-zinc-800/60">
					<span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 text-[10px]">
						<IconCalendarEvent className="size-3 text-zinc-400" />
						<span>موعد المقابلة</span>
					</span>
					<div className="flex items-center gap-1">
						<span className="font-bold text-zinc-900 dark:text-zinc-100 text-[10.5px]">
							{appointmentTimeFormatted}
						</span>
						<button
							type="button"
							onClick={onOpenReschedule}
							className="rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 px-1.5 py-0.5 text-[9.5px] font-medium transition-colors cursor-pointer shadow-2xs"
							title="إعادة جدولة موعد المقابلة"
						>
							إعادة الجدولة
						</button>
					</div>
				</div>

				{/* مدة المقابلة */}
				<div className="flex items-center justify-between py-0.5 border-b border-zinc-100 dark:border-zinc-800/60">
					<span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 text-[10px]">
						<IconClock className="size-3 text-zinc-400" />
						<span>مدة المقابلة</span>
					</span>
					<span className="font-bold text-zinc-900 dark:text-zinc-100 text-[10.5px]">
						{request.interviewDurationMinutes ?? 20} دقيقة
					</span>
				</div>

				{/* الفصل المقترح (المقابلة/السداد) أو الفصل الدراسي (المقبول) */}
				{(request.status === "INTERVIEW" || request.status === "AWAITING_PAYMENT" || request.status === "ACCEPTED") && (
					<div className="flex items-center justify-between py-0.5">
						<span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 text-[10px]">
							<IconSchool className="size-3 text-zinc-400" />
							<span>{request.status === "ACCEPTED" ? "الفصل الدراسي" : "الفصل المقترح"}</span>
						</span>
						<Popover open={classPopoverOpen} onOpenChange={setClassPopoverOpen}>
							<PopoverTrigger asChild>
								{request.targetClass ? (
									<Button
										variant="outline"
										size="sm"
										className="h-5 px-1.5 text-[10px] font-bold text-primary border-primary/30 hover:bg-primary/10 gap-0.5"
									>
										<span>{request.targetClass}</span>
									</Button>
								) : (
									<Button
										variant="outline"
										size="sm"
										className="h-5 px-1.5 text-[9.5px] border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary gap-0.5"
									>
										<IconPlus className="size-2.5 text-primary" />
										<span>تعيين فصل</span>
									</Button>
								)}
							</PopoverTrigger>
							<PopoverContent align="end" className="w-48 p-1.5" dir="rtl">
								<p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5">
									{request.status === "ACCEPTED" ? "تسكين الطالب في فصل" : "اختر الفصل المناسب للطالب"}
								</p>
								<div className="space-y-0.5 mt-0.5">
									{classrooms.length === 0 ? (
										<p className="px-1.5 py-2 text-[10px] text-muted-foreground">لا توجد فصول مضافة في النظام</p>
									) : classrooms.map((cls) => (
										<button
											key={cls.id}
											type="button"
											onClick={() => handleAssignClass(cls)}
											className="w-full text-right text-[11px] px-1.5 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium transition-colors"
										>
											{cls.name}
										</button>
									))}
								</div>
							</PopoverContent>
						</Popover>
					</div>
				)}

				{/* المسار المقترح */}
				<div className="flex items-center justify-between py-0.5">
					<span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 text-[10px]">
						<IconCompass className="size-3 text-zinc-400" />
						<span>المسار المقترح</span>
					</span>
					<Popover open={trackPopoverOpen} onOpenChange={setTrackPopoverOpen}>
						<PopoverTrigger asChild>
							{request.proposedTrack ? (
								<Button
									variant="outline"
									size="sm"
									className="h-5 px-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 gap-0.5"
								>
									<span>{request.proposedTrack}</span>
								</Button>
							) : (
								<Button
									variant="outline"
									size="sm"
									className="h-5 px-1.5 text-[9.5px] border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary gap-0.5"
								>
									<IconPlus className="size-2.5 text-primary" />
									<span>تعيين مسار</span>
								</Button>
							)}
						</PopoverTrigger>
						<PopoverContent align="end" className="w-52 p-1.5" dir="rtl">
							<p className="text-[10px] font-bold text-zinc-800 dark:text-zinc-200 px-1.5 py-0.5">
								اختر المسار الأكاديمي
							</p>
							<div className="space-y-0.5 mt-0.5">
								{REGISTRATION_TRACKS.map((trk) => (
									<button
										key={trk}
										type="button"
										onClick={() => handleAssignTrack(trk)}
										className="w-full text-right text-[11px] px-1.5 py-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 font-medium transition-colors"
									>
										{trk}
									</button>
								))}
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</div>
	);
}

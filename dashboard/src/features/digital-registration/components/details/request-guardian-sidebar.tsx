import { useState, useEffect } from "react";
import {
	IconCalendar,
	IconCheck,
	IconCopy,
	IconMapPin,
	IconPhone,
	IconPlus,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useRegistrationReviewers, useAssignReviewer } from "../../hooks/use-digital-registration";
import { useClinicInfo } from "@/features/settings/services/hooks/use-clinic-info";
import {
	formatAppointmentDate,
	formatAppointmentTime,
	DEFAULT_CLINIC_TIMEZONE,
} from "../../utils/date-format";
import { getWhatsAppUrl } from "../../utils/phone-format";

function getInitials(name?: string | null): string {
	if (!name) return "";
	const clean = name
		.trim()
		.replace(/^(د\.|أ\.|م\.|مهندس|دكتور|أستاذ)\s*/i, "")
		.split(/\s+/);
	if (clean.length === 0 || !clean[0]) return "";
	if (clean.length === 1) return clean[0].slice(0, 2);
	return `${clean[0][0]}${clean[1][0]}`;
}

interface RequestGuardianSidebarProps {
	request: CampaignRequestItem;
	onOpenReschedule: (staffId?: string) => void;
	onOpenReferDialog: () => void;
	onRequestUpdate?: (updated: Partial<CampaignRequestItem> & { id: string }) => void;
}

export function RequestGuardianSidebar({
	request,
	onOpenReschedule,
	onOpenReferDialog,
	onRequestUpdate,
}: RequestGuardianSidebarProps) {
	const [reviewerPopoverOpen, setReviewerPopoverOpen] = useState(false);
	const { data: reviewers = [], isLoading: staffLoading } = useRegistrationReviewers();
	const assignReviewerMutation = useAssignReviewer();

	const [localReviewer, setLocalReviewer] = useState<{
		id: string;
		name: string;
		phone?: string | null;
		image?: string | null;
	} | null>(() => {
		return (
			request.assignedStaff ||
			(request.reviewerName
				? { name: request.reviewerName, id: request.assignedStaffId || "", phone: (request as any).reviewerPhone || null }
				: null)
		);
	});

	useEffect(() => {
		setLocalReviewer(
			request.assignedStaff ||
				(request.reviewerName
					? { name: request.reviewerName, id: request.assignedStaffId || "", phone: (request as any).reviewerPhone || null }
					: null)
		);
	}, [request.assignedStaff, request.reviewerName, request.assignedStaffId]);

	const handleCopy = async (text: string, label: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success(`تم نسخ ${label} بنجاح`);
		} catch {
			toast.error(`تعذر نسخ ${label}`);
		}
	};

	const handleAssignReviewer = (staffId: string) => {
		setReviewerPopoverOpen(false);
		const targetStaff = reviewers.find((r) => r.staffId === staffId || r.id === staffId);
		const optimisticStaff = targetStaff
			? {
					id: targetStaff.userId || targetStaff.staffId || targetStaff.id,
					name: targetStaff.name,
					phone: targetStaff.phone || null,
					image: targetStaff.image || null,
			  }
			: null;

		// 1. تحديث محلي وفوري بنسبة 100% بدون أي تأخير (0ms Optimistic UI)
		if (optimisticStaff) {
			setLocalReviewer(optimisticStaff);
			onRequestUpdate?.({
				id: request.id,
				assignedStaffId: optimisticStaff.id,
				assignedStaff: optimisticStaff,
				reviewerName: optimisticStaff.name,
			});
		}

		assignReviewerMutation.mutate(
			{ requestId: request.id, staffId },
			{
				onSuccess: (resData: any) => {
					const finalStaff = resData?.assignedStaff || optimisticStaff;
					if (finalStaff) {
						setLocalReviewer(finalStaff);
						onRequestUpdate?.({
							id: request.id,
							assignedStaffId: resData?.assignedStaffId || finalStaff.id,
							assignedStaff: finalStaff,
							reviewerName: finalStaff.name,
						});
					}
					toast.success(`تم تعيين المراجع: ${targetStaff?.name || ""}`);
				},
				onError: (err: any) => {
					// إرجاع الحالة السابقة فوراً في حال حدوث خطأ
					setLocalReviewer(
						request.assignedStaff ||
							(request.reviewerName
								? { name: request.reviewerName, id: request.assignedStaffId || "", phone: (request as any).reviewerPhone || null }
								: null)
					);
					toast.error(err.message || "فشل تعيين المراجع");
				},
			},
		);
	};

	const guardianWaUrl = request.guardianPhone ? getWhatsAppUrl(request.guardianPhone) : "";

	const reviewer = localReviewer || request.assignedStaff || (request.reviewerName ? { name: request.reviewerName, id: request.assignedStaffId || "", phone: null } : null);
	const matchedReviewer = reviewers.find((r) => r.id === reviewer?.id || r.userId === reviewer?.id);
	const reviewerPhone = (reviewer as any)?.phone || matchedReviewer?.phone || "";
	const reviewerWaUrl = reviewerPhone ? getWhatsAppUrl(reviewerPhone) : "";

	const { clinicInfo } = useClinicInfo();
	const clinicTimezone = clinicInfo?.timezone || DEFAULT_CLINIC_TIMEZONE;

	const submittedAtFormatted = request.submittedAt
		? `${formatAppointmentDate(request.submittedAt, clinicTimezone, "ar-EG-u-nu-latn", { month: "short", day: "numeric", weekday: undefined, year: undefined })} • ${formatAppointmentTime(request.submittedAt, clinicTimezone, "ar-EG-u-nu-latn")}`
		: (request.date || "قيد المراجعة");
	const hasInterviewContext = Boolean(
		request.status === "INTERVIEW" ||
		request.appointmentDate ||
		request.assessmentAppointment
	);

	const isRemote = request.interviewMode
		? request.interviewMode === "REMOTE"
		: request.channel === "CALL";

	const sessionLocationLabel = isRemote ? "عبر اتصال" : "في الأكاديمية";

	return (
		<aside
			className="w-full lg:w-[28%] shrink-0 border-t lg:border-t-0 lg:border-r border-zinc-200 dark:border-zinc-800 bg-background px-3 pb-3 pt-3.5 text-right font-sans text-xs self-stretch flex flex-col"
			dir="rtl"
		>
			<div className="space-y-3.5 lg:sticky lg:top-3.5">
				{/* سكشن 1: تفاصيل ولي الأمر (مطابق للصورة تماماً) */}
				<div className="space-y-1.5 font-sans">
					<h3 className="text-[13.5px] font-bold text-zinc-900 dark:text-zinc-100">
						التفاصيل ولي الأمر
					</h3>

					{/* بيانات وهوية ولي الأمر */}
					<div className="space-y-2 pt-1">
						{/* الصف الأول: الدائرة الزرقاء بالأحرف الأولى واسم ولي الأمر + زر إرسال رسالة */}
						<div className="flex items-center justify-between gap-1.5">
							<div className="flex items-center gap-1.5 min-w-0 flex-1">
								<div className="size-5 rounded-full bg-[#4f6ae0] text-white flex items-center justify-center shrink-0 text-[9.5px] font-bold select-none shadow-2xs">
									{getInitials(request.guardianName)}
								</div>
								<p className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
									{request.guardianName || "غير محدد"}
								</p>
							</div>

							{/* زر إرسال رسالة لولي الأمر */}
							{guardianWaUrl ? (
								<a
									href={guardianWaUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[9.5px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
									title="إرسال رسالة لولي الأمر"
								>
									<span>إرسال رسالة</span>
								</a>
							) : (
								<span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/40 text-[9.5px] font-medium text-zinc-400 select-none shrink-0">
									إرسال رسالة
								</span>
							)}
						</div>

						{/* الصف الثاني: رقم الهاتف مع زر النسخ */}
						<div className="flex items-center justify-between gap-2 text-xs pt-0.5">
							<div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300 min-w-0">
								<IconPhone className="size-3 text-zinc-400 shrink-0" />
								<span className="font-mono text-[10.5px] truncate" dir="ltr">
									{request.guardianPhone || "غير محدد"}
								</span>
							</div>
							{request.guardianPhone && (
								<button
									type="button"
									onClick={() => handleCopy(request.guardianPhone, "رقم الهاتف")}
									className="inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[9.5px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
									title="نسخ رقم الهاتف"
								>
									<span>نسخ</span>
								</button>
							)}
						</div>

						{/* الصف الثالث: مكان الجلسة (دائم الظهور مطابقاً للصورة) */}
						<div className="flex items-center justify-between gap-2 text-xs pt-0.5">
							<div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300 min-w-0">
								<IconMapPin className="size-3 text-zinc-500 shrink-0" />
								<span className="text-[11px] font-medium text-zinc-800 dark:text-zinc-200">
									مكان الجلسة
								</span>
							</div>
							<span
								className={cn(
									"text-[10px] font-medium px-2 py-0.5 rounded shrink-0",
									isRemote
										? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/70 dark:border-emerald-800/40"
										: "text-blue-700 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/70 dark:border-blue-900/40",
								)}
							>
								{sessionLocationLabel}
							</span>
						</div>
					</div>
				</div>

				{/* سكشن 2: قسم المراجع */}
				<div className="space-y-2 border-t border-zinc-200/80 dark:border-zinc-800 pt-3">
					<div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
						<span>المراجع</span>
						{reviewer && (
							<Popover open={reviewerPopoverOpen} onOpenChange={setReviewerPopoverOpen}>
								<PopoverTrigger asChild>
									<button
										type="button"
										className="text-[10px] text-primary hover:underline font-normal cursor-pointer"
									>
										تغيير
									</button>
								</PopoverTrigger>
								<PopoverContent align="end" className="w-56 p-1.5 z-50 bg-popover border border-border shadow-xl rounded-xl" dir="rtl">
									<div className="space-y-1">
										<p className="text-[10.5px] font-bold text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5">
											تغيير المراجع
										</p>
										<div className="max-h-44 overflow-y-auto space-y-0.5">
											{staffLoading ? (
												<p className="text-[10px] text-muted-foreground p-1 text-center">جاري التحميل...</p>
											) : reviewers.length === 0 ? (
												<p className="text-[10px] text-muted-foreground p-1 text-center">لا يوجد أعضاء متاحين</p>
											) : (
												reviewers.map((s) => {
													const isSelected = s.staffId === localReviewer?.id || s.id === localReviewer?.id;
													return (
														<button
															key={s.id}
															type="button"
															onClick={() => handleAssignReviewer(s.staffId)}
															className={cn(
																"w-full flex items-center justify-between gap-1.5 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-right transition-colors cursor-pointer",
																isSelected && "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold",
															)}
														>
															<div className="flex items-center gap-1.5 min-w-0 flex-1">
																<Avatar className="size-5 shrink-0">
																	<AvatarFallback className="text-[8.5px] bg-primary/10 text-primary font-bold">
																		{s.name.slice(0, 2)}
																	</AvatarFallback>
																</Avatar>
																<div className="min-w-0 flex-1">
																	<span className="text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 truncate block">
																		{s.name}
																	</span>
																	{s.phone && (
																		<span className="text-[9px] text-muted-foreground font-mono block" dir="ltr">
																			{s.phone}
																		</span>
																	)}
																</div>
															</div>
															{isSelected && <IconCheck className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
														</button>
													);
												})
											)}
										</div>
									</div>
								</PopoverContent>
							</Popover>
						)}
					</div>

					{reviewer ? (
						<div className="space-y-1.5 pt-1">
							{/* الصف الأول: الدائرة الزرقاء واسم المراجع + زر إرسال رسالة */}
							<div className="flex items-center justify-between gap-1.5">
								<div className="flex items-center gap-1.5 min-w-0">
									<div className="size-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
										{reviewer.name.slice(0, 1)}
									</div>
									<span className="text-[11.5px] font-bold text-zinc-900 dark:text-zinc-100 truncate block">
										{reviewer.name}
									</span>
								</div>

								{/* زر إرسال رسالة للمراجع */}
								{reviewerWaUrl ? (
									<a
										href={reviewerWaUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-semibold transition-colors shrink-0"
										title="إرسال رسالة للمراجع"
									>
										<span>إرسال رسالة</span>
									</a>
								) : (
									<button
										type="button"
										onClick={() => toast.info("لم يتم تسجيل رقم هاتف لهذا المراجع")}
										className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-semibold transition-colors shrink-0"
										title="إرسال رسالة للمراجع"
									>
										<span>إرسال رسالة</span>
									</button>
								)}
							</div>

							{/* الصف الثاني: رقم الهاتف مع زر النسخ (بدون خط سفلي) */}
							<div className="flex items-center justify-between gap-2 text-xs pt-0.5">
								<div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300 min-w-0">
									<IconPhone className="size-3 text-zinc-400 shrink-0" />
									<span className="font-mono text-[10.5px] truncate" dir="ltr">
										{reviewerPhone || "غير محدد"}
									</span>
								</div>
								{reviewerPhone && (
									<button
										type="button"
										onClick={() => handleCopy(reviewerPhone, "رقم هاتف المراجع")}
										className="inline-flex items-center justify-center px-1.5 py-0.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-[9.5px] font-medium text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors cursor-pointer shrink-0"
										title="نسخ رقم الهاتف"
									>
										<span>نسخ</span>
									</button>
								)}
							</div>
						</div>
					) : (
						<div className="pt-0.5">
							<Popover open={reviewerPopoverOpen} onOpenChange={setReviewerPopoverOpen}>
								<PopoverTrigger asChild>
									<Button
										type="button"
										variant="outline"
										className="w-full h-8 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary text-[10.5px] font-medium text-zinc-600 dark:text-zinc-300 gap-1 justify-center bg-white dark:bg-zinc-900 cursor-pointer"
									>
										<IconPlus className="size-3 text-primary" />
										<span>تعيين مراجع</span>
									</Button>
								</PopoverTrigger>
								<PopoverContent align="end" className="w-56 p-1.5 z-50 bg-popover border border-border shadow-xl rounded-xl" dir="rtl">
									<div className="space-y-1">
										<p className="text-[10.5px] font-bold text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5">
											اختر الأخصائي / المراجع
										</p>
										<div className="max-h-44 overflow-y-auto space-y-0.5">
											{staffLoading ? (
												<p className="text-[10px] text-muted-foreground p-1 text-center">جاري التحميل...</p>
											) : reviewers.length === 0 ? (
												<p className="text-[10px] text-muted-foreground p-1 text-center">لا يوجد أعضاء متاحين</p>
											) : (
												reviewers.map((s) => {
													const isSelected = s.staffId === localReviewer?.id || s.id === localReviewer?.id;
													return (
														<button
															key={s.id}
															type="button"
															onClick={() => handleAssignReviewer(s.staffId)}
															className={cn(
																"w-full flex items-center justify-between gap-1.5 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-right transition-colors cursor-pointer",
																isSelected && "bg-blue-50/80 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 font-semibold",
															)}
														>
															<div className="flex items-center gap-1.5 min-w-0 flex-1">
																<Avatar className="size-5 shrink-0">
																	<AvatarFallback className="text-[8.5px] bg-primary/10 text-primary font-bold">
																		{s.name.slice(0, 2)}
																	</AvatarFallback>
																</Avatar>
																<div className="min-w-0 flex-1">
																	<span className="text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 truncate block">
																		{s.name}
																	</span>
																	{s.phone && (
																		<span className="text-[9px] text-muted-foreground font-mono block" dir="ltr">
																			{s.phone}
																		</span>
																	)}
																</div>
															</div>
															{isSelected && <IconCheck className="size-3.5 text-blue-600 dark:text-blue-400 shrink-0" />}
														</button>
													);
												})
											)}
										</div>
									</div>
								</PopoverContent>
							</Popover>
						</div>
					)}
				</div>

				{/* سكشن 3: قسم إحالة لجهة أخرى بدون border */}
				<div className="space-y-2 border-t border-zinc-200/80 dark:border-zinc-800 pt-3">
					<span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100">
						إحالة لجهة أخرى
					</span>
					{request.referredToStaff ? (
						<div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-950/20 p-2 space-y-0.5 text-xs">
							<div className="flex items-center justify-between">
								<span className="font-bold text-purple-900 dark:text-purple-300 text-[10.5px]">تمت الإحالة إلى:</span>
								<Badge variant="outline" className="text-[8.5px] px-1 py-0 border-purple-300 text-purple-800 dark:text-purple-200 bg-purple-100">
									محال
								</Badge>
							</div>
							<p className="text-[10.5px] font-semibold text-zinc-800 dark:text-zinc-200">
								{request.referredToStaff.name}
							</p>
							{request.referralReason && (
								<p className="text-[9.5px] text-muted-foreground leading-relaxed">
									{request.referralReason}
								</p>
							)}
						</div>
					) : (
						<Button
							type="button"
							variant="secondary"
							className="w-full h-8 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold gap-1.5 justify-center shadow-none cursor-pointer"
							onClick={onOpenReferDialog}
						>
							<IconPlus className="size-3.5" />
							<span>إحالة الطالب</span>
						</Button>
					)}
				</div>

				{/* سكشن 4: تاريخ وتوقيت التقديم بدون border */}
				<div className="flex items-center justify-between gap-2 border-t border-zinc-200/80 dark:border-zinc-800 pt-3 text-xs text-muted-foreground">
					<span className="flex items-center gap-1 text-[10px]">
						<IconCalendar className="size-3 text-zinc-400" />
						<span>تاريخ التقديم</span>
					</span>
					<span className="font-semibold text-zinc-700 dark:text-zinc-300 text-[10px]">
						{submittedAtFormatted}
					</span>
				</div>
			</div>
		</aside>
	);
}

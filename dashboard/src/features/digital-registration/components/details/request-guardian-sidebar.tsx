import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
	IconCalendar,
	IconCopy,
	IconPhone,
	IconPlus,
	IconVideo,
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
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useRegistrationReviewers } from "../../hooks/use-digital-registration";

interface RequestGuardianSidebarProps {
	request: CampaignRequestItem;
	onOpenReschedule: (staffId?: string) => void;
	onOpenReferDialog: () => void;
}

export function RequestGuardianSidebar({
	request,
	onOpenReschedule,
	onOpenReferDialog,
}: RequestGuardianSidebarProps) {
	const [reviewerPopoverOpen, setReviewerPopoverOpen] = useState(false);
	const { data: reviewers = [], isLoading: staffLoading } = useRegistrationReviewers();

	const handleCopy = async (text: string, label: string) => {
		try {
			await navigator.clipboard.writeText(text);
			toast.success(`تم نسخ ${label} بنجاح`);
		} catch {
			toast.error(`تعذر نسخ ${label}`);
		}
	};

	const handleAssignReviewer = (staffId: string) => {
		// لا نحدّث المراجع وحده: اختيار الموظف يفتح نفس إعادة الجدولة حتى يُحفظ
		// مع الموعد وAppointment الفعلي في معاملة واحدة.
		setReviewerPopoverOpen(false);
		onOpenReschedule(staffId);
	};

	const cleanPhone = request.guardianPhone ? request.guardianPhone.replace(/\D/g, "") : "";
	const waPhone = cleanPhone;

	const reviewer = request.assignedStaff || (request.reviewerName ? { name: request.reviewerName, id: request.assignedStaffId || "", phone: null } : null);
	const matchedReviewer = reviewers.find((r) => r.id === reviewer?.id || r.userId === reviewer?.id);
	const reviewerPhone = (reviewer as any)?.phone || matchedReviewer?.phone || "";
	const reviewerCleanPhone = reviewerPhone ? reviewerPhone.replace(/\D/g, "") : "";

	const submittedAtFormatted = request.submittedAt
		? `${new Date(request.submittedAt).toLocaleDateString("ar-EG", { month: "short", day: "numeric" })} • ${new Date(request.submittedAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}`
		: (request.date || "قيد المراجعة");
	const hasActiveRemoteAppointment = Boolean(
		request.interviewMode === "REMOTE" &&
		request.appointmentId &&
		(!request.assessmentAppointment || request.assessmentAppointment.status !== "CANCELLED"),
	);

	return (
		<aside
			className="w-full lg:w-[28%] shrink-0 border-t lg:border-t-0 lg:border-r border-zinc-200 dark:border-zinc-800 bg-background px-3 pb-3 pt-3.5 text-right font-sans text-xs self-stretch flex flex-col"
			dir="rtl"
		>
			<div className="space-y-3.5 lg:sticky lg:top-3.5">
				{/* سكشن 1: تفاصيل ولي الأمر (بمحاذاة بيانات الطالب تماماً) */}
				<div className="space-y-1.5 font-sans">
					<h3 className="text-[13.5px] font-bold text-zinc-900 dark:text-zinc-100">
						تفاصيل ولي الأمر
					</h3>

					{/* بيانات وهوية ولي الأمر */}
					<div className="space-y-2 pt-1">
						<div className="flex items-center justify-between gap-1.5">
							<div className="min-w-0 flex-1">
								<p className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
									{request.guardianName}
								</p>
								<span className="text-[10px] text-zinc-400 dark:text-zinc-500 block truncate">
									ولي أمر الطالب
								</span>
							</div>

							{/* زر إرسال رسالة لولي الأمر */}
							{request.guardianPhone && (
								<a
									href={`https://wa.me/${waPhone}`}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-semibold transition-colors shrink-0"
									title="إرسال رسالة لولي الأمر"
								>
									<span>إرسال رسالة</span>
								</a>
							)}
						</div>

						{/* رقم الهاتف مع زر النسخ (بدون خط سفلي) */}
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

						{/* مكان الجلسة / طريقة الحضور (بدون خط سفلي) */}
						<div className="flex items-center justify-between gap-2 text-xs pt-0.5">
							<span className="text-[10px] text-zinc-400 dark:text-zinc-500">مكان الجلسة:</span>
							<span className="text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
								{request.interviewMode === "REMOTE" ? (
									<>
										<IconVideo className="size-3 text-blue-500" />
										<span>عبر اتصال</span>
									</>
								) : (
									<span>في الأكاديمية</span>
								)}
							</span>
						</div>
						{hasActiveRemoteAppointment && (
							<Link
								to="/video-call"
								search={{ registrationRequestId: request.id }}
								className="flex h-7 w-full items-center justify-center gap-1 rounded-md bg-emerald-600 px-2 text-[10px] font-semibold text-white transition-colors hover:bg-emerald-700"
								title="دخول المقابلة عن بُعد"
							>
								<IconVideo className="size-3" />
								<span>دخول المقابلة عن بُعد</span>
							</Link>
						)}
					</div>
				</div>

				{/* سكشن 2: قسم تعيين المراجع بدون border */}
				<div className="space-y-2 border-t border-zinc-200/80 dark:border-zinc-800 pt-3">
					<div className="flex items-center justify-between text-xs font-bold text-zinc-900 dark:text-zinc-100">
						<span>المراجع</span>
						<Popover open={reviewerPopoverOpen} onOpenChange={setReviewerPopoverOpen}>
							<PopoverTrigger asChild>
								<button
									type="button"
									className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-[9.5px] font-semibold transition-colors cursor-pointer"
									title="تغيير أو اختيار مراجع آخر"
								>
									<IconPlus className="size-2.5" />
									<span>تعيين مراجع</span>
								</button>
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
											reviewers.map((s) => (
												<button
													key={s.id}
													type="button"
													onClick={() => handleAssignReviewer(s.staffId)}
													className="w-full flex items-center gap-1.5 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-right transition-colors cursor-pointer"
												>
													<Avatar className="size-5">
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
												</button>
											))
										)}
									</div>
								</div>
							</PopoverContent>
						</Popover>
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
								{reviewerPhone ? (
									<a
										href={`https://wa.me/${reviewerCleanPhone}`}
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
							<Button
								type="button"
								variant="outline"
								onClick={() => setReviewerPopoverOpen(true)}
								className="w-full h-8 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary text-[10.5px] font-medium text-zinc-600 dark:text-zinc-300 gap-1 justify-center bg-white dark:bg-zinc-900 cursor-pointer"
							>
								<IconPlus className="size-3 text-primary" />
								<span>تعيين مراجع</span>
							</Button>
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

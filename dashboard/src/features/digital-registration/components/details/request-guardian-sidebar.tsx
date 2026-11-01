import { useState } from "react";
import {
	IconArrowsExchange,
	IconBrandWhatsapp,
	IconCalendar,
	IconCopy,
	IconPhone,
	IconPlus,
	IconUserCircle,
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
import { useStaffForBooking } from "@/features/appointments/hooks/use-staff-for-booking";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { useQuickUpdateRequest } from "../../hooks/use-digital-registration";

interface RequestGuardianSidebarProps {
	request: CampaignRequestItem;
	campaignId?: string;
	onOpenReferDialog: () => void;
}

export function RequestGuardianSidebar({
	request,
	campaignId = "",
	onOpenReferDialog,
}: RequestGuardianSidebarProps) {
	const [reviewerPopoverOpen, setReviewerPopoverOpen] = useState(false);
	const { staff, isLoading: staffLoading } = useStaffForBooking();
	const quickUpdateMutation = useQuickUpdateRequest(campaignId);

	const handleCopy = (text: string, label: string) => {
		navigator.clipboard.writeText(text);
		toast.success(`تم نسخ ${label} بنجاح`);
	};

	const handleAssignReviewer = (staffId: string) => {
		quickUpdateMutation.mutate(
			{
				requestId: request.id,
				data: { assignedStaffId: staffId },
			},
			{
				onSuccess: () => {
					toast.success("تم تعيين مراجع للطلب بنجاح");
					setReviewerPopoverOpen(false);
				},
				onError: (err: any) => {
					toast.error(err.message || "فشل تعيين المراجع");
				},
			},
		);
	};

	const cleanPhone = request.guardianPhone ? request.guardianPhone.replace(/\D/g, "") : "";
	const waPhone = cleanPhone.startsWith("05") ? `966${cleanPhone.slice(1)}` : cleanPhone;

	const reviewer = request.assignedStaff || (request.reviewerName ? { name: request.reviewerName, id: request.assignedStaffId || "" } : null);

	const submittedAtFormatted = request.submittedAt
		? `${new Date(request.submittedAt).toLocaleDateString("ar-EG", { month: "short", day: "numeric" })} • ${new Date(request.submittedAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}`
		: (request.date || "قيد المراجعة");

	return (
		<div
			className="w-full lg:w-48 xl:w-52 shrink-0 border-t lg:border-t-0 lg:border-r border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50 p-2.5 space-y-2.5 text-right font-sans text-xs"
			dir="rtl"
		>
			{/* العنوان الرئيسي للعمود بدون أيقونات مكررة في الأعلى */}
			<div className="flex items-center justify-between">
				<h3 className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
					<IconUserCircle className="size-3.5 text-primary" />
					<span>تفاصيل ولي الأمر</span>
				</h3>
			</div>

			{/* كارت هوية ولي الأمر بدون دائرة الحروف ومزود بأيقونة الواتساب المباشرة */}
			<div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2.5 space-y-2 shadow-2xs">
				<div className="flex items-center justify-between gap-1.5">
					<div className="min-w-0 flex-1">
						<p className="text-[11.5px] font-bold text-zinc-900 dark:text-zinc-100 truncate">
							{request.guardianName}
						</p>
						<span className="text-[9.5px] text-zinc-400 dark:text-zinc-500 block truncate">
							ولي أمر الطالب
						</span>
					</div>

					{/* زر إرسال رسالة لولي الأمر عبر واتساب */}
					{request.guardianPhone && (
						<a
							href={`https://wa.me/${waPhone}`}
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-[10px] font-semibold transition-colors shrink-0 shadow-2xs"
							title="إرسال رسالة لولي الأمر عبر واتساب"
						>
							<IconBrandWhatsapp className="size-3 text-emerald-600 dark:text-emerald-400" />
							<span>إرسال رسالة</span>
						</a>
					)}
				</div>

				{/* رقم الهاتف مع زر النسخ */}
				<div className="flex items-center justify-between gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 text-xs">
					<div className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300">
						<IconPhone className="size-3 text-zinc-400 shrink-0" />
						<span className="font-mono text-[10.5px]" dir="ltr">
							{request.guardianPhone}
						</span>
					</div>
					<button
						type="button"
						onClick={() => handleCopy(request.guardianPhone, "رقم الهاتف")}
						className="inline-flex items-center gap-0.5 text-[9.5px] text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
						title="نسخ رقم الهاتف"
					>
						<IconCopy className="size-2.5" />
						<span>نسخ</span>
					</button>
				</div>

				{/* مكان الجلسة / طريقة الحضور - بدون كلام زايد */}
				<div className="flex items-center justify-between gap-2 text-xs pt-0.5">
					<span className="text-[10px] text-zinc-400 dark:text-zinc-500">مكان الجلسة:</span>
					<span className="text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
						{request.source === "DIRECT_LINK" || request.meetingUrl ? (
							<>
								<IconVideo className="size-3 text-blue-500" />
								<span>أونلاين</span>
							</>
						) : (
							<span>حضوري</span>
						)}
					</span>
				</div>
			</div>

			{/* قسم تعيين المراجع */}
			<div className="space-y-1.5">
				<div className="flex items-center justify-between text-[11px] font-bold text-zinc-800 dark:text-zinc-200">
					<span>المراجع</span>
					{reviewer && (
						<button
							type="button"
							onClick={() => setReviewerPopoverOpen(true)}
							className="text-[9.5px] text-primary hover:underline font-normal"
						>
							تغيير
						</button>
					)}
				</div>

				{reviewer ? (
					<div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 flex items-center justify-between gap-1.5 shadow-2xs">
						<div className="flex items-center gap-1.5 min-w-0">
							<Avatar className="size-6 shrink-0">
								<AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-[9px] font-bold">
									{reviewer.name.slice(0, 2)}
								</AvatarFallback>
							</Avatar>
							<div className="min-w-0">
								<span className="text-[11px] font-bold text-zinc-900 dark:text-zinc-100 truncate block">
									{reviewer.name}
								</span>
								<span className="text-[9px] text-muted-foreground block truncate">
									مراجع أكاديمي
								</span>
							</div>
						</div>
						<Badge variant="outline" className="text-[8.5px] px-1 py-0 border-emerald-200 text-emerald-700 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40">
							معين
						</Badge>
					</div>
				) : (
					<Popover open={reviewerPopoverOpen} onOpenChange={setReviewerPopoverOpen}>
						<PopoverTrigger asChild>
							<Button
								type="button"
								variant="outline"
								className="w-full h-8 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary text-[10.5px] font-medium text-zinc-600 dark:text-zinc-300 gap-1 justify-center bg-white dark:bg-zinc-900 shadow-2xs"
							>
								<IconPlus className="size-3 text-primary" />
								<span>تعيين مراجع</span>
							</Button>
						</PopoverTrigger>
						<PopoverContent align="center" className="w-56 p-1.5" dir="rtl">
							<div className="space-y-1">
								<p className="text-[10.5px] font-bold text-zinc-900 dark:text-zinc-100 px-1.5 py-0.5">
									اختر الأخصائي / المراجع
								</p>
								<div className="max-h-44 overflow-y-auto space-y-0.5">
									{staffLoading ? (
										<p className="text-[10px] text-muted-foreground p-1 text-center">جاري التحميل...</p>
									) : staff.length === 0 ? (
										<p className="text-[10px] text-muted-foreground p-1 text-center">لا يوجد أعضاء متاحين</p>
									) : (
										staff.map((s) => (
											<button
												key={s.id}
												type="button"
												onClick={() => handleAssignReviewer(s.id)}
												className="w-full flex items-center gap-1.5 p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-right transition-colors"
											>
												<Avatar className="size-5">
													<AvatarFallback className="text-[8.5px] bg-primary/10 text-primary font-bold">
														{s.name.slice(0, 2)}
													</AvatarFallback>
												</Avatar>
												<span className="text-[10.5px] font-medium text-zinc-800 dark:text-zinc-200 truncate flex-1">
													{s.name}
												</span>
											</button>
										))
									)}
								</div>
							</div>
						</PopoverContent>
					</Popover>
				)}
			</div>

			{/* قسم إحالة لجهة أخرى */}
			<div className="space-y-1.5">
				<span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 block">
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
						variant="outline"
						className="w-full h-8 border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-purple-300 hover:text-purple-700 text-[10.5px] font-medium gap-1 justify-center shadow-2xs"
						onClick={onOpenReferDialog}
					>
						<IconArrowsExchange className="size-3 text-purple-600" />
						<span>إحالة الطالب</span>
					</Button>
				)}
			</div>

			{/* تاريخ وتوقيت التقديم */}
			<div className="pt-2 border-t border-zinc-200/80 dark:border-zinc-800/80 flex items-center justify-between text-xs text-muted-foreground">
				<span className="flex items-center gap-1 text-[10px]">
					<IconCalendar className="size-3 text-zinc-400" />
					<span>تاريخ التقديم</span>
				</span>
				<span className="font-semibold text-zinc-700 dark:text-zinc-300 text-[10px]">
					{submittedAtFormatted}
				</span>
			</div>
		</div>
	);
}

import {
	IconActivity,
	IconArrowsExchange,
	IconCalendarPlus,
	IconCheck,
	IconChevronDown,
	IconClipboardCheck,
	IconClock,
	IconCoin,
	IconCopy,
	IconDots,
	IconEdit,
	IconHourglass,
	IconPlus,
	IconPrinter,
	IconShare,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CampaignRequestItem } from "../../types/campaign-request.types";

interface RequestHeaderActionsProps {
	request: CampaignRequestItem;
	onClose: () => void;
	onOpenShortlist: () => void;
	onOpenWaitlist: () => void;
	onOpenSchedule: () => void;
	onOpenReschedule: () => void;
	onOpenReject: () => void;
	onOpenDelete: () => void;
	onAcceptDirect?: () => void;
	onOpenEdit?: () => void;
	onOpenRefer?: () => void;
	onOpenPrint?: () => void;
	onMoveToQueue?: () => void;
	onMoveToInterview?: () => void;
	onMoveToAwaitingPayment?: () => void;
	onMarkDuplicate?: () => void;
}

export function RequestHeaderActions({
	request,
	onClose,
	onOpenShortlist,
	onOpenWaitlist,
	onOpenSchedule,
	onOpenReschedule,
	onOpenReject,
	onOpenDelete,
	onAcceptDirect,
	onOpenEdit,
	onOpenRefer,
	onOpenPrint,
	onMoveToQueue,
	onMoveToInterview,
	onMoveToAwaitingPayment,
	onMarkDuplicate,
}: RequestHeaderActionsProps) {
	const handlePrint = () => {
		if (onOpenPrint) {
			onOpenPrint();
		} else {
			toast.info("جاري تجهيز استمارة الطالب للطباعة...");
			window.print();
		}
	};

	const handleShare = () => {
		const url = window.location.href;
		navigator.clipboard.writeText(url);
		toast.success("تم نسخ رابط داخلي؛ يعمل فقط للمستخدمين المصرح لهم");
	};

	// فتح النوافذ الجانبية بتأخير بسيط لضمان اكتمال إغلاق القائمة المنسدلة بدون أي تعارض في التركيز
	const triggerSafeOpen = (fn?: () => void) => {
		if (!fn) return;
		setTimeout(() => {
			fn();
		}, 80);
	};

	return (
		<div
			className="border-b border-zinc-200 dark:border-zinc-800 px-3 py-2 flex items-center justify-between gap-2 bg-white dark:bg-zinc-900 shrink-0"
			dir="rtl"
		>
			{/* مسار التنقل (Breadcrumb) */}
			<div className="flex items-center gap-1.5 text-[11px] min-w-0">
				<span className="font-semibold text-zinc-500 dark:text-zinc-400">الطلبات</span>
				<span className="text-zinc-300 dark:text-zinc-600">›</span>
				<span className="font-bold text-zinc-800 dark:text-zinc-200 truncate">
					{request.patientName}
				</span>
				<span className="text-zinc-300 dark:text-zinc-600">›</span>
				<span className="font-mono text-[10.5px] text-zinc-400 font-semibold">
					#{request.code}
				</span>
			</div>

			{/* الأزرار والإجراءات */}
			<div className="flex items-center gap-1.5 print:hidden">
				{/* زر إضافة للقائمة مع تغطية شاملة لكافة مراحل وقوائم الطلب المنظومية */}
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<Button
							size="sm"
							className="h-7 gap-1 text-[11px] font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xs px-2.5 cursor-pointer [&_*]:pointer-events-none select-none transition-all"
						>
							<IconPlus className="size-3" />
							<span>إضافة للقائمة</span>
							<IconChevronDown className="size-2.5 opacity-80" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56 text-xs z-[100]">
						<DropdownMenuLabel className="text-[10px] text-muted-foreground font-semibold px-2 py-1">
							نقل الطالب لمرحلة / قائمة:
						</DropdownMenuLabel>

						{/* 1. القائمة المختصرة */}
						<DropdownMenuItem
							onSelect={() => triggerSafeOpen(onOpenShortlist)}
							className="gap-2 text-[11px] cursor-pointer"
						>
							<IconClipboardCheck className="size-3.5 text-blue-600" />
							<span>تسجيل بالقائمة المختصرة</span>
						</DropdownMenuItem>

						{/* 2. إعادة جدولة موعد المقابلة */}
						<DropdownMenuItem
							onSelect={() => triggerSafeOpen(onOpenReschedule)}
							className="gap-2 text-[11px] cursor-pointer"
						>
							<IconCalendarPlus className="size-3.5 text-purple-600" />
							<span>إعادة جدولة موعد المقابلة</span>
						</DropdownMenuItem>

						<DropdownMenuItem
							onSelect={() => triggerSafeOpen(onMoveToInterview)}
							className="gap-2 text-[11px] cursor-pointer"
						>
							<IconActivity className="size-3.5 text-violet-600" />
							<span>نقل إلى المقابلة الشخصية</span>
						</DropdownMenuItem>

						{/* 3. قائمة الانتظار */}
						<DropdownMenuItem
							onSelect={() => triggerSafeOpen(onOpenWaitlist)}
							className="gap-2 text-[11px] cursor-pointer"
						>
							<IconHourglass className="size-3.5 text-orange-600" />
							<span>إدراج في قائمة الانتظار</span>
						</DropdownMenuItem>

						{/* 5. بانتظار الدفع */}
						<DropdownMenuItem
							onSelect={() => triggerSafeOpen(onMoveToAwaitingPayment)}
							className="gap-2 text-[11px] cursor-pointer"
						>
							<IconCoin className="size-3.5 text-indigo-600" />
							<span>إدراج في بانتظار الدفع</span>
						</DropdownMenuItem>

						{/* 6. قبول واعتماد نهائي */}
						{onAcceptDirect && (
							<DropdownMenuItem
								onSelect={() => triggerSafeOpen(onAcceptDirect)}
								className="gap-2 text-[11px] cursor-pointer font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20"
							>
								<IconCheck className="size-3.5 text-emerald-600" />
								<span>قبول واعتماد الطالب نهائياً</span>
							</DropdownMenuItem>
						)}

						<DropdownMenuSeparator />

						{/* 7. إحالة لجهة أخرى / أخصائي */}
						{onOpenRefer && (
							<DropdownMenuItem
								onSelect={() => triggerSafeOpen(onOpenRefer)}
								className="gap-2 text-[11px] cursor-pointer text-purple-700 dark:text-purple-300"
							>
								<IconArrowsExchange className="size-3.5 text-purple-600" />
								<span>إحالة لجهة أو أخصائي آخر</span>
							</DropdownMenuItem>
						)}

						{/* 8. نقل إلى الطابور */}
						<DropdownMenuItem
							onSelect={() => triggerSafeOpen(onMoveToQueue)}
							className="gap-2 text-[11px] cursor-pointer"
						>
							<IconClock className="size-3.5 text-zinc-500" />
							<span>إعادة إلى الطابور</span>
						</DropdownMenuItem>

						{/* 9. تعليم كطلب مكرر */}
						<DropdownMenuItem
							onSelect={() => triggerSafeOpen(onMarkDuplicate)}
							className="gap-2 text-[11px] cursor-pointer text-amber-800 dark:text-amber-400"
						>
							<IconCopy className="size-3.5 text-amber-600" />
							<span>تعليم كطلب مكرر</span>
						</DropdownMenuItem>

						<DropdownMenuSeparator />

						{/* 10. إرسال رفض */}
						<DropdownMenuItem
							onSelect={() => triggerSafeOpen(onOpenReject)}
							className="gap-2 text-[11px] text-destructive focus:text-destructive cursor-pointer font-semibold"
						>
							<IconX className="size-3.5" />
							<span>إرسال رفض للطلب</span>
						</DropdownMenuItem>

						{/* 11. حذف طلب الطالب */}
						{onOpenDelete && (
							<DropdownMenuItem
								onSelect={() => triggerSafeOpen(onOpenDelete)}
								onClick={() => triggerSafeOpen(onOpenDelete)}
								className="gap-2 text-[11px] text-destructive focus:text-destructive cursor-pointer font-semibold"
							>
								<IconTrash className="size-3.5" />
								<span>حذف طلب الطالب</span>
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>

				{/* زر تعديل بيانات الطلب */}
				{onOpenEdit && (
					<button
						type="button"
						onClick={onOpenEdit}
						className="size-7 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
						title="تعديل بيانات الطلب"
					>
						<IconEdit className="size-3.5" />
					</button>
				)}

				{/* زر المشاركة */}
				<button
					type="button"
					onClick={handleShare}
					className="size-7 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
					title="مشاركة الرابط"
				>
					<IconShare className="size-3.5" />
				</button>

				{/* زر الطباعة المباشر */}
				<button
					type="button"
					onClick={handlePrint}
					className="size-7 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
					title="طباعة استمارة تفاصيل الطلب"
				>
					<IconPrinter className="size-3.5" />
				</button>

				{/* القائمة العلوية السريعة (...) */}
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="size-7 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
							title="خيارات إضافية"
						>
							<IconDots className="size-3.5" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-44">
						<DropdownMenuItem onClick={() => triggerSafeOpen(onOpenReschedule)} className="gap-2 text-[11px] cursor-pointer">
							<IconCalendarPlus className="size-3.5 text-zinc-600" />
							<span>إعادة جدولة موعد المقابلة</span>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={handlePrint} className="gap-2 text-[11px] cursor-pointer">
							<IconPrinter className="size-3.5 text-zinc-600" />
							<span>طباعة</span>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onSelect={() => triggerSafeOpen(onOpenDelete)}
							onClick={() => triggerSafeOpen(onOpenDelete)}
							className="gap-2 text-[11px] text-destructive focus:text-destructive cursor-pointer font-medium"
						>
							<IconTrash className="size-3.5" />
							<span>حذف طلب الطالب</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				{/* زر الإغلاق */}
				<button
					type="button"
					onClick={onClose}
					className="size-7 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
					title="إغلاق"
				>
					<IconX className="size-4" />
					<span className="sr-only">إغلاق</span>
				</button>
			</div>
		</div>
	);
}

import { Link } from "@tanstack/react-router";
import {
	IconActivity,
	IconArrowsDiagonal,
	IconArrowsDiagonalMinimize,
	IconCalendarPlus,
	IconCalendarX,
	IconCash,
	IconCheck,
	IconChevronDown,
	IconClipboardCheck,
	IconClock,
	IconCoin,
	IconDots,
	IconFileText,
	IconHourglass,
	IconLink,
	IconLoader2,
	IconPlus,
	IconPrinter,
	IconShare,
	IconSparkles,
	IconCopy,
	IconVideo,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import type { DigitalRegistrationCapabilities } from "../../types/campaign-share.types";
import { useDigitalRegistrationCapabilities } from "../../hooks/use-digital-registration";
import { getContractStatusMeta } from "../print/service-agreement-print-document";

/** أيقونة نسخ معرّف الطلب (بطاقتين متراكبتين مع رمز ID) مطابقة للشاشات المنظومية */
function IconCopyId({ className = "size-3.5" }: { className?: string }) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			className={className}
		>
			<path d="M16 3H6a2 2 0 0 0-2 2v12" />
			<rect x="6" y="6" width="14" height="15" rx="2.5" />
			<path d="M9.5 11.5v4" />
			<path d="M12.5 11.5v4h1.5a2 2 0 0 0 0-4h-1.5z" />
		</svg>
	);
}

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

interface RequestHeaderActionsProps {
	request: CampaignRequestItem;
	onClose: () => void;
	onOpenShortlist: () => void;
	onOpenWaitlist: () => void;
	/** تثبيت أو إعادة جدولة الموعد هو المسار الوحيد للوصول إلى المقابلة. */
	onOpenSchedule: () => void;
	onOpenReschedule: () => void;
	onOpenReject: () => void;
	onOpenDelete: () => void;
	onAcceptDirect?: () => void;
	onOpenCashPayment?: () => void;
	onEnrollStudent?: () => void;
	isEnrollingStudent?: boolean;
	onOpenContract?: () => void;
	capabilities?: DigitalRegistrationCapabilities;
	onOpenEdit?: () => void;
	onOpenRefer?: () => void;
	onOpenPrint?: () => void;
	onMoveToQueue?: () => void;
	onMoveToAwaitingPayment?: () => void;
	onMarkDuplicate?: () => void;
	isExpanded?: boolean;
	onToggleExpand?: () => void;
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
	onOpenCashPayment,
	onEnrollStudent,
	isEnrollingStudent,
	onOpenContract,
	capabilities: capabilitiesProp,
	onOpenEdit,
	onOpenRefer,
	onOpenPrint,
	onMoveToQueue,
	onMoveToAwaitingPayment,
	onMarkDuplicate,
	isExpanded,
	onToggleExpand,
}: RequestHeaderActionsProps) {
	const { capabilities: hookCapabilities } = useDigitalRegistrationCapabilities();
	const capabilities = capabilitiesProp ?? hookCapabilities;
	const handlePrint = () => {
		if (onOpenPrint) {
			onOpenPrint();
		} else {
			toast.info("جاري تجهيز استمارة الطالب للطباعة...");
			window.print();
		}
	};

	const handleCopyInternalLink = async () => {
		try {
			await navigator.clipboard.writeText(window.location.href);
			toast.success("تم نسخ الرابط الداخلي للطلب. لا يمنح الرابط أي صلاحية وصول.");
		} catch {
			toast.error("تعذر نسخ الرابط الداخلي للطلب");
		}
	};

	const handleCopyId = () => {
		const textToCopy = request.code || request.id;
		navigator.clipboard.writeText(textToCopy);
		toast.success(`تم نسخ معرّف الطلب (${textToCopy})`);
	};

	// فتح النوافذ الجانبية بتأخير بسيط لضمان اكتمال إغلاق القائمة المنسدلة بدون أي تعارض في التركيز
	const triggerSafeOpen = (fn?: () => void) => {
		if (!fn) return;
		setTimeout(() => {
			fn();
		}, 80);
	};

	// إعداد قائمة الخيارات الثلاثة المنطقية ديناميكياً بحسب عمود/حالة الكانبان مع فحص صلاحية الرفض
	const getDynamicListItems = () => {
		const canReject = Boolean(capabilities.canAcceptOrReject && onOpenReject);
		const rejectItem = canReject
			? {
					label: "قائمة الرفض",
					icon: <IconCalendarX className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
					action: onOpenReject,
			  }
			: null;

		let rawItems: Array<{ label: string; icon: React.ReactNode; action?: () => void } | null> = [];

		switch (request.status) {
			case "QUEUE":
				rawItems = [
					{
						label: "القائمة المختصرة",
						icon: <IconClipboardCheck className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
						action: onOpenShortlist,
					},
					{
						label: "قائمة الإنتظار",
						icon: <IconHourglass className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
						action: onOpenWaitlist,
					},
					rejectItem,
				];
				break;
			case "SHORTLIST":
				rawItems = [
					{
						label: "جدولة مقابلة",
						icon: <IconActivity className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
						action: onOpenSchedule,
					},
					{
						label: "قائمة الإنتظار",
						icon: <IconHourglass className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
						action: onOpenWaitlist,
					},
					rejectItem,
				];
				break;
			case "WAITLIST":
				rawItems = [
					{
						label: "جدولة مقابلة",
						icon: <IconActivity className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
						action: onOpenSchedule,
					},
					rejectItem,
				];
				break;
			case "INTERVIEW":
				rawItems = [
					{
						label: "نقل إلى بانتظار الدفع",
						icon: <IconCoin className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
						action: onMoveToAwaitingPayment,
					},
					rejectItem,
				];
				break;
			case "REJECTED":
				rawItems = [
					{
						label: "إعادة إلى قائمة الانتظار",
						icon: <IconHourglass className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
						action: capabilities.canChangeStatus ? onOpenWaitlist : undefined,
					},
				];
				break;
			case "DUPLICATE":
				rawItems = [
					{
						label: "إعادة إلى الطابور",
						icon: <IconClock className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
						action: onMoveToQueue,
					},
					{
						label: "القائمة المختصرة",
						icon: <IconClipboardCheck className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
						action: onOpenShortlist,
					},
					rejectItem,
				];
				break;
			default:
				rawItems = [
					{
						label: "القائمة المختصرة",
						icon: <IconClipboardCheck className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
						action: onOpenShortlist,
					},
					{
						label: "قائمة الإنتظار",
						icon: <IconHourglass className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />,
						action: onOpenWaitlist,
					},
					rejectItem,
				];
		}

		return rawItems.filter(
			(item): item is { label: string; icon: React.ReactNode; action?: () => void } =>
				item !== null && Boolean(item.action),
		);
	};

	const isRemoteInterview = Boolean(
		request.status === "INTERVIEW" &&
		(request.interviewMode ? request.interviewMode === "REMOTE" : request.channel === "CALL")
	);
	const dynamicListItems = getDynamicListItems();

	const lacksEnrollPermission = !capabilities.canEdit && !capabilities.canAcceptOrReject;
	const isEnrollDisabled =
		Boolean(isEnrollingStudent) || lacksEnrollPermission || !onEnrollStudent;
	const enrollTitle = isEnrollingStudent
		? "جاري إضافة الطالب لقائمة الطلاب..."
		: lacksEnrollPermission
		? "صلاحيات حسابك الحالية للعرض فقط ولا تسمح بإضافة الطالب"
		: !onEnrollStudent
		? "يرجى تحديث الصفحة (F5) لتفعيل زر إضافة الطالب"
		: "إضافة الطالب لقائمة الطلاب وإنشاء أو ربط ملف ولي الأمر";

	return (
		<div
			className="border-b border-zinc-200 dark:border-zinc-800 px-3 py-2 flex items-center justify-between gap-2 bg-white dark:bg-zinc-900 shrink-0"
			dir="rtl"
		>
			{/* مسار التنقل (Breadcrumb) */}
			<div className="flex items-center gap-1.5 text-[11.5px] min-w-0">
				<span className="font-bold text-zinc-900 dark:text-zinc-100">الطلبات</span>
				<span className="text-zinc-400 dark:text-zinc-500 font-medium">›</span>

				{/* الأفاتار الدائري بالأحرف الأولى */}
				<div className="size-5 rounded-full bg-[#4f6ae0] text-white flex items-center justify-center text-[9.5px] font-bold shrink-0 select-none shadow-2xs">
					{getInitials(request.patientName)}
				</div>

				{/* اسم الطالب */}
				<span className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
					{request.patientName}
				</span>

				{/* أيقونة النجوم / sparkles */}
				<IconSparkles className="size-3.5 text-zinc-400 dark:text-zinc-500 shrink-0" />

				{/* نقطة فاصلة */}
				<span className="text-zinc-300 dark:text-zinc-600 font-bold select-none">·</span>

				{/* كود الطلب */}
				<span
					className="text-zinc-400 dark:text-zinc-500 font-mono text-[10.5px] font-medium tracking-wide uppercase shrink-0 select-all"
					dir="ltr"
				>
					{request.code || request.id}
				</span>

				{/* زر الثلاثة نقط بجانب كود الطلب مباشرة */}
				<DropdownMenu dir="rtl">
					<DropdownMenuTrigger asChild>
						<button
							type="button"
							className="size-5.5 rounded flex items-center justify-center text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer shrink-0"
							title="خيارات إضافية"
						>
							<IconDots className="size-3.5" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="start" className="w-36 p-1 text-xs z-[100] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg rounded-xl">
						{/* 1. تعديل */}
						{onOpenEdit && (
							<DropdownMenuItem
								onClick={() => triggerSafeOpen(onOpenEdit)}
								className="gap-2.5 py-1.5 px-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
							>
								<IconCalendarPlus className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
								<span>تعديل</span>
							</DropdownMenuItem>
						)}

						{/* 2. حذف التسجيل */}
						{onOpenDelete && (
							<DropdownMenuItem
								onSelect={() => triggerSafeOpen(onOpenDelete)}
								onClick={() => triggerSafeOpen(onOpenDelete)}
								className="gap-2.5 py-1.5 px-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
							>
								<IconCalendarX className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
								<span>حذف التسجيل</span>
							</DropdownMenuItem>
						)}

						{/* 3. طباعة */}
						<DropdownMenuItem
							onClick={handlePrint}
							className="gap-2.5 py-1.5 px-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
						>
							<IconPrinter className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
							<span>طباعة</span>
						</DropdownMenuItem>

						{/* 4. مشاركة (نسخ الرابط الداخلي للطلب) */}
						<DropdownMenuItem
							onClick={handleCopyInternalLink}
							className="gap-2.5 py-1.5 px-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 cursor-pointer"
						>
							<IconShare className="size-3.5 text-zinc-500 dark:text-zinc-400 shrink-0" />
							<span>مشاركة</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* الأزرار والإجراءات */}
			<div className="flex items-center gap-1.5 print:hidden">
				{/* 1. عند القبول: زر «نموذج الخدمة» + زر «إضافة لقائمة الطلاب» المستقل */}
				{request.status === "ACCEPTED" ? (
					<div className="flex items-center gap-1.5">
						{onOpenContract && (
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={onOpenContract}
								className="h-7.5 gap-1.5 text-xs font-semibold bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 shadow-2xs px-2.5 rounded-lg cursor-pointer select-none transition-colors"
								title={getContractStatusMeta(request.contractStatus).label}
							>
								<IconFileText className="size-3.5 text-zinc-600 dark:text-zinc-300 shrink-0" />
								<span>نموذج الخدمة</span>
								<span
									className={cn(
										"inline-flex items-center gap-1 rounded px-1.5 py-0.2 text-[10px] font-medium border",
										getContractStatusMeta(request.contractStatus).badgeClass,
									)}
								>
									<span
										className={cn(
											"size-1.5 rounded-full shrink-0",
											getContractStatusMeta(request.contractStatus).dotClass,
										)}
									/>
									<span>{getContractStatusMeta(request.contractStatus).shortLabel}</span>
								</span>
							</Button>
						)}

						{Boolean(request.convertedPatientId) ? (
							<Button
								disabled
								size="sm"
								className="h-7.5 gap-1.5 text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 shadow-none px-3 rounded-lg cursor-not-allowed select-none opacity-90"
								title={
									request.convertedPatientCode
										? `تمت إضافة الطالب لقائمة الطلاب (${request.convertedPatientCode})`
										: "تمت إضافة الطالب لقائمة الطلاب"
								}
							>
								<IconCheck className="size-3.5 stroke-[2.5]" />
								<span>تمت الإضافة لقائمة الطلاب</span>
							</Button>
						) : (
							<Button
								type="button"
								size="sm"
								disabled={isEnrollDisabled}
								onClick={onEnrollStudent}
								className="h-7.5 gap-1.5 text-xs font-semibold bg-[#4f6ae0] hover:bg-[#435bc4] text-white shadow-xs px-3 rounded-lg cursor-pointer select-none transition-all border-none disabled:opacity-60 disabled:cursor-not-allowed"
								title={enrollTitle}
							>
								{isEnrollingStudent ? (
									<IconLoader2 className="size-3.5 animate-spin" />
								) : (
									<IconPlus className="size-3.5 stroke-[2.5]" />
								)}
								<span>{isEnrollingStudent ? "جاري الإضافة..." : "إضافة لقائمة الطلاب"}</span>
							</Button>
						)}
					</div>
				) : (
					<div className="flex items-center gap-1.5">
						{/* زر بدء مقابلة: يظهر عندما تكون المقابلة مكالمة عبر اتصال/تطبيق الويب */}
						{isRemoteInterview && (
							<Button
								asChild
								size="sm"
								className="h-7.5 gap-1.5 text-xs font-semibold bg-[#4f6ae0] hover:bg-[#435bc4] text-white shadow-xs px-3 rounded-lg cursor-pointer select-none transition-all border-none"
							>
								<Link
									to="/video-call"
									search={{ registrationRequestId: request.id }}
									title="بدء مقابلة عبر مكالمة ويب"
								>
									<IconVideo className="size-3.5 stroke-[2.2]" />
									<span>بدء مقابلة</span>
								</Link>
							</Button>
						)}

						{/* في مرحلة بانتظار الدفع: يظهر الدفع كاش + زر رفض مباشرة بدلاً من إضافة لقائمة */}
						{request.status === "AWAITING_PAYMENT" ? (
							<>
								{!request.paidAt && capabilities.canEdit && onOpenCashPayment && (
									<Button
										type="button"
										size="sm"
										onClick={() => triggerSafeOpen(onOpenCashPayment)}
										className="h-7.5 gap-1.5 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs px-3 rounded-lg cursor-pointer select-none transition-all border-none"
									>
										<IconCash className="size-3.5 stroke-[2.2]" />
										<span>الدفع كاش</span>
									</Button>
								)}
								{capabilities.canAcceptOrReject && onOpenReject && (
									<Button
										type="button"
										size="sm"
										onClick={() => triggerSafeOpen(onOpenReject)}
										className="h-7.5 gap-1.5 text-xs font-semibold bg-rose-50 hover:bg-rose-100/90 text-rose-500 dark:bg-rose-950/40 dark:hover:bg-rose-950/60 dark:text-rose-400 shadow-none px-3 rounded-lg cursor-pointer select-none transition-colors border-none"
									>
										<IconX className="size-3.5 stroke-[2.2]" />
										<span>رفض</span>
									</Button>
								)}
							</>
						) : dynamicListItems.length > 0 ? (
							<DropdownMenu dir="rtl">
								<DropdownMenuTrigger asChild>
									<Button
										size="sm"
										className="h-7.5 gap-1.5 text-xs font-semibold bg-[#4f6ae0] hover:bg-[#435bc4] text-white shadow-xs px-3 rounded-lg cursor-pointer [&_*]:pointer-events-none select-none transition-all border-none"
									>
										<IconPlus className="size-3.5 stroke-[2.5]" />
										<span>إضافة لقائمة</span>
										<IconChevronDown className="size-3 opacity-90" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-52 p-1 text-xs z-[100] bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-lg rounded-xl">
									{dynamicListItems.map((item, idx) => (
										<DropdownMenuItem
											key={`${item.label}-${idx}`}
											onSelect={() => triggerSafeOpen(item.action)}
											disabled={!item.action}
											className="gap-2.5 py-1.5 px-2.5 text-xs font-medium text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:bg-zinc-100 dark:focus:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
										>
											{item.icon}
											<span>{item.label}</span>
										</DropdownMenuItem>
									))}
								</DropdownMenuContent>
							</DropdownMenu>
						) : null}
					</div>
				)}

				{/* 2. نسخ رابط داخلي — لا يعمل إلا ضمن صلاحيات التسجيل المطبقة من الباك إند. */}
				<button
					type="button"
					onClick={handleCopyInternalLink}
					className="size-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
					title="نسخ رابط داخلي للطلب"
				>
					<IconLink className="size-4" />
					<span className="sr-only">نسخ رابط داخلي للطلب</span>
				</button>

				{/* 3. زر نسخ معرّف/كود الطلب */}
				<button
					type="button"
					onClick={handleCopyId}
					className="size-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
					title="نسخ معرّف الطلب"
				>
					<IconCopyId className="size-4" />
					<span className="sr-only">نسخ معرّف الطلب</span>
				</button>

				{/* 4. فاصل رأسي */}
				<div className="h-4.5 w-px bg-zinc-200 dark:bg-zinc-700 mx-0.5" />

				{/* 5. زر التمدد (يكبر العرض 5% زيادة فقط) */}
				{onToggleExpand && (
					<button
						type="button"
						onClick={onToggleExpand}
						className={cn(
							"size-7 rounded-md flex items-center justify-center transition-colors cursor-pointer",
							isExpanded
								? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
								: "text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
						)}
						title={isExpanded ? "استعادة العرض الافتراضي (-5%)" : "توسيع العرض (+5%)"}
					>
						{isExpanded ? (
							<IconArrowsDiagonalMinimize className="size-4" />
						) : (
							<IconArrowsDiagonal className="size-4" />
						)}
						<span className="sr-only">تمدد العرض</span>
					</button>
				)}

				{/* 6. زر الإغلاق */}
				<button
					type="button"
					onClick={onClose}
					className="size-7 rounded-md flex items-center justify-center text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
					title="إغلاق"
				>
					<IconX className="size-4" />
					<span className="sr-only">إغلاق</span>
				</button>
			</div>
		</div>
	);
}

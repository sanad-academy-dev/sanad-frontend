import { useState } from "react";
import type { ComponentType } from "react";
import {
	IconAlertCircle,
	IconArrowUp,
	IconAt,
	IconBuilding,
	IconCake,
	IconCalendar,
	IconCheck,
	IconCircle,
	IconCircleCheck,
	IconClock,
	IconDots,
	IconDownload,
	IconEye,
	IconEyeOff,
	IconFileText,
	IconGenderFemale,
	IconGenderMale,
	IconHeartbeat,
	IconMail,
	IconMessage,
	IconMoodSmile,
	IconPhone,
	IconUser,
	IconUserCircle,
	IconX,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "./campaign-requests-kanban";

type IconType = ComponentType<{ className?: string }>;

function DetailRow({
	icon: Icon,
	label,
	value,
}: {
	icon: IconType;
	label: string;
	value: React.ReactNode;
}) {
	return (
		<div
			className="flex items-center justify-between gap-3 py-1"
			dir="rtl"
		>
			<span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
				<Icon className="size-3.5" />
				{label}
			</span>
			<span className="text-[13px] font-semibold text-foreground">{value}</span>
		</div>
	);
}

function AttachmentRow({
	label,
	size,
}: {
	label: string;
	size: string;
}) {
	return (
		<div
			className="flex items-center gap-2 rounded-[4px] border bg-muted/40 px-3 py-2"
			dir="rtl"
		>
			<span className="flex size-7 shrink-0 items-center justify-center rounded-[4px] border bg-background">
				<IconFileText className="size-3.5 text-muted-foreground" />
			</span>
			<div className="flex min-w-0 flex-1 flex-col">
				<span className="truncate text-xs font-medium text-foreground">
					{label}
				</span>
				<span className="text-[10px] text-muted-foreground">
					مستند PDF · {size}
				</span>
			</div>
			<div className="flex items-center gap-1">
				<button
					type="button"
					className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
					title="تنزيل"
				>
					<IconDownload className="size-3.5" />
					<span className="sr-only">تنزيل</span>
				</button>
				<button
					type="button"
					className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
					title="عرض"
				>
					<IconEye className="size-3.5" />
					<span className="sr-only">عرض</span>
				</button>
			</div>
		</div>
	);
}

interface TimelineStep {
	id: string;
	title: string;
	byName: string;
	dateLabel?: string;
	status: "done" | "active" | "pending";
	statusBadge?: string;
}

function TimelineStepItem({
	step,
	isLast,
}: {
	step: TimelineStep;
	isLast: boolean;
}) {
	const isDone = step.status === "done";
	const isActive = step.status === "active";

	return (
		<div className="flex gap-3" dir="rtl">
			{/* الأيقونة والخط الرابط */}
			<div className="flex flex-col items-center">
				<span
					className={cn(
						"flex size-6 shrink-0 items-center justify-center rounded-full text-xs",
						isDone
							? "bg-emerald-500 text-white"
							: isActive
								? "bg-primary text-primary-foreground"
								: "border bg-muted/60 text-muted-foreground",
					)}
				>
					{isDone ? (
						<IconCircleCheck className="size-3.5" />
					) : (
						<IconCircle className="size-3.5" />
					)}
				</span>
				{!isLast && (
					<span
						className={cn(
							"mt-1 w-px flex-1 min-h-6",
							isDone ? "bg-emerald-200" : "bg-border",
						)}
					/>
				)}
			</div>

			{/* التفاصيل */}
			<div className="flex-1 pb-4">
				<div className="flex items-start justify-between gap-2">
					<p className="text-[13px] font-semibold text-foreground">{step.title}</p>
					{step.statusBadge && (
						<span
							className={cn(
								"rounded-[4px] px-2 py-0.5 text-[10px] font-medium border",
								isDone
									? "bg-emerald-50 text-emerald-600 border-emerald-200"
									: isActive
										? "bg-primary/10 text-primary border-primary/20"
										: "bg-muted text-muted-foreground border-border",
							)}
						>
							{step.statusBadge}
						</span>
					)}
				</div>
				<div className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
					{step.dateLabel && <span>{step.dateLabel}</span>}
					{step.dateLabel && <span>·</span>}
					<span>بواسطة:</span>
					<Avatar className="size-4">
						<AvatarFallback className="text-[8px] bg-muted font-medium">
							{step.byName.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<span className="font-medium text-foreground">{step.byName}</span>
				</div>
			</div>
		</div>
	);
}

interface CommentItem {
	id: string;
	authorName: string;
	body: string;
	createdAt: string;
}

function CommentItemView({
	comment,
	onEdit,
	onDelete,
}: {
	comment: CommentItem;
	onEdit: (id: string, text: string) => void;
	onDelete: (id: string) => void;
}) {
	const [isEditing, setIsEditing] = useState(false);
	const [draft, setDraft] = useState(comment.body);

	const handleSave = () => {
		const trimmed = draft.trim();
		if (!trimmed) return;
		onEdit(comment.id, trimmed);
		setIsEditing(false);
	};

	return (
		<div className="rounded-md border bg-card p-3">
			<div className="mb-2 flex items-center justify-between gap-2">
				<div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
					<Avatar size="sm" className="size-5">
						<AvatarFallback className="bg-primary text-[9px] font-semibold text-primary-foreground">
							{comment.authorName.slice(0, 2)}
						</AvatarFallback>
					</Avatar>
					<span className="truncate font-semibold text-foreground">
						{comment.authorName}
					</span>
					<span>•</span>
					<span className="shrink-0 text-[11px]">{comment.createdAt}</span>
				</div>
				{!isEditing && (
					<DropdownMenu dir="rtl">
						<DropdownMenuTrigger asChild>
							<Button size="icon" variant="ghost" className="size-6">
								<IconDots className="size-3.5" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onSelect={() => setIsEditing(true)}>
								تعديل
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onSelect={() => onDelete(comment.id)}
							>
								حذف
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				)}
			</div>

			{isEditing ? (
				<div className="flex flex-col gap-2">
					<Textarea
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						className="min-h-16 text-xs"
					/>
					<div className="flex items-center gap-2">
						<Button size="sm" className="h-7 text-xs" onClick={handleSave}>
							حفظ
						</Button>
						<Button
							size="sm"
							variant="outline"
							className="h-7 text-xs"
							onClick={() => {
								setDraft(comment.body);
								setIsEditing(false);
							}}
						>
							إلغاء
						</Button>
					</div>
				</div>
			) : (
				<p className="whitespace-pre-wrap text-xs text-foreground leading-relaxed">
					{comment.body}
				</p>
			)}
		</div>
	);
}

const STATUS_META: Record<string, { label: string; className: string }> = {
	queue: {
		label: "طابور الانتظار",
		className: "bg-amber-50 text-amber-700 border-amber-200",
	},
	"check-in": {
		label: "التقييم",
		className: "bg-purple-50 text-purple-700 border-purple-200",
	},
	"in-service": {
		label: "قيد المراجعة",
		className: "bg-blue-50 text-blue-700 border-blue-200",
	},
	"awaiting-payment": {
		label: "انتظار الرد",
		className: "bg-indigo-50 text-indigo-700 border-indigo-200",
	},
	done: {
		label: "تم القبول",
		className: "bg-emerald-50 text-emerald-700 border-emerald-200",
	},
	cancelled: {
		label: "مرفوض",
		className: "bg-rose-50 text-rose-700 border-rose-200",
	},
};

const APPROVAL_STEPS: TimelineStep[] = [
	{
		id: "1",
		title: "استلام الطلب",
		byName: "النظام",
		dateLabel: "01/02/2026",
		status: "done",
		statusBadge: "مكتمل",
	},
	{
		id: "2",
		title: "مراجعة المستندات",
		byName: "فاطمة السالم",
		dateLabel: "01/02/2026",
		status: "active",
		statusBadge: "قيد المراجعة",
	},
	{
		id: "3",
		title: "مراجعة الطبيب",
		byName: "د. أحمد العمري",
		status: "pending",
	},
	{
		id: "4",
		title: "اعتماد المدير",
		byName: "أحمد المالكي",
		status: "pending",
	},
	{
		id: "5",
		title: "مراجعة المحاسب",
		byName: "سارة المحمد",
		status: "pending",
	},
];

const INITIAL_COMMENTS: CommentItem[] = [
	{
		id: "c-1",
		authorName: "د. أحمد العمري",
		body: "يحتاج متابعة خاصة في التكيف الاجتماعي ومراجعة تقرير الحساسية قبل اعتماد الفصل.",
		createdAt: "منذ ساعتين",
	},
];

export function CampaignRequestSheet({
	request,
	open,
	onOpenChange,
	onAccept,
	onWaitlist,
	onReject,
}: {
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAccept?: (request: CampaignRequestItem) => void;
	onWaitlist?: (request: CampaignRequestItem) => void;
	onReject?: (request: CampaignRequestItem) => void;
}) {
	const { data: session } = useSession();
	const [hasChronic, setHasChronic] = useState(true);
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [comments, setComments] = useState<CommentItem[]>(INITIAL_COMMENTS);
	const [commentDraft, setCommentDraft] = useState("");

	if (!request) return null;

	const currentUserName = session?.user?.name || "المشرف الحالي";

	const statusMeta =
		STATUS_META[request.column] ?? {
			label: request.statusLabel || "معلق",
			className: "bg-amber-50 text-amber-700 border-amber-200",
		};

	const isMale = request.patientDetails?.includes("ذكر");
	const ageLabel = request.patientDetails?.split("-")[0]?.trim() || "2 سنوات";

	const handleAddComment = () => {
		const trimmed = commentDraft.trim();
		if (!trimmed) return;
		const newComment: CommentItem = {
			id: `c-${Date.now()}`,
			authorName: currentUserName,
			body: trimmed,
			createdAt: "الآن",
		};
		setComments((prev) => [newComment, ...prev]);
		setCommentDraft("");
	};

	const handleEditComment = (id: string, text: string) => {
		setComments((prev) =>
			prev.map((c) => (c.id === id ? { ...c, body: text } : c)),
		);
	};

	const handleDeleteComment = (id: string) => {
		setComments((prev) => prev.filter((c) => c.id !== id));
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="left"
				dir="rtl"
				showCloseButton={false}
				className="w-full flex-row items-stretch gap-3 border-none! bg-transparent! p-0 shadow-none! sm:max-w-xl!"
				onEscapeKeyDown={(e) => {
					if (commentsOpen) {
						e.preventDefault();
						setCommentsOpen(false);
					}
				}}
			>
				{/* اللوحة الرئيسية للطلب */}
				<div
					className="relative order-2 flex min-h-0 flex-1 flex-col rounded-lg border bg-popover text-popover-foreground shadow-lg"
					dir="rtl"
				>
					{/* الترويسة - مسار التنقل مع زر التعليقات وزر الإغلاق في اليسار */}
					<div className="border-b px-4 py-2 flex items-center justify-between gap-2">
						<h2 className="flex items-center gap-1.5 text-xs font-bold text-foreground">
							التسجيل الرقمي
							<span className="text-muted-foreground">›</span>
							<span className="font-semibold text-muted-foreground">طلبات الحملة</span>
							<span className="text-muted-foreground">›</span>
							<span className="font-semibold text-muted-foreground">تفاصيل الطلب</span>
						</h2>

						{/* عناصر أقصى اليسار في الهيدر: زر التعليقات وزر الإغلاق */}
						<div className="flex items-center gap-1.5">
							<Button
								type="button"
								size="sm"
								variant={commentsOpen ? "secondary" : "outline"}
								className="h-7 gap-1.5 text-xs font-normal"
								aria-pressed={commentsOpen}
								onClick={() => setCommentsOpen((v) => !v)}
							>
								<IconMessage className="size-3.5" />
								التعليقات
								{comments.length > 0 && (
									<span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
										{comments.length}
									</span>
								)}
							</Button>

							<button
								type="button"
								onClick={() => onOpenChange(false)}
								className="flex size-7 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
							>
								<IconX className="size-4" />
								<span className="sr-only">إغلاق</span>
							</button>
						</div>
					</div>

					{/* المحتوى القابل للتمرير */}
					<div className="flex-1 space-y-4 overflow-y-auto p-4">
						{/* العنوان والحالة */}
						<div
							className="flex items-center justify-between gap-2"
							dir="rtl"
						>
							<span
								className={cn(
									"rounded-[4px] px-2 py-0.5 text-[11px] font-medium border",
									statusMeta.className,
								)}
							>
								{statusMeta.label}
							</span>
							<div className="flex items-center gap-2">
								<span className="text-sm font-bold text-foreground">
									{request.patientName}
								</span>
								<span className="text-xs text-muted-foreground tabular-nums">
									.{request.code}#
								</span>
							</div>
						</div>

						{/* بيانات الطفل */}
						<div className="space-y-1.5">
							<span className="text-[11px] font-semibold text-foreground">
								بيانات الطفل
							</span>
							<div className="space-y-0.5 rounded-[4px] border px-3 py-2 bg-background">
								<DetailRow
									icon={IconUser}
									label="الاسم"
									value={request.patientName}
								/>
								<DetailRow
									icon={IconCalendar}
									label="تاريخ الميلاد"
									value="01/01/2023"
								/>
								<DetailRow
									icon={isMale ? IconGenderMale : IconGenderFemale}
									label="الجنس"
									value={isMale ? "ذكر" : "أنثى"}
								/>
								<DetailRow
									icon={IconCake}
									label="العمر"
									value={ageLabel}
								/>
								<DetailRow
									icon={IconBuilding}
									label="الفصل المطلوب"
									value="النجوم"
								/>
								<DetailRow
									icon={IconCalendar}
									label="تاريخ التقديم"
									value={request.date || "01/02/2026"}
								/>
							</div>
						</div>

						{/* المعلومات الطبية */}
						<div className="space-y-1.5">
							<span className="text-[11px] font-semibold text-foreground">
								المعلومات الطبية
							</span>
							<div className="space-y-2 rounded-[4px] border px-3 py-2.5 bg-background">
								<DetailRow
									icon={IconHeartbeat}
									label="فصيلة الدم"
									value="A+"
								/>
								<div
									className="flex items-center justify-between gap-3 py-1"
									dir="rtl"
								>
									<span className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
										<IconAlertCircle className="size-3.5" />
										حساسية
									</span>
									<div className="flex items-center gap-1 flex-wrap">
										<Badge
											variant="outline"
											className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-medium px-2 py-0.5"
										>
											حساسية فول سوداني
										</Badge>
									</div>
								</div>

								<div className="flex items-center justify-between border rounded-[4px] p-2.5 bg-destructive/5 border-destructive/20 mt-1">
									<div className="flex items-center gap-2 text-destructive font-medium text-xs">
										<IconHeartbeat className="size-4" />
										<span>حالات مزمنة</span>
									</div>
									<Switch
										checked={hasChronic}
										onCheckedChange={setHasChronic}
										className="data-[state=checked]:bg-destructive"
									/>
								</div>

								{hasChronic && (
									<div className="rounded-[4px] border border-destructive/20 bg-destructive/5 p-2 text-center text-xs font-medium text-destructive">
										ربو خفيف - الأدوية: بخاخ فنتولين عند الحاجة
									</div>
								)}
							</div>
						</div>

						{/* بيانات ولي الأمر */}
						<div className="space-y-1.5">
							<span className="text-[11px] font-semibold text-foreground">
								بيانات ولي الأمر
							</span>
							<div className="space-y-0.5 rounded-[4px] border px-3 py-2 bg-background">
								<DetailRow
									icon={IconUserCircle}
									label="ولي الأمر"
									value={
										<div className="flex items-center gap-1.5">
											<Avatar className="size-5">
												<AvatarFallback className="text-[9px] bg-emerald-50 text-emerald-700 font-bold">
													{request.guardianName?.slice(0, 2) || "وا"}
												</AvatarFallback>
											</Avatar>
											<span>{request.guardianName || "محمد السالم"}</span>
										</div>
									}
								/>
								<DetailRow
									icon={IconPhone}
									label="رقم الهاتف"
									value={
										<span dir="ltr" className="tabular-nums font-mono text-xs">
											0584505412
										</span>
									}
								/>
								<DetailRow
									icon={IconMail}
									label="البريد الإلكتروني"
									value={
										<span dir="ltr" className="font-mono text-xs">
											mohammed@email.com
										</span>
									}
								/>
							</div>
						</div>

						{/* المستندات والمرفقات */}
						<div className="space-y-2">
							<div
								className="flex items-center justify-between gap-2"
								dir="rtl"
							>
								<span className="text-[11px] font-semibold text-foreground">
									المستندات والملفات
								</span>
								<span className="text-[10px] text-muted-foreground">
									{request.documents
										? `${request.documents.count} من ${request.documents.total} مستندات`
										: "3 مستندات"}
								</span>
							</div>
							<div className="space-y-1.5">
								<AttachmentRow label="شهادة الميلاد.pdf" size="1.2 MB" />
								<AttachmentRow label="كارت التطعيمات واللقاحات.pdf" size="850 KB" />
								<AttachmentRow label="الهوية الوطنية لولي الأمر.pdf" size="2.1 MB" />
							</div>
						</div>

						{/* مسار الموافقات */}
						<div className="space-y-2">
							<span className="text-[11px] font-semibold text-foreground">
								سلسلة الموافقات
							</span>
							<div className="space-y-0 pt-1">
								{APPROVAL_STEPS.map((step, i) => (
									<TimelineStepItem
										key={step.id}
										step={step}
										isLast={i === APPROVAL_STEPS.length - 1}
									/>
								))}
							</div>
						</div>
					</div>

					{/* التذييل والأزرار */}
					<div className="flex items-center justify-between gap-3 border-t px-4 py-2.5 bg-background">
						<div className="flex items-center gap-2">
							<Button
								type="button"
								size="sm"
								className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 h-8 text-xs font-medium"
								onClick={() => {
									onAccept?.(request);
									onOpenChange(false);
								}}
							>
								<IconCheck className="size-3.5" />
								قبول الطلب
							</Button>
						</div>

						<div className="flex items-center gap-2">
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="gap-1.5 h-8 text-xs font-medium"
								onClick={() => {
									onWaitlist?.(request);
									onOpenChange(false);
								}}
							>
								<IconClock className="size-3.5" />
								قائمة الانتظار
							</Button>
							<Button
								type="button"
								variant="outline"
								size="sm"
								className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive gap-1.5 h-8 text-xs font-medium"
								onClick={() => {
									onReject?.(request);
									onOpenChange(false);
								}}
							>
								<IconX className="size-3.5" />
								رفض
							</Button>
						</div>
					</div>
				</div>

				{/* لوحة التعليقات الجانبية — تظهر من اليمين تماماً كما في شيت التحاليل */}
				{commentsOpen && (
					<aside
						dir="rtl"
						aria-label="تعليقات الطلب"
						className="fixed inset-y-2 right-2 w-80 sm:w-96 z-50 flex flex-col gap-0 rounded-lg border bg-popover text-sm text-popover-foreground shadow-2xl animate-in fade-in-0 slide-in-from-right-10 duration-200"
					>
						<div className="flex items-center justify-between gap-2 border-b px-4 py-2.5">
							<h2 className="flex min-w-0 items-center gap-2 text-sm font-bold">
								<IconMessage className="size-4 shrink-0 text-muted-foreground" />
								<span className="truncate">التعليقات</span>
								{comments.length > 0 && (
									<span className="inline-flex h-4 min-w-4 items-center justify-center rounded bg-muted px-1 text-[10px] font-medium tabular-nums text-muted-foreground">
										{comments.length}
									</span>
								)}
								<Badge
									variant="secondary"
									className="shrink-0 text-[10px] font-normal"
								>
									<IconEyeOff className="size-3.5" />
									داخلية
								</Badge>
							</h2>
							<Button
								size="icon"
								variant="ghost"
								className="size-7 rounded"
								aria-label="إغلاق التعليقات"
								onClick={() => setCommentsOpen(false)}
							>
								<IconX className="size-4" />
							</Button>
						</div>

						<div className="min-h-0 flex-1 overflow-y-auto p-4 flex flex-col gap-3">
							{/* حقل كتابة التعليق في الأعلى */}
							<div className="relative rounded-md border bg-card p-0">
								<Textarea
									value={commentDraft}
									onChange={(e) => setCommentDraft(e.target.value)}
									onKeyDown={(e) => {
										if (e.key === "Enter" && !e.shiftKey) {
											e.preventDefault();
											handleAddComment();
										}
									}}
									placeholder="أضف تعليقًا... (اضغط Enter للإرسال)"
									className="min-h-24 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 text-xs p-3 pb-9"
								/>
								<div className="absolute bottom-2 inset-x-2 flex items-center justify-between">
									<div className="flex items-center gap-1.5 text-muted-foreground">
										<button
											type="button"
											className="hover:text-foreground p-0.5 transition-colors"
											title="رمز تعبيري"
										>
											<IconMoodSmile className="size-3.5" />
										</button>
										<button
											type="button"
											className="hover:text-foreground p-0.5 transition-colors"
											title="إشارة"
										>
											<IconAt className="size-3.5" />
										</button>
									</div>
									<Button
										size="icon-xs"
										variant="outline"
										className="size-6 rounded-full border enabled:border-primary enabled:bg-primary enabled:text-primary-foreground"
										onClick={handleAddComment}
										disabled={commentDraft.trim().length === 0}
									>
										<IconArrowUp className="size-3.5" />
									</Button>
								</div>
							</div>

							{/* قائمة التعليقات السابقة */}
							{comments.length === 0 ? (
								<p className="text-xs text-muted-foreground text-center py-6">
									لا توجد تعليقات بعد
								</p>
							) : (
								<div className="flex flex-col gap-2">
									{comments.map((comment) => (
										<CommentItemView
											key={comment.id}
											comment={comment}
											onEdit={handleEditComment}
											onDelete={handleDeleteComment}
										/>
									))}
								</div>
							)}
						</div>
					</aside>
				)}
			</SheetContent>
		</Sheet>
	);
}

// تصدير متوافق باسم Dialog لتفادي أي مشاكل في الاستدعاء القديم
export { CampaignRequestSheet as CampaignRequestDialog };

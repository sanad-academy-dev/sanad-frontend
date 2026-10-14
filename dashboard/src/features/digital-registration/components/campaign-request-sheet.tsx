import { useState } from "react";
import type { ComponentType } from "react";
import {
	IconAlertCircle,
	IconArrowUp,
	IconAt,
	IconBrandWhatsapp,
	IconBuilding,
	IconCake,
	IconCalendar,
	IconCalendarPlus,
	IconCheck,
	IconCircle,
	IconCircleCheck,
	IconClock,
	IconDots,
	IconDownload,
	IconEdit,
	IconExternalLink,
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
	IconSend,
	IconUser,
	IconUserCircle,
	IconX,
} from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

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
import { getFileUrl } from "@/lib/file-url";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem, RequestNotificationItem } from "../types/campaign-request.types";
import {
	useAddRequestComment,
	useDeleteRequestComment,
	useMarkNotificationSent,
	useRequestNotifications,
} from "../hooks/use-digital-registration";
import { EditRequestDialog } from "./edit-request-dialog";
import { ScheduleAssessmentDialog } from "./schedule-assessment-dialog";

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
	fileUrl,
}: {
	label: string;
	size: string;
	fileUrl?: string;
}) {
	const resolvedUrl = fileUrl
		? fileUrl.startsWith("http")
			? fileUrl
			: getFileUrl(fileUrl)
		: undefined;

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
					{size}
				</span>
			</div>
			<div className="flex items-center gap-1">
				{resolvedUrl ? (
					<>
						<a
							href={resolvedUrl}
							download
							target="_blank"
							rel="noopener noreferrer"
							className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
							title="تنزيل المستند"
						>
							<IconDownload className="size-3.5" />
							<span className="sr-only">تنزيل</span>
						</a>
						<a
							href={resolvedUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="flex size-6 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
							title="عرض المستند"
						>
							<IconEye className="size-3.5" />
							<span className="sr-only">عرض</span>
						</a>
					</>
				) : (
					<span className="text-[10px] text-muted-foreground">مرفق</span>
				)}
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

function NotificationOutboxCard({
	item,
	onMarkSent,
	isPending,
}: {
	item: RequestNotificationItem;
	onMarkSent: (id: string) => void;
	isPending: boolean;
}) {
	const isWhatsapp = item.channel === "WHATSAPP";
	const isSent = item.status === "SENT";

	return (
		<div
			className="rounded-lg border bg-card/70 p-3 space-y-2 text-right transition-all hover:border-primary/40 shadow-xs"
			dir="rtl"
		>
			<div className="flex items-center justify-between gap-2">
				<div className="flex items-center gap-1.5">
					{isWhatsapp ? (
						<span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
							<IconBrandWhatsapp className="size-3 text-emerald-600" />
							واتساب
						</span>
					) : (
						<span className="inline-flex items-center gap-1 rounded bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 px-2 py-0.5 text-[10px] font-bold">
							<IconMail className="size-3 text-blue-600" />
							بريد إلكتروني
						</span>
					)}

					<span className="text-[10px] text-muted-foreground font-mono" dir="ltr">
						{item.toAddress || "غير محدد"}
					</span>
				</div>

				<div className="flex items-center gap-1.5">
					{isSent ? (
						<Badge
							variant="outline"
							className="border-emerald-500/30 text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 text-[10px] gap-1 font-semibold"
						>
							<IconCheck className="size-3 text-emerald-600" />
							تم الإرسال
						</Badge>
					) : item.status === "AWAITING_MANUAL" ? (
						<Badge
							variant="outline"
							className="border-amber-500/30 text-amber-600 bg-amber-50 dark:bg-amber-950/30 text-[10px] gap-1 font-semibold"
						>
							<IconClock className="size-3 text-amber-600" />
							بانتظار الإرسال
						</Badge>
					) : item.status === "FAILED" ? (
						<Badge
							variant="outline"
							className="border-rose-500/30 text-rose-600 bg-rose-50 dark:bg-rose-950/30 text-[10px] gap-1 font-semibold"
						>
							فشل الإرسال
						</Badge>
					) : (
						<Badge variant="outline" className="text-[10px] font-semibold">
							في الطابور الآلي
						</Badge>
					)}
				</div>
			</div>

			{item.subject && (
				<p className="text-xs font-bold text-foreground">
					{item.subject}
				</p>
			)}

			<p className="text-[11px] text-muted-foreground whitespace-pre-wrap leading-relaxed bg-muted/40 p-2.5 rounded-md border border-border/40 text-right">
				{item.body}
			</p>

			<div className="flex items-center justify-between gap-2 pt-1 border-t border-border/40">
				<span className="text-[10px] text-muted-foreground">
					{new Date(item.createdAt).toLocaleDateString("ar-EG", {
						month: "numeric",
						day: "numeric",
						hour: "2-digit",
						minute: "2-digit",
					})}
				</span>

				{isWhatsapp && item.manualLink && !isSent && (
					<div className="flex items-center gap-2">
						<Button
							asChild
							size="sm"
							className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold gap-1.5 shadow-sm"
						>
							<a href={item.manualLink} target="_blank" rel="noopener noreferrer">
								<IconBrandWhatsapp className="size-3.5" />
								فتح واتساب وإرسال
							</a>
						</Button>

						<Button
							type="button"
							size="sm"
							variant="outline"
							className="h-7 text-xs gap-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 font-semibold"
							onClick={() => onMarkSent(item.id)}
							disabled={isPending}
						>
							<IconCheck className="size-3.5" />
							تأكيد الإرسال
						</Button>
					</div>
				)}

				{isSent && item.sentAt && (
					<span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
						<IconCheck className="size-3" />
						أُرسل {new Date(item.sentAt).toLocaleTimeString("ar-EG", { hour: "2-digit", minute: "2-digit" })}
					</span>
				)}
			</div>
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

export function CampaignRequestSheet({
	request,
	open,
	onOpenChange,
	campaignId,
	onAccept,
	onWaitlist,
	onReject,
}: {
	campaignId?: string;
	request: CampaignRequestItem | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onAccept?: (request: CampaignRequestItem) => void;
	onWaitlist?: (request: CampaignRequestItem) => void;
	onReject?: (request: CampaignRequestItem) => void;
}) {
	const { data: session } = useSession();
	const [hasChronic, setHasChronic] = useState(
		request?.hasChronicDiseases ?? Boolean(request?.chronicDiseases),
	);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isScheduleAssessmentOpen, setIsScheduleAssessmentOpen] = useState(false);
	const [commentsOpen, setCommentsOpen] = useState(false);
	const [commentDraft, setCommentDraft] = useState("");

	useEffect(() => {
		if (request) {
			setHasChronic(request.hasChronicDiseases ?? Boolean(request.chronicDiseases));
		}
	}, [request]);

	const addCommentMutation = useAddRequestComment(campaignId || "");
	const deleteCommentMutation = useDeleteRequestComment(campaignId || "");

	const { data: notifications = [], isLoading: isLoadingNotifications } =
		useRequestNotifications(request?.id || "");
	const markNotificationSentMutation = useMarkNotificationSent(
		campaignId || "",
		request?.id || "",
	);

	if (!request) return null;

	const comments = (request.comments || []).map((c) => ({
		id: c.id,
		authorName: c.authorName,
		body: c.body,
		createdAt: c.createdAt,
	}));

	const statusMeta =
		STATUS_META[request.column] ?? {
			label: request.statusLabel || "معلق",
			className: "bg-amber-50 text-amber-700 border-amber-200",
		};

	const isMale = request.gender === "MALE" || request.patientDetails?.includes("ذكر");
	const ageLabel = request.ageLabel || request.patientDetails?.split("-")[0]?.trim() || "غير محدد";

	const handleAddComment = () => {
		const trimmed = commentDraft.trim();
		if (!trimmed) return;
		addCommentMutation.mutate({
			requestId: request.id,
			content: trimmed,
		});
		setCommentDraft("");
	};

	const handleEditComment = (_id: string, _text: string) => {
		// Not implemented in backend yet, reserved
	};

	const handleDeleteComment = (id: string) => {
		deleteCommentMutation.mutate(id);
	};

	const handleMarkSent = (outboxId: string) => {
		markNotificationSentMutation.mutate(outboxId, {
			onSuccess: () => {
				toast.success("تم تأكيد إرسال الإشعار وتوثيقه في السجل الزمني");
			},
			onError: (err: any) => {
				toast.error(err.message || "حدث خطأ أثناء تأكيد الإرسال");
			},
		});
	};

	return (
		<>
			<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="left"
				dir="rtl"
				showCloseButton={false}
				className={cn(
					"w-full flex-row items-stretch gap-3 border-none! bg-transparent! p-0 shadow-none! sm:max-w-xl! transition-[max-width] duration-300 ease-out",
					commentsOpen && "sm:max-w-[calc(var(--container-xl,36rem)+384px+12px)]!",
				)}
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

						{/* عناصر أقصى اليسار في الهيدر: زر التعديل، زر التعليقات وزر الإغلاق */}
						<div className="flex items-center gap-1.5">
							<Button
								type="button"
								size="sm"
								variant="outline"
								className="h-7 gap-1.5 text-xs font-normal hover:border-primary/50 text-foreground"
								onClick={() => setIsEditDialogOpen(true)}
							>
								<IconEdit className="size-3.5 text-primary" />
								تعديل البيانات
							</Button>

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

						{/* بانر اعتماد القبول والروابط المباشرة */}
						{request.convertedPatientId && (
							<div
								className="flex flex-col gap-2 rounded-md border border-emerald-200 bg-emerald-50/80 dark:bg-emerald-950/30 dark:border-emerald-800 p-3"
								dir="rtl"
							>
								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
										<IconCheck className="size-4 shrink-0 text-emerald-600" />
										<span>تم اعتماد الطالب وإنشاء السجلات في المنظومة</span>
									</div>
									{request.convertedPatientCode && (
										<Badge variant="outline" className="font-mono text-[11px] bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-900/50 dark:text-emerald-200 font-bold px-2">
											{request.convertedPatientCode}
										</Badge>
									)}
								</div>

								<p className="text-[11px] text-muted-foreground leading-relaxed">
									تم ترحيل بيانات الطالب وولي الأمر تلقائياً. يمكنك الانتقال المباشر لملفاتهما في الأقسام الرسمية:
								</p>

								<div className="flex items-center gap-2 pt-1 flex-wrap">
									<Button
										asChild
										size="sm"
										variant="outline"
										className="h-7 text-xs bg-white dark:bg-card border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 gap-1.5 font-semibold"
									>
										<Link to="/services/patients">
											<IconUser className="size-3.5" />
											فتح ملف الطالب الأكاديمي
											<IconExternalLink className="size-3" />
										</Link>
									</Button>

									{request.convertedOwnerId && (
										<Button
											asChild
											size="sm"
											variant="outline"
											className="h-7 text-xs bg-white dark:bg-card border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 gap-1.5 font-semibold"
										>
											<Link to="/services/owners">
												<IconUserCircle className="size-3.5" />
												فتح ملف ولي الأمر
												<IconExternalLink className="size-3" />
											</Link>
										</Button>
									)}
								</div>
							</div>
						)}

						{/* كرت موعد الفحص والتقييم الرسمي */}
						{request.assessmentAppointment ? (
							<div
								className="flex flex-col gap-2 rounded-md border border-purple-200 bg-purple-50/70 dark:bg-purple-950/30 dark:border-purple-800 p-3"
								dir="rtl"
							>
								<div className="flex items-center justify-between gap-2">
									<div className="flex items-center gap-1.5 text-xs font-bold text-purple-800 dark:text-purple-300">
										<IconCalendar className="size-4 shrink-0 text-purple-600" />
										<span>موعد جلسة التقييم والفحص المقررة</span>
									</div>
									<Badge
										variant="outline"
										className="font-mono text-[11px] bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/50 dark:text-purple-200 font-bold px-2"
									>
										{request.assessmentAppointment.code}
									</Badge>
								</div>

								<div className="grid grid-cols-2 gap-2 text-xs pt-1">
									<div>
										<span className="text-muted-foreground block text-[11px]">التاريخ والوقت:</span>
										<span className="font-semibold text-foreground">
											{new Date(request.assessmentAppointment.startsAt).toLocaleDateString("ar-EG", {
												weekday: "long",
												year: "numeric",
												month: "long",
												day: "numeric",
											})}{" "}
											- {new Date(request.assessmentAppointment.startsAt).toLocaleTimeString("ar-EG", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</span>
									</div>

									<div>
										<span className="text-muted-foreground block text-[11px]">الأخصائي المسؤول:</span>
										<span className="font-semibold text-foreground">
											{request.assessmentAppointment.staffName || "فريق التقييم العام"}
										</span>
									</div>
								</div>

								<div className="flex items-center gap-2 pt-1 flex-wrap">
									<Button
										type="button"
										size="sm"
										variant="outline"
										className="h-7 text-xs bg-white dark:bg-card border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 gap-1.5 font-semibold"
										onClick={() => setIsScheduleAssessmentOpen(true)}
									>
										<IconCalendarPlus className="size-3.5" />
										تعديل / إعادة جدولة الموعد
									</Button>

									<Button
										asChild
										size="sm"
										variant="outline"
										className="h-7 text-xs bg-white dark:bg-card border-purple-300 text-purple-700 hover:bg-purple-100 dark:border-purple-700 dark:text-purple-300 gap-1.5 font-semibold"
									>
										<Link to="/appointments">
											<IconCalendar className="size-3.5" />
											عرض في تقويم المواعيد
											<IconExternalLink className="size-3" />
										</Link>
									</Button>
								</div>
							</div>
						) : request.status !== "REJECTED" && request.status !== "ACCEPTED" ? (
							<div
								className="flex items-center justify-between gap-3 rounded-md border border-dashed border-purple-300 bg-purple-50/40 dark:bg-purple-950/20 p-3"
								dir="rtl"
							>
								<div className="flex items-center gap-2.5 text-xs">
									<div className="flex size-7 shrink-0 items-center justify-center rounded bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300">
										<IconCalendarPlus className="size-4" />
									</div>
									<div>
										<span className="font-semibold block text-foreground">
											جلسة الفحص والتقييم لم تُجدول بعد
										</span>
										<span className="text-[11px] text-muted-foreground">
											ثبّت موعداً رسمياً في تقويم المركز لتحويل الطلب لطابور التقييم
										</span>
									</div>
								</div>
								<Button
									type="button"
									size="sm"
									className="h-7 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold gap-1 shrink-0 shadow-sm"
									onClick={() => setIsScheduleAssessmentOpen(true)}
								>
									<IconCalendarPlus className="size-3.5" />
									تثبيت الموعد
								</Button>
							</div>
						) : null}

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
									value={
										request.birthDate
											? new Date(request.birthDate).toLocaleDateString("ar-EG")
											: "غير محدد"
									}
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
									label="الفصل / المسار المطلوب"
									value={request.targetClass || "المسار التمهيدي"}
								/>
								<DetailRow
									icon={IconCalendar}
									label="تاريخ التقديم"
									value={request.date || "-"}
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
									value={request.bloodType || "غير محدد"}
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
										{request.allergies ? (
											<Badge
												variant="outline"
												className="bg-amber-50 text-amber-700 border-amber-200 text-[11px] font-medium px-2 py-0.5"
											>
												{request.allergies}
											</Badge>
										) : (
											<span className="text-xs text-muted-foreground">
												لا توجد حساسية مسجلة
											</span>
										)}
									</div>
								</div>

								<div className="flex items-center justify-between border rounded-[4px] p-2.5 bg-destructive/5 border-destructive/20 mt-1">
									<div className="flex items-center gap-2 text-destructive font-medium text-xs">
										<IconHeartbeat className="size-4" />
										<span>حالات صحية أو أمراض مزمنة</span>
									</div>
									<Switch
										checked={hasChronic}
										onCheckedChange={setHasChronic}
										className="data-[state=checked]:bg-destructive"
									/>
								</div>

								{hasChronic ? (
									<div className="rounded-[4px] border border-destructive/20 bg-destructive/5 p-2 text-center text-xs font-medium text-destructive">
										{request.chronicDiseases || "توجد حالات صحية مسجلة"}
									</div>
								) : (
									<div className="rounded-[4px] border border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-900 p-2 text-center text-xs font-medium text-emerald-700 dark:text-emerald-400">
										لا توجد حالات صحية مزمنة مسجلة
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
											<span>{request.guardianName || "-"}</span>
										</div>
									}
								/>
								<DetailRow
									icon={IconPhone}
									label="رقم الهاتف"
									value={
										request.guardianPhone ? (
											<a
												href={`tel:${request.guardianPhone}`}
												dir="ltr"
												className="tabular-nums font-mono text-xs text-primary hover:underline"
											>
												{request.guardianPhone}
											</a>
										) : (
											<span className="text-xs text-muted-foreground">-</span>
										)
									}
								/>
								<DetailRow
									icon={IconMail}
									label="البريد الإلكتروني"
									value={
										request.guardianEmail ? (
											<a
												href={`mailto:${request.guardianEmail}`}
												dir="ltr"
												className="font-mono text-xs text-primary hover:underline"
											>
												{request.guardianEmail}
											</a>
										) : (
											<span className="text-xs text-muted-foreground">-</span>
										)
									}
								/>
								{request.guardianNationalId && (
									<DetailRow
										icon={IconUserCircle}
										label="الهوية الوطنية / الإقامة"
										value={
											<span dir="ltr" className="font-mono text-xs text-foreground">
												{request.guardianNationalId}
											</span>
										}
									/>
								)}
							</div>
						</div>

						{/* إشعارات ولي الأمر (Notification Outbox) */}
						<div className="space-y-2">
							<div
								className="flex items-center justify-between gap-2"
								dir="rtl"
							>
								<span className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
									<IconBrandWhatsapp className="size-3.5 text-emerald-600" />
									صندوق إشعارات ولي الأمر
								</span>
								<span className="text-[10px] text-muted-foreground">
									{notifications.length > 0
										? `${notifications.length} رسائل`
										: "0 رسائل"}
								</span>
							</div>

							<div className="space-y-2">
								{isLoadingNotifications ? (
									<div className="rounded-[4px] border border-dashed p-3 text-center text-xs text-muted-foreground">
										جاري تحميل الإشعارات...
									</div>
								) : notifications.length === 0 ? (
									<div className="rounded-[4px] border border-dashed p-3 text-center text-xs text-muted-foreground bg-muted/20">
										لا توجد إشعارات مسجلة لهذا المتقدم بعد.
									</div>
								) : (
									notifications.map((item) => (
										<NotificationOutboxCard
											key={item.id}
											item={item}
											onMarkSent={handleMarkSent}
											isPending={markNotificationSentMutation.isPending}
										/>
									))
								)}
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
									{request.documents?.items?.length
										? `${request.documents.items.length} مستندات`
										: "0 مستندات"}
								</span>
							</div>
							<div className="space-y-1.5">
								{request.documents?.items && request.documents.items.length > 0 ? (
									request.documents.items.map((doc) => (
										<AttachmentRow
											key={doc.id}
											label={doc.title}
											size={doc.fileSize || "1.0 MB"}
											fileUrl={doc.fileUrl}
										/>
									))
								) : (
									<div className="rounded-[4px] border border-dashed p-3 text-center text-xs text-muted-foreground">
										لا توجد مستندات أو مرفقات مرفوعة مع هذا الطلب
									</div>
								)}
							</div>
						</div>

						{/* مسار الموافقات */}
						<div className="space-y-2">
							<span className="text-[11px] font-semibold text-foreground">
								سلسلة الموافقات
							</span>
							<div className="space-y-0 pt-1">
								{request.timeline && request.timeline.length > 0 ? (
									request.timeline.map((step, i) => (
										<TimelineStepItem
											key={step.id}
											step={{
												id: step.id,
												title: step.title,
												byName: step.actorName,
												statusBadge: step.statusBadge || undefined,
												status: step.isCompleted ? "done" : "active",
											}}
											isLast={i === (request.timeline?.length || 1) - 1}
										/>
									))
								) : (
									<TimelineStepItem
										step={{
											id: "step-initial",
											title: "تم استلام الطلب",
											byName: request.source ? `بوابة ${request.source}` : "بوابة التسجيل الرقمي",
											dateLabel: request.date,
											status: "done",
											statusBadge: "مكتمل",
										}}
										isLast={true}
									/>
								)}
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

				{/* لوحة التعليقات الجانبية — تظهر بجانب اللوحة الرئيسية من اليمين */}
				{commentsOpen && (
					<aside
						dir="rtl"
						aria-label="تعليقات الطلب"
						className="order-1 flex min-h-0 w-80 sm:w-96 shrink-0 flex-col rounded-lg border bg-popover text-sm text-popover-foreground shadow-lg animate-in fade-in-0 duration-200"
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

		{request && (
			<EditRequestDialog
				open={isEditDialogOpen}
				onOpenChange={setIsEditDialogOpen}
				request={request}
				campaignId={campaignId || ""}
			/>
		)}

		{request && (
			<ScheduleAssessmentDialog
				open={isScheduleAssessmentOpen}
				onOpenChange={setIsScheduleAssessmentOpen}
				request={request}
				campaignId={campaignId || ""}
			/>
		)}
	</>
	);
}

// تصدير متوافق باسم Dialog لتفادي أي مشاكل في الاستدعاء القديم
export { CampaignRequestSheet as CampaignRequestDialog };

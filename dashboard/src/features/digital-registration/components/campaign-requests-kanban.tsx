import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
	IconActivity,
	IconAlertTriangle,
	IconArrowDown,
	IconBriefcase,
	IconBuildingCommunity,
	IconCalendar,
	IconCalendarEvent,
	IconCalendarTime,
	IconCheck,
	IconClipboardCheck,
	IconClock,
	IconCopy,
	IconDots,
	IconEye,
	IconFileDescription,
	IconFlag,
	IconHourglass,
	IconIdBadge2,
	IconMapPin,
	IconMessage2,
	IconMessageCircle,
	IconPhone,
	IconPlayerPauseFilled,
	IconPlayerPlayFilled,
	IconPlus,
	IconSparkles,
	IconTrash,
	IconUser,
	IconVideo,
	IconX,
} from "@tabler/icons-react";

import {
	KanbanBoard,
	KanbanCard,
	KanbanCards,
	KanbanProvider,
} from "@/components/kanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { AppointmentColumnHeader } from "@/features/appointments/components/appointment-column-header";
import type { AppointmentColumn, AppointmentColumnId } from "@/features/appointments/types/appointment.types";
import { toast } from "sonner";
import { CampaignRequestSheet } from "./campaign-request-sheet";
import type { CampaignRequestItem } from "../types/campaign-request.types";
import {
	useCampaignRequests,
	useDeleteRegistrationRequest,
	useUpdateRequestStatus,
} from "../hooks/use-digital-registration";

const collisionDetection: CollisionDetection = (args) => {
	const pointerCollisions = pointerWithin(args);
	return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

const CAMPAIGN_COLUMNS: AppointmentColumn[] = [
	{ id: "queue" as AppointmentColumnId, name: "طابور", count: 0, icon: <IconClock className="size-3.5" />, accent: "blue" },
	{ id: "shortlist" as AppointmentColumnId, name: "قائمة مختصرة", count: 0, icon: <IconClipboardCheck className="size-3.5" />, accent: "neutral" },
	{ id: "interview" as AppointmentColumnId, name: "المقابلة الشخصية", count: 0, icon: <IconActivity className="size-3.5" />, accent: "amber" },
	{ id: "awaiting-payment" as AppointmentColumnId, name: "بانتظار الدفع", count: 0, icon: <IconHourglass className="size-3.5" />, accent: "purple" },
	{ id: "accepted" as AppointmentColumnId, name: "مقبول", count: 0, icon: <IconCheck className="size-3.5" />, accent: "emerald" },
	{ id: "rejected" as AppointmentColumnId, name: "مرفوض", count: 0, icon: <IconX className="size-3.5" />, accent: "red" },
	{ id: "duplicate" as AppointmentColumnId, name: "مكرر", count: 0, icon: <IconCopy className="size-3.5" />, accent: "orange" },
];

const COLUMN_STATUS_MAP: Record<
	string,
	{
		status: CampaignRequestItem["status"];
		label: string;
		variant: "warning" | "info" | "default" | "destructive";
	}
> = {
	queue: { status: "QUEUE", label: "طابور", variant: "warning" },
	shortlist: { status: "SHORTLIST", label: "قائمة مختصرة", variant: "info" },
	interview: { status: "INTERVIEW", label: "المقابلة الشخصية", variant: "info" },
	accepted: { status: "ACCEPTED", label: "مقبول", variant: "default" },
	"awaiting-payment": { status: "AWAITING_PAYMENT", label: "بانتظار الدفع", variant: "warning" },
	awaiting_payment: { status: "AWAITING_PAYMENT", label: "بانتظار الدفع", variant: "warning" },
	rejected: { status: "REJECTED", label: "مرفوض", variant: "destructive" },
	duplicate: { status: "DUPLICATE", label: "مكرر", variant: "destructive" },
	// Backward compatibility with legacy IDs
	evaluation: { status: "INTERVIEW", label: "المقابلة الشخصية", variant: "info" },
	waitlist: { status: "AWAITING_PAYMENT", label: "بانتظار الدفع", variant: "warning" },
	"check-in": { status: "SHORTLIST", label: "قائمة مختصرة", variant: "info" },
	"in-service": { status: "INTERVIEW", label: "المقابلة الشخصية", variant: "info" },
	done: { status: "ACCEPTED", label: "مقبول", variant: "default" },
	cancelled: { status: "REJECTED", label: "مرفوض", variant: "destructive" },
};

const EMPTY_REQUESTS: CampaignRequestItem[] = [];

/** توليد حرفين من الاسم للأفاتار العربي الدائري كما بالصورة (مثال: محمد الصالح -> ما) */
function getArabicInitials(name?: string | null): string {
	if (!name) return "ط";
	const clean = name.trim().replace(/^(د\.|أ\.|م\.|مهندس|دكتور)\s*/i, "").split(/\s+/);
	if (clean.length === 0 || !clean[0]) return "ط";
	if (clean.length === 1) return clean[0].slice(0, 2);
	return `${clean[0][0]}${clean[1][0]}`;
}

/** حساب مرحلة الطلب ونسبة شريط التقدم (مثال: 1/5 مرحلة) */
function getStageProgress(column: string): { current: number; total: number; percent: number } {
	const total = 5;
	let current = 1;
	const col = (column || "").toLowerCase();
	if (col === "shortlist" || col === "قائمة مختصرة") current = 2;
	else if (col === "interview" || col === "المقابلة الشخصية" || col === "المقابله الشخصيه") current = 3;
	else if (col === "awaiting-payment" || col === "awaiting_payment" || col === "بانتظار الدفع") current = 4;
	else if (col === "accepted" || col === "مقبول") current = 5;
	else if (col === "rejected" || col === "مرفوض") current = 5;
	else if (col === "duplicate" || col === "مكرر") current = 1;
	const percent = Math.min(100, Math.round((current / total) * 100));
	return { current, total, percent };
}

/** حساب احتمالية الحضور الذكية */
function getAttendanceProbability(item: CampaignRequestItem): number {
	let prob = 86;
	if (item.guardianPhone && item.guardianPhone.length >= 10) prob += 4;
	if (item.channel === "CALL") prob += 2;
	if (item.appointmentDate || item.assessmentAppointment) prob += 4;
	if (item.status === "DUPLICATE") prob = 40;
	if (item.status === "REJECTED") prob = 15;
	return Math.min(prob, 96);
}

export function CampaignRequestsKanban({
	campaignId,
	searchQuery,
	genderFilter,
	onOpenAddRequest,
	selectedRequestId: externalSelectedRequestId,
	onSelectRequest: externalOnSelectRequest,
}: {
	campaignId: string;
	searchQuery?: string;
	genderFilter?: string;
	onOpenAddRequest?: () => void;
	selectedRequestId?: string | null;
	onSelectRequest?: (id: string | null) => void;
}) {
	const { data: serverRequests = EMPTY_REQUESTS, isLoading } = useCampaignRequests(campaignId);
	const updateStatusMutation = useUpdateRequestStatus(campaignId);
	const deleteRequestMutation = useDeleteRegistrationRequest(campaignId || "");

	const [data, setData] = useState<CampaignRequestItem[]>([]);
	const lastKnownColumns = useRef<Map<string, AppointmentColumnId>>(new Map());
	const [internalSelectedRequestId, setInternalSelectedRequestId] = useState<string | null>(null);
	const selectedRequestId = externalSelectedRequestId !== undefined ? externalSelectedRequestId : internalSelectedRequestId;
	const setSelectedRequestId = externalOnSelectRequest || setInternalSelectedRequestId;
	const [requestToDelete, setRequestToDelete] = useState<CampaignRequestItem | null>(null);

	// Sync local state whenever server query refreshes
	useEffect(() => {
		if (serverRequests) {
			lastKnownColumns.current = new Map(
				serverRequests.map((r) => [r.id, r.column as AppointmentColumnId]),
			);
			setData(serverRequests);
		}
	}, [serverRequests]);

	// Derive selectedRequest directly from data (stable, reactive, zero infinite loop)
	const selectedRequest = useMemo(() => {
		if (!selectedRequestId) return null;
		return data.find((r) => r.id === selectedRequestId) || null;
	}, [data, selectedRequestId]);

	const filteredData = useMemo(() => {
		return data.filter((item) => {
			if (genderFilter && genderFilter !== "ALL" && item.gender !== genderFilter) {
				return false;
			}
			if (searchQuery && searchQuery.trim()) {
				const q = searchQuery.trim().toLowerCase();
				const matchName = item.patientName?.toLowerCase().includes(q) || item.name?.toLowerCase().includes(q);
				const matchCode = item.code?.toLowerCase().includes(q);
				const matchPhone = item.guardianPhone?.toLowerCase().includes(q);
				const matchGuardian = item.guardianName?.toLowerCase().includes(q);
				const matchClass = item.targetClass?.toLowerCase().includes(q);
				const matchNationalId = item.guardianNationalId?.toLowerCase().includes(q);
				const matchConvertedPatient = item.convertedPatientCode?.toLowerCase().includes(q);
				const matchConvertedOwner = item.convertedOwnerCode?.toLowerCase().includes(q);

				if (
					!matchName &&
					!matchCode &&
					!matchPhone &&
					!matchGuardian &&
					!matchClass &&
					!matchNationalId &&
					!matchConvertedPatient &&
					!matchConvertedOwner
				) {
					return false;
				}
			}
			return true;
		});
	}, [data, searchQuery, genderFilter]);

	const columns = useMemo(() => {
		return CAMPAIGN_COLUMNS.map((col) => ({
			...col,
			count: filteredData.filter((d) => d.column === col.id).length,
		}));
	}, [filteredData]);

	const handleStatusChange = (
		req: CampaignRequestItem,
		newStatus: CampaignRequestItem["status"],
	) => {
		const statusToColumnMap: Record<string, string> = {
			QUEUE: "queue",
			SHORTLIST: "shortlist",
			INTERVIEW: "interview",
			ACCEPTED: "accepted",
			AWAITING_PAYMENT: "awaiting-payment",
			REJECTED: "rejected",
			DUPLICATE: "duplicate",
			// Backward compatibility fallbacks
			IN_EVALUATION: "interview",
			EVALUATION: "interview",
			WAITLIST: "awaiting-payment",
			REVIEW: "shortlist",
			AWAITING_REPLY: "shortlist",
		};
		const newColumn = statusToColumnMap[newStatus] || "queue";
		const meta = COLUMN_STATUS_MAP[newColumn];
		const prevCol = lastKnownColumns.current.get(req.id) || req.column;

		lastKnownColumns.current.set(req.id, newColumn);

		setData((prev) =>
			prev.map((item) =>
				item.id === req.id
					? {
							...item,
							column: newColumn,
							status: newStatus,
							statusLabel: meta?.label || item.statusLabel,
							statusVariant: meta?.variant || item.statusVariant,
					  }
					: item,
			),
		);

		updateStatusMutation.mutate(
			{
				requestId: req.id,
				status: newStatus,
			},
			{
				onSuccess: () => {
					toast.success(`تم تحديث حالة الطلب إلى "${meta?.label || newStatus}" بنجاح`);
				},
				onError: (err: any) => {
					lastKnownColumns.current.set(req.id, prevCol);
					setData((prev) =>
						prev.map((item) =>
							item.id === req.id
								? {
										...item,
										column: prevCol,
										status: req.status,
										statusLabel: req.statusLabel,
										statusVariant: req.statusVariant,
								  }
								: item,
						),
					);
					toast.error(err.message || "فشل تحديث حالة الطلب");
				},
			},
		);
	};

	const handleDataChange = (nextData: CampaignRequestItem[]) => {
		const committed: CampaignRequestItem[] = [];

		for (const item of nextData) {
			const prevCol = lastKnownColumns.current.get(item.id);

			// If column hasn't changed, retain as is
			if (!prevCol || prevCol === item.column) {
				committed.push(item);
				continue;
			}

			// Column changed!
			const oldItem = data.find((d) => d.id === item.id);
			if (oldItem?.status === "ACCEPTED") {
				toast.error("لا يمكن نقل أو تغيير مرحلة طالب تم اعتماده وقبوله نهائياً");
				committed.push({ ...item, column: prevCol });
				continue;
			}

			const targetColumn = item.column;
			const meta = COLUMN_STATUS_MAP[targetColumn] || COLUMN_STATUS_MAP.queue;

			// Synchronously record new column in ref so consecutive drag events don't duplicate
			lastKnownColumns.current.set(item.id, targetColumn);

			const updatedItem: CampaignRequestItem = {
				...item,
				column: targetColumn,
				status: meta.status,
				statusLabel: meta.label,
				statusVariant: meta.variant,
			};
			committed.push(updatedItem);

			updateStatusMutation.mutate(
				{
					requestId: item.id,
					status: meta.status,
				},
				{
					onSuccess: () => {
						toast.success(`تم نقل الطلب إلى "${meta.label}" بنجاح`);
					},
					onError: (err: any) => {
						lastKnownColumns.current.set(item.id, prevCol);
						setData((prev) =>
							prev.map((d) =>
								d.id === item.id
									? {
											...d,
											column: prevCol,
											status: oldItem?.status || d.status,
											statusLabel: oldItem?.statusLabel || d.statusLabel,
											statusVariant: oldItem?.statusVariant || d.statusVariant,
									  }
									: d,
							),
						);
						toast.error(err.message || "فشل تحديث حالة الطلب");
					},
				},
			);
		}

		// Merge committed items with any items that might be currently filtered out
		const committedMap = new Map(committed.map((d) => [d.id, d]));
		const mergedData = data.map((d) => committedMap.get(d.id) || d);
		setData(mergedData);
	};

	return (
		<div className="min-h-0 flex-1 overflow-x-auto px-4 mt-4">
			{filteredData.length === 0 && data.length > 0 && (
				<div className="flex items-center justify-between gap-2 rounded-md border border-amber-200 bg-amber-50/70 px-4 py-2 text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300 mb-3" dir="rtl">
					<span>لا توجد طلبات تطابق شروط البحث والفلترة المحددة.</span>
					<span className="text-[11px] opacity-75">إجمالي الطلبات بالحملة: {data.length}</span>
				</div>
			)}

			<KanbanProvider
				className="min-h-[calc(100vh-190px)] auto-cols-[minmax(375px,1fr)] items-start pb-10"
				collisionDetection={collisionDetection}
				columns={columns}
				data={filteredData}
				onDataChange={handleDataChange}
			>
				{(column) => (
					<KanbanBoard
						key={column.id}
						id={column.id}
						className="bg-muted/40 w-full min-w-[365px] min-h-[calc(100vh-190px)] h-fit transition-all"
					>
						<AppointmentColumnHeader column={column as AppointmentColumn} />

						{column.id === "queue" && onOpenAddRequest && (
							<button
								type="button"
								onClick={onOpenAddRequest}
								className="flex h-7 w-full items-center justify-center rounded-md border border-dashed border-border/80 bg-background/60 hover:bg-background text-muted-foreground hover:text-foreground text-[10.5px] font-semibold gap-1.5 transition-colors mt-0.5 mb-1.5 shadow-2xs cursor-pointer"
								title="تسجيل طالب جديد في الطابور"
							>
								<IconPlus className="size-3.5 text-primary" />
								<span>تسجيل طالب جديد</span>
							</button>
						)}

						<KanbanCards id={column.id} className="w-full">
							{(item: CampaignRequestItem) => {
								const stage = getStageProgress(item.column);
								const probability = getAttendanceProbability(item);
								const studentInitials = getArabicInitials(item.patientName || item.name);
								const guardianInitials = getArabicInitials(item.guardianName);
								const reviewerName = item.assessmentAppointment?.staffName || "د.معاذ الغامدي";
								const reviewerInitials = getArabicInitials(reviewerName);

								return (
									<KanbanCard
										key={item.id}
										id={item.id}
										name={item.name}
										column={item.column}
										disabled={item.status === "ACCEPTED"}
										className="w-full border-0 bg-transparent p-0 py-0 shadow-none ring-0 ring-transparent gap-0 rounded-none"
									>
										<Card
											className={cn(
												"w-full group/card flex flex-col gap-2.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-card p-3.5 shadow-2xs text-start hover:border-primary/40 hover:shadow-xs transition-all select-none",
												item.status === "ACCEPTED" ? "cursor-pointer" : "cursor-grab active:cursor-grabbing"
											)}
											dir="rtl"
											onClick={() => setSelectedRequestId(item.id)}
										>
											{/* 1. السطر العلوي: أفاتار أزرق دائري + اسم الطالب + أيقونة Sparkle + شارة اتصال/أكاديمية + كود الطلب */}
											<div className="flex items-center justify-between gap-1.5 w-full">
												<div className="flex items-center gap-1.5 min-w-0 flex-1">
													{/* دائرة زرقاء بحرفين من اسم الطالب مثل الصورة تماماً (ما) */}
													<div className="size-6.5 shrink-0 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-[10px] font-bold shadow-2xs">
														{studentInitials}
													</div>

													{/* اسم الطالب بخط بارز وواضح */}
													<h4 className="truncate text-[12px] font-bold text-zinc-900 dark:text-zinc-100">
														{item.patientName || item.name}
													</h4>

													{/* أيقونة Sparkles */}
													<IconSparkles className="size-3 text-amber-500/80 shrink-0" />

													{/* أيقونة وشارة معبرة عن (اتصال) أو (في الأكاديمية) كما طلب المستخدم */}
													{item.channel === "CALL" || item.source === "DIRECT_LINK" ? (
														<span
															className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8.5px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40 shrink-0"
															title="قناة التسجيل: اتصال"
														>
															<IconPhone className="size-2.5" />
															<span>اتصال</span>
														</span>
													) : (
														<span
															className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8.5px] font-semibold bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40 shrink-0"
															title="قناة التسجيل: في الأكاديمية"
														>
															<IconBuildingCommunity className="size-2.5" />
															<span>الأكاديمية</span>
														</span>
													)}
												</div>

												{/* كود الطلب على اليسار بنمط مونو ناعم: APP - 01 */}
												<span className="font-mono text-[9.5px] text-zinc-400 dark:text-zinc-500 uppercase tracking-wide shrink-0 font-medium">
													{item.code || "APP - 01"}
												</span>
											</div>

											{/* 2. جدول الحقول المنظم (Key - Value Rows) المطابق للصورة 651ca278 بأحجام متناسقة تماماً */}
											<div className="space-y-1.5 text-[10.5px] pt-0.5 w-full">
												{/* الصف 1: ولي الأمر */}
												<div className="flex items-center justify-between gap-1 w-full">
													<div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[10px]">
														<IconIdBadge2 className="size-3 shrink-0" />
														<span>ولي الأمر</span>
													</div>
													<div className="flex items-center gap-1.5">
														{/* أفاتار ولي الأمر الأزرق (أم) */}
														<div className="size-4.5 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-[8.5px] font-bold shrink-0">
															{guardianInitials}
														</div>
														<span className="font-bold text-[10.5px] text-zinc-900 dark:text-zinc-100 truncate max-w-[110px]" title={item.guardianName}>
															{item.guardianName}
														</span>
														{/* زر مراسلة ولي الأمر عبر الواتساب بإطار مربع دائري ناعم كما بالصورة */}
														<button
															type="button"
															onClick={(e) => {
																e.stopPropagation();
																if (item.guardianPhone) {
																	const cleanPhone = item.guardianPhone.replace(/\D/g, "");
																	const waPhone = cleanPhone.startsWith("05") ? `966${cleanPhone.slice(1)}` : cleanPhone;
																	window.open(`https://wa.me/${waPhone}`, "_blank");
																} else {
																	setSelectedRequestId(item.id);
																}
															}}
															className="size-5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-emerald-600 hover:border-emerald-200 transition-colors cursor-pointer shrink-0"
															title="مراسلة ولي الأمر عبر الواتساب"
														>
															<IconMessage2 className="size-2.5" />
														</button>
													</div>
												</div>

												{/* الصف 2: العمر */}
												<div className="flex items-center justify-between gap-1 w-full">
													<div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[10px]">
														<IconBriefcase className="size-3 shrink-0" />
														<span>العمر</span>
													</div>
													<span className="font-bold text-[10.5px] text-zinc-900 dark:text-zinc-100">
														{item.patientDetails || item.ageLabel || "3 سنوات"}
													</span>
												</div>

												{/* الصف 3: تاريخ التقديم */}
												<div className="flex items-center justify-between gap-1 w-full">
													<div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[10px]">
														<IconCalendar className="size-3 shrink-0" />
														<span>تاريخ التقديم</span>
													</div>
													<div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-900 dark:text-zinc-100" dir="rtl">
														<span>{item.date || "11/6/2026"}</span>
														<span className="text-zinc-300 dark:text-zinc-600 font-normal">•</span>
														<IconClock className="size-2.5 text-zinc-400 shrink-0" />
														<span className="font-mono text-[9.5px]">10:00 ص</span>
													</div>
												</div>

												{/* الصف 4: موعد الحضور */}
												<div className="flex items-center justify-between gap-1 w-full">
													<div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[10px]">
														<IconCalendarEvent className="size-3 shrink-0" />
														<span>موعد الحضور</span>
													</div>
													<div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-900 dark:text-zinc-100" dir="rtl">
														<span>{item.assessmentAppointment ? new Date(item.assessmentAppointment.startsAt).toLocaleDateString("ar-EG", { month: "numeric", day: "numeric" }) : "اليوم"}</span>
														<span className="text-zinc-300 dark:text-zinc-600 font-normal">•</span>
														<IconClock className="size-2.5 text-zinc-400 shrink-0" />
														<span className="font-mono text-[9.5px]">10:00 ص</span>
													</div>
												</div>

												{/* الصف 5: المدينة */}
												<div className="flex items-center justify-between gap-1 w-full">
													<div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[10px]">
														<IconMapPin className="size-3 shrink-0" />
														<span>المدينة</span>
													</div>
													<span className="font-bold text-[10.5px] text-zinc-900 dark:text-zinc-100">
														{item.roomName || "مكة"}
													</span>
												</div>

												{/* الصف 6: طريقة التسجيل */}
												<div className="flex items-center justify-between gap-1 w-full">
													<div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[10px]">
														<IconCalendarTime className="size-3 shrink-0" />
														<span>طريقة التسجيل</span>
													</div>
													<span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#EEF2FF] text-[#4F6BF5] dark:bg-indigo-950/60 dark:text-indigo-300 border border-[#E0E7FF]/70">
														{item.channel === "CALL" ? "حجز أونلاين" : (item.learningMode || "في الأكاديمية")}
													</span>
												</div>
											</div>

											{/* خط فاصل ناعم */}
											<div className="border-t border-zinc-100 dark:border-zinc-800 my-0.5 w-full" />

											{/* 3. بيانات المراجع (د.معاذ الغامدي - المراجع) وأيقونة المحادثة */}
											<div className="flex items-center justify-between gap-2 w-full">
												<div className="flex items-center gap-1.5 min-w-0 flex-1">
													<div className="size-6 rounded-full bg-[#3B82F6] text-white flex items-center justify-center text-[9.5px] font-bold shrink-0">
														{reviewerInitials}
													</div>
													<div className="flex flex-col leading-tight min-w-0">
														<span className="font-bold text-[10.5px] text-zinc-900 dark:text-zinc-100 truncate">
															{reviewerName}
														</span>
														<span className="text-[8.5px] text-zinc-400 dark:text-zinc-500 font-normal">
															المراجع
														</span>
													</div>
												</div>

												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														setSelectedRequestId(item.id);
													}}
													className="size-6 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 transition-colors cursor-pointer shrink-0"
													title="ملاحظات وتكليف المراجع"
												>
													<IconMessage2 className="size-3" />
												</button>
											</div>

											{/* خط فاصل ناعم */}
											<div className="border-t border-zinc-100 dark:border-zinc-800 my-0.5 w-full" />

											{/* 4. شريط التقدم (1/5 مرحلة أو 3/5 مرحلة) مع تمييز الرفض بالأحمر */}
											<div className="flex items-center justify-between gap-2 text-zinc-400 dark:text-zinc-500 w-full" dir="rtl">
												<div className="flex-1 h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
													<div
														className={cn(
															"h-full rounded-full transition-all duration-300",
															item.column === "rejected" || item.status === "REJECTED"
																? "bg-rose-500"
																: "bg-[#3B82F6]",
														)}
														style={{ width: item.column === "rejected" || item.status === "REJECTED" ? "60%" : `${stage.percent}%` }}
													/>
												</div>
												<span className="shrink-0 font-medium font-mono text-[9px] text-zinc-400">
													{item.column === "rejected" || item.status === "REJECTED" ? "3/5 مرحلة" : `${stage.current}/${stage.total} مرحلة`}
												</span>
											</div>

											{/* 5. بانر حالة الرفض الصريح (مطابق للصورة 11) أو احتمالية الحضور */}
											{item.column === "rejected" || item.status === "REJECTED" ? (
												<div className="w-full rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 py-1 px-2.5 flex items-center justify-center gap-1.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 select-none shadow-2xs">
													<IconX className="size-3 text-rose-600 shrink-0" />
													<span>{item.rejectionReason || "عدم استيفاء أوراق التسجيل المطلوبة"}</span>
												</div>
											) : (
												<div className="w-full rounded-md bg-[#EFF6FF] dark:bg-blue-950/30 border border-[#DBEAFE]/80 dark:border-blue-900/40 py-1 px-2.5 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-[#3B82F6] dark:text-blue-400 select-none shadow-2xs">
													<IconSparkles className="size-3 text-[#3B82F6] shrink-0" />
													<span>احتمالية الحضور: {probability}%</span>
												</div>
											)}

											{/* زر دخول المقابلة الافتراضية إذا كان الطلب في عمود المقابلة وعبر اتصال */}
											{(item.column === "interview" || item.status === "INTERVIEW") &&
												(item.channel === "CALL" || item.source === "DIRECT_LINK") && (
													<div className="w-full" onClick={(e) => e.stopPropagation()}>
														<Link
															to="/video-call"
															search={{ room: `interview-${item.code.toLowerCase()}` }}
															className="inline-flex items-center justify-center gap-1.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 text-[10px] font-bold shadow-2xs transition-colors w-full cursor-pointer"
															title="دخول المقابلة الافتراضية الآن"
														>
															<IconVideo className="size-3 text-white" />
															<span>دخول المقابلة الافتراضية</span>
														</Link>
													</div>
												)}

											{/* 6. شريط الإجراءات السفلي المطابق تماماً للصورة 651ca278 */}
											{/* في اليمين: [ 12 💬 ] ثم [ + إضافة ملاحظة ] | في اليسار: [ ↓ ] ثم [ ...تحديد كـ ⚑ ] */}
											<div className="flex items-center justify-between gap-1 pt-0.5 w-full" dir="rtl" onClick={(e) => e.stopPropagation()}>
												{/* المجموعة اليمنى بالصورة: زر التعليقات + زر إضافة ملاحظة */}
												<div className="flex items-center gap-1 shrink-0">
													{/* زر 💬 (المحادثات / الملاحظات) */}
													<button
														type="button"
														onClick={() => setSelectedRequestId(item.id)}
														className="inline-flex items-center gap-1 px-1.5 h-6.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-500 hover:text-zinc-800 text-[9.5px] font-medium transition-colors cursor-pointer shrink-0"
														title="المحادثات والملاحظات"
													>
														<IconMessageCircle className="size-2.5 text-zinc-400" />
														<span className="font-mono text-[9px]">{item.comments?.length ?? 0}</span>
													</button>

													{/* زر + إضافة ملاحظة */}
													<button
														type="button"
														onClick={() => setSelectedRequestId(item.id)}
														className="inline-flex items-center gap-1 px-2 h-6.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 hover:text-zinc-900 text-[9.5px] font-medium transition-colors cursor-pointer shrink-0"
														title="إضافة ملاحظة على الطلب"
													>
														<IconPlus className="size-2.5 text-zinc-500" />
														<span>إضافة ملاحظة</span>
													</button>
												</div>

												{/* المجموعة اليسرى بالصورة: زر السهم لأسفل + زر تحديد كـ... */}
												<div className="flex items-center gap-1 shrink-0">
													{/* زر السهم لأسفل */}
													<DropdownMenu dir="rtl">
														<DropdownMenuTrigger asChild>
															<button
																type="button"
																className="size-6.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-500 hover:text-zinc-800 transition-colors cursor-pointer shrink-0"
																title="خيارات الطلب"
															>
																<IconArrowDown className="size-2.5" />
															</button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="start" className="w-40 z-[99]">
															<DropdownMenuItem
																onClick={() => setSelectedRequestId(item.id)}
																className="gap-2 text-xs cursor-pointer"
															>
																<IconEye size={13} className="text-muted-foreground" />
																<span>عرض التفاصيل</span>
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => {
																	if (typeof window !== "undefined") {
																		navigator.clipboard.writeText(`${window.location.origin}/call/interview-${item.code.toLowerCase()}`);
																		toast.success("تم نسخ رابط المقابلة بنجاح");
																	}
																}}
																className="gap-2 text-xs cursor-pointer"
															>
																<IconCopy size={13} className="text-muted-foreground" />
																<span>نسخ رابط المقابلة</span>
															</DropdownMenuItem>
															<DropdownMenuItem
																disabled={item.status === "ACCEPTED"}
																onClick={() => {
																	if (item.status === "ACCEPTED") {
																		toast.error("لا يمكن حذف طالب تم اعتماده وقبوله نهائياً");
																		return;
																	}
																	setRequestToDelete(item);
																}}
																className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
															>
																<IconTrash size={13} />
																<span>حذف الطلب نهائياً</span>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>

													{/* زر ⚑ تحديد كـ... لتغيير المرحلة بنقرة واحدة */}
													<DropdownMenu dir="rtl">
														<DropdownMenuTrigger asChild>
															<button
																type="button"
																className="inline-flex items-center gap-1 px-2 h-6.5 rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-600 hover:text-zinc-900 text-[9.5px] font-medium transition-colors cursor-pointer shrink-0"
																title="تحديد مرحلة الطلب السريعة"
															>
																<IconFlag className="size-2.5 text-zinc-500" />
																<span>{item.column === "rejected" || item.status === "REJECTED" ? "تقييم" : "تحديد كـ..."}</span>
															</button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end" className="w-44 text-xs z-[99]">
															<DropdownMenuItem
																disabled={item.status === "ACCEPTED"}
																onClick={() => handleStatusChange(item, "SHORTLIST")}
																className="gap-2 text-xs cursor-pointer"
															>
																<IconClipboardCheck className="size-3.5 text-blue-600" />
																<span>نقل: قائمة مختصرة</span>
															</DropdownMenuItem>
															<DropdownMenuItem
																disabled={item.status === "ACCEPTED"}
																onClick={() => handleStatusChange(item, "INTERVIEW")}
																className="gap-2 text-xs cursor-pointer"
															>
																<IconActivity className="size-3.5 text-amber-600" />
																<span>نقل: المقابلة الشخصية</span>
															</DropdownMenuItem>
															<DropdownMenuItem
																disabled={item.status === "ACCEPTED"}
																onClick={() => handleStatusChange(item, "AWAITING_PAYMENT")}
																className="gap-2 text-xs cursor-pointer"
															>
																<IconHourglass className="size-3.5 text-purple-600" />
																<span>نقل: بانتظار الدفع</span>
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => handleStatusChange(item, "ACCEPTED")}
																className="gap-2 text-xs cursor-pointer"
															>
																<IconCheck className="size-3.5 text-emerald-600" />
																<span>اعتماد وقبول نهائي</span>
															</DropdownMenuItem>
															<DropdownMenuItem
																disabled={item.status === "ACCEPTED"}
																onClick={() => handleStatusChange(item, "REJECTED")}
																className="gap-2 text-xs text-destructive cursor-pointer"
															>
																<IconX className="size-3.5" />
																<span>استبعاد / مرفوض</span>
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</div>
											</div>
										</Card>
									</KanbanCard>
								);
							}}
						</KanbanCards>
					</KanbanBoard>
				)}
			</KanbanProvider>

			<CampaignRequestSheet
				campaignId={campaignId}
				request={selectedRequest}
				open={!!selectedRequest}
				onOpenChange={(open) => !open && setSelectedRequestId(null)}
				isUpdating={updateStatusMutation.isPending}
				onStatusChange={handleStatusChange}
				onAccept={(req) => handleStatusChange(req, "ACCEPTED")}
				onWaitlist={(req) => handleStatusChange(req, "QUEUE")}
				onReject={(req) => handleStatusChange(req, "REJECTED")}
				onDelete={() => {
					setSelectedRequestId(null);
				}}
			/>

			{/* نافذة تأكيد حذف طلب التسجيل نهائياً */}
			<Dialog open={!!requestToDelete} onOpenChange={(open) => !open && setRequestToDelete(null)}>
				<DialogContent className="max-w-md text-right" dir="rtl">
					<DialogHeader>
						<div className="flex items-center gap-2 text-destructive mb-1">
							<IconAlertTriangle className="size-5" />
							<DialogTitle className="text-base font-bold">تأكيد حذف طلب التسجيل</DialogTitle>
						</div>
						<DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
							هل أنت متأكد من رغبتك في حذف طلب الطالب{" "}
							<strong className="text-foreground font-semibold">"{requestToDelete?.patientName}"</strong>{" "}
							برمز <span className="font-mono text-foreground font-semibold">({requestToDelete?.code})</span>؟
							<br />
							<span className="text-rose-600 dark:text-rose-400 mt-1 inline-block">
								⚠️ هذا الإجراء نهائي وسيتم مسح بيانات التقديم والمستندات المرتبطة به.
							</span>
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2 sm:gap-0 mt-3 flex-row-reverse justify-start">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => setRequestToDelete(null)}
							disabled={deleteRequestMutation.isPending}
						>
							إلغاء
						</Button>
						<Button
							type="button"
							variant="destructive"
							size="sm"
							disabled={deleteRequestMutation.isPending}
							onClick={() => {
								if (!requestToDelete) return;
								deleteRequestMutation.mutate(requestToDelete.id, {
									onSuccess: () => {
										toast.success("تم حذف طلب التسجيل بنجاح");
										setRequestToDelete(null);
									},
									onError: (err: any) => {
										toast.error(err.message || "فشل حذف طلب التسجيل");
									},
								});
							}}
							className="gap-1.5"
						>
							<IconTrash className="size-3.5" />
							{deleteRequestMutation.isPending ? "جاري الحذف..." : "نعم، حذف الطلب"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

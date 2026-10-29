import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import {
	IconActivity,
	IconAlertTriangle,
	IconCalendar,
	IconCheck,
	IconClipboardCheck,
	IconClock,
	IconDots,
	IconEye,
	IconFileDescription,
	IconHourglass,
	IconPlayerPauseFilled,
	IconPlayerPlayFilled,
	IconPlus,
	IconTrash,
	IconUser,
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
	{ id: "queue" as AppointmentColumnId, name: "طابور", count: 0, icon: <IconClock className="size-4" />, accent: "blue" },
	{ id: "shortlist" as AppointmentColumnId, name: "القائمة المختصرة", count: 0, icon: <IconClipboardCheck className="size-4" />, accent: "neutral" },
	{ id: "interview" as AppointmentColumnId, name: "المقابلة الشخصية", count: 0, icon: <IconActivity className="size-4" />, accent: "amber" },
	{ id: "evaluation" as AppointmentColumnId, name: "داخل التقييم", count: 0, icon: <IconPlayerPlayFilled className="size-4" />, accent: "amber" },
	{ id: "waitlist" as AppointmentColumnId, name: "قائمة الانتظار", count: 0, icon: <IconHourglass className="size-4" />, accent: "purple" },
	{ id: "accepted" as AppointmentColumnId, name: "مقبول", count: 0, icon: <IconCheck className="size-4" />, accent: "emerald" },
	{ id: "rejected" as AppointmentColumnId, name: "مرفوض", count: 0, icon: <IconX className="size-4" />, accent: "red" },
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
	shortlist: { status: "SHORTLIST", label: "القائمة المختصرة", variant: "info" },
	interview: { status: "INTERVIEW", label: "المقابلة الشخصية", variant: "info" },
	evaluation: { status: "IN_EVALUATION", label: "داخل التقييم", variant: "info" },
	waitlist: { status: "WAITLIST", label: "قائمة الانتظار", variant: "warning" },
	accepted: { status: "ACCEPTED", label: "مقبول", variant: "default" },
	rejected: { status: "REJECTED", label: "مرفوض", variant: "destructive" },
	// Backward compatibility with legacy appointment IDs
	"check-in": { status: "SHORTLIST", label: "القائمة المختصرة", variant: "info" },
	"in-service": { status: "INTERVIEW", label: "المقابلة الشخصية", variant: "info" },
	"awaiting-payment": { status: "WAITLIST", label: "قائمة الانتظار", variant: "warning" },
	done: { status: "ACCEPTED", label: "مقبول", variant: "default" },
	cancelled: { status: "REJECTED", label: "مرفوض", variant: "destructive" },
};

const EMPTY_REQUESTS: CampaignRequestItem[] = [];

export function CampaignRequestsKanban({
	campaignId,
	searchQuery,
	genderFilter,
	onOpenAddRequest,
}: {
	campaignId: string;
	searchQuery?: string;
	genderFilter?: string;
	onOpenAddRequest?: () => void;
}) {
	const { data: serverRequests = EMPTY_REQUESTS, isLoading } = useCampaignRequests(campaignId);
	const updateStatusMutation = useUpdateRequestStatus(campaignId);
	const deleteRequestMutation = useDeleteRegistrationRequest(campaignId || "");

	const [data, setData] = useState<CampaignRequestItem[]>([]);
	const lastKnownColumns = useRef<Map<string, AppointmentColumnId>>(new Map());
	const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
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
			IN_EVALUATION: "evaluation",
			EVALUATION: "evaluation",
			WAITLIST: "waitlist",
			REVIEW: "shortlist",
			AWAITING_REPLY: "waitlist",
			ACCEPTED: "accepted",
			REJECTED: "rejected",
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
				className="h-full auto-cols-[minmax(20rem,1fr)]"
				collisionDetection={collisionDetection}
				columns={columns}
				data={filteredData}
				onDataChange={handleDataChange}
			>
				{(column) => (
					<KanbanBoard
						key={column.id}
						id={column.id}
						className="bg-muted/40"
					>
						<AppointmentColumnHeader column={column as AppointmentColumn} />

						{column.id === "queue" && onOpenAddRequest && (
							<button
								type="button"
								onClick={onOpenAddRequest}
								className="flex h-8 w-full items-center justify-center rounded-md border border-dashed border-border/80 bg-background/60 hover:bg-background text-muted-foreground hover:text-foreground text-xs gap-1 transition-colors mt-1 mb-2 shadow-2xs"
								title="تسجيل طالب جديد في الطابور"
							>
								<IconPlus className="size-3.5" />
							</button>
						)}

						<KanbanCards id={column.id}>
							{(item: CampaignRequestItem) => (
								<KanbanCard
									key={item.id}
									id={item.id}
									name={item.name}
									column={item.column}
									disabled={item.status === "ACCEPTED"}
									className="border-0 bg-transparent p-0 shadow-none"
								>
									<Card
										className={cn(
											"flex flex-col gap-3 rounded-md border bg-background p-3 shadow-sm text-start hover:border-primary/50 transition-colors",
											item.status === "ACCEPTED" ? "cursor-pointer" : "cursor-grab"
										)}
										dir="rtl"
										onClick={() => setSelectedRequestId(item.id)}
									>
										{/* Top row: Status Badge and Code */}
										<div className="flex items-start justify-between gap-2">
											<div className="flex items-center gap-1.5">
												<span className="text-[13px] font-medium text-muted-foreground">
													{item.code}
												</span>
												{/* قائمة الإجراءات السريعة (3 نقط) */}
												<DropdownMenu dir="rtl">
													<DropdownMenuTrigger asChild>
														<button
															type="button"
															onClick={(e) => {
																e.stopPropagation();
															}}
															className="size-6 rounded-md hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
															title="خيارات الطلب"
														>
															<IconDots size={13} />
														</button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="start"
														className="w-40 z-[99]"
														onClick={(e) => e.stopPropagation()}
													>
														<DropdownMenuItem
															onClick={(e) => {
																e.stopPropagation();
																setSelectedRequestId(item.id);
															}}
															className="gap-2 text-xs cursor-pointer"
														>
															<IconEye size={14} className="text-muted-foreground" />
															<span>عرض التفاصيل</span>
														</DropdownMenuItem>
														<DropdownMenuItem
															disabled={item.status === "ACCEPTED"}
															onClick={(e) => {
																e.stopPropagation();
																if (item.status === "ACCEPTED") {
																	toast.error("لا يمكن حذف طالب تم اعتماده وقبوله نهائياً");
																	return;
																}
																setRequestToDelete(item);
															}}
															className="gap-2 text-xs text-destructive focus:text-destructive cursor-pointer"
														>
															<IconTrash size={14} />
															<span>حذف الطلب نهائياً</span>
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
											{(() => {
												const cardMeta = COLUMN_STATUS_MAP[item.column as AppointmentColumnId] || {
													status: item.status,
													label: item.statusLabel,
													variant: item.statusVariant,
												};
												return (
													<Badge
														variant="outline"
														className={cn(
															"gap-1 py-1 px-3 text-[11px] font-semibold border",
															cardMeta.variant === "warning" &&
																"border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
															cardMeta.variant === "info" &&
																"border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
															cardMeta.variant === "default" &&
																"border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
														)}
													>
														{cardMeta.variant === "warning" && (
															<IconPlayerPauseFilled size={12} className="me-1" />
														)}
														{cardMeta.label}
													</Badge>
												);
											})()}
										</div>

										{/* Middle row: Patient info and Date */}
										<div className="flex items-start justify-between gap-2">
											<div className="flex items-start gap-3">
												<div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-500 border border-pink-100 dark:bg-pink-950 dark:border-pink-900 dark:text-pink-400 mt-0.5">
													<IconUser size={14} />
												</div>
												<div className="flex flex-col gap-0.5">
													<h3 className="truncate text-[15px] font-bold text-foreground">
														{item.patientName}
													</h3>
													<span className="text-[12px] text-muted-foreground">
														{item.patientDetails}
													</span>
												</div>
											</div>
											<span className="text-xs text-muted-foreground mt-1">{item.date}</span>
										</div>

										{/* Guardian & Tags */}
										<div className="flex flex-col gap-1.5 pe-11">
											<span className="text-[12px] text-muted-foreground mb-1">
												{item.guardianName}
											</span>
											{item.convertedPatientId && (
												<div className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 w-fit">
													<IconCheck size={12} className="shrink-0" />
													<span>طالب معتمد</span>
													{item.convertedPatientCode && (
														<span className="font-mono text-[9px] opacity-80" dir="ltr">
															{item.convertedPatientCode}
														</span>
													)}
												</div>
											)}
											{item.assessmentAppointment && (
												<div className="inline-flex items-center gap-1 rounded bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 text-[10px] font-bold dark:bg-purple-950/40 dark:border-purple-800 dark:text-purple-300 w-fit">
													<IconCalendar size={12} className="shrink-0 text-purple-600" />
													<span>موعد تقييم: {new Date(item.assessmentAppointment.startsAt).toLocaleDateString("ar-EG", { month: "numeric", day: "numeric" })}</span>
												</div>
											)}
											{item.tags.length > 0 && (
												<div className="flex flex-col items-start gap-1.5">
													{item.tags.map((tag, idx) => (
														<Badge
															key={idx}
															variant="outline"
															className={cn(
																"gap-1 py-0.5 px-2 text-[10px] font-medium rounded-sm border-0",
																tag.variant === "warning" &&
																	"bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
																tag.variant === "destructive" &&
																	"bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400",
															)}
														>
															{tag.label}
														</Badge>
													))}
												</div>
											)}
										</div>

										{/* Bottom row: Documents */}
										<div className="-mx-3 -mb-3 flex items-center justify-between gap-2 border-t px-3 pb-3 pt-2.5 mt-2">
											<div className="flex min-w-0 items-center gap-1.5 text-[11px]">
												<IconFileDescription className="size-3.5 shrink-0 text-muted-foreground" />
												<span className="truncate text-muted-foreground">
													{item.documents.count}/{item.documents.total} مستندات
												</span>
											</div>
											{item.documents.status && (
												<span
													className={cn(
														"truncate font-semibold text-[11px]",
														item.documents.status === "ناقص"
															? "text-amber-500"
															: "text-emerald-500",
													)}
												>
													{item.documents.status}
												</span>
											)}
										</div>
									</Card>
								</KanbanCard>
							)}
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
				onDelete={(req) => {
					setSelectedRequestId(null);
					setRequestToDelete(req);
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

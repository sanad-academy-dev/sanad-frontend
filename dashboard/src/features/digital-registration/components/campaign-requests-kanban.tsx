import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import {
	IconActivity,
	IconCalendar,
	IconCheck,
	IconClipboardCheck,
	IconClock,
	IconFileDescription,
	IconHourglass,
	IconPlayerPauseFilled,
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
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AppointmentColumnHeader } from "@/features/appointments/components/appointment-column-header";
import type { AppointmentColumn, AppointmentColumnId } from "@/features/appointments/types/appointment.types";
import { CampaignRequestSheet } from "./campaign-request-sheet";
import type { CampaignRequestItem } from "../types/campaign-request.types";
import { useCampaignRequests, useUpdateRequestStatus } from "../hooks/use-digital-registration";

const collisionDetection: CollisionDetection = (args) => {
	const pointerCollisions = pointerWithin(args);
	return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

const CAMPAIGN_COLUMNS: AppointmentColumn[] = [
	{ id: "queue" as AppointmentColumnId, name: "طابور الانتظار", count: 0, icon: <IconClock className="size-4" />, accent: "neutral" },
	{ id: "check-in" as AppointmentColumnId, name: "التقييم", count: 0, icon: <IconClipboardCheck className="size-4" />, accent: "purple" },
	{ id: "in-service" as AppointmentColumnId, name: "قيد المراجعة", count: 0, icon: <IconActivity className="size-4" />, accent: "amber" },
	{ id: "awaiting-payment" as AppointmentColumnId, name: "انتظار الرد", count: 0, icon: <IconHourglass className="size-4" />, accent: "blue" },
	{ id: "done" as AppointmentColumnId, name: "تم القبول", count: 0, icon: <IconCheck className="size-4" />, accent: "emerald" },
	{ id: "cancelled" as AppointmentColumnId, name: "مرفوض", count: 0, icon: <IconX className="size-4" />, accent: "red" },
];

const columnToStatusMap: Record<string, "QUEUE" | "EVALUATION" | "REVIEW" | "AWAITING_REPLY" | "ACCEPTED" | "REJECTED"> = {
	queue: "QUEUE",
	"check-in": "EVALUATION",
	"in-service": "REVIEW",
	"awaiting-payment": "AWAITING_REPLY",
	done: "ACCEPTED",
	cancelled: "REJECTED",
};

export function CampaignRequestsKanban({
	campaignId,
	searchQuery,
	genderFilter,
}: {
	campaignId: string;
	searchQuery?: string;
	genderFilter?: string;
}) {
	const { data: serverRequests = [], isLoading } = useCampaignRequests(campaignId);
	const updateStatusMutation = useUpdateRequestStatus(campaignId);

	const [data, setData] = useState<CampaignRequestItem[]>([]);
	const [selectedRequest, setSelectedRequest] = useState<CampaignRequestItem | null>(null);

	useEffect(() => {
		if (serverRequests) {
			setData(serverRequests);
		}
	}, [serverRequests]);

	// Update selectedRequest live when serverRequests change (e.g. after comments or status changes)
	useEffect(() => {
		if (selectedRequest) {
			const updated = serverRequests.find((r) => r.id === selectedRequest.id);
			if (updated) setSelectedRequest(updated);
		}
	}, [serverRequests]);

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

	const handleDataChange = (nextData: CampaignRequestItem[]) => {
		// Detect which item changed column
		const changedItem = nextData.find((item) => {
			const old = data.find((d) => d.id === item.id);
			return old && old.column !== item.column;
		});

		setData((prev) =>
			prev.map((item) => {
				const updated = nextData.find((d) => d.id === item.id);
				return updated || item;
			}),
		);

		if (changedItem) {
			const newStatus = columnToStatusMap[changedItem.column] || "QUEUE";
			updateStatusMutation.mutate({
				requestId: changedItem.id,
				status: newStatus,
			});
		}
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

						<KanbanCards id={column.id}>
							{(item: CampaignRequestItem) => (
								<KanbanCard
									key={item.id}
									id={item.id}
									name={item.name}
									column={item.column}
									className="border-0 bg-transparent p-0 shadow-none"
								>
									<Card
										className="cursor-pointer flex flex-col gap-3 rounded-md border bg-background p-3 shadow-sm text-start hover:border-primary/50 transition-colors"
										dir="rtl"
										onClick={() => setSelectedRequest(item)}
									>
										{/* Top row: Status Badge and Code */}
										<div className="flex items-start justify-between gap-2">
											<span className="text-[13px] font-medium text-muted-foreground">
												{item.code}
											</span>
											<Badge
												variant="outline"
												className={cn(
													"gap-1 py-1 px-3 text-[11px] font-semibold border",
													item.statusVariant === "warning" &&
														"border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-400",
													item.statusVariant === "info" &&
														"border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-400",
													item.statusVariant === "default" &&
														"border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-400",
												)}
											>
												{item.statusVariant === "warning" && (
													<IconPlayerPauseFilled size={12} className="me-1" />
												)}
												{item.statusLabel}
											</Badge>
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
				onOpenChange={(open) => !open && setSelectedRequest(null)}
				onAccept={(req) => {
					updateStatusMutation.mutate({
						requestId: req.id,
						status: "ACCEPTED",
					});
				}}
				onWaitlist={(req) => {
					updateStatusMutation.mutate({
						requestId: req.id,
						status: "QUEUE",
					});
				}}
				onReject={(req) => {
					updateStatusMutation.mutate({
						requestId: req.id,
						status: "REJECTED",
					});
				}}
			/>
		</div>
	);
}

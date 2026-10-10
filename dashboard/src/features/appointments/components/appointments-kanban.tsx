import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { KanbanBoard, KanbanCard, KanbanCards, KanbanProvider } from "@/components/kanban";
import { AppointmentCard } from "@/features/appointments/components/appointment-card";
import {
	APPOINTMENT_COLUMNS,
	AppointmentColumnHeader,
} from "@/features/appointments/components/appointment-column-header";
import { AppointmentPayDialog } from "@/features/appointments/components/appointment-pay-dialog";
import { AppointmentSheet } from "@/features/appointments/components/appointment-sheet";
import { ViewInvoiceDialog } from "@/features/appointments/components/view-invoice-dialog";
import { useAppointmentsList } from "@/features/appointments/hooks/use-appointments-list";
import { useUpdateAppointmentStatus } from "@/features/appointments/hooks/use-update-appointment-status";
import { useVisitStatusLabels } from "@/features/appointments/hooks/use-visit-status-labels";
import { useSelectedAppointmentStore } from "@/features/appointments/stores/selected-appointment.store";
import type {
	AppointmentCardData,
	AppointmentColumnId,
} from "@/features/appointments/types/appointment.types";
import {
	COLUMN_TO_STATUS,
	mapAppointmentToCard,
} from "@/features/appointments/utils/map-appointment-card";
import {
	type QueueSettingsByBranch,
	sortQueueCards,
} from "@/features/appointments/utils/sort-queue-cards";
import { useBranches } from "@/features/settings/branches/hooks/use-branches";
import { Route as AppointmentsRoute } from "@/routes/_pathless-layout/appointments";
import {
	canTransition,
	invalidTransitionMessage,
} from "@sanad/contracts/runtime/server/appointments/appointments.workflow";
import { parseBranchSettings } from "@sanad/contracts/runtime/server/branches/branches.type";

const collisionDetection: CollisionDetection = (args) => {
	const pointerCollisions = pointerWithin(args);
	return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

export function AppointmentsKanban() {
	const { period, view, openAppointment } = AppointmentsRoute.useSearch();
	const navigate = useNavigate({ from: AppointmentsRoute.fullPath });
	const { appointments } = useAppointmentsList(period, view);
	const { branches } = useBranches();
	const statusLabels = useVisitStatusLabels();
	const { updateStatus } = useUpdateAppointmentStatus();
	const [data, setData] = useState<AppointmentCardData[]>([]);
	const selectedCard = useSelectedAppointmentStore((s) => s.selected);
	const selectCard = useSelectedAppointmentStore((s) => s.select);
	const closeSelected = useSelectedAppointmentStore((s) => s.close);

	// إعدادات الطابور لكل فرع — لفرز الطابور طبيًا/طوارئ وإخفاء العمود عند التعطيل
	const queueByBranch = useMemo<QueueSettingsByBranch>(() => {
		const map: QueueSettingsByBranch = {};
		for (const branch of branches) {
			map[branch.id] = parseBranchSettings(branch.settings).queue;
		}
		return map;
	}, [branches]);

	// تفعيل الطابور = وضع الطابور نشط → يُخفى عمود الطابور الحر من اللوحة.
	// العمود يظهر فقط عندما لا يكون أي فرع مفعِّلًا للطابور (اللوحة على مستوى الأكاديمية).
	const queueColumnVisible = useMemo(
		() => branches.length === 0 || Object.values(queueByBranch).every((q) => !q.enabled),
		[branches.length, queueByBranch],
	);

	const serverCards = useMemo(
		() => sortQueueCards(appointments.map(mapAppointmentToCard), queueByBranch),
		[appointments, queueByBranch],
	);
	const lastKnownColumns = useRef<Map<string, AppointmentColumnId>>(new Map());

	useEffect(() => {
		lastKnownColumns.current = new Map(serverCards.map((c) => [c.id, c.column]));
		setData(serverCards);
	}, [serverCards]);

	// رابط عميق: ?openAppointment=<id> (من إشعار الوارد) → افتح لوحة الزيارة مرة واحدة
	const openedDeepLinkRef = useRef<string | null>(null);
	useEffect(() => {
		if (!openAppointment || openedDeepLinkRef.current === openAppointment) return;
		const card = serverCards.find((c) => c.id === openAppointment);
		if (!card) return; // الزيارة قد لا تكون ضمن الفترة المحمّلة بعد
		openedDeepLinkRef.current = openAppointment;
		selectCard(card);
		// أزل المعامل من الرابط حتى لا تُعاد الفتح عند الإغلاق/التحديث
		void navigate({
			search: (prev) => ({ ...prev, openAppointment: undefined }),
			replace: true,
		});
	}, [openAppointment, serverCards, selectCard, navigate]);

	const columns = APPOINTMENT_COLUMNS.filter(
		(column) => column.id !== "queue" || queueColumnVisible,
	).map((column) => ({
		...column,
		name: statusLabels[COLUMN_TO_STATUS[column.id]],
		count: data.filter((item) => item.column === column.id).length,
	}));

	const handleDataChange = (next: AppointmentCardData[]) => {
		const committed: AppointmentCardData[] = [];
		for (const item of next) {
			const prevCol = lastKnownColumns.current.get(item.id);
			if (!prevCol || prevCol === item.column) {
				committed.push(item);
				continue;
			}
			const from = COLUMN_TO_STATUS[prevCol];
			const to = COLUMN_TO_STATUS[item.column];
			if (!canTransition(from, to)) {
				toast.error(invalidTransitionMessage(from, to));
				committed.push({ ...item, column: prevCol });
				continue;
			}
			if (item.column === "awaiting-payment" && !item.examCompleted) {
				toast.error("يجب إكمال الفحص السريري قبل إنهاء الزيارة");
				committed.push({ ...item, column: prevCol });
				continue;
			}
			if (item.column === "done" && !item.examCompleted) {
				toast.error("يجب إكمال الفحص السريري قبل إنهاء الزيارة");
				committed.push({ ...item, column: prevCol });
				continue;
			}
			lastKnownColumns.current.set(item.id, item.column);
			void updateStatus({ id: item.id, status: to });
			committed.push(item);
		}
		setData(committed);
	};

	return (
		<div className="min-h-0 flex-1 overflow-x-auto px-4">
			<KanbanProvider
				className="h-full auto-cols-[minmax(20rem,1fr)]"
				collisionDetection={collisionDetection}
				columns={columns}
				data={data}
				onDataChange={handleDataChange}
			>
				{(column) => (
					<KanbanBoard
						key={column.id}
						id={column.id}
						className="bg-muted/40"
					>
						<AppointmentColumnHeader column={column} />
						<KanbanCards id={column.id}>
							{(item: AppointmentCardData) => (
								<KanbanCard
									key={item.id}
									id={item.id}
									name={item.name}
									column={item.column}
									className="border-0 bg-transparent p-0 shadow-none"
								>
									<AppointmentCard
										data={item}
										onSelect={selectCard}
									/>
								</KanbanCard>
							)}
						</KanbanCards>
					</KanbanBoard>
				)}
			</KanbanProvider>

			<AppointmentSheet
				card={selectedCard}
				open={!!selectedCard}
				onClose={closeSelected}
			/>

			{/* نافذة الدفع من البطاقة — على مستوى الكانبان حتى لا تفتح لوحة الزيارة */}
			<AppointmentPayDialog />

			{/* عرض الفاتورة المدفوعة من شارة "مدفوعة" — على مستوى الكانبان أيضًا */}
			<ViewInvoiceDialog />
		</div>
	);
}

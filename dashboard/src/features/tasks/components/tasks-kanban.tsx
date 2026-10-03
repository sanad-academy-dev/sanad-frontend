import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { KanbanBoard, KanbanCard, KanbanCards, KanbanProvider } from "@/components/kanban";
import { TaskAcceptDialog } from "@/features/tasks/components/task-accept-dialog";
import { TaskCard } from "@/features/tasks/components/task-card";
import { TaskColumnHeader } from "@/features/tasks/components/task-column-header";
import { TaskDeclineDialog } from "@/features/tasks/components/task-decline-dialog";
import { TaskSheet } from "@/features/tasks/components/task-sheet";
import type { TasksView } from "@/features/tasks/components/tasks-header";
import { COLUMN_TO_STATUS, getTaskColumns } from "@/features/tasks/data/task-columns";
import { useAcceptTask } from "@/features/tasks/hooks/use-accept-task";
import { useDeclineTask } from "@/features/tasks/hooks/use-decline-task";
import { useTaskSettings } from "@/features/tasks/hooks/use-task-settings";
import { useTasksKanban } from "@/features/tasks/hooks/use-tasks-kanban";
import { useUpdateTaskStatus } from "@/features/tasks/hooks/use-update-task-status";
import { useSelectedTaskStore } from "@/features/tasks/stores/selected-task.store";
import type { TaskCardData, TaskColumnId } from "@/features/tasks/types/task.types";
import { mapTaskToCard } from "@/features/tasks/utils/map-task-card";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";
import { Route as TasksRoute } from "@/routes/_pathless-layout/tasks";

const collisionDetection: CollisionDetection = (args) => {
	const pointerCollisions = pointerWithin(args);
	return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

const ALL_COLUMN_IDS: TaskColumnId[] = [
	"queue",
	"pending",
	"not-yet-started",
	"in-progress",
	"completed",
	"cancelled",
	"duplicate",
];

export function TasksKanban({ view }: { view: TasksView }) {
	const { t, lang } = useI18n();
	const { openTask } = TasksRoute.useSearch();
	const navigate = useNavigate({ from: TasksRoute.fullPath });
	const { tasks } = useTasksKanban(view);
	const { settings: taskSettings, statusLabel } = useTaskSettings(t);
	const { updateStatus } = useUpdateTaskStatus();
	const [data, setData] = useState<TaskCardData[]>([]);
	const lastKnownColumns = useRef<Map<string, TaskColumnId>>(new Map());
	const selectedCard = useSelectedTaskStore((s) => s.selected);
	const selectCard = useSelectedTaskStore((s) => s.select);
	const closeSelected = useSelectedTaskStore((s) => s.close);

	// موافقات الطابور من البطاقة مباشرة — على مستوى اللوحة حتى لا تُفتح لوحة المهمة
	const [acceptCard, setAcceptCard] = useState<TaskCardData | null>(null);
	const [declineCard, setDeclineCard] = useState<TaskCardData | null>(null);
	const { acceptTask, isAccepting } = useAcceptTask(acceptCard?.id ?? null, {
		onSuccess: () => setAcceptCard(null),
	});
	const { declineTask, isDeclining } = useDeclineTask(declineCard?.id ?? null, {
		onSuccess: () => setDeclineCard(null),
	});

	const serverCards = useMemo(
		() => tasks.map((task) => mapTaskToCard(task, t, lang)),
		[tasks, t, lang],
	);

	useEffect(() => {
		lastKnownColumns.current = new Map(serverCards.map((c) => [c.id, c.column]));
		setData(serverCards);
	}, [serverCards]);

	// رابط عميق: ?openTask=<id> (من إشعار الوارد) → افتح لوحة المهمة مرة واحدة
	const openedDeepLinkRef = useRef<string | null>(null);
	useEffect(() => {
		if (!openTask || openedDeepLinkRef.current === openTask) return;
		const card = serverCards.find((c) => c.id === openTask);
		if (!card) return; // المهمة قد لا تكون ضمن العرض المحمّل بعد
		openedDeepLinkRef.current = openTask;
		selectCard(card);
		// أزل المعامل من الرابط حتى لا تُعاد الفتح عند الإغلاق/التحديث
		void navigate({
			search: (prev) => ({ ...prev, openTask: undefined }),
			replace: true,
		});
	}, [openTask, serverCards, selectCard, navigate]);

	// وضع الطابور مفعّل → عمود الطابور ظاهر (صندوق الموافقات). وحتى مع تعطيله يظهر العمود
	// ما دامت هناك مهام موقوفة فيه — وإلا اختفت من اللوحة بلا طريقة لقبولها أو رفضها.
	const hasQueuedTasks = data.some((item) => item.column === "queue");
	const columns = getTaskColumns(t)
		.filter((col) => ALL_COLUMN_IDS.includes(col.id))
		.filter((col) => col.id !== "queue" || taskSettings.enabled || hasQueuedTasks)
		.map((column) => ({
			...column,
			name: statusLabel(COLUMN_TO_STATUS[column.id]),
			count: data.filter((item) => item.column === column.id).length,
		}));

	const handleDataChange = (next: TaskCardData[]) => {
		const committed: TaskCardData[] = [];
		for (const item of next) {
			const prevCol = lastKnownColumns.current.get(item.id);
			if (!prevCol || prevCol === item.column) {
				committed.push(item);
				continue;
			}
			lastKnownColumns.current.set(item.id, item.column);
			void updateStatus({ id: item.id, status: COLUMN_TO_STATUS[item.column] });
			committed.push(item);
		}
		setData(committed);
	};

	return (
		<div className="min-h-0 flex-1 overflow-x-auto px-4">
			<KanbanProvider
				className={cn(
					"h-full",
					columns.length === 1 ? "auto-cols-[20rem]" : "auto-cols-[minmax(18rem,1fr)]",
				)}
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
						<TaskColumnHeader column={column} />
						<KanbanCards id={column.id}>
							{(item: TaskCardData) => (
								<KanbanCard
									key={item.id}
									id={item.id}
									name={item.name}
									column={item.column}
									className="border-0 bg-transparent p-0 shadow-none"
								>
									<TaskCard
										data={item}
										onSelect={selectCard}
										onAccept={setAcceptCard}
										onDecline={setDeclineCard}
									/>
								</KanbanCard>
							)}
						</KanbanCards>
					</KanbanBoard>
				)}
			</KanbanProvider>

			<TaskSheet
				card={selectedCard}
				open={!!selectedCard}
				onClose={closeSelected}
			/>

			<TaskAcceptDialog
				card={acceptCard}
				open={!!acceptCard}
				onClose={() => setAcceptCard(null)}
				onSubmit={(data) => acceptTask(data)}
				isPending={isAccepting}
			/>

			<TaskDeclineDialog
				card={declineCard}
				open={!!declineCard}
				onClose={() => setDeclineCard(null)}
				onSubmit={(data) => declineTask(data)}
				isPending={isDeclining}
			/>
		</div>
	);
}

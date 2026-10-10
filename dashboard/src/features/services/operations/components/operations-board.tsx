import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { useEffect, useState } from "react";
import { KanbanBoard, KanbanCard, KanbanCards, KanbanProvider } from "@/components/kanban";
import { OperationCard } from "@/features/services/operations/components/operation-card";
import { OperationColumnHeader } from "@/features/services/operations/components/operation-column-header";
import { OPERATIONS_COLUMNS } from "@/features/services/operations/data/operations-data";
import type { OperationCardData } from "@/features/services/operations/types/operations.types";

const collisionDetection: CollisionDetection = (args) => {
	const pointerCollisions = pointerWithin(args);
	return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

// لوحة العمليات — بيانات حية من الخادم، والسحب يستدعي PATCH /:id/status:
// الخادم يفرض آلة الحالات والمسار، ورسالة الرفض العربية تظهر كما هي وتعود
// البطاقة لعمودها (إبطال الاستعلام يعيد الحقيقة من الخادم).
export function OperationsBoard({
	cards,
	onMove,
}: {
	cards: OperationCardData[];
	onMove: (id: string, to: OperationCardData["column"]) => void;
}) {
	// نسخة محلية للسحب السلس — تُزامَن من الخادم عند كل جلب
	const [data, setData] = useState<OperationCardData[]>(cards);
	useEffect(() => {
		setData(cards);
	}, [cards]);

	const columns = OPERATIONS_COLUMNS.map((column) => ({
		...column,
		count: data.filter((item) => item.column === column.id).length,
	}));

	const handleDataChange = (next: OperationCardData[]) => {
		setData(next);
		// البطاقة التي تغيّر عمودها عن حالة الخادم = طلب انتقال
		for (const item of next) {
			if (item.raw.status !== item.column) {
				onMove(item.id, item.column);
			}
		}
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
						<OperationColumnHeader column={column} />
						<KanbanCards id={column.id}>
							{(item: OperationCardData) => (
								<KanbanCard
									key={item.id}
									id={item.id}
									name={item.name}
									column={item.column}
									className="border-0 bg-transparent p-0 shadow-none"
								>
									<OperationCard data={item} />
								</KanbanCard>
							)}
						</KanbanCards>
					</KanbanBoard>
				)}
			</KanbanProvider>
		</div>
	);
}

import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { KanbanBoard, KanbanCard, KanbanCards, KanbanProvider } from "@/components/kanban";
import {
	GroomingCard,
	type GroomingCardTab,
} from "@/features/care/grooming/components/grooming-card";
import { GroomingColumnHeader } from "@/features/care/grooming/components/grooming-column-header";
import {
	type BlockedMove,
	GroomingGateOverrideDialog,
} from "@/features/care/grooming/components/grooming-gate-override-dialog";
import {
	GROOMING_COLUMNS,
	type GroomingCardData,
} from "@/features/care/grooming/data/grooming-columns";
import {
	GroomingGateError,
	isGateOverridable,
	useGroomingMutations,
} from "@/features/care/grooming/hooks/use-grooming";
import type { GroomingStatus } from "@/generated/prisma/enums";
import type { GroomingSessionCard } from "@/server/grooming/grooming.type";
import {
	canGroomingTransition,
	invalidGroomingTransitionMessage,
} from "@sanad/contracts/runtime/server/grooming/grooming.workflow";

const collisionDetection: CollisionDetection = (args) => {
	const pointerCollisions = pointerWithin(args);
	return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

export function GroomingBoard({
	cards,
	onSelect,
}: {
	cards: GroomingSessionCard[];
	onSelect: (id: string, tab?: GroomingCardTab) => void;
}) {
	const { moveSession } = useGroomingMutations();
	const [data, setData] = useState<GroomingCardData[]>([]);
	const [blocked, setBlocked] = useState<BlockedMove | null>(null);

	const serverCards = useMemo<GroomingCardData[]>(
		() =>
			cards.map((card) => ({
				id: card.id,
				column: card.status,
				name: card.patient.name,
				card,
			})),
		[cards],
	);

	const lastKnownColumns = useRef<Map<string, GroomingStatus>>(new Map());

	useEffect(() => {
		lastKnownColumns.current = new Map(serverCards.map((c) => [c.id, c.column]));
		setData(serverCards);
	}, [serverCards]);

	const columns = GROOMING_COLUMNS.map((column) => ({
		...column,
		count: data.filter((item) => item.column === column.id).length,
	}));

	/** نقل واحد بمعالجة رفض واحدة — يستعمله السحب وزرّ «الإجراء التالي» معًا */
	const attemptMove = (id: string, from: GroomingStatus, to: GroomingStatus) => {
		lastKnownColumns.current.set(id, to);
		setData((rows) => rows.map((r) => (r.id === id ? { ...r, column: to } : r)));
		void moveSession({ id, to }).catch((e: unknown) => {
			// الرفض يُعيد البطاقة إلى عمودها، ويُبقي السبب ظاهرًا
			lastKnownColumns.current.set(id, from);
			setData((rows) => rows.map((r) => (r.id === id ? { ...r, column: from } : r)));
			if (e instanceof GroomingGateError && isGateOverridable(e.gate)) {
				setBlocked({ sessionId: id, to, gate: e.gate as string, message: e.message });
			}
		});
	};

	/** زرّ «الإجراء التالي» على البطاقة — نفس الفحص ونفس معالجة الرفض */
	const advance = (id: string, to: GroomingStatus) => {
		const from = lastKnownColumns.current.get(id);
		if (!from) return;
		if (!canGroomingTransition(from, to)) {
			toast.error(invalidGroomingTransitionMessage(from, to));
			return;
		}
		attemptMove(id, from, to);
	};

	/**
	 * السحب يُفحص مرّتين: هنا بآلة الحالات نفسها التي يستعملها الخادم (فلا نُرسل
	 * انتقالًا مستحيلًا أصلًا)، ثم على الخادم حيث تُقيَّم البوابات بحالة مخزَّنة لا
	 * تعرفها البطاقة. رفض البوابة يُعيد البطاقة ويعرض سببها العربي، ويفتح نافذة
	 * التجاوز إن كانت البوابة تقبله.
	 */
	const handleDataChange = (next: GroomingCardData[]) => {
		const committed: GroomingCardData[] = [];
		for (const card of next) {
			const prevCol = lastKnownColumns.current.get(card.id);
			if (!prevCol || prevCol === card.column) {
				committed.push(card);
				continue;
			}

			if (!canGroomingTransition(prevCol, card.column)) {
				toast.error(invalidGroomingTransitionMessage(prevCol, card.column));
				committed.push({ ...card, column: prevCol });
				continue;
			}

			attemptMove(card.id, prevCol, card.column);
			committed.push(card);
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
						<GroomingColumnHeader column={column} />
						<KanbanCards id={column.id}>
							{(item: GroomingCardData) => (
								<KanbanCard
									key={item.id}
									id={item.id}
									name={item.name}
									column={item.column}
									className="border-0 bg-transparent p-0 shadow-none"
								>
									<GroomingCard
										data={item}
										onSelect={onSelect}
										onAdvance={advance}
									/>
								</KanbanCard>
							)}
						</KanbanCards>
					</KanbanBoard>
				)}
			</KanbanProvider>

			<GroomingGateOverrideDialog
				blocked={blocked}
				onClose={() => setBlocked(null)}
			/>
		</div>
	);
}

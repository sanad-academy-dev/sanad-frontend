import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { KanbanBoard, KanbanCard, KanbanCards, KanbanProvider } from "@/components/kanban";
import { LabTestCard } from "@/features/services/lab-tests/components/lab-test-card";
import { LabTestColumnHeader } from "@/features/services/lab-tests/components/lab-test-column-header";
import { LabTestSheet } from "@/features/services/lab-tests/components/lab-test-sheet";
import { LAB_TESTS_COLUMNS } from "@/features/services/lab-tests/data/lab-tests-data";
import { useUpdateLabTestStatus } from "@/features/services/lab-tests/hooks/use-lab-test-mutations";
import { useLabTestsList } from "@/features/services/lab-tests/hooks/use-lab-tests-list";
import { useSelectedLabTestStore } from "@/features/services/lab-tests/stores/selected-lab-test.store";
import type {
	LabItemCardData,
	LabTestColumnId,
} from "@/features/services/lab-tests/types/lab-tests.types";
import { LabTestStatus } from "@/generated/prisma/enums";
import { Route as LabTestsRoute } from "@/routes/_pathless-layout/services/lab-tests";
import {
	canLeaveQueue,
	isPaymentGatedStatus,
	labPaymentStatus,
	paymentBlockMessage,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.type";
import {
	canLabTransition,
	canLeaveSampleCollection,
	canSendToReview,
	invalidLabTransitionMessage,
	REVIEW_BLOCKED_MESSAGE,
	SAMPLE_BLOCKED_MESSAGE,
} from "@sanad/contracts/runtime/server/lab-tests/lab-tests.workflow";

const collisionDetection: CollisionDetection = (args) => {
	const pointerCollisions = pointerWithin(args);
	return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

export function LabTestsBoard() {
	const { period, view } = LabTestsRoute.useSearch();
	const { labTests } = useLabTestsList(period, view);
	const { updateStatus } = useUpdateLabTestStatus();
	const [data, setData] = useState<LabItemCardData[]>([]);
	const selectedId = useSelectedLabTestStore((s) => s.selectedId);
	const select = useSelectedLabTestStore((s) => s.select);
	const close = useSelectedLabTestStore((s) => s.close);

	// بطاقة لكل تحليل في عمود حالته هو — لا بطاقة للطلب. طلبٌ اكتمل أحد
	// تحليلَيه والآخر مجدول يظهر بطاقتين في عمودَيهما الصحيحين بدل بطاقة
	// واحدة عالقة في «مجدول». الملغاة لا تُعرض (لا عمود لها).
	const serverCards = useMemo<LabItemCardData[]>(
		() =>
			labTests.flatMap((order) =>
				order.items
					.filter((i) => i.status !== LabTestStatus.CANCELLED)
					.map((item) => ({
						id: item.id,
						column: item.status,
						name: item.service.name,
						item,
						order,
					})),
			),
		[labTests],
	);

	const lastKnownColumns = useRef<Map<string, LabTestColumnId>>(new Map());

	useEffect(() => {
		lastKnownColumns.current = new Map(serverCards.map((c) => [c.id, c.column]));
		setData(serverCards);
	}, [serverCards]);

	// عدّادات الأعمدة تَعُدّ تحاليل لا طلبات
	const columns = LAB_TESTS_COLUMNS.map((column) => ({
		...column,
		count: data.filter((item) => item.column === column.id).length,
	}));

	// السحب ينقل التحليل وحده، بنفس حراسة آلة الحالات في الخادم قبل الإرسال —
	// لا غموض بعد الآن حول أي تحليل ينتقل.
	const handleDataChange = (next: LabItemCardData[]) => {
		const committed: LabItemCardData[] = [];
		for (const card of next) {
			const prevCol = lastKnownColumns.current.get(card.id);
			if (!prevCol || prevCol === card.column) {
				committed.push(card);
				continue;
			}

			const revert = (message: string) => {
				toast.error(message);
				committed.push({ ...card, column: prevCol });
			};

			if (!canLabTransition(prevCol, card.column)) {
				revert(invalidLabTransitionMessage(prevCol, card.column));
				continue;
			}
			// لا يغادر التحليل مرحلة السحب قبل تسجيل سحب العيّنة فعلًا
			if (
				card.column === LabTestStatus.IN_LAB &&
				!canLeaveSampleCollection(card.item.status, card.item.sampleStage)
			) {
				revert(SAMPLE_BLOCKED_MESSAGE);
				continue;
			}
			// المراجعة لا تُفتح إلا بعد "ظهرت النتائج"
			if (
				card.column === LabTestStatus.UNDER_REVIEW &&
				!canSendToReview(card.item.status, card.item.sampleStage)
			) {
				revert(REVIEW_BLOCKED_MESSAGE);
				continue;
			}
			// لا يتقدّم التحليل من «الطابور» أو «مجدول» قبل سداد فاتورة طلبه
			if (isPaymentGatedStatus(prevCol) && !canLeaveQueue(labPaymentStatus(card.order))) {
				revert(paymentBlockMessage(labPaymentStatus(card.order)));
				continue;
			}
			// الاعتماد/الرفض يتمّان من لوحة التفاصيل حتى يُسجَّل المراجِع والسبب
			if (prevCol === LabTestStatus.UNDER_REVIEW) {
				revert("افتح الطلب لاعتماد النتائج أو رفضها");
				continue;
			}

			lastKnownColumns.current.set(card.id, card.column);
			// الرفض من الخادم يُعالَج بإعادة الجلب في الخطّاف — نبتلع الرفض هنا
			void updateStatus({ itemId: card.id, status: card.column }).catch(() => {});
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
						<LabTestColumnHeader column={column} />
						<KanbanCards id={column.id}>
							{(item: LabItemCardData) => (
								<KanbanCard
									key={item.id}
									id={item.id}
									name={item.name}
									column={item.column}
									className="border-0 bg-transparent p-0 shadow-none"
								>
									<LabTestCard
										card={item}
										onSelect={select}
									/>
								</KanbanCard>
							)}
						</KanbanCards>
					</KanbanBoard>
				)}
			</KanbanProvider>

			<LabTestSheet
				labTestId={selectedId}
				open={!!selectedId}
				onClose={close}
			/>
		</div>
	);
}

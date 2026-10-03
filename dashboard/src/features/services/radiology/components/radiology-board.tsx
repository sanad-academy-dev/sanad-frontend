import { type CollisionDetection, pointerWithin, rectIntersection } from "@dnd-kit/core";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { KanbanBoard, KanbanCard, KanbanCards, KanbanProvider } from "@/components/kanban";
import { RadiologyCard } from "@/features/services/radiology/components/radiology-card";
import { RadiologyColumnHeader } from "@/features/services/radiology/components/radiology-column-header";
import { RadiologyOrderSheet } from "@/features/services/radiology/components/radiology-order-sheet";
import { RADIOLOGY_COLUMNS } from "@/features/services/radiology/data/radiology-data";
import { useRadiologyList } from "@/features/services/radiology/hooks/use-radiology-list";
import { useUpdateRadiologyStatus } from "@/features/services/radiology/hooks/use-radiology-mutations";
import { useSelectedRadiologyOrderStore } from "@/features/services/radiology/stores/selected-radiology-order.store";
import type {
	RadiologyColumnId,
	RadiologyItemCardData,
} from "@/features/services/radiology/types/radiology.types";
import { RadiologyStatus } from "@/generated/prisma/enums";
import { Route as RadiologyRoute } from "@/routes/_pathless-layout/services/radiology";
import {
	canLeaveRadiologyQueue,
	isRadiologyPaymentGatedStatus,
	radiologyPaymentBlockMessage,
	radiologyPaymentStatus,
} from "@sanad/contracts/runtime/server/radiology/radiology.type";
import {
	canLeaveImaging,
	canLeavePreparation,
	canRadiologyTransition,
	IMAGING_BLOCKED_MESSAGE,
	invalidRadiologyTransitionMessage,
	PREPARATION_BLOCKED_MESSAGE,
	RADIOLOGY_REVIEW_BLOCKED_MESSAGE,
	RADIOLOGY_STATUS_ORDER,
} from "@sanad/contracts/runtime/server/radiology/radiology.workflow";

const collisionDetection: CollisionDetection = (args) => {
	const pointerCollisions = pointerWithin(args);
	return pointerCollisions.length > 0 ? pointerCollisions : rectIntersection(args);
};

/** عدد الصور المرفوعة لفحص — مجموع صور كل السلاسل في كل دراساته */
const instancesCountOf = (item: RadiologyItemCardData["item"]) =>
	item.studies.reduce(
		(sum, study) => sum + study.series.reduce((s, series) => s + series.instances.length, 0),
		0,
	);

export function RadiologyBoard() {
	const { period, view, q, modality, status } = RadiologyRoute.useSearch();
	const { radiologyOrders } = useRadiologyList(period, view);
	const { updateStatus } = useUpdateRadiologyStatus();
	const [data, setData] = useState<RadiologyItemCardData[]>([]);
	const select = useSelectedRadiologyOrderStore((s) => s.select);

	// بطاقة لكل فحص في عمود حالته هو — لا بطاقة للطلب. طلبٌ اكتمل أحد فحصَيه
	// والآخر في التصوير يظهر بطاقتين في عمودَيهما الصحيحين بدل بطاقة واحدة
	// عالقة. الملغاة لا تُعرض (لا عمود لها).
	const serverCards = useMemo<RadiologyItemCardData[]>(
		() =>
			radiologyOrders.flatMap((order) =>
				order.items
					.filter((i) => i.status !== RadiologyStatus.CANCELLED)
					.map((item) => ({
						id: item.id,
						column: item.status,
						name: item.service.name,
						item,
						order,
					})),
			),
		[radiologyOrders],
	);

	// البحث والتصفية على البطاقات الجاهزة: تصفية عرض بحتة لا تمسّ ما يرسله
	// الخادم، فالسحب وحراسة آلة الحالات تعملان على المعروض كما على الكل.
	const visibleCards = useMemo(() => {
		const needle = q.trim().toLowerCase();
		const modalities = modality ? modality.split(",") : [];
		const statuses = status ? status.split(",") : [];
		if (!needle && modalities.length === 0 && statuses.length === 0) return serverCards;
		return serverCards.filter((card) => {
			if (modalities.length > 0 && !modalities.includes(card.item.modality)) return false;
			if (statuses.length > 0 && !statuses.includes(card.item.status)) return false;
			if (!needle) return true;
			const haystack = [
				card.name,
				card.item.accession,
				card.item.bodyPart,
				card.order.code,
				card.order.patient.name,
				card.order.patient.code,
				card.order.owner?.name,
				card.item.assignedTo?.name,
			];
			return haystack.some((field) => field?.toLowerCase().includes(needle));
		});
	}, [serverCards, q, modality, status]);

	const lastKnownColumns = useRef<Map<string, RadiologyColumnId>>(new Map());

	useEffect(() => {
		lastKnownColumns.current = new Map(visibleCards.map((c) => [c.id, c.column]));
		setData(visibleCards);
	}, [visibleCards]);

	// عدّادات الأعمدة تَعُدّ فحوصات لا طلبات
	const columns = RADIOLOGY_COLUMNS.map((column) => ({
		...column,
		count: data.filter((item) => item.column === column.id).length,
	}));

	// السحب ينقل الفحص وحده، بنفس حراسة آلة الحالات في الخادم قبل الإرسال —
	// لا غموض بعد الآن حول أي فحص ينتقل.
	const handleDataChange = (next: RadiologyItemCardData[]) => {
		const committed: RadiologyItemCardData[] = [];
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

			if (!canRadiologyTransition(prevCol, card.column)) {
				revert(invalidRadiologyTransitionMessage(prevCol, card.column));
				continue;
			}
			// لا يغادر الفحص التحضير قبل بلوغ «الملخص والتسليم»
			if (
				prevCol === RadiologyStatus.PREPARATION &&
				card.column === RadiologyStatus.IMAGING &&
				!canLeavePreparation(card.item.status, card.item.stage)
			) {
				revert(PREPARATION_BLOCKED_MESSAGE);
				continue;
			}
			// لا يغادر الفحص التصوير قبل رفع صورة واحدة على الأقل وتقييم جودتها
			if (
				prevCol === RadiologyStatus.IMAGING &&
				card.column === RadiologyStatus.REPORTING &&
				(!canLeaveImaging(card.item.status, card.item.stage) ||
					instancesCountOf(card.item) === 0 ||
					!card.item.execution?.imageQuality)
			) {
				revert(IMAGING_BLOCKED_MESSAGE);
				continue;
			}
			// المراجعة لا تُفتح إلا بتقرير فيه موجودات وانطباع
			if (
				card.column === RadiologyStatus.UNDER_REVIEW &&
				(!card.item.report?.findings || !card.item.report?.impression)
			) {
				revert(RADIOLOGY_REVIEW_BLOCKED_MESSAGE);
				continue;
			}
			// لا يتقدّم الفحص من «الطلبات» أو «مجدول» قبل سداد فاتورة طلبه —
			// الرجوع للخلف (مجدول ← الطلبات) غير محكوم بالبوابة
			if (
				isRadiologyPaymentGatedStatus(prevCol) &&
				RADIOLOGY_STATUS_ORDER.indexOf(
					card.column as (typeof RADIOLOGY_STATUS_ORDER)[number],
				) >
					RADIOLOGY_STATUS_ORDER.indexOf(prevCol as (typeof RADIOLOGY_STATUS_ORDER)[number]) &&
				!canLeaveRadiologyQueue(radiologyPaymentStatus(card.order))
			) {
				revert(radiologyPaymentBlockMessage(radiologyPaymentStatus(card.order)));
				continue;
			}
			// الاعتماد/الرفض يتمّان من لوحة التفاصيل حتى يُسجَّل المراجِع والسبب
			if (prevCol === RadiologyStatus.UNDER_REVIEW) {
				revert("افتح الطلب لاعتماد التقرير أو رفضه");
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
						<RadiologyColumnHeader column={column} />
						<KanbanCards id={column.id}>
							{(item: RadiologyItemCardData) => (
								<KanbanCard
									key={item.id}
									id={item.id}
									name={item.name}
									column={item.column}
									className="border-0 bg-transparent p-0 shadow-none"
								>
									<RadiologyCard
										card={item}
										onSelect={select}
									/>
								</KanbanCard>
							)}
						</KanbanCards>
					</KanbanBoard>
				)}
			</KanbanProvider>

			<RadiologyOrderSheet />
		</div>
	);
}

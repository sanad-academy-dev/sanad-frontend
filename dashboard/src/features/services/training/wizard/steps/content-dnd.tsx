import {
	closestCorners,
	DndContext,
	type DragEndEvent,
	type DragOverEvent,
	DragOverlay,
	type DragStartEvent,
	KeyboardSensor,
	PointerSensor,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { IconPlus } from "@tabler/icons-react";
import { Fragment, type HTMLAttributes, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Button } from "@/components/ui/button";
import type {
	CourseDetailResponse,
	LevelResponse,
	ReorderContentInput,
	UnitResponse,
} from "@/server/training/training.type";
import { ContentCard } from "./content-card";
import { LevelHeading } from "./level-heading";

// معرّف عمود المحتوى غير المُجمَّع (levelId = null)
const UNGROUPED = "__ungrouped__";
type Item = { id: string; levelId: string | null };
const colOf = (levelId: string | null) => levelId ?? UNGROUPED;
const levelOfCol = (col: string) => (col === UNGROUPED ? null : col);

function signature(units: UnitResponse[]) {
	return units.map((u) => `${u.id}:${u.levelId ?? ""}:${u.order}`).join("|");
}

// يبني حمولة إعادة الترتيب (موضع عالمي 0-based) من ترتيب العناصر الحالي
function buildPayload(items: Item[]): ReorderContentInput[] {
	return items.map((it, position) => ({ unitId: it.id, levelId: it.levelId, position }));
}

function SortableCard({
	unit,
	courseId,
	courseName,
	autoOpen,
}: {
	unit: UnitResponse;
	courseId: string;
	courseName: string;
	autoOpen?: boolean;
}) {
	const { attributes, listeners, setNodeRef, transition, transform, isDragging } = useSortable(
		{
			id: unit.id,
		},
	);
	return (
		<ContentCard
			unit={unit}
			courseId={courseId}
			courseName={courseName}
			autoOpen={autoOpen}
			dragRef={setNodeRef}
			style={{ transition, transform: CSS.Transform.toString(transform) }}
			isDragging={isDragging}
			dragHandleProps={{ ...attributes, ...listeners } as HTMLAttributes<HTMLButtonElement>}
		/>
	);
}

// زر «+» بين البطاقات لإدراج محتوى في هذا الموضع بالضبط
function InsertButton({ onClick }: { onClick: () => void }) {
	return (
		<div className="flex h-0 items-center justify-center opacity-0 transition-opacity hover:opacity-100 has-[button:focus]:opacity-100">
			<button
				type="button"
				onClick={onClick}
				aria-label="إضافة محتوى هنا"
				className="flex size-6 -translate-y-1 items-center justify-center rounded-full border border-primary/40 bg-white text-primary shadow-sm"
			>
				<IconPlus className="size-3.5" />
			</button>
		</div>
	);
}

// مجموعة مستوى واحد (قابلة للإفلات حتى وهي فارغة)
function LevelGroup({
	col,
	itemIds,
	units,
	courseId,
	courseName,
	autoOpenUnitId,
	onInsert,
	onAddEnd,
	heading,
}: {
	col: string;
	itemIds: string[];
	units: Map<string, UnitResponse>;
	courseId: string;
	courseName: string;
	autoOpenUnitId?: string | null;
	onInsert: (indexInGroup: number) => void;
	onAddEnd: () => void;
	heading?: React.ReactNode;
}) {
	const { setNodeRef } = useDroppable({ id: col });
	return (
		<div className="flex flex-col gap-3">
			{heading}
			<SortableContext items={itemIds}>
				<div
					ref={setNodeRef}
					className="flex min-h-[8px] flex-col"
				>
					{itemIds.map((id, i) => {
						const unit = units.get(id);
						if (!unit) return null;
						return (
							<Fragment key={id}>
								<SortableCard
									unit={unit}
									courseId={courseId}
									courseName={courseName}
									autoOpen={unit.id === autoOpenUnitId}
								/>
								{i < itemIds.length - 1 && <InsertButton onClick={() => onInsert(i + 1)} />}
							</Fragment>
						);
					})}
				</div>
			</SortableContext>
			<div className="pt-1">
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={onAddEnd}
					className="h-8 gap-1.5 rounded-lg text-[12px]"
				>
					<IconPlus className="size-4" />
					إضافة محتوى
				</Button>
			</div>
		</div>
	);
}

export function ContentDnd({
	course,
	courseId,
	levels,
	autoOpenUnitId,
	onAddContent,
	onRenameLevel,
	onRemoveLevel,
	reorderContents,
}: {
	course: CourseDetailResponse;
	courseId: string;
	levels: LevelResponse[];
	// معرّف البطاقة المُنشأة حديثًا — تُفتح موسّعة تلقائيًا للتحرير
	autoOpenUnitId?: string | null;
	// إنشاء بطاقة في نهاية المستوى وإرجاعها (لإدراجها بعد ذلك في الموضع المطلوب)
	onAddContent: (levelId: string | null) => Promise<UnitResponse | undefined>;
	onRenameLevel: (id: string, name: string) => void;
	onRemoveLevel: (id: string) => void;
	reorderContents: (items: ReorderContentInput[]) => Promise<unknown>;
}) {
	const unitMap = new Map(course.units.map((u) => [u.id, u]));
	const [items, setItems] = useState<Item[]>(
		course.units.map((u) => ({ id: u.id, levelId: u.levelId ?? null })),
	);
	const [activeId, setActiveId] = useState<string | null>(null);

	// مزامنة الحالة المحلية عند تغيّر ترتيب/مستويات الوحدات في الكاش (بعد الحفظ/التراجع).
	// نعتمد توقيعًا نصيًّا لا مصفوفة الوحدات لتفادي إعادة التزامن عند كل إعادة تصيير.
	const unitsSig = signature(course.units);
	// biome-ignore lint/correctness/useExhaustiveDependencies: التزامن مقصود عند تغيّر التوقيع فقط
	useEffect(() => {
		setItems(course.units.map((u) => ({ id: u.id, levelId: u.levelId ?? null })));
	}, [unitsSig]);

	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor),
	);

	const idsInCol = (col: string) =>
		items.filter((it) => colOf(it.levelId) === col).map((it) => it.id);

	// أعمدة العرض: غير المُجمَّع (إن وُجد أو لا مستويات) ثم المستويات بترتيبها
	const hasUngrouped = items.some((it) => it.levelId === null);
	const columns: { col: string; level?: LevelResponse }[] = [
		...(hasUngrouped || levels.length === 0 ? [{ col: UNGROUPED }] : []),
		...levels.map((level) => ({ col: level.id, level })),
	];

	const handleDragOver = (e: DragOverEvent) => {
		const { active, over } = e;
		if (!over) return;
		const activeItem = items.find((it) => it.id === active.id);
		if (!activeItem) return;
		const overItem = items.find((it) => it.id === over.id);
		const overCol = overItem ? colOf(overItem.levelId) : String(over.id);
		if (colOf(activeItem.levelId) === overCol) return;
		// نقل بين المستويات: غيّر المستوى وحرّك إلى موضع العنصر المُمرّر فوقه
		setItems((prev) => {
			const next = prev.map((it) =>
				it.id === active.id ? { ...it, levelId: levelOfCol(overCol) } : it,
			);
			const from = next.findIndex((it) => it.id === active.id);
			const to = overItem ? next.findIndex((it) => it.id === over.id) : next.length - 1;
			return arrayMove(next, from, Math.max(0, to));
		});
	};

	const handleDragEnd = (e: DragEndEvent) => {
		setActiveId(null);
		const { active, over } = e;
		if (!over) return;
		let final = items;
		if (active.id !== over.id) {
			const from = items.findIndex((it) => it.id === active.id);
			const to = items.findIndex((it) => it.id === over.id);
			if (from !== -1 && to !== -1) {
				final = arrayMove(items, from, to);
				setItems(final);
			}
		}
		void reorderContents(buildPayload(final));
	};

	// إدراج بموضع محدّد: أنشئ في نهاية المستوى ثم أعد الترتيب ليقع في الموضع المطلوب
	const insertAt = async (levelId: string | null, indexInGroup: number) => {
		const created = await onAddContent(levelId);
		if (!created) return;
		const rest = items.filter((it) => it.id !== created.id);
		const colItems = rest.filter((it) => colOf(it.levelId) === colOf(levelId));
		const anchor = colItems[indexInGroup]?.id;
		const flat = [...rest];
		const insertIdx = anchor ? flat.findIndex((it) => it.id === anchor) : flat.length;
		flat.splice(insertIdx, 0, { id: created.id, levelId });
		setItems(flat);
		await reorderContents(buildPayload(flat));
	};

	const activeUnit = activeId ? unitMap.get(activeId) : null;

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCorners}
			onDragStart={(e: DragStartEvent) => setActiveId(String(e.active.id))}
			onDragOver={handleDragOver}
			onDragEnd={handleDragEnd}
			onDragCancel={() => setActiveId(null)}
		>
			<div className="flex flex-col gap-6">
				{columns.map(({ col, level }) => (
					<LevelGroup
						key={col}
						col={col}
						itemIds={idsInCol(col)}
						units={unitMap}
						courseId={courseId}
						courseName={course.name}
						autoOpenUnitId={autoOpenUnitId}
						onInsert={(idx) => insertAt(levelOfCol(col), idx)}
						onAddEnd={() => void onAddContent(levelOfCol(col))}
						heading={
							level ? (
								<LevelHeading
									name={level.name}
									onRename={(name) => onRenameLevel(level.id, name)}
									onDelete={() => onRemoveLevel(level.id)}
								/>
							) : undefined
						}
					/>
				))}
			</div>

			{typeof window !== "undefined" &&
				createPortal(
					<DragOverlay>
						{activeUnit ? (
							<div className="flex items-center gap-3 rounded-xl border border-primary/40 bg-white px-3 py-2.5 shadow-lg">
								<span className="text-[13px] font-semibold text-[#08090A]">
									{activeUnit.title}
								</span>
							</div>
						) : null}
					</DragOverlay>,
					document.body,
				)}
		</DndContext>
	);
}

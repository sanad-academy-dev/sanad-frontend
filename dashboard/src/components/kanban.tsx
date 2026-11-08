"use client";

import type {
	Announcements,
	DndContextProps,
	DragCancelEvent,
	DragEndEvent,
	DragOverEvent,
	DragStartEvent,
} from "@dnd-kit/core";
import {
	closestCenter,
	DndContext,
	DragOverlay,
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useDroppable,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
	createContext,
	type HTMLAttributes,
	type ReactNode,
	useContext,
	useState,
} from "react";
import { createPortal } from "react-dom";
import tunnel from "tunnel-rat";
import { Card } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const t = tunnel();

export type { DragEndEvent } from "@dnd-kit/core";

type KanbanItemProps = {
	id: string;
	name: string;
	column: string;
} & Record<string, unknown>;

type KanbanColumnProps = {
	id: string;
	name: string;
} & Record<string, unknown>;

type KanbanContextProps<
	T extends KanbanItemProps = KanbanItemProps,
	C extends KanbanColumnProps = KanbanColumnProps,
> = {
	columns: C[];
	data: T[];
	disabled?: boolean;
	activeCardId: string | null;
};

const KanbanContext = createContext<KanbanContextProps>({
	columns: [],
	data: [],
	activeCardId: null,
});

export type KanbanBoardProps = {
	id: string;
	children: ReactNode;
	className?: string;
};

export const KanbanBoard = ({ id, children, className }: KanbanBoardProps) => {
	const { isOver, setNodeRef } = useDroppable({
		id,
	});

	return (
		<div
			className={cn(
				"flex size-full min-h-[calc(100vh-190px)] flex-col divide-y rounded-md bg-secondary text-xs shadow-sm ring-1 transition-colors",
				isOver ? "bg-primary/[0.025] ring-primary/35" : "ring-transparent",
				className,
			)}
			ref={setNodeRef}
		>
			{children}
		</div>
	);
};

export type KanbanCardProps<T extends KanbanItemProps = KanbanItemProps> = T & {
	children?: ReactNode;
	className?: string;
	disabled?: boolean;
};

export const KanbanCard = <T extends KanbanItemProps = KanbanItemProps>({
	id,
	name,
	children,
	className,
	disabled,
}: KanbanCardProps<T>) => {
	const { activeCardId, disabled: contextDisabled } = useContext(KanbanContext) as KanbanContextProps;
	const isCardDisabled = disabled ?? contextDisabled ?? false;

	const { attributes, listeners, setNodeRef, transition, transform, isDragging } = useSortable(
		{
			id,
			disabled: isCardDisabled,
		},
	);

	const style = {
		transition,
		transform: CSS.Transform.toString(transform),
	};

	return (
		<>
			<div
				style={style}
				{...(!isCardDisabled ? listeners : {})}
				{...attributes}
				ref={setNodeRef}
			>
				<Card
					className={cn(
						isCardDisabled ? "cursor-default" : "cursor-grab",
						"gap-4 rounded-md p-3 shadow-sm",
						isDragging && "pointer-events-none cursor-grabbing opacity-30",
						className,
					)}
				>
					{children ?? <p className="m-0 font-medium text-sm">{name}</p>}
				</Card>
			</div>
			{activeCardId === id && (
				<t.In>
					<Card
						className={cn(
							"cursor-grab gap-4 rounded-md p-3 shadow-sm ring-2 ring-primary",
							isDragging && "cursor-grabbing",
							className,
						)}
					>
						{children ?? <p className="m-0 font-medium text-sm">{name}</p>}
					</Card>
				</t.In>
			)}
		</>
	);
};

export type KanbanCardsProps<T extends KanbanItemProps = KanbanItemProps> = Omit<
	HTMLAttributes<HTMLDivElement>,
	"children" | "id"
> & {
	children: (item: T) => ReactNode;
	id: string;
};

export const KanbanCards = <T extends KanbanItemProps = KanbanItemProps>({
	children,
	className,
	...props
}: KanbanCardsProps<T>) => {
	const { data } = useContext(KanbanContext) as KanbanContextProps<T>;
	const filteredData = data.filter((item) => item.column === props.id);
	const items = filteredData.map((item) => item.id);

	return (
		<div className="flex-1 flex flex-col min-h-[220px]">
			<SortableContext items={items}>
				<div
					className={cn("flex flex-grow flex-col gap-2 p-2 min-h-[220px]", className)}
					{...props}
				>
					{filteredData.length > 0 ? (
						filteredData.map(children)
					) : (
						<div className="flex flex-1 flex-col items-center justify-center py-12 text-center text-muted-foreground/40 text-[11px] select-none border border-dashed border-border/40 rounded-lg m-1 min-h-[160px]">
							<span>لا توجد طلبات في هذه المرحلة</span>
						</div>
					)}
				</div>
			</SortableContext>
		</div>
	);
};

export type KanbanHeaderProps = HTMLAttributes<HTMLDivElement>;

export const KanbanHeader = ({ className, ...props }: KanbanHeaderProps) => (
	<div
		className={cn("m-0 p-2 font-semibold text-sm", className)}
		{...props}
	/>
);

export type KanbanProviderProps<
	T extends KanbanItemProps = KanbanItemProps,
	C extends KanbanColumnProps = KanbanColumnProps,
> = Omit<DndContextProps, "children"> & {
	children: (column: C) => ReactNode;
	className?: string;
	columns: C[];
	data: T[];
	/**
	 * Some boards persist a column change as soon as `onDataChange` fires.  They
	 * must opt out of the temporary cross-column update emitted while dragging,
	 * otherwise merely hovering a column is treated as a committed transition.
	 */
	previewCrossColumnOnDragOver?: boolean;
	onDataChange?: (data: T[]) => void;
	onDragStart?: (event: DragStartEvent) => void;
	onDragEnd?: (event: DragEndEvent) => void;
	onDragOver?: (event: DragOverEvent) => void;
};

export const KanbanProvider = <
	T extends KanbanItemProps = KanbanItemProps,
	C extends KanbanColumnProps = KanbanColumnProps,
>({
	children,
	onDragStart,
	onDragEnd,
	onDragCancel,
	onDragOver,
	className,
	columns,
	data,
	disabled = false,
	previewCrossColumnOnDragOver = true,
	onDataChange,
	...props
}: KanbanProviderProps<T, C>) => {
	const [activeCardId, setActiveCardId] = useState<string | null>(null);

	const standardSensors = useSensors(
		useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
		useSensor(TouchSensor, { activationConstraint: { distance: 5 } }),
		useSensor(KeyboardSensor),
	);
	const emptySensors = useSensors();
	const sensors = disabled ? emptySensors : standardSensors;

	const handleDragStart = (event: DragStartEvent) => {
		if (disabled) return;
		const card = data.find((item) => item.id === event.active.id);
		if (card) {
			setActiveCardId(event.active.id as string);
		}
		onDragStart?.(event);
	};

	const handleDragOver = (event: DragOverEvent) => {
		if (disabled) return;
		const { active, over } = event;

		if (!over) {
			return;
		}

		const activeItem = data.find((item) => item.id === active.id);
		const overItem = data.find((item) => item.id === over.id);

		if (!activeItem) {
			return;
		}

		const activeColumn = activeItem.column;
		const overColumn =
			overItem?.column || columns.find((col) => col.id === over.id)?.id || columns[0]?.id;

		if (previewCrossColumnOnDragOver && activeColumn !== overColumn) {
			let newData = [...data];
			const activeIndex = newData.findIndex((item) => item.id === active.id);
			if (activeIndex !== -1) {
				newData[activeIndex] = { ...newData[activeIndex], column: overColumn };
				const overIndex = overItem
					? newData.findIndex((item) => item.id === over.id)
					: -1;

				if (overIndex !== -1) {
					newData = arrayMove(newData, activeIndex, overIndex);
				}

				onDataChange?.(newData);
			}
		}

		onDragOver?.(event);
	};

	const handleDragEnd = (event: DragEndEvent) => {
		if (disabled) return;
		setActiveCardId(null);

		onDragEnd?.(event);

		const { active, over } = event;

		if (!over) {
			return;
		}

		const activeItem = data.find((item) => item.id === active.id);
		if (!activeItem) {
			return;
		}

		const overItem = data.find((item) => item.id === over.id);
		const overColumn =
			overItem?.column || columns.find((col) => col.id === over.id)?.id || activeItem.column;

		let newData = [...data];
		const oldIndex = newData.findIndex((item) => item.id === active.id);
		if (oldIndex === -1) return;

		let hasChanges = false;
		if (newData[oldIndex].column !== overColumn) {
			newData[oldIndex] = { ...newData[oldIndex], column: overColumn };
			hasChanges = true;
		}

		if (overItem && active.id !== over.id) {
			const newIndex = newData.findIndex((item) => item.id === over.id);
			if (newIndex !== -1 && oldIndex !== newIndex) {
				newData = arrayMove(newData, oldIndex, newIndex);
				hasChanges = true;
			}
		}

		if (hasChanges) {
			onDataChange?.(newData);
		}
	};

	const handleDragCancel = (event: DragCancelEvent) => {
		if (disabled) return;
		setActiveCardId(null);
		onDragCancel?.(event);
	};

	const announcements: Announcements = {
		onDragStart({ active }) {
			const { name, column } = data.find((item) => item.id === active.id) ?? {};

			return `Picked up the card "${name}" from the "${column}" column`;
		},
		onDragOver({ active, over }) {
			const { name } = data.find((item) => item.id === active.id) ?? {};
			const newColumn = columns.find((column) => column.id === over?.id)?.name;

			return `Dragged the card "${name}" over the "${newColumn}" column`;
		},
		onDragEnd({ active, over }) {
			const { name } = data.find((item) => item.id === active.id) ?? {};
			const newColumn = columns.find((column) => column.id === over?.id)?.name;

			return `Dropped the card "${name}" into the "${newColumn}" column`;
		},
		onDragCancel({ active }) {
			const { name } = data.find((item) => item.id === active.id) ?? {};

			return `Cancelled dragging the card "${name}"`;
		},
	};

	return (
		<KanbanContext.Provider value={{ columns, data, activeCardId, disabled }}>
			<DndContext
				accessibility={{ announcements }}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}
				onDragOver={handleDragOver}
				onDragStart={handleDragStart}
				sensors={sensors}
				{...props}
			>
				<div className={cn("grid size-full auto-cols-fr grid-flow-col gap-4 pb-2", className)}>
					{columns.map((column) => children(column))}
				</div>
				{typeof window !== "undefined" &&
					createPortal(
						<DragOverlay>
							<div dir={document.documentElement.dir || "ltr"}>
								<t.Out />
							</div>
						</DragOverlay>,
						document.body,
					)}
			</DndContext>
		</KanbanContext.Provider>
	);
};

import {
	closestCenter,
	DndContext,
	type DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type {
	LessonContentItem,
	LessonType,
} from "@sanad/contracts/runtime/server/training/training.type";
import {
	IconFileDescription,
	IconFileText,
	IconGripVertical,
	IconMicrophone,
	IconPlus,
	IconTrash,
	IconVideo,
} from "@tabler/icons-react";
import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CoursePageBlocksField } from "@/features/services/training/components/course-page-inline-editor";
import { MediaUploadField } from "@/features/services/training/components/media-upload-field";
import { LESSON_ACCEPT } from "@/features/services/training/data/training";
import { useUploadMedia } from "@/features/services/training/hooks/use-upload-media";
import { cn } from "@/lib/utils";

const CONTENT_OPTIONS: { type: LessonType; label: string; Icon: typeof IconVideo }[] = [
	{ type: "PAGE", label: "صفحة", Icon: IconFileText },
	{ type: "TEXT", label: "نص", Icon: IconFileText },
	{ type: "VIDEO", label: "فيديو", Icon: IconVideo },
	{ type: "DOCUMENT", label: "مستند", Icon: IconFileDescription },
	{ type: "AUDIO", label: "صوت", Icon: IconMicrophone },
];

function createContent(type: LessonType): LessonContentItem {
	return {
		id: `content-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		type,
		title: CONTENT_OPTIONS.find((option) => option.type === type)?.label ?? "محتوى جديد",
		mediaSource: "URL",
	};
}

function SortableContentItem({
	item,
	disabled,
	onChange,
	onRemove,
}: {
	item: LessonContentItem;
	disabled: boolean;
	onChange: (update: Partial<LessonContentItem>) => void;
	onRemove: () => void;
}) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable(
		{
			id: item.id,
			disabled,
		},
	);
	const uploadState = useUploadMedia();
	const Icon =
		CONTENT_OPTIONS.find((option) => option.type === item.type)?.Icon ?? IconFileText;
	const fileName =
		item.mediaKey
			?.split("/")
			.pop()
			?.replace(/^[\\w-]{8,}_/, "") ?? "";
	const upload = useCallback(
		async (file: File | undefined) => {
			if (!file) return;
			try {
				const result = await uploadState.upload(file);
				onChange({ mediaSource: "DEVICE", mediaKey: result.key, mediaUrl: null });
			} catch {
				onChange({ mediaKey: null });
			}
		},
		[onChange, uploadState.upload],
	);

	return (
		<div
			ref={setNodeRef}
			style={{ transform: CSS.Transform.toString(transform), transition }}
			className={cn(
				"rounded-md border bg-white",
				isDragging ? "z-10 border-primary opacity-70 shadow-lg" : "border-[#E5E5E5]",
			)}
		>
			<div className="flex items-center gap-2 border-b border-[#EFEFEF] px-2 py-1.5">
				<button
					type="button"
					{...attributes}
					{...listeners}
					aria-label={`تحريك ${item.title || "المحتوى"}`}
					className="touch-none cursor-grab text-[#9B9B9D] active:cursor-grabbing"
				>
					<IconGripVertical className="size-4" />
				</button>
				<Icon className="size-4 shrink-0 text-primary" />
				<Input
					value={item.title}
					onChange={(event) => onChange({ title: event.target.value })}
					placeholder="عنوان المحتوى"
					aria-label="عنوان المحتوى"
					disabled={disabled}
					className="h-7 min-w-0 flex-1 border-0 px-1 text-[11px] shadow-none focus-visible:ring-0"
				/>
				<button
					type="button"
					onClick={onRemove}
					disabled={disabled}
					aria-label={`حذف ${item.title || "المحتوى"}`}
					className="rounded p-1 text-[#9B9B9D] hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
				>
					<IconTrash className="size-3.5" />
				</button>
			</div>

			<div className="flex flex-col gap-2 p-2">
				{item.type === "PAGE" ? (
					<CoursePageBlocksField
						value={item.content}
						onChange={(content) => onChange({ content })}
						className="border-0"
						minEditorHeightClassName="min-h-[160px]"
					/>
				) : item.type === "TEXT" ? (
					<Textarea
						value={item.content ?? ""}
						onChange={(event) => onChange({ content: event.target.value })}
						placeholder="اكتب محتوى النص هنا..."
						disabled={disabled}
						className="min-h-24 text-[12px]"
					/>
				) : (
					<div className="flex flex-col gap-2">
						<div className="flex items-center gap-1 rounded bg-[#F8F8FC] p-1">
							{(["URL", "DEVICE"] as const).map((source) => (
								<button
									key={source}
									type="button"
									onClick={() => onChange({ mediaSource: source })}
									className={cn(
										"rounded px-2 py-1 text-[10px]",
										item.mediaSource === source
											? "bg-white font-semibold text-primary shadow-xs"
											: "text-muted-foreground",
									)}
								>
									{source === "URL" ? "رابط" : "رفع ملف"}
								</button>
							))}
						</div>
						{item.mediaSource === "URL" ? (
							<Input
								value={item.mediaUrl ?? ""}
								onChange={(event) => onChange({ mediaUrl: event.target.value })}
								placeholder="الصق رابط المحتوى هنا..."
								disabled={disabled}
								className="h-8 text-[11px]"
							/>
						) : (
							<MediaUploadField
								fileName={fileName}
								progress={uploadState.progress}
								isUploading={uploadState.isUploading}
								placeholder="ارفع الملف أو اسحبه هنا..."
								accept={LESSON_ACCEPT[item.type]}
								disabled={disabled || uploadState.isUploading}
								onPick={(file) => void upload(file)}
								onClear={() => {
									uploadState.reset();
									onChange({ mediaKey: null });
								}}
							/>
						)}
					</div>
				)}
				<Textarea
					value={item.description ?? ""}
					onChange={(event) => onChange({ description: event.target.value })}
					placeholder="وصف أو ملاحظات اختيارية للمحتوى"
					disabled={disabled}
					className="min-h-14 text-[11px]"
				/>
			</div>
		</div>
	);
}

export function CourseLessonContentsField({
	value,
	onChange,
	disabled = false,
}: {
	value?: LessonContentItem[];
	onChange: (items: LessonContentItem[]) => void;
	disabled?: boolean;
}) {
	const items = value ?? [];
	const sensors = useSensors(
		useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
		useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
	);
	const handleDragEnd = ({ active, over }: DragEndEvent) => {
		if (!over || active.id === over.id) return;
		const from = items.findIndex((item) => item.id === active.id);
		const to = items.findIndex((item) => item.id === over.id);
		if (from < 0 || to < 0) return;
		const next = [...items];
		const [moved] = next.splice(from, 1);
		next.splice(to, 0, moved);
		onChange(next);
	};

	return (
		<div className="flex flex-col gap-2 rounded-md border border-dashed border-[#DCDCF0] bg-[#FCFCFF] p-2">
			<div className="flex flex-wrap items-center justify-between gap-2">
				<div>
					<p className="text-[11px] font-semibold text-[#30303A]">محتوى إضافي لهذا الدرس</p>
					<p className="text-[10px] text-muted-foreground">
						أضيفي أكثر من نوع، واسحبي المقبض لتغيير الترتيب.
					</p>
				</div>
				<div className="flex flex-wrap gap-1">
					{CONTENT_OPTIONS.map(({ type, label, Icon }) => (
						<Button
							key={type}
							type="button"
							variant="outline"
							size="sm"
							disabled={disabled}
							onClick={() => onChange([...items, createContent(type)])}
							className="h-7 gap-1 px-2 text-[10px]"
						>
							<Icon className="size-3" />
							<IconPlus className="size-3" />
							{label}
						</Button>
					))}
				</div>
			</div>

			{items.length > 0 ? (
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={items.map((item) => item.id)}
						strategy={verticalListSortingStrategy}
					>
						<div className="flex flex-col gap-2">
							{items.map((item, index) => (
								<SortableContentItem
									key={item.id}
									item={item}
									disabled={disabled}
									onChange={(update) =>
										onChange(
											items.map((current, i) =>
												i === index ? { ...current, ...update } : current,
											),
										)
									}
									onRemove={() => onChange(items.filter((_, i) => i !== index))}
								/>
							))}
						</div>
					</SortableContext>
				</DndContext>
			) : (
				<div className="rounded border border-dashed border-[#E5E5E5] px-3 py-4 text-center text-[10px] text-muted-foreground">
					لا يوجد محتوى إضافي. استخدمي الأزرار لإضافة صفحة أو فيديو أو مستند.
				</div>
			)}
		</div>
	);
}

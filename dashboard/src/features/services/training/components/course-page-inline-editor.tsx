"use client";

import type { PartialBlock } from "@blocknote/core";
import {
	IconAlertCircle,
	IconCheck,
	IconFileText,
	IconPlus,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type EditorPage = {
	id: string;
	title: string;
	content: PartialBlock[];
};

type SerializedPages = {
	version: 1;
	pages: EditorPage[];
};

type BlockNoteEditorComponent =
	typeof import("./course-blocknote-editor").CourseBlockNoteEditor;

const EMPTY_DOCUMENT: PartialBlock[] = [{ type: "paragraph" }];

function newPage(title = "صفحة جديدة"): EditorPage {
	return {
		id: `page-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
		title,
		content: [...EMPTY_DOCUMENT],
	};
}

function toInlineContent(text: string) {
	return text ? [{ type: "text" as const, text, styles: {} }] : [];
}

/** Migrate the hand-written editor's legacy blocks and old plain text to BlockNote blocks. */
function normalizeLegacyContent(value: unknown): PartialBlock[] {
	if (typeof value === "string") {
		return value.trim()
			? [{ type: "paragraph", content: toInlineContent(value) }]
			: [...EMPTY_DOCUMENT];
	}
	if (!Array.isArray(value) || value.length === 0) return [...EMPTY_DOCUMENT];

	return value.map((raw): PartialBlock => {
		if (!raw || typeof raw !== "object") return { type: "paragraph" };
		const block = raw as {
			id?: unknown;
			type?: string;
			content?: unknown;
			children?: unknown;
			props?: Record<string, unknown>;
		};
		// مستندات BlockNote الحقيقية تحتوي id أو children أو مصفوفة content أو أنواع أعمدة/جداول/وسائط — تُمرَّر كما هي دون تجريد
		const isBlockNoteBlock =
			typeof block.id === "string" ||
			Array.isArray(block.children) ||
			Array.isArray(block.content) ||
			block.type === "columnList" ||
			block.type === "column" ||
			block.type === "table" ||
			block.type === "divider" ||
			block.type === "video" ||
			block.type === "audio" ||
			block.type === "file" ||
			(block.content !== undefined && typeof block.content === "object");

		if (isBlockNoteBlock) {
			return raw as PartialBlock;
		}

		const text = typeof block.content === "string" ? block.content : "";
		const content = toInlineContent(text);
		switch (block.type) {
			case "heading":
				return {
					type: "heading",
					props: {
						level: block.props?.level === 1 ? 1 : block.props?.level === 3 ? 3 : 2,
					},
					content,
				};
			case "bulletListItem":
				return { type: "bulletListItem", content };
			case "numberedListItem":
				return { type: "numberedListItem", content };
			case "codeBlock":
				return { type: "codeBlock", props: { language: "text" }, content: text };
			case "quote":
				return { type: "paragraph", props: { textColor: "gray" }, content };
			case "image":
				return block.props?.url
					? {
							type: "image",
							props: {
								url: String(block.props.url),
								caption: String(block.props.caption ?? ""),
							},
						}
					: { type: "paragraph", content };
			default:
				return { type: "paragraph", content };
		}
	});
}

export function readPages(initialContent?: string | null): EditorPage[] {
	if (!initialContent) return [newPage("الصفحة الأولى")];
	try {
		const parsed: unknown = JSON.parse(initialContent);
		if (
			parsed &&
			typeof parsed === "object" &&
			"version" in parsed &&
			"pages" in parsed &&
			Array.isArray(parsed.pages)
		) {
			const pages = parsed.pages as Partial<EditorPage>[];
			if (pages.length) {
				return pages.map((page, index) => ({
					id: page.id || `page-${index + 1}`,
					title: page.title || `الصفحة ${index + 1}`,
					content: normalizeLegacyContent(page.content),
				}));
			}
		}
		return [{ ...newPage("الصفحة الأولى"), content: normalizeLegacyContent(parsed) }];
	} catch {
		return [{ ...newPage("الصفحة الأولى"), content: normalizeLegacyContent(initialContent) }];
	}
}

export function serializePages(pages: EditorPage[]): string {
	const data: SerializedPages = { version: 1, pages };
	return JSON.stringify(data);
}

export function createInitialPageContent(): string {
	return serializePages([newPage("الصفحة الأولى")]);
}

function blockHasContent(block: PartialBlock): boolean {
	const blockType = block.type as string | undefined;
	if (blockType === "columnList" || blockType === "column") {
		return Array.isArray(block.children) && block.children.some(blockHasContent);
	}
	if (blockType && blockType !== "paragraph") return true;
	if (typeof block.content === "string" && block.content.trim().length > 0) return true;
	if (Array.isArray(block.content)) {
		const hasInline = block.content.some((item) => {
			if (!item || typeof item !== "object") return false;
			if ("text" in item && typeof item.text === "string") return item.text.trim().length > 0;
			return true;
		});
		if (hasInline) return true;
	}
	return Array.isArray(block.children) && block.children.some(blockHasContent);
}

function hasMeaningfulPageContent(pages: EditorPage[]): boolean {
	return pages.length > 1 || pages.some((page) => page.content.some(blockHasContent));
}

interface CoursePageBlocksFieldProps {
	value?: string | null;
	onChange: (serialized: string) => void;
	onActivePageChange?: (pageId: string) => void;
	disabled?: boolean;
	/** Return empty string when only a blank default paragraph remains so form validation can flag empty lessons. */
	emitEmptyWhenBlank?: boolean;
	minEditorHeightClassName?: string;
	className?: string;
}

export function CoursePageBlocksField({
	value,
	onChange,
	onActivePageChange,
	disabled = false,
	emitEmptyWhenBlank = true,
	minEditorHeightClassName = "min-h-[260px]",
	className,
}: CoursePageBlocksFieldProps) {
	const [pages, setPages] = useState<EditorPage[]>(() => readPages(value));
	const [activePageId, setActivePageId] = useState<string | null>(null);
	const [BlockNoteEditor, setBlockNoteEditor] = useState<BlockNoteEditorComponent | null>(
		null,
	);
	const lastEmittedRef = useRef<string | null | undefined>(value);

	const activePage = pages.find((page) => page.id === activePageId) ?? pages[0];

	useEffect(() => {
		if (activePage?.id) onActivePageChange?.(activePage.id);
	}, [activePage?.id, onActivePageChange]);

	useEffect(() => {
		let cancelled = false;
		void import("./course-blocknote-editor").then((module) => {
			if (!cancelled) setBlockNoteEditor(() => module.CourseBlockNoteEditor);
		});
		return () => {
			cancelled = true;
		};
	}, []);

	useEffect(() => {
		if (value === lastEmittedRef.current) return;
		lastEmittedRef.current = value;
		const parsed = readPages(value);
		setPages(parsed);
		setActivePageId(parsed[0]?.id ?? null);
	}, [value]);

	const commitPages = useCallback(
		(next: EditorPage[]) => {
			const nextSerialized =
				!emitEmptyWhenBlank || hasMeaningfulPageContent(next) ? serializePages(next) : "";
			lastEmittedRef.current = nextSerialized;
			onChange(nextSerialized);
		},
		[emitEmptyWhenBlank, onChange],
	);

	const updatePage = (id: string, update: Partial<EditorPage>) => {
		setPages((current) => {
			const next = current.map((page) => (page.id === id ? { ...page, ...update } : page));
			commitPages(next);
			return next;
		});
	};

	const addPage = () => {
		const page = newPage(`الصفحة ${pages.length + 1}`);
		const next = [...pages, page];
		setPages(next);
		setActivePageId(page.id);
		commitPages(next);
	};

	const deletePage = (id: string) => {
		if (pages.length <= 1) return;
		const next = pages.filter((page) => page.id !== id);
		setPages(next);
		if (activePage?.id === id) setActivePageId(next[0].id);
		commitPages(next);
	};

	return (
		<div
			className={cn(
				"sanad-page-canvas overflow-hidden rounded-[6px] border border-[#E5E5E5] bg-white",
				disabled && "pointer-events-none opacity-60",
				className,
			)}
			dir="rtl"
		>
			{/* شريط الصفحات والإرشاد السريع */}
			<div className="ps-[54px] pe-3 pt-2.5">
				{pages.length === 1 ? (
					<div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFEFEF] pb-2.5">
						<p className="text-[11px] text-[#9B9B9D]">
							اكتب{" "}
							<kbd className="rounded bg-[#F4F4F6] px-1 py-0.5 font-mono text-[10px] text-[#6B6B67]">
								/
							</kbd>{" "}
							لإدراج العناوين والقوائم والصور والجداول، أو حرّك المؤشر لليمين لظهور{" "}
							<span className="font-medium text-[#6B6B67]">+ و ⋮⋮</span>
						</p>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={addPage}
							className="h-[24px] shrink-0 gap-1 rounded-[4px] border-[#E5E5E5] bg-white px-2 text-[11px] font-medium text-[#08090A] hover:bg-[#FAFAFA] cursor-pointer"
						>
							<IconPlus className="size-3" />
							إضافة صفحة
						</Button>
					</div>
				) : (
					<div className="flex items-center justify-between gap-3 border-b border-[#E5E5E5]">
						<div
							className="flex min-w-0 items-center gap-1 overflow-x-auto"
							role="tablist"
							aria-label="صفحات الدرس"
						>
							{pages.map((page, index) => {
								const isActive = activePage?.id === page.id;
								return (
									<div
										key={page.id}
										className={cn(
											"group flex shrink-0 items-center gap-1 border-b-2 px-2 py-1.5 transition-colors",
											isActive ? "border-[#6366F1]" : "border-transparent",
										)}
									>
										<button
											type="button"
											role="tab"
											aria-selected={isActive}
											onClick={() => setActivePageId(page.id)}
											className={cn(
												"max-w-36 truncate text-[12px] cursor-pointer",
												isActive
													? "font-semibold text-[#4F46E5]"
													: "text-[#6B6B67] hover:text-[#08090A]",
											)}
										>
											{page.title || `الصفحة ${index + 1}`}
										</button>
										<button
											type="button"
											onClick={() => deletePage(page.id)}
											aria-label={`حذف ${page.title}`}
											title="حذف الصفحة"
											className={cn(
												"rounded p-0.5 text-[#9B9B9D] transition-opacity hover:bg-rose-50 hover:text-rose-600 cursor-pointer",
												isActive ? "opacity-75" : "opacity-0 group-hover:opacity-75",
											)}
										>
											<IconTrash className="size-3" />
										</button>
									</div>
								);
							})}
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={addPage}
							className="mb-1 h-[24px] shrink-0 gap-1 rounded-[4px] border-[#E5E5E5] bg-white px-2 text-[11px] font-medium text-[#08090A] hover:bg-[#FAFAFA] cursor-pointer"
						>
							<IconPlus className="size-3" />
							إضافة صفحة
						</Button>
					</div>
				)}
			</div>

			{/* عنوان الصفحة الفرعية يظهر فقط عند وجود أكثر من صفحة */}
			{pages.length > 1 && activePage && (
				<div className="mt-3 ps-[54px] pe-4">
					<input
						value={activePage.title}
						onChange={(event) => updatePage(activePage.id, { title: event.target.value })}
						aria-label="اسم الصفحة"
						className="sanad-page-text-input w-full border-0 bg-transparent p-0 text-[16px] font-bold text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
						placeholder="عنوان هذه الصفحة..."
					/>
				</div>
			)}

			{/* محرر BlockNote مفتوح بمقبض + و ⋮⋮ على اليمين */}
			<div className="py-2">
				{activePage && BlockNoteEditor ? (
					<BlockNoteEditor
						key={activePage.id}
						page={activePage}
						onChange={(content) => updatePage(activePage.id, { content })}
					/>
				) : (
					<div
						className={cn(
							"flex items-center justify-center ps-[54px] pe-3 text-xs text-[#9B9B9D]",
							minEditorHeightClassName,
						)}
					>
						جاري تجهيز المحرر...
					</div>
				)}
			</div>
		</div>
	);
}

interface CoursePageInlineEditorProps {
	initialTitle?: string;
	initialContent?: string | null;
	unitTitle?: string;
	onSave: (data: { title: string; content: string }) => Promise<void> | void;
	onValuesChange?: (data: { title: string; content: string }) => void;
	onCancel: () => void;
	isSaving?: boolean;
	autoSave?: boolean;
}

export function CoursePageInlineEditor({
	initialTitle = "",
	initialContent,
	unitTitle,
	onSave,
	onValuesChange,
	onCancel,
	isSaving = false,
	autoSave = true,
}: CoursePageInlineEditorProps) {
	const [title, setTitle] = useState(initialTitle);
	const [content, setContent] = useState<string>(
		() => initialContent ?? createInitialPageContent(),
	);
	const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
	const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const titleTextareaRef = useRef<HTMLTextAreaElement>(null);

	const save = useCallback(
		(nextTitle: string, nextContent: string) => {
			onValuesChange?.({ title: nextTitle, content: nextContent });
			if (!autoSave) return;
			if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
			setSaveState("saving");
			debounceTimerRef.current = setTimeout(async () => {
				try {
					await onSave({ title: nextTitle, content: nextContent });
					setSaveState("saved");
				} catch {
					setSaveState("error");
				}
			}, 1200);
		},
		[autoSave, onSave, onValuesChange],
	);

	useEffect(
		() => () => {
			if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
		},
		[],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: resize the textarea when its value changes.
	useEffect(() => {
		const el = titleTextareaRef.current;
		if (el) {
			el.style.height = "auto";
			el.style.height = `${el.scrollHeight}px`;
		}
	}, [title]);

	const updateTitle = (value: string) => {
		setTitle(value);
		save(value, content);
	};

	const updateContent = (nextContent: string) => {
		setContent(nextContent);
		save(title, nextContent);
	};

	const saveNewLesson = () => {
		if (!title.trim()) {
			toast.error("يرجى إدخال عنوان الدرس أولاً");
			titleTextareaRef.current?.focus();
			return;
		}
		return onSave({ title: title.trim(), content });
	};

	return (
		<div
			className="flex min-h-0 flex-1 flex-col bg-white font-sans text-right"
			dir="rtl"
		>
			{/* شريط ترويسة موحّد مع بقية محررات الدروس في المنصة */}
			<div className="sticky top-0 z-20 flex shrink-0 items-center justify-between border-b border-[#E5E5E5] bg-white px-4 py-2.5 shadow-2xs">
				<div className="flex items-center gap-2">
					<span className="flex size-7 items-center justify-center rounded-md bg-[#6366F1]/10 text-[#6366F1]">
						<IconFileText className="size-4" />
					</span>
					<div className="flex flex-col">
						<div className="flex items-center gap-1.5">
							<span className="text-[12px] font-bold text-[#08090A]">
								{autoSave ? "محرر الصفحة التعليمية" : "إنشاء صفحة تعليمية"}
							</span>
							<span className="rounded bg-[#6366F1]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[#6366F1]">
								صفحة
							</span>
						</div>
						{unitTitle && (
							<span className="text-[10px] text-[#6B6B67]">
								القسم: <span className="font-semibold text-[#08090A]">{unitTitle}</span>
							</span>
						)}
					</div>
				</div>

				<div className="flex items-center gap-2">
					<div className="px-1.5 py-0.5 text-[11px] font-medium">
						{saveState === "saving" || isSaving ? (
							<span className="flex items-center gap-1 text-[#4F6AE0]">
								<span className="size-1.5 animate-pulse rounded-full bg-[#4F6AE0]" />
								جارٍ الحفظ...
							</span>
						) : saveState === "saved" ? (
							<span className="flex items-center gap-1 text-emerald-600">
								<IconCheck className="size-3.5" />
								تم الحفظ
							</span>
						) : saveState === "error" ? (
							<span className="flex items-center gap-1 text-rose-600">
								<IconAlertCircle className="size-3.5" />
								فشل الحفظ
							</span>
						) : (
							<span className="text-[10px] text-[#9B9B9D]">
								{autoSave ? "حفظ تلقائي" : "مسودة جديدة"}
							</span>
						)}
					</div>

					{!autoSave && (
						<Button
							type="button"
							size="sm"
							onClick={saveNewLesson}
							disabled={isSaving}
							className="h-[26px] rounded-[4px] bg-[#4F6AE0] px-3 text-[11px] font-semibold text-white hover:bg-[#4F6AE0]/90 cursor-pointer"
						>
							{isSaving ? "جارٍ الحفظ..." : "حفظ الصفحة"}
						</Button>
					)}

					<button
						type="button"
						onClick={onCancel}
						className="flex size-6 items-center justify-center rounded-md text-[#9B9B9D] transition-colors hover:bg-[#FAFAFA] hover:text-[#08090A] cursor-pointer"
						aria-label="إغلاق المحرر"
						title="إغلاق"
					>
						<IconX className="size-4" />
					</button>
				</div>
			</div>

			{/* مساحة صفحة Notion المنسّقة — خلفية هادئة تحيط ببطاقة الصفحة، ومقبض +/:: في الهامش الأيمن */}
			<div className="flex-1 overflow-y-auto bg-[#F7F8FB] px-4 py-5 sm:px-6">
				<div className="mx-auto w-full max-w-[820px] rounded-[8px] border border-[#E5E5E5] bg-white py-6 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
					<div className="ps-[54px] pe-4 pb-3">
						<textarea
							ref={titleTextareaRef}
							value={title}
							onChange={(event) => updateTitle(event.target.value)}
							rows={1}
							placeholder="عنوان الصفحة أو الدرس..."
							className="sanad-page-text-input w-full resize-none bg-transparent p-0 text-[24px] font-bold leading-snug text-[#08090A] outline-none placeholder:text-[#9B9B9D] sm:text-[26px]"
						/>
					</div>

					<CoursePageBlocksField
						value={content}
						onChange={updateContent}
						emitEmptyWhenBlank={false}
						minEditorHeightClassName="min-h-[360px]"
						className="rounded-none border-0"
					/>
				</div>
			</div>
		</div>
	);
}

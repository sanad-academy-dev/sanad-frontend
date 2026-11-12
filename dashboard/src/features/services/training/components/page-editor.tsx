/**
 * PageEditor — المحرر الرئيسي للصفحة
 *
 * يعمل في وضعين:
 *   - editable=true  (وضع المدرس): محرر BlockNote كامل + حفظ تلقائي + فهرس
 *   - editable=false (وضع الطالب): عرض قراءة فقط بلا Toolbar
 *
 * المتطلبات:
 *   npm i @blocknote/core @blocknote/react @blocknote/mantine @mantine/core @mantine/hooks
 */
"use client";

import { IconAlertCircle, IconArrowLeft, IconBook2, IconEye } from "@tabler/icons-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BlockNoteDocument, SaveState } from "../hooks/use-page-editor";
import { PageEditorSaveStatus } from "./page-editor-save-status";
import {
	extractHeadings,
	PageTableOfContents,
	type TocHeading,
} from "./page-table-of-contents";

// biome-ignore lint/suspicious/noExplicitAny: Dynamic BlockNote editor type
type BlockNoteEditorType<T = any> = any;

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PageEditorProps {
	/** معرف الصفحة — يُستخدم للحفظ وتحميل البيانات */
	pageId: string;
	/** العنوان الابتدائي */
	initialTitle?: string;
	/** المحتوى الابتدائي (JSON بلوكات BlockNote) */
	initialContent?: BlockNoteDocument;
	/** وضع التحرير (true=مدرس, false=طالب) */
	editable?: boolean;
	/** حالة الحفظ من usePageEditor */
	saveState?: SaveState;
	/** يُستدعى عند تغيير العنوان */
	onTitleChange?: (title: string) => void;
	/** يُستدعى عند تغيير المحتوى */
	onContentChange?: (doc: BlockNoteDocument) => void;
	/** يُستدعى عند الضغط على "رجوع" */
	onBack?: () => void;
	/** رفع ملف للمحرر — يُعيد URL */
	uploadFile?: (file: File) => Promise<string>;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PageEditor({
	pageId: _pageId,
	initialTitle = "",
	initialContent,
	editable = true,
	saveState = "idle",
	onTitleChange,
	onContentChange,
	onBack,
	uploadFile,
}: PageEditorProps) {
	const [title, setTitle] = useState(initialTitle);
	const [headings, setHeadings] = useState<TocHeading[]>(() =>
		initialContent ? extractHeadings(initialContent) : [],
	);
	const [BlockNoteLoaded, setBlockNoteLoaded] = useState(false);
	const [blockNoteError, setBlockNoteError] = useState(false);
	const [fallbackContent, setFallbackContent] = useState(() =>
		typeof initialContent === "string" ? initialContent : "",
	);

	// biome-ignore lint/suspicious/noExplicitAny: Dynamic BlockNote types
	const [BlockNoteComponents, setBlockNoteComponents] = useState<{
		// biome-ignore lint/suspicious/noExplicitAny: Dynamic BlockNote types
		BlockNoteView: React.ComponentType<any>;
		// biome-ignore lint/suspicious/noExplicitAny: Dynamic BlockNote types
		useCreateBlockNote: (opts: any) => BlockNoteEditorType<any>;
	} | null>(null);

	// biome-ignore lint/suspicious/noExplicitAny: Dynamic BlockNote types
	const editorRef = useRef<BlockNoteEditorType<any> | null>(null);

	// ─── Load BlockNote dynamically with vite-ignore ────────────────────────
	useEffect(() => {
		let cancelled = false;
		async function loadBlockNote() {
			try {
				const corePkg = "@blocknote/core";
				const reactPkg = "@blocknote/react";
				const mantinePkg = "@blocknote/mantine";
				const cssPkg = "@blocknote/mantine/style.css";

				const [, reactModule, { BlockNoteView }] = await Promise.all([
					import(/* @vite-ignore */ corePkg),
					import(/* @vite-ignore */ reactPkg),
					import(/* @vite-ignore */ mantinePkg),
				]);

				await import(/* @vite-ignore */ cssPkg);

				if (!cancelled) {
					setBlockNoteComponents({
						BlockNoteView,
						useCreateBlockNote: reactModule.useCreateBlockNote,
					});
					setBlockNoteLoaded(true);
				}
			} catch (err) {
				console.warn("[PageEditor] BlockNote packages not yet available:", err);
				if (!cancelled) {
					setBlockNoteError(true);
				}
			}
		}
		loadBlockNote();
		return () => {
			cancelled = true;
		};
	}, []);

	// ─── Title ────────────────────────────────────────────────────────────────
	const handleTitleChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const val = e.target.value;
			setTitle(val);
			onTitleChange?.(val);
		},
		[onTitleChange],
	);

	// Auto-resize textarea
	const titleRef = useRef<HTMLTextAreaElement>(null);
	useEffect(() => {
		const el = titleRef.current;
		if (!el) return;
		el.style.height = "auto";
		el.style.height = `${el.scrollHeight}px`;
	}, []);

	// ─── Render ───────────────────────────────────────────────────────────────

	return (
		<div
			dir="rtl"
			className="flex flex-col h-full bg-background"
		>
			{/* ─── Top Bar (Instructor Mode) ─── */}
			{editable && (
				<div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border/60 bg-card shrink-0">
					{onBack && (
						<button
							type="button"
							onClick={onBack}
							className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
						>
							<IconArrowLeft className="size-3.5 rotate-180" />
							رجوع
						</button>
					)}

					<div className="flex items-center gap-2 flex-1 justify-end">
						<PageEditorSaveStatus state={saveState} />

						<Button
							type="button"
							variant="outline"
							size="sm"
							className="h-7 gap-1.5 text-xs rounded-lg"
						>
							<IconEye className="size-3.5" />
							معاينة
						</Button>

						<Button
							type="button"
							size="sm"
							className="h-7 gap-1.5 text-xs rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
						>
							<IconBook2 className="size-3.5" />
							نشر
						</Button>
					</div>
				</div>
			)}

			{/* ─── Top Bar (Student Mode Back Button if provided) ─── */}
			{!editable && onBack && (
				<div className="flex items-center px-4 py-2 border-b border-border/60 bg-card shrink-0">
					<button
						type="button"
						onClick={onBack}
						className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
					>
						<IconArrowLeft className="size-3.5 rotate-180" />
						رجوع للدرس
					</button>
				</div>
			)}

			{/* ─── Body ─── */}
			<div className="flex-1 flex min-h-0 overflow-hidden">
				{/* ─── Main Content ─── */}
				<div className="flex-1 overflow-y-auto">
					<div className="max-w-3xl mx-auto px-6 py-10">
						{/* Title Input */}
						{editable ? (
							<textarea
								ref={titleRef}
								value={title}
								onChange={handleTitleChange}
								placeholder="عنوان الصفحة..."
								rows={1}
								className={cn(
									"w-full resize-none bg-transparent border-none outline-none",
									"text-3xl font-bold text-foreground leading-tight mb-8",
									"placeholder:text-muted-foreground/40 font-sans",
								)}
								style={{ overflow: "hidden" }}
							/>
						) : (
							<h1 className="text-3xl font-bold text-foreground mb-8 font-sans">
								{title || "صفحة بلا عنوان"}
							</h1>
						)}

						{/* BlockNote Editor Loading */}
						{!BlockNoteLoaded && !blockNoteError && (
							<div className="flex items-center justify-center py-20">
								<div className="flex flex-col items-center gap-3 text-muted-foreground">
									<div className="size-8 rounded-full border-2 border-purple-300 border-t-purple-600 animate-spin" />
									<span className="text-sm">جاري تحميل المحرر...</span>
								</div>
							</div>
						)}

						{/* BlockNote Editor Ready */}
						{BlockNoteLoaded && BlockNoteComponents && (
							<BlockNoteEditorInner
								components={BlockNoteComponents}
								initialContent={initialContent}
								editable={editable}
								uploadFile={uploadFile}
								onEditorReady={(editor) => {
									editorRef.current = editor;
								}}
								onContentChange={(doc) => {
									const hs = extractHeadings(doc);
									setHeadings(hs);
									onContentChange?.(doc);
								}}
							/>
						)}

						{/* Fallback Editor if BlockNote is not installed */}
						{blockNoteError && (
							<div className="flex flex-col gap-4">
								<div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
									<div className="flex items-center gap-2 font-bold mb-1">
										<IconAlertCircle className="size-4" />
										<span>محرر BlockNote التفاعلي قيد التجهيز</span>
									</div>
									<p>
										يمكنك كتابة محتوى الدرس أدناه مباشرة، ولتفعيل محرر البلوكات بنمط Notion
										الكامل، شغّل أمر التثبيت في المشروع:
									</p>
									<code className="mt-2 block rounded bg-black/10 dark:bg-white/10 p-2 font-mono text-[11px] select-all">
										npm i @blocknote/core @blocknote/react @blocknote/mantine @mantine/core
										@mantine/hooks
									</code>
								</div>

								{editable ? (
									<textarea
										value={fallbackContent}
										onChange={(e) => {
											setFallbackContent(e.target.value);
											// biome-ignore lint/suspicious/noExplicitAny: fallback doc
											onContentChange?.(e.target.value as any);
										}}
										placeholder="اكتب محتوى الدرس بالتفصيل هنا..."
										rows={12}
										className="w-full rounded-lg border border-border bg-card p-4 text-sm leading-relaxed outline-none focus:border-primary font-sans resize-y"
									/>
								) : (
									<div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground font-sans">
										{fallbackContent || "لا يوجد محتوى في هذه الصفحة بعد."}
									</div>
								)}
							</div>
						)}
					</div>
				</div>

				{/* ─── Sidebar TOC ─── */}
				{headings.length > 0 && (
					<div className="w-64 shrink-0 border-r border-border/60 p-4 overflow-y-auto hidden xl:block">
						<PageTableOfContents headings={headings} />
					</div>
				)}
			</div>
		</div>
	);
}

// ─── Inner Editor (needs Hook) ────────────────────────────────────────────────

function BlockNoteEditorInner({
	components,
	initialContent,
	editable,
	uploadFile,
	onEditorReady,
	onContentChange,
}: {
	components: {
		// biome-ignore lint/suspicious/noExplicitAny: Dynamic BlockNote types
		BlockNoteView: React.ComponentType<any>;
		// biome-ignore lint/suspicious/noExplicitAny: Dynamic BlockNote types
		useCreateBlockNote: (opts: any) => BlockNoteEditorType<any>;
	};
	initialContent?: BlockNoteDocument;
	editable: boolean;
	uploadFile?: (file: File) => Promise<string>;
	// biome-ignore lint/suspicious/noExplicitAny: Dynamic BlockNote types
	onEditorReady: (editor: BlockNoteEditorType<any>) => void;
	onContentChange: (doc: BlockNoteDocument) => void;
}) {
	const { BlockNoteView, useCreateBlockNote } = components;

	const editorOptions = useMemo(
		() => ({
			initialContent: initialContent ?? undefined,
			uploadFile: uploadFile,
			dictionary: {
				placeholders: {
					default: "اكتب '/' للأوامر...",
					emptyDocument: "اضغط '/' لإضافة بلوك...",
					heading: "عنوان",
				},
			},
		}),
		[initialContent, uploadFile],
	);

	const editor = useCreateBlockNote(editorOptions);

	useEffect(() => {
		onEditorReady(editor);
	}, [editor, onEditorReady]);

	return (
		<BlockNoteView
			editor={editor}
			editable={editable}
			theme="light"
			dir="rtl"
			sideMenu={editable}
			formattingToolbar={editable}
			slashMenu={editable}
			tableHandles={editable}
			onChange={() => {
				onContentChange(editor.document);
			}}
			className={cn(
				"bn-container bn-rtl",
				"[&_.bn-editor]:!px-0 [&_.bn-editor]:!min-h-[400px]",
				"[&_.bn-editor]:font-sans [&_.bn-editor]:leading-relaxed",
				"[&_.bn-editor]:caret-purple-600",
				!editable && "[&_.bn-editor]:cursor-default",
			)}
		/>
	);
}

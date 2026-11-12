import { BlockNoteSchema, filterSuggestionItems, type PartialBlock } from "@blocknote/core";
import { ar } from "@blocknote/core/locales";
import { BlockNoteView } from "@blocknote/mantine";
import {
	FormattingToolbar,
	FormattingToolbarController,
	getDefaultReactSlashMenuItems,
	getFormattingToolbarItems,
	SideMenuController,
	SuggestionMenuController,
	useBlockNoteEditor,
	useComponentsContext,
	useCreateBlockNote,
	useSelectedBlocks,
} from "@blocknote/react";
import {
	getMultiColumnSlashMenuItems,
	multiColumnDropCursor,
	locales as multiColumnLocales,
	withMultiColumn,
} from "@blocknote/xl-multi-column";
import { IconLayoutColumns } from "@tabler/icons-react";
import { useCallback, useEffect, useRef } from "react";
import "@blocknote/mantine/style.css";
import { uploadFileForEditor } from "../hooks/use-page-editor";

const pageSchema = withMultiColumn(BlockNoteSchema.create());
type PagePartialBlock = typeof pageSchema.PartialBlock;

type EditorPage = {
	id: string;
	content: PartialBlock[];
};

/** زر بشريط أدوات الصورة/الوسائط لإنشاء عمود نصي بجانب العنصر بنقرة واحدة */
function WriteBesideMediaButton() {
	const editor = useBlockNoteEditor(pageSchema);
	const Components = useComponentsContext();
	const selectedBlocks = useSelectedBlocks(editor);

	const targetBlock =
		selectedBlocks.length === 1 &&
		(selectedBlocks[0].type === "image" ||
			selectedBlocks[0].type === "video" ||
			selectedBlocks[0].type === "audio" ||
			selectedBlocks[0].type === "file")
			? selectedBlocks[0]
			: null;

	const parent = targetBlock ? editor.getParentBlock(targetBlock) : undefined;
	if (!Components || !targetBlock || parent?.type === "column") return null;

	return (
		<Components.FormattingToolbar.Button
			mainTooltip="كتابة نص بجانب العنصر"
			label="نص بجانبه"
			icon={<IconLayoutColumns className="size-4" />}
			onClick={() => {
				const cleanProps = { ...(targetBlock.props as Record<string, unknown>) };
				delete cleanProps.previewWidth;
				const { insertedBlocks } = editor.replaceBlocks(
					[targetBlock],
					[
						{
							type: "columnList",
							children: [
								{
									type: "column",
									props: { width: 1 },
									children: [{ type: "paragraph" }],
								},
								{
									type: "column",
									props: { width: 1 },
									children: [
										{
											type: targetBlock.type,
											props: cleanProps,
										} as PagePartialBlock,
									],
								},
							],
						},
					],
				);
				const firstParagraph = insertedBlocks[0]?.children?.[0]?.children?.[0];
				if (firstParagraph) {
					editor.setTextCursorPosition(firstParagraph, "start");
					editor.focus();
				}
			}}
		>
			<span className="px-1 text-[11px] font-medium">نص بجانبه</span>
		</Components.FormattingToolbar.Button>
	);
}

function CustomFormattingToolbar() {
	return (
		<FormattingToolbar>
			{getFormattingToolbarItems()}
			<WriteBesideMediaButton key="writeBesideMediaButton" />
		</FormattingToolbar>
	);
}

export function CourseBlockNoteEditor({
	page,
	onChange,
}: {
	page: EditorPage;
	onChange: (content: PartialBlock[]) => void;
}) {
	const uploadFile = useCallback(uploadFileForEditor, []);
	const editor = useCreateBlockNote(
		{
			schema: pageSchema,
			dropCursor: multiColumnDropCursor,
			initialContent: (page.content.length
				? page.content
				: [{ type: "paragraph" }]) as PagePartialBlock[],
			uploadFile,
			dictionary: {
				...ar,
				multi_column: multiColumnLocales.ar,
				placeholders: {
					...ar.placeholders,
					default: "اكتب هنا أو اكتب / لإضافة محتوى أو أعمدة...",
					emptyDocument:
						"ابدأ بكتابة محتوى الصفحة، أو اكتب / لإدراج صورة أو عمودين متجاورين...",
				},
			},
		},
		[page.id],
	);
	const handleChange = useCallback(
		() => onChange(editor.document as unknown as PartialBlock[]),
		[editor, onChange],
	);
	const isBlank =
		editor.document.length === 1 &&
		editor.document[0].type === "paragraph" &&
		!editor.document[0].content?.length;
	const applyTemplate = (blocks: PagePartialBlock[]) => {
		if (isBlank) {
			editor.replaceBlocks(editor.document, blocks);
		} else {
			const cursor = editor.getTextCursorPosition();
			editor.insertBlocks(blocks, cursor.block.id, "after");
		}
		editor.focus();
	};

	return (
		<div>
			<div className="mb-2 flex flex-wrap items-center gap-2 rounded-md bg-[#F8F8FC] px-3 py-2">
				<div className="min-w-[145px] flex-1">
					<p className="text-[11px] font-semibold text-[#30303A]">
						{isBlank ? "ابدأ بقالب أو اكتب بطريقتك" : "أضيفي جزءًا جاهزًا للصفحة"}
					</p>
					<p className="mt-0.5 text-[10px] text-muted-foreground">
						{isBlank
							? "استخدمي / لإضافة صور وجداول وأعمدة ومحتوى متنوع."
							: "يُدرج الجزء بعد موضع المؤشر من غير حذف المحتوى الحالي."}
					</p>
				</div>
				<button
					type="button"
					onClick={() =>
						applyTemplate([
							{ type: "heading", props: { level: 2 }, content: "الفكرة الرئيسية" },
							{
								type: "paragraph",
								content: "اشرح الفكرة ببساطة، ثم أضف مثالًا يربطها بتطبيق عملي.",
							},
							{ type: "heading", props: { level: 3 }, content: "مثال تطبيقي" },
							{ type: "paragraph", content: "اكتب المثال أو أدرج صورة توضيحية من قائمة /." },
						])
					}
					className="rounded border border-[#E5E5E5] bg-white px-2 py-1 text-[10px] font-medium text-[#4F46E5] hover:bg-primary/5"
				>
					شرح ومثال
				</button>
				<button
					type="button"
					onClick={() =>
						applyTemplate([
							{ type: "heading", props: { level: 2 }, content: "خطوات التنفيذ" },
							{ type: "numberedListItem", content: "الخطوة الأولى" },
							{ type: "numberedListItem", content: "الخطوة الثانية" },
							{ type: "numberedListItem", content: "الخطوة الثالثة" },
						])
					}
					className="rounded border border-[#E5E5E5] bg-white px-2 py-1 text-[10px] font-medium text-[#4F46E5] hover:bg-primary/5"
				>
					خطوات عملية
				</button>
				<button
					type="button"
					onClick={() =>
						applyTemplate([
							{ type: "heading", props: { level: 2 }, content: "أهداف الصفحة" },
							{ type: "checkListItem", content: "الهدف الأول" },
							{ type: "checkListItem", content: "الهدف الثاني" },
							{ type: "checkListItem", content: "الهدف الثالث" },
						])
					}
					className="rounded border border-[#E5E5E5] bg-white px-2 py-1 text-[10px] font-medium text-[#4F46E5] hover:bg-primary/5"
				>
					أهداف الصفحة
				</button>
			</div>
			<BlockNoteView
				editor={editor}
				dir="rtl"
				theme="light"
				sideMenu={false}
				slashMenu={false}
				formattingToolbar={false}
				onChange={handleChange}
				className="sanad-bn-rtl min-h-[420px]"
			>
				<FormattingToolbarController formattingToolbar={CustomFormattingToolbar} />
				<SideMenuController
					floatingUIOptions={{
						useFloatingOptions: {
							placement: "right-start",
						},
					}}
				/>
				<SuggestionMenuController
					triggerCharacter="/"
					getItems={async (query) =>
						filterSuggestionItems(
							[
								...getDefaultReactSlashMenuItems(editor),
								...getMultiColumnSlashMenuItems(editor),
							],
							query,
						)
					}
					shouldOpen={(tr) => !tr.selection.$from.parent.type.isInGroup("tableContent")}
					floatingUIOptions={{
						useFloatingOptions: {
							placement: "bottom-end",
						},
					}}
				/>
			</BlockNoteView>
		</div>
	);
}

export function CourseBlockNoteReader({ content }: { content: PartialBlock[] }) {
	const editor = useCreateBlockNote(
		{
			schema: pageSchema,
			initialContent: (content.length
				? content
				: [{ type: "paragraph" }]) as PagePartialBlock[],
			dictionary: {
				...ar,
				multi_column: multiColumnLocales.ar,
				placeholders: {
					...ar.placeholders,
					default: "",
					emptyDocument: "",
				},
			},
		},
		[],
	);
	const lastSyncedRef = useRef<string>(JSON.stringify(content));

	useEffect(() => {
		const nextBlocks = (
			content.length ? content : [{ type: "paragraph" }]
		) as PagePartialBlock[];
		const signature = JSON.stringify(nextBlocks);
		if (signature === lastSyncedRef.current) return;
		lastSyncedRef.current = signature;
		try {
			editor.replaceBlocks(editor.document, nextBlocks);
		} catch {
			// تجاهل أي حالة عابرة أثناء إعادة التزامن
		}
	}, [editor, content]);

	return (
		<BlockNoteView
			editor={editor}
			editable={false}
			dir="rtl"
			theme="light"
			sideMenu={false}
			formattingToolbar={false}
			slashMenu={false}
			linkToolbar={false}
			filePanel={false}
			tableHandles={false}
			className="sanad-bn-rtl sanad-bn-rtl-reader"
		/>
	);
}

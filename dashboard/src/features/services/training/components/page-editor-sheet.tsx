/**
 * PageEditorSheet
 * Sheet (drawer) كامل الارتفاع يحتوي PageEditor مع usePageEditor hook
 * يُفتح من ContentCard عند اختيار نوع محتوى PAGE
 */
import { useCallback } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { uploadFileForEditor, usePageEditor } from "../hooks/use-page-editor";
import { PageEditor } from "./page-editor";

interface PageEditorSheetProps {
	/** معرف الصفحة (يُحمّل من API)، أو null لعدم الفتح */
	pageId: string | null;
	/** وضع التحرير (true=مدرس, false=طالب) */
	editable?: boolean;
	/** يُستدعى عند الإغلاق */
	onClose: () => void;
}

export function PageEditorSheet({ pageId, editable = true, onClose }: PageEditorSheetProps) {
	const { page, isLoading, saveState, onTitleChange, onContentChange } = usePageEditor(pageId);

	const handleUpload = useCallback(async (file: File) => {
		return uploadFileForEditor(file);
	}, []);

	return (
		<Sheet
			open={!!pageId}
			onOpenChange={(open) => !open && onClose()}
		>
			<SheetContent
				side="bottom"
				// نجعل الـ Sheet يملأ 95% من الشاشة كصفحة كاملة
				className="h-[95dvh] p-0 flex flex-col rounded-t-2xl overflow-hidden"
			>
				{/* Hidden title for accessibility */}
				<SheetHeader className="sr-only">
					<SheetTitle>محرر الصفحة</SheetTitle>
				</SheetHeader>

				{isLoading ? (
					<div className="flex flex-1 items-center justify-center">
						<div className="flex flex-col items-center gap-3 text-muted-foreground">
							<Spinner className="size-6 text-purple-600" />
							<span className="text-sm">جاري تحميل الصفحة...</span>
						</div>
					</div>
				) : !page ? (
					<div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
						تعذّر تحميل الصفحة
					</div>
				) : (
					<PageEditor
						pageId={page.id}
						initialTitle={page.title}
						initialContent={page.content ?? undefined}
						editable={editable}
						saveState={saveState}
						onTitleChange={onTitleChange}
						onContentChange={onContentChange}
						onBack={onClose}
						uploadFile={handleUpload}
					/>
				)}
			</SheetContent>
		</Sheet>
	);
}

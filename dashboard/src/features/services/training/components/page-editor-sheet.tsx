/**
 * PageEditorSheet
 * Sheet (drawer) كامل الارتفاع يحتوي PageEditor مع usePageEditor hook
 * يُفتح من ContentCard عند اختيار نوع محتوى PAGE
 */
import { useCallback } from "react";
import { Spinner } from "@/components/common/spinner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
		<Dialog
			open={!!pageId}
			onOpenChange={(open) => !open && onClose()}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="h-[92dvh] w-[96vw] max-w-[1500px] overflow-hidden p-0 flex flex-col gap-0"
			>
				{/* Hidden title for accessibility */}
				<DialogHeader className="sr-only">
					<DialogTitle>محرر الصفحة</DialogTitle>
				</DialogHeader>

				{isLoading ? (
					<Spinner containerClassName="py-24 min-h-0 flex-1" />
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
						splitPreview
					/>
				)}
			</DialogContent>
		</Dialog>
	);
}

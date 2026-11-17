import { IconFileText, IconX } from "@tabler/icons-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { TrainingPage } from "../hooks/use-training-pages";
import { CoursePageContent } from "./course-page-content";
import { cleanPageSummary, extractNotesTag } from "./page-dialog";

const fmtDate = (d?: string) =>
	d
		? new Date(d).toLocaleDateString("ar-EG", {
				day: "numeric",
				month: "long",
				year: "numeric",
			})
		: "";

export function PagePreviewDialog({
	page,
	open,
	onClose,
}: {
	page: TrainingPage | null;
	open: boolean;
	onClose: () => void;
}) {
	if (!page) return null;

	const contentStr =
		typeof page.content === "string"
			? page.content
			: page.content
				? JSON.stringify(page.content)
				: "";

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => !next && onClose()}
		>
			<DialogContent
				showCloseButton={false}
				className="w-[95vw] max-w-[95vw] sm:max-w-[1000px] md:max-w-[1100px] h-[88vh] max-h-[88vh] gap-0 rounded-2xl border border-border bg-background p-0 flex flex-col overflow-hidden shadow-2xl"
				dir="rtl"
			>
				{/* ترويسة المعاينة */}
				<div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5 bg-card">
					<div className="flex items-center gap-2.5 min-w-0">
						<span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
							<IconFileText className="size-4" />
						</span>
						<div className="flex flex-col min-w-0">
							<DialogTitle className="truncate text-sm font-bold text-foreground">
								{page.title || "معاينة الصفحة"}
							</DialogTitle>
							<div className="flex items-center gap-2 text-[11px] text-muted-foreground">
								<span className="font-semibold text-primary">{page.category || "عام"}</span>
								<span>•</span>
								<span>{fmtDate(page.updatedAt)}</span>
							</div>
						</div>
					</div>

					<button
						type="button"
						onClick={onClose}
						aria-label="إغلاق المعاينة"
						className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer"
					>
						<IconX className="size-4" />
					</button>
				</div>

				{/* جسم الصفحة المقروءة */}
				<div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-[#F7F8FB] dark:bg-muted/10">
					<div className="mx-auto max-w-[760px] rounded-xl border border-border bg-card p-6 sm:p-8 shadow-xs">
						{cleanPageSummary(page.summary) && (
							<div className="mb-6 rounded-lg border-r-4 border-r-primary bg-primary/[0.04] p-3.5 text-xs leading-relaxed text-muted-foreground">
								{cleanPageSummary(page.summary)}
							</div>
						)}
						{extractNotesTag(page.summary) && (
							<div className="mb-6 rounded-lg border border-amber-200/60 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20 p-3 text-xs leading-relaxed text-amber-800 dark:text-amber-300">
								<span className="font-semibold block mb-1">ملاحظات:</span>
								<p className="whitespace-pre-wrap">{extractNotesTag(page.summary)}</p>
							</div>
						)}

						{contentStr ? (
							<CoursePageContent content={contentStr} />
						) : (
							<div className="py-12 text-center text-xs text-muted-foreground">
								لا يوجد محتوى مكتوب في هذه الصفحة بعد.
							</div>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}

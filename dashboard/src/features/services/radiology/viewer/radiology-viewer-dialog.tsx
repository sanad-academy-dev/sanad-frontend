import { IconExternalLink, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RadiologyStudyViewer } from "@/features/services/radiology/viewer/viewer-page";

// عارض الدراسة داخل نافذة منبثقة بحجم ٩٠٪ من الشاشة — يبقى المستخدم في سياق
// الفحص بدل الانتقال لتبويب آخر، وزر «فتح في تبويب» متاح لمن أراد شاشة كاملة.

export function RadiologyViewerDialog({
	studyId,
	onOpenChange,
}: {
	/** معرّف الدراسة المفتوحة — null يعني الحوار مغلق */
	studyId: string | null;
	onOpenChange: (open: boolean) => void;
}) {
	return (
		<Dialog
			open={!!studyId}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				showCloseButton={false}
				className="h-[90vh] w-[90vw] max-w-[90vw]! gap-0 overflow-hidden border-neutral-800 bg-neutral-950 p-0 sm:max-w-[90vw]"
			>
				<DialogTitle className="sr-only">عارض صور الأشعة</DialogTitle>

				{/* أزرار التحكم فوق العارض — العارض نفسه يملأ ما تبقّى */}
				<div className="relative flex h-full min-h-0 flex-col">
					<div className="absolute end-3 top-3 z-10 flex items-center gap-1.5">
						{studyId && (
							<Button
								type="button"
								size="icon"
								variant="ghost"
								aria-label="فتح في تبويب مستقل"
								title="فتح في تبويب مستقل"
								className="size-8 text-neutral-400 hover:bg-neutral-800 hover:text-white"
								onClick={() => window.open(`/radiology-viewer/${studyId}`, "_blank")}
							>
								<IconExternalLink className="size-4" />
							</Button>
						)}
						<Button
							type="button"
							size="icon"
							variant="ghost"
							aria-label="إغلاق العارض"
							className="size-8 text-neutral-400 hover:bg-neutral-800 hover:text-white"
							onClick={() => onOpenChange(false)}
						>
							<IconX className="size-4" />
						</Button>
					</div>

					{/* إعادة التركيب عند تبديل الدراسة تبني محرّك العرض نظيفًا */}
					{studyId && (
						<RadiologyStudyViewer
							key={studyId}
							studyId={studyId}
						/>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}

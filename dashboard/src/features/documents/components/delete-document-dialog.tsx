import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useI18n } from "@/hooks/use-i18n";
import type { ClinicDocumentResponse } from "@/server/clinic-documents/clinic-documents.type";

export function DeleteDocumentDialog({
	document,
	onOpenChange,
	onConfirm,
	isDeleting,
}: {
	document: ClinicDocumentResponse | null;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	isDeleting: boolean;
}) {
	const { t, isRtl } = useI18n();

	return (
		<Dialog
			open={!!document}
			onOpenChange={onOpenChange}
		>
			{/* محتوى Radix يُنقَل خارج الشجرة (portal) فلا يرث اتجاه الصفحة — يُمرَّر صراحة */}
			<DialogContent dir={isRtl ? "rtl" : "ltr"}>
				<DialogHeader>
					<DialogTitle>{t("documents.delete.title")}</DialogTitle>
					<DialogDescription>
						{t("documents.delete.description", { title: document?.title ?? "" })}
						{document?.kind === "FILE" && ` ${t("documents.delete.fileWarning")}`}
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="gap-2 sm:justify-start">
					<Button
						variant="destructive"
						onClick={onConfirm}
						disabled={isDeleting}
					>
						{t("documents.delete.confirm")}
					</Button>
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={isDeleting}
					>
						{t("documents.delete.cancel")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

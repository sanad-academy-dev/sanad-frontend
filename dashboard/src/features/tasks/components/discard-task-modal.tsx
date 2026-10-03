import { IconAlertTriangle } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useI18n } from "@/hooks/use-i18n";

const FIELD_LABEL_KEYS: Record<string, string> = {
	title: "tasks.discard.fields.title",
	content: "tasks.discard.fields.content",
	type: "tasks.discard.fields.type",
	deadline: "tasks.discard.fields.deadline",
	images: "tasks.discard.fields.images",
	priority: "tasks.discard.fields.priority",
	assigneeIds: "tasks.discard.fields.assigneeIds",
};

interface DiscardTaskModalProps {
	open: boolean;
	filledFields: string[];
	onDiscard: () => void;
	onContinue: () => void;
}

export function DiscardTaskModal({
	open,
	filledFields,
	onDiscard,
	onContinue,
}: DiscardTaskModalProps) {
	const { t, isRtl } = useI18n();

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				if (!v) onContinue();
			}}
		>
			<DialogContent
				dir={isRtl ? "rtl" : "ltr"}
				className="max-w-sm gap-4"
			>
				<DialogHeader className="flex-row items-center gap-3 space-y-0">
					<div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
						<IconAlertTriangle className="size-5 text-amber-600" />
					</div>
					<div className="text-start">
						<DialogTitle className="text-base">{t("tasks.discard.title")}</DialogTitle>
						<p className="text-sm text-muted-foreground mt-0.5">
							{t("tasks.discard.description")}
						</p>
					</div>
				</DialogHeader>

				{filledFields.length > 0 && (
					<div className="rounded-md bg-muted/50 p-3">
						<p className="text-xs text-muted-foreground mb-2 text-start">
							{t("tasks.discard.filledFields")}
						</p>
						<div className="flex flex-wrap gap-1.5 justify-end">
							{filledFields.map((field) => (
								<span
									key={field}
									className="inline-flex items-center rounded-md border bg-background px-2 py-0.5 text-xs font-medium"
								>
									{FIELD_LABEL_KEYS[field] ? t(FIELD_LABEL_KEYS[field]) : field}
								</span>
							))}
						</div>
					</div>
				)}

				<div className="flex gap-2">
					<Button
						variant="destructive"
						className="flex-1"
						onClick={onDiscard}
					>
						{t("tasks.discard.discard")}
					</Button>
					<Button
						variant="outline"
						className="flex-1"
						onClick={onContinue}
					>
						{t("tasks.discard.continue")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

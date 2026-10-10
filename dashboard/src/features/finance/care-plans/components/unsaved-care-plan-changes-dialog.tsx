import { IconArrowsDiagonal } from "@tabler/icons-react";

import { FormHeader } from "@/components/common/form-header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription } from "@/components/ui/dialog";

interface UnsavedCarePlanChangesDialogProps {
	open: boolean;
	planName?: string;
	planCode?: string | null;
	modifiedFields: string[];
	onDiscard: () => void;
	onResume: () => void;
}

export function UnsavedCarePlanChangesDialog({
	open,
	planName,
	planCode,
	modifiedFields,
	onDiscard,
	onResume,
}: UnsavedCarePlanChangesDialogProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onResume();
			}}
		>
			<DialogContent
				className="gap-0 p-0 sm:max-w-[720px]!"
				dir="rtl"
				showCloseButton={false}
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") onDiscard();
				}}
			>
				<FormHeader
					title="بيانات غير محفوظة"
					variant="dialog"
					identity={planName ? { name: planName, code: planCode } : null}
					changesCount={modifiedFields.length}
					onClose={onResume}
					actions={
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
						>
							<IconArrowsDiagonal className="size-4" />
						</Button>
					}
				/>

				<DialogDescription className="sr-only">
					لديك تغييرات غير محفوظة على خطة الرعاية
				</DialogDescription>

				{/* الجسم: الحقول المعدّلة كشارات */}
				<div className="px-4 pt-4">
					<div className="flex flex-col items-start gap-2.5 rounded-md border p-4">
						<span className="text-sm font-medium text-muted-foreground">الحقول المعدّلة:</span>
						<div className="flex flex-wrap justify-start gap-2">
							{modifiedFields.map((f) => (
								<span
									key={f}
									className="rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400"
								>
									{f}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* الفوتر — المجموعة في نهاية السطر (يسارًا)، والزر الأحمر في الطرف */}
				<div className="mt-4 flex items-center justify-end gap-2 border-t px-4 py-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={onResume}
					>
						متابعة التعديل
					</Button>

					<Button
						type="button"
						variant="destructive"
						size="sm"
						onClick={onDiscard}
						className="gap-2"
					>
						تجاهل وخروج
						<kbd className="pointer-events-none inline-flex items-center rounded bg-white/20 px-1 py-0.5 font-mono text-[10px]">
							⌘↵
						</kbd>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

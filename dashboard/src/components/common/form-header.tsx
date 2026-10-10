import { IconChevronLeft, IconX } from "@tabler/icons-react";
import type { ReactNode } from "react";

import { ChangesBadge } from "@/components/common/changes-badge";
import { InitialsAvatar } from "@/components/common/initials-avatar";
import { Button } from "@/components/ui/button";
import { CompletionRing } from "@/components/ui/completion-ring";
import { DialogTitle } from "@/components/ui/dialog";
import { SheetTitle } from "@/components/ui/sheet";
import type { FormProgress } from "@/hooks/use-form-progress";
import { cn } from "@/lib/utils";

/**
 * رأس موحّد لكل نماذج الإضافة/التعديل: العنوان، هوية السجل عند التعديل،
 * شارة عدد التعديلات، حلقة تقدّم الحقول المطلوبة، وعدّاد الحقول، وزر الإغلاق.
 */
export function FormHeader({
	title,
	variant = "sheet",
	identity,
	changesCount = 0,
	progress,
	onClose,
	titleActions,
	actions,
	className,
}: {
	title: string;
	/** "plain" لنماذج داخل الصفحات — عناوين Radix تتطلب Sheet/Dialog محيطًا */
	variant?: "sheet" | "dialog" | "plain";
	identity?: { name: string; code?: string | null } | null;
	/** عدد الحقول المعدّلة — تظهر الشارة تلقائيًا عند أي تغيير (إضافة أو تعديل) */
	changesCount?: number;
	progress?: FormProgress | null;
	onClose?: () => void;
	// عناصر تحكّم تلتصق بالعنوان في جهة البداية (يمين في RTL)
	titleActions?: ReactNode;
	// أزرار إضافية قبل زر الإغلاق (توسيع، قائمة، ...)
	actions?: ReactNode;
	className?: string;
}) {
	const Title = variant === "dialog" ? DialogTitle : variant === "plain" ? "h2" : SheetTitle;

	return (
		<div
			className={cn("flex items-center justify-between gap-2 border-b px-4 py-2", className)}
		>
			<div className="flex min-w-0 items-center gap-2.5">
				<Title className="shrink-0 text-base font-semibold">{title}</Title>

				{identity && (
					<div className="flex min-w-0 items-center gap-1.5">
						{/* فاصل مسار — في RTL يشير لليسار */}
						<IconChevronLeft className="size-4 shrink-0 text-muted-foreground" />
						<InitialsAvatar name={identity.name} />
						<span className="truncate text-sm font-medium">{identity.name}</span>
						{identity.code && (
							<span className="shrink-0 text-xs text-muted-foreground tabular-nums">
								{identity.code}
							</span>
						)}
					</div>
				)}

				<ChangesBadge count={changesCount} />

				{titleActions}

				{progress && progress.requiredCount > 0 && (
					<>
						<CompletionRing
							value={progress.progress}
							size={34}
							strokeWidth={3}
							trackClassName="stroke-border"
							colorClassName={progress.isComplete ? "stroke-green-500" : "stroke-primary"}
							labelClassName="text-[9px]"
						/>
						<span className="shrink-0 text-xs text-muted-foreground whitespace-nowrap">
							{progress.filledCount} من {progress.requiredCount} حقول مطلوبة
						</span>
					</>
				)}
			</div>

			<div className="flex shrink-0 items-center gap-1">
				{actions}
				{onClose && (
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onClose}
						type="button"
					>
						<IconX className="size-4" />
					</Button>
				)}
			</div>
		</div>
	);
}

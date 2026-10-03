import type { ReactNode } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormFooterProps {
	/** حالة «حفظ ومتابعة الإضافة» — اتركها غير معرّفة لإخفاء الخيار (وضع التعديل / القراءة فقط) */
	continueAdding?: boolean;
	onContinueAddingChange?: (value: boolean) => void;
	disabled?: boolean;
	/** أخفِ تلميح ⌘↵ عندما لا يوجد زر حفظ (وضع القراءة فقط) */
	showShortcut?: boolean;
	/** خيارات إضافية تظهر بجانب الخيار على اليمين */
	extra?: ReactNode;
	/** أزرار الإجراءات — تظهر على اليسار */
	children: ReactNode;
	className?: string;
}

/**
 * فوتر موحّد لكل نماذج الإضافة: في RTL أول عنصر يمين (الخيار + الاختصار)
 * وآخر عنصر يسار (الأزرار). لا تُعِد بناءه داخل كل نموذج.
 */
export const FormFooter = ({
	continueAdding,
	onContinueAddingChange,
	disabled,
	showShortcut = true,
	extra,
	children,
	className,
}: FormFooterProps) => (
	<div
		className={cn(
			"flex shrink-0 items-center justify-between gap-3 border-t px-4 py-2",
			className,
		)}
	>
		<div className="flex items-center gap-3">
			{onContinueAddingChange && (
				<Label className="flex cursor-pointer items-center gap-2 font-normal text-muted-foreground">
					<Checkbox
						checked={continueAdding}
						onCheckedChange={(v) => onContinueAddingChange(v === true)}
						disabled={disabled}
					/>
					حفظ ومتابعة الإضافة
				</Label>
			)}
			{showShortcut && <Kbd>⌘↵</Kbd>}
			{extra}
		</div>

		<div className="flex items-center gap-2">{children}</div>
	</div>
);

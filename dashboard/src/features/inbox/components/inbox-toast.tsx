import { IconBellFilled } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import type { InboxToastProps } from "@/features/inbox/types/inbox-toast.types";

/**
 * بطاقة التنبيه اللحظي للوارد.
 *
 * ترتيب DOM في RTL: أوّل عنصر يمينًا — [أيقونة] [العنوان والوصف] [زر عرض].
 * تُرسم عبر toast.custom بـ unstyled حتى لا تتضاعف حدود sonner الافتراضية.
 */
export const InboxToast = ({ title, description, onOpen }: InboxToastProps) => {
	return (
		<div className="flex w-full items-center gap-3 rounded-[4px] border border-border bg-popover px-4 py-2 text-popover-foreground shadow-lg">
			<div className="flex size-8 shrink-0 items-center justify-center rounded-[4px] bg-primary/10 text-primary">
				<IconBellFilled className="size-4" />
			</div>

			<div className="min-w-0 flex-1 space-y-0.5">
				<p className="truncate font-bold text-xs">{title}</p>
				<p className="truncate text-muted-foreground text-xs">{description}</p>
			</div>

			<Button
				type="button"
				size="sm"
				className="shrink-0"
				onClick={onOpen}
			>
				عرض
			</Button>
		</div>
	);
};

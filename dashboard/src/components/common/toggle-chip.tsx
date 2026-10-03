import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * رقاقة تُضغط فيتغيّر لونها — بديل مربّع الاختيار في نماذج سير العمل الطبي
 * (الأدوية، الإسقاطات، نعم/لا). تُستخدم في التحاليل والأشعة معًا.
 */
export function ToggleChip({
	active,
	onClick,
	disabled,
	className,
	children,
}: {
	active: boolean;
	onClick: () => void;
	disabled?: boolean;
	className?: string;
	children: ReactNode;
}) {
	return (
		<button
			type="button"
			aria-pressed={active}
			disabled={disabled}
			onClick={onClick}
			className={cn(
				"inline-flex h-8 items-center justify-center whitespace-nowrap rounded-md border px-3 text-xs font-medium transition-colors disabled:opacity-60",
				active
					? "border-primary bg-primary/10 text-primary"
					: "bg-background text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground",
				className,
			)}
		>
			{children}
		</button>
	);
}

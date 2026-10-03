import { IconMessage2 } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/** حالة فارغة موحّدة للمحادثات — تُستخدم في القائمة وفي منطقة المحادثة */
export function MessagesEmpty({
	title = "المحادثات فارغة",
	description = "أضف أول محادثة بالنقر على رسالة جديدة",
	className,
}: {
	title?: string;
	description?: string;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center",
				className,
			)}
		>
			<IconMessage2
				className="size-9 text-muted-foreground/40"
				stroke={1.5}
			/>
			<div className="space-y-1">
				<p className="text-base font-semibold text-foreground">{title}</p>
				<p className="text-sm text-muted-foreground">{description}</p>
			</div>
		</div>
	);
}

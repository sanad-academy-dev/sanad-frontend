import { formatDistanceToNow } from "date-fns";
import { arSA, enUS } from "date-fns/locale";

import type { InboxApproval, InboxImportance } from "@/features/inbox/types/inbox.type";
import { useI18n } from "@/hooks/use-i18n";
import { cn } from "@/lib/utils";

// لون نص درجة الأهمية (عالية = أحمر / متوسطة = كهرماني / منخفضة = رمادي)
const IMPORTANCE_STYLE: Record<InboxImportance, { label: string; className: string }> = {
	high: { label: "عالية", className: "text-red-500" },
	normal: { label: "متوسطة", className: "text-amber-500" },
	low: { label: "منخفضة", className: "text-muted-foreground" },
};

export function InboxApprovalItem({
	approval,
	isActive,
	isFirst = false,
	onSelect,
}: {
	approval: InboxApproval;
	isActive: boolean;
	// أول عنصر في المجموعة يحصل على حد علوي أيضًا
	isFirst?: boolean;
	onSelect: (id: string) => void;
}) {
	const { lang } = useI18n();
	const relative = formatDistanceToNow(new Date(approval.createdAt), {
		addSuffix: true,
		locale: lang === "ar" ? arSA : enUS,
	});
	const importance = IMPORTANCE_STYLE[approval.importance];

	return (
		<button
			type="button"
			onClick={() => onSelect(approval.id)}
			className={cn(
				"flex w-full flex-col gap-1.5 border-b border-border px-3 py-2.5 text-start transition-colors hover:bg-muted/60",
				isFirst && "border-t",
				isActive && "bg-muted",
			)}
		>
			{/* العنوان + نقطة غير مقروء على أقصى اليمين */}
			<span className="flex items-center gap-2">
				<span className="min-w-0 flex-1 truncate text-[13px] font-bold text-foreground">
					{approval.title}
				</span>
				{!approval.read ? (
					<span
						className="size-1.5 shrink-0 rounded-full bg-primary"
						title="غير مقروء"
					/>
				) : null}
			</span>

			{/* البيانات الوصفية: درجة الأهمية + رقاقة النوع + الوقت */}
			<span className="flex items-center gap-1.5 text-[10px]">
				<span className={cn("font-medium", importance.className)}>{importance.label}</span>
				<span className="rounded-[4px] bg-muted px-1.5 py-0.5 text-muted-foreground">
					{approval.typeLabel}
				</span>
				<span className="text-muted-foreground">{relative}</span>
			</span>
		</button>
	);
}

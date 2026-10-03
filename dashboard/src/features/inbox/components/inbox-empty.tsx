import { IconBell } from "@tabler/icons-react";

// حالة فارغة موحّدة للوارد — تُستخدم للقائمة الفارغة ولوحة التفاصيل بدون تحديد
export function InboxEmpty({
	title = "لا يوجد أي إشعار لعرض تفاصيله",
	description = "حزمة الحملات الواردة بدون أي إشعارات",
}: {
	title?: string;
	description?: string;
}) {
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center gap-3 px-6 py-16 text-center"
			dir="rtl"
		>
			<IconBell
				className="size-9 text-muted-foreground/40"
				stroke={1.5}
			/>
			<div className="space-y-1">
				<p className="text-sm font-semibold text-foreground">{title}</p>
				<p className="text-xs text-muted-foreground">{description}</p>
			</div>
		</div>
	);
}

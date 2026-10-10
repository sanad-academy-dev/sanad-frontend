import type { Icon } from "@tabler/icons-react";

// عرض مبدئي لتبويبات الموارد البشرية التي لم تُصمَّم بعد
export function TabPlaceholder({
	icon: TabIcon,
	title,
	description,
}: {
	icon: Icon;
	title: string;
	description: string;
}) {
	return (
		<div
			className="flex flex-1 flex-col items-center justify-center gap-3 p-12 text-center"
			dir="rtl"
		>
			<div className="flex size-12 items-center justify-center rounded-full border bg-muted/50 text-muted-foreground">
				<TabIcon className="size-6" />
			</div>
			<h2 className="text-lg font-semibold">{title}</h2>
			<p className="max-w-md text-sm text-muted-foreground">{description}</p>
		</div>
	);
}

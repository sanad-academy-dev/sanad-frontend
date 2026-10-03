import { IconClockHour3 } from "@tabler/icons-react";

export function EmptyTabPlaceholder() {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-2 py-16 text-muted-foreground">
			<IconClockHour3 className="size-8" />
			<p className="text-sm">قريبًا</p>
		</div>
	);
}

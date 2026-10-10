import { IconTool } from "@tabler/icons-react";

interface PlaceholderStepProps {
	title: string;
}

export function PlaceholderStep({ title }: PlaceholderStepProps) {
	return (
		<div className="flex min-h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
			<IconTool className="size-10 opacity-40" />
			<p className="font-medium text-base">{title}</p>
			<p className="text-sm">قيد التطوير</p>
		</div>
	);
}

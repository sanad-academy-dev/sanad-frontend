import { Switch } from "@/components/ui/switch";
import type { StatusCellProps } from "@/features/settings/branches/types/status-cell.types";

export function StatusCell({ checked, disabled, onCheckedChange }: StatusCellProps) {
	return (
		<Switch
			size="sm"
			checked={checked}
			disabled={disabled}
			onCheckedChange={onCheckedChange}
		/>
	);
}

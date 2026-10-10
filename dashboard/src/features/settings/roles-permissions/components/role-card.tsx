import { IconEdit, IconTrash, IconUsers } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { StaffRoleResponse } from "@/server/staff-roles/staff-roles.type";

type Props = {
	role: StaffRoleResponse;
	isSelected: boolean;
	onSelect: () => void;
	onRename: (name: string) => void;
	onDelete: () => void;
	isDeleting: boolean;
};

export const RoleCard = ({
	role,
	isSelected,
	onSelect,
	onRename,
	onDelete,
	isDeleting,
}: Props) => {
	const [editing, setEditing] = useState(false);
	const [name, setName] = useState(role.name);

	const handleRename = () => {
		const trimmed = name.trim();
		if (trimmed && trimmed !== role.name) {
			onRename(trimmed);
		}
		setEditing(false);
	};

	return (
		<div
			className={cn(
				"group flex items-center justify-between rounded-lg border border-border px-3 py-2.5 transition-colors",
				isSelected ? "bg-primary/10 border-primary/30" : "bg-background hover:bg-muted/40",
			)}
		>
			{editing ? (
				<Input
					autoFocus
					value={name}
					onChange={(e) => setName(e.target.value)}
					onBlur={handleRename}
					onKeyDown={(e) => {
						if (e.key === "Enter") handleRename();
						if (e.key === "Escape") {
							setName(role.name);
							setEditing(false);
						}
					}}
					className="h-7 text-sm"
				/>
			) : (
				<>
					<button
						type="button"
						className="flex items-center gap-2 min-w-0 flex-1 text-start cursor-pointer"
						onClick={onSelect}
					>
						<span className="text-sm font-medium truncate">{role.name}</span>
						<span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
							<IconUsers className="size-3" />
							{role.staffCount}
						</span>
					</button>
					<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-6"
							onClick={() => {
								setEditing(true);
								setName(role.name);
							}}
						>
							<IconEdit className="size-3.5" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="size-6 text-destructive hover:text-destructive"
							disabled={isDeleting}
							onClick={onDelete}
						>
							<IconTrash className="size-3.5" />
						</Button>
					</div>
				</>
			)}
		</div>
	);
};

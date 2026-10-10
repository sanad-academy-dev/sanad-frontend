import { IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { Input } from "@/components/ui/input";

// فاصل منقّط + اسم مستوى قابل للتحرير + حذف
export function LevelHeading({
	name,
	onRename,
	onDelete,
}: {
	name: string;
	onRename: (name: string) => void;
	onDelete: () => void;
}) {
	const [editing, setEditing] = useState(false);
	const [value, setValue] = useState(name);
	const commit = () => {
		setEditing(false);
		if (value.trim() && value !== name) onRename(value.trim());
		else setValue(name);
	};
	return (
		<div className="flex items-center gap-3 py-1">
			{editing ? (
				<Input
					autoFocus
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onBlur={commit}
					onKeyDown={(e) => e.key === "Enter" && commit()}
					className="h-7 w-[200px] text-[12px] font-bold"
				/>
			) : (
				<button
					type="button"
					onClick={() => setEditing(true)}
					className="shrink-0 text-[12px] font-bold text-[#08090A]"
				>
					{name}
				</button>
			)}
			<span className="h-px flex-1 border-t border-dashed border-[#D4D4DE]" />
			<button
				type="button"
				onClick={onDelete}
				aria-label="حذف المستوى"
				className="text-[#C4C4CC] hover:text-[#DC2626]"
			>
				<IconTrash className="size-4" />
			</button>
		</div>
	);
}

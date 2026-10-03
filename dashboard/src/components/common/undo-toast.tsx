import { IconTrash } from "@tabler/icons-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

// توست حذف مع إمكانية التراجع (Figma node 4573-516244)
// في RTL: أيقونة السلة والنص يمينًا، وزر «تراجع» أقصى اليسار.
export function showUndoToast(
	message: string,
	onUndo: () => void,
	opts?: { textClassName?: string },
) {
	toast.custom(
		(id) => (
			<div
				dir="rtl"
				className="flex w-[356px] items-center justify-between gap-3.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 py-1.5 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]"
			>
				<div className="flex min-w-0 items-center gap-1.5">
					<IconTrash className="size-[15px] shrink-0 text-[#DC2626]" />
					<span
						className={cn(
							"truncate font-semibold leading-[18px] text-[#08090A]",
							opts?.textClassName ?? "text-[10px]",
						)}
					>
						{message}
					</span>
				</div>
				<button
					type="button"
					onClick={() => {
						toast.dismiss(id);
						onUndo();
					}}
					className="flex h-[18px] shrink-0 items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[5px] text-[11px] font-medium text-[#08090A]"
				>
					تراجع
				</button>
			</div>
		),
		{ position: "bottom-left", duration: 6000 },
	);
}

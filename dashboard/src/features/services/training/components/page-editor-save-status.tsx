/**
 * PageEditorSaveStatus
 * شريط صغير يعرض حالة الحفظ التلقائي: جاري / تم / فشل
 */
import { IconCheck, IconCloudUpload, IconExclamationCircle } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { SaveState } from "../hooks/use-page-editor";

interface Props {
	state: SaveState;
}

export function PageEditorSaveStatus({ state }: Props) {
	if (state === "idle") return null;

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-all",
				state === "saving" && "bg-muted text-muted-foreground",
				state === "saved" &&
					"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
				state === "error" && "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
			)}
		>
			{state === "saving" && (
				<>
					<IconCloudUpload className="size-3 animate-pulse" />
					جاري الحفظ...
				</>
			)}
			{state === "saved" && (
				<>
					<IconCheck className="size-3" />
					تم الحفظ
				</>
			)}
			{state === "error" && (
				<>
					<IconExclamationCircle className="size-3" />
					فشل الحفظ
				</>
			)}
		</span>
	);
}

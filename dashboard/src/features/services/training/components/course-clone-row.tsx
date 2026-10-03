import { IconLoader2 } from "@tabler/icons-react";

import { TableCell, TableRow } from "@/components/ui/table";

// صفّ «جاري الاستنساخ» المضمّن أسفل الدورة المصدر (Figma node 4426-536121).
// شريط تقدّم غير محدّد (indeterminate) لأن الاستنساخ يتم في معاملة واحدة بلا تقدّم جزئي مُبلَّغ.
export function CourseCloneRow({ name, colSpan }: { name: string; colSpan: number }) {
	return (
		<TableRow className="hover:bg-transparent">
			<TableCell
				colSpan={colSpan}
				className="border-b border-[#D8D8D8] p-0 last:py-0"
			>
				<div className="flex items-center gap-3 px-3 py-2">
					<IconLoader2 className="size-3.5 shrink-0 animate-spin text-primary/80" />
					<span className="whitespace-nowrap text-[12px] font-medium leading-[18px] text-primary/[0.87]">
						جاري استنساخ دورة {name}...
					</span>
					{/* شريط تقدّم غير محدّد يملأ ما تبقّى من العرض */}
					<div className="relative h-3 min-w-24 flex-1 overflow-hidden rounded-full bg-[#E3E1E1]/70">
						<div className="absolute inset-y-0 w-1/4 animate-[clone-progress_1.2s_ease-in-out_infinite] rounded-full bg-primary/70" />
					</div>
					<style>{`@keyframes clone-progress{0%{transform:translateX(-110%)}100%{transform:translateX(430%)}}`}</style>
				</div>
			</TableCell>
		</TableRow>
	);
}

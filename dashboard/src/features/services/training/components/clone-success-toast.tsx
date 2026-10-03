import { IconCircleCheckFilled } from "@tabler/icons-react";

// توست نجاح الاستنساخ مع إجراء «تراجع» (Figma node 4422-532751).
// في RTL: الرسالة وأيقونة الصح يمينًا، وزر «تراجع» يسارًا.
export function CloneSuccessToast({ name, onUndo }: { name: string; onUndo: () => void }) {
	return (
		<div
			dir="rtl"
			className="flex w-[356px] max-w-[calc(100vw-2rem)] items-center justify-between gap-3.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-2 py-1.5 shadow-[0px_4px_24px_rgba(0,0,0,0.08)]"
		>
			<div className="flex min-w-0 items-center gap-1.5">
				<IconCircleCheckFilled className="size-4 shrink-0 text-[#008A2E]" />
				<span className="truncate text-[10px] font-semibold leading-[18px] text-[#08090A]">
					تم استنساخ الدورة "{name}" بنجاح
				</span>
			</div>
			<button
				type="button"
				onClick={onUndo}
				className="flex h-[18px] shrink-0 items-center justify-center rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[7px] text-[11px] font-medium leading-4 text-[#08090A] hover:bg-neutral-50"
			>
				تراجع
			</button>
		</div>
	);
}

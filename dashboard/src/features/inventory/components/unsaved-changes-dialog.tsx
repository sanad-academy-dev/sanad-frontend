import { IconArrowsDiagonal, IconBandage, IconPencil, IconX } from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { INVENTORY_FIELD_LABELS } from "@/features/inventory/data/constants";

interface UnsavedChangesDialogProps {
	open: boolean;
	productName?: string;
	productCode?: string;
	/** أسماء الحقول المعدّلة (مفاتيح react-hook-form dirtyFields) */
	modifiedFields: string[];
	onDiscard: () => void;
	onResume: () => void;
}

// قيم بصرية حرفية من get_code (Figma node 1091-72287)
export function UnsavedChangesDialog({
	open,
	productName,
	productCode,
	modifiedFields,
	onDiscard,
	onResume,
}: UnsavedChangesDialogProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={(o) => {
				if (!o) onResume();
			}}
		>
			<DialogContent
				className="gap-0 p-0 sm:max-w-[620px]! rounded-[4px]"
				dir="rtl"
				showCloseButton={false}
			>
				{/* الهيدر */}
				<DialogHeader className="flex-row items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2 space-y-0">
					<div className="flex items-center gap-2">
						<DialogTitle className="flex items-center gap-1 text-[10px] font-bold text-[#F59E0B]">
							<IconPencil className="size-[9px]" />
							تغييرات غير محفوظة
						</DialogTitle>
						{productName && (
							<div className="flex items-center gap-1.5">
								<span className="flex size-[18px] items-center justify-center rounded-[4px] bg-[#F5F5F6]">
									<IconBandage className="size-[14px] text-[#22202A]" />
								</span>
								<span className="text-[10px] font-bold text-[#08090A]">{productName}</span>
								{productCode && (
									<span className="font-mono text-[11px] text-[#A0A09B]">{productCode}</span>
								)}
							</div>
						)}
					</div>
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconArrowsDiagonal className="size-3" />
						</button>
						<button
							type="button"
							onClick={onResume}
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconX className="size-[14px]" />
						</button>
					</div>
				</DialogHeader>

				<DialogDescription className="sr-only">
					لديك تغييرات غير محفوظة على المنتج
				</DialogDescription>

				{/* الجسم: الحقول المعدّلة كشارات */}
				<div className="px-[15px] pt-3 pb-0">
					<div className="flex flex-col items-end gap-2 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-2.5">
						<span className="text-[10px] font-semibold text-[#9B9B9D]">الحقول المعدّلة:</span>
						<div className="flex flex-wrap justify-end gap-1.5">
							{modifiedFields.map((f) => (
								<span
									key={f}
									className="rounded-[4px] bg-[#F59E0B]/10 px-[4.5px] py-px text-[9px] text-[#F59E0B]"
								>
									{INVENTORY_FIELD_LABELS[f] ?? f}
								</span>
							))}
						</div>
					</div>
				</div>

				{/* الفوتر */}
				<div className="mt-3 flex items-center justify-between border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<Button
						onClick={onDiscard}
						className="h-[25.5px] gap-2 rounded-[4px] bg-destructive/40 px-3 text-[11px] font-semibold text-[#F7F7FA] hover:bg-destructive"
					>
						<kbd className="pointer-events-none inline-flex items-center rounded-[4px] bg-white/20 px-[3px] py-[1.5px] font-mono text-[8px]">
							⌘↵
						</kbd>
						تجاهل وخروج
					</Button>

					<Button
						type="button"
						variant="outline"
						onClick={onResume}
						className="h-[27px] rounded-[4px] px-[9px] text-[11px] font-medium text-[#08090A]"
					>
						متابعة التعديل
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

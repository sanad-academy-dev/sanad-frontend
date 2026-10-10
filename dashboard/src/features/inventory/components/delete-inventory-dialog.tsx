import {
	IconArrowsDiagonal,
	IconBandage,
	IconInfoCircle,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDeleteInventory } from "@/features/inventory/hooks/use-delete-inventory";
import type { InventoryResponse } from "@/server/inventory/inventory.type";

interface DeleteInventoryDialogProps {
	product: InventoryResponse | null;
	onClose: () => void;
}

// قيم بصرية حرفية من get_code (Figma node 1091-64605)
export function DeleteInventoryDialog({ product, onClose }: DeleteInventoryDialogProps) {
	const [notifyManager, setNotifyManager] = useState(false);
	const { deleteInventory, isPending } = useDeleteInventory();

	const handleDelete = () => {
		if (!product) return;
		deleteInventory(product);
		onClose();
	};

	return (
		<Dialog
			open={!!product}
			onOpenChange={(open) => {
				if (!open) onClose();
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
						<DialogTitle className="flex items-center gap-1 text-[10px] font-bold text-[#DC2626]">
							<IconTrash className="size-[9px]" />
							حذف المنتج
						</DialogTitle>
						{product && (
							<div className="flex items-center gap-1.5">
								<span className="flex size-[18px] items-center justify-center rounded-[4px] bg-[#F5F5F6]">
									<IconBandage className="size-[14px] text-[#22202A]" />
								</span>
								<span className="text-[10px] font-bold text-[#08090A]">{product.name}</span>
								<span className="font-mono text-[11px] text-[#A0A09B]">{product.code}</span>
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
							onClick={onClose}
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconX className="size-[14px]" />
						</button>
					</div>
				</DialogHeader>

				<DialogDescription className="sr-only">تأكيد حذف المنتج من المخزون</DialogDescription>

				{/* الجسم */}
				<div className="flex flex-col gap-1.5 px-[15px] pt-3 pb-0">
					<p className="text-right text-[12px] leading-[22px] text-[#08090A]">
						هل أنت متأكد من حذف منتج &ldquo;{product?.name}&rdquo;؟ لا يمكن التراجع عن هذا
						الإجراء.
					</p>

					<div className="flex flex-col gap-1.5 rounded-[4px] border-[0.75px] border-[#DC2626] bg-[#FDEBEB] p-2.5">
						<p className="flex items-center gap-1.5 text-[12px] font-bold text-[#EF4444]">
							<IconInfoCircle className="size-3 text-[#DC2626]" />
							النتائج المترتبة:
						</p>
						<ul className="flex flex-col gap-1.5">
							<li className="flex items-center gap-1.5 text-[11px] text-[#08090A]">
								<IconInfoCircle className="size-[11px] shrink-0 text-[#DC2626]" />
								قد تتأثر الفواتير والوصفات المرتبطة به
							</li>
							<li className="flex items-center gap-1.5 text-[11px] text-[#08090A]">
								<IconInfoCircle className="size-[11px] shrink-0 text-[#DC2626]" />
								سيتم إيقاف استخدام المنتج في العمليات المستقبلية
							</li>
							<li className="flex items-center gap-1.5 text-[11px] text-[#08090A]">
								<IconInfoCircle className="size-[11px] shrink-0 text-[#F59E0B]" />
								قد تفقد بعض بيانات التتبع والتقارير
							</li>
						</ul>
					</div>
				</div>

				{/* الفوتر */}
				<div className="flex items-center justify-end gap-2 border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<div className="flex items-center gap-1">
						<Label
							htmlFor="delete-notify-manager"
							className="cursor-pointer text-[10px] font-normal text-[#737373]"
						>
							إشعار المدير عبر البريد
						</Label>
						<Switch
							id="delete-notify-manager"
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
							disabled={isPending}
							className="h-[15px] w-[30px]"
						/>
					</div>

					<Button
						onClick={handleDelete}
						disabled={isPending}
						className="h-[25.5px] cursor-pointer gap-2 rounded-[4px] bg-[#DC2626] px-3 text-[11px] font-semibold text-[#F7F7FA] transition-colors hover:bg-[#B91C1C]"
					>
						<kbd className="pointer-events-none inline-flex items-center rounded-[4px] bg-white/20 px-[3px] py-[1.5px] font-mono text-[8px]">
							⌘↵
						</kbd>
						حذف
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

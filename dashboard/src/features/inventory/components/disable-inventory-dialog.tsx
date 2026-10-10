import {
	IconArrowsDiagonal,
	IconBan,
	IconBandage,
	IconInfoCircle,
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
import { useDisableInventory } from "@/features/inventory/hooks/use-disable-inventory";
import type { InventoryResponse } from "@/server/inventory/inventory.type";

interface DisableInventoryDialogProps {
	product: InventoryResponse | null;
	onClose: () => void;
}

// قيم بصرية حرفية من get_code (Figma node 1109-40735) — ثيم كهرماني
export function DisableInventoryDialog({ product, onClose }: DisableInventoryDialogProps) {
	const [notifyManager, setNotifyManager] = useState(false);
	const { disableInventory, isPending } = useDisableInventory();

	const handleDisable = async () => {
		if (!product) return;
		await disableInventory(product.id);
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
						<DialogTitle className="flex items-center gap-1 text-[10px] font-bold text-[#F59E0B]">
							<IconBan className="size-[9px]" />
							تعطيل المنتج
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

				<DialogDescription className="sr-only">تأكيد تعطيل المنتج</DialogDescription>

				{/* الجسم */}
				<div className="flex flex-col gap-1.5 px-[15px] pt-3 pb-0">
					<p className="text-[12px] leading-[22px] text-[#08090A]">
						هل أنت متأكد من تعطيل منتج &ldquo;{product?.name}&rdquo;؟ سيتم إيقاف استخدام المنتج
						داخل النظام دون حذف بياناته.
					</p>

					<div className="flex flex-col gap-1.5 rounded-[4px] border-[0.75px] border-[#F59E0B] bg-[#F59E0B]/[0.12] p-2.5">
						<p className="flex items-center justify-start gap-1.5 text-[12px] font-bold text-[#FFA000]">
							<IconInfoCircle className="size-3 text-[#F59E0B]" />
							النتائج المترتبة:
						</p>
						<ul className="flex flex-col gap-1.5">
							<li className="flex items-center justify-start gap-1.5 text-[11px] text-[#08090A]">
								<IconInfoCircle className="size-[11px] shrink-0 text-[#F59E0B]" />
								لن يظهر المنتج في عمليات الصرف والبيع الجديدة
							</li>
							<li className="flex items-center justify-start gap-1.5 text-[11px] text-[#08090A]">
								<IconInfoCircle className="size-[11px] shrink-0 text-[#F59E0B]" />
								لن يمكن إضافته إلى الفواتير أو الوصفات الطبية
							</li>
							<li className="flex items-center justify-start gap-1.5 text-[11px] text-[#08090A]">
								<IconInfoCircle className="size-[11px] shrink-0 text-[#F59E0B]" />
								سيظل سجل المنتج وحركة المخزون والتقارير والسجلات السابقة محفوظين
							</li>
						</ul>
					</div>
				</div>

				{/* الفوتر */}
				<div className="flex items-center justify-end gap-2 border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<div className="flex items-center gap-1">
						<Label
							htmlFor="disable-notify-manager"
							className="cursor-pointer text-[10px] font-normal text-[#737373]"
						>
							إشعار المدير عبر البريد
						</Label>
						<Switch
							id="disable-notify-manager"
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
							disabled={isPending}
							className="h-[15px] w-[30px]"
						/>
					</div>

					<Button
						onClick={handleDisable}
						disabled={isPending}
						className="h-[25.5px] gap-2 rounded-[4px] bg-[#FFA000] px-3 text-[11px] font-semibold text-[#F7F7FA] hover:bg-[#FFA000]/90"
					>
						<kbd className="pointer-events-none inline-flex items-center rounded-[4px] bg-white/20 px-[3px] py-[1.5px] font-mono text-[8px]">
							⌘↵
						</kbd>
						تعطيل
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

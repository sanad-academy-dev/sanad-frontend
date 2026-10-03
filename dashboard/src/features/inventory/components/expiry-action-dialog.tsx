import {
	IconArrowsDiagonal,
	IconBandage,
	IconInfoCircle,
	IconRotateClockwise,
	IconTrash,
	IconX,
} from "@tabler/icons-react";
import type { ComponentType, ReactNode } from "react";
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
import { useCreateMovement } from "@/features/inventory/hooks/use-create-movement";
import { useWarehouses } from "@/features/inventory/hooks/use-warehouses";
import { cn } from "@/lib/utils";
import type { InventoryResponse } from "@/server/inventory/inventory.type";

export type ExpiryAction = "dispose" | "return";

const dayFmt = new Intl.DateTimeFormat("ar-EG", { dateStyle: "medium" });

const money = (n: number) =>
	`${n.toLocaleString("ar-EG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`;

// نصوص وألوان كل إجراء — بنفس بنية حوار حذف المنتج
const COPY: Record<
	ExpiryAction,
	{
		title: string;
		Icon: ComponentType<{ className?: string }>;
		question: (name: string, qty: number) => string;
		consequences: string[];
		confirmLabel: string;
		// ملاحظة حركة المخزون المسجَّلة في الدفتر
		movementNote: string;
		accent: string;
		boxClass: string;
		labelClass: string;
		buttonClass: string;
	}
> = {
	dispose: {
		title: "إعدام منتج منتهي الصلاحية",
		Icon: IconTrash,
		question: (name, qty) =>
			`هل أنت متأكد من إعدام "${name}"؟ سيتم إخراج ${qty} من المخزون ولا يمكن التراجع عن هذا الإجراء.`,
		consequences: [
			"سيُخصم الرصيد المنتهي من المخزون فورًا.",
			"ستُسجَّل حركة صرف في دفتر المخزون باسم «إتلاف منتهي الصلاحية».",
			"لا يمكن التراجع عن العملية بعد التأكيد.",
		],
		confirmLabel: "إعدام",
		movementNote: "إتلاف منتهي الصلاحية",
		accent: "text-[#DC2626]",
		boxClass: "border-[#DC2626] bg-[#FDEBEB]",
		labelClass: "text-[#EF4444]",
		buttonClass: "bg-[#DC2626] hover:bg-[#B91C1C]",
	},
	return: {
		title: "استرجاع منتج منتهي الصلاحية",
		Icon: IconRotateClockwise,
		question: (name, qty) =>
			`هل أنت متأكد من استرجاع "${name}" إلى المورد؟ سيتم إخراج ${qty} من المخزون.`,
		consequences: [
			"سيُخصم الرصيد المنتهي من المخزون وتُسجَّل حركة صرف باسم «استرجاع للمورد».",
			"تُتابَع تسوية الاسترجاع مع المورد خارج النظام.",
			"لن تتأثر الفواتير أو الحركات السابقة على المنتج.",
		],
		confirmLabel: "استرجاع",
		movementNote: "استرجاع منتهي الصلاحية للمورد",
		accent: "text-[#F59E0B]",
		boxClass: "border-[#F59E0B] bg-[#F59E0B]/[0.12]",
		labelClass: "text-[#B45309]",
		buttonClass: "bg-[#FFA000] hover:bg-[#F59E0B]",
	},
};

// صف معلومة: الوسم (يمينًا) والقيمة (يسارًا) — يتّبع تدفّق RTL
function DetailRow({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-2">
			<span className="text-[12px] font-semibold leading-[18px] text-[#08090A]">{label}</span>
			{children}
		</div>
	);
}

// حوار تأكيد إعدام/استرجاع منتج منتهي الصلاحية — نفس تصميم حوار حذف المنتج ببيانات الإجراء
export function ExpiryActionDialog({
	product,
	action,
	onClose,
}: {
	product: InventoryResponse | null;
	action: ExpiryAction;
	onClose: () => void;
}) {
	const [notifyManager, setNotifyManager] = useState(false);
	const { warehouses } = useWarehouses();
	const { createMovement, isPending } = useCreateMovement();

	const copy = COPY[action];
	const warehouse = warehouses.find((w) => w.isDefault) ?? warehouses[0];
	const qty = product?.stock ?? 0;
	const unitCost = product
		? Number(product.valuationRate) || Number(product.unitCost ?? 0) || Number(product.price)
		: 0;

	const confirm = () => {
		if (!product || !warehouse || qty <= 0) return;
		createMovement({
			type: "ISSUE",
			warehouseId: warehouse.id,
			note: copy.movementNote,
			lines: [{ itemId: product.id, qty }],
		});
		setNotifyManager(false);
		onClose();
	};

	return (
		<Dialog
			open={!!product}
			onOpenChange={(open) => {
				if (!open) {
					setNotifyManager(false);
					onClose();
				}
			}}
		>
			<DialogContent
				className="gap-0 rounded-[4px] p-0 sm:max-w-[620px]!"
				dir="rtl"
				showCloseButton={false}
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") confirm();
				}}
			>
				{/* الهيدر */}
				<DialogHeader className="flex-row items-center justify-between space-y-0 border-b border-[#E5E5E5] px-[11px] py-2">
					<div className="flex items-center gap-2">
						<DialogTitle
							className={cn("flex items-center gap-1 text-[10px] font-bold", copy.accent)}
						>
							<copy.Icon className="size-[9px]" />
							{copy.title}
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
							aria-label="إغلاق"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconX className="size-[14px]" />
						</button>
					</div>
				</DialogHeader>

				<DialogDescription className="sr-only">
					تأكيد {copy.confirmLabel} منتج منتهي الصلاحية
				</DialogDescription>

				{/* الجسم */}
				{product && (
					<div className="flex flex-col gap-1.5 px-[15px] pt-3 pb-0">
						<p className="text-start text-[12px] leading-[22px] text-[#08090A]">
							{copy.question(product.name, qty)}
						</p>

						{/* بيانات الإجراء */}
						<div className="flex flex-col gap-2.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[21.75px] py-2">
							<DetailRow label="الكمية">
								<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
									{qty}
								</span>
							</DetailRow>
							<DetailRow label="تاريخ انتهاء الصلاحية">
								<span className="text-[12px] leading-[18px] tabular-nums text-[#DC2626]">
									{product.expiryDate ? dayFmt.format(new Date(product.expiryDate)) : "—"}
								</span>
							</DetailRow>
							<DetailRow label="المستودع">
								<span className="text-[12px] leading-[18px] text-[#08090A]">
									{warehouse?.name ?? "—"}
								</span>
							</DetailRow>
							<DetailRow label="قيمة الكمية">
								<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
									{money(qty * unitCost)}
								</span>
							</DetailRow>
						</div>

						<div
							className={cn(
								"flex flex-col gap-1.5 rounded-[4px] border-[0.75px] p-2.5",
								copy.boxClass,
							)}
						>
							<p
								className={cn(
									"flex items-center gap-1.5 text-[12px] font-bold",
									copy.labelClass,
								)}
							>
								<IconInfoCircle className={cn("size-3", copy.accent)} />
								النتائج المترتبة:
							</p>
							<ul className="flex flex-col gap-1.5">
								{copy.consequences.map((line) => (
									<li
										key={line}
										className="flex items-start gap-1.5 text-[11px] text-[#08090A]"
									>
										<IconInfoCircle
											className={cn("mt-[3px] size-[11px] shrink-0", copy.accent)}
										/>
										{line}
									</li>
								))}
							</ul>
						</div>
					</div>
				)}

				{/* الفوتر */}
				<div className="flex items-center justify-end gap-2 border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<div className="flex items-center gap-1">
						<Label
							htmlFor="expiry-notify-manager"
							className="cursor-pointer text-[10px] font-normal text-[#737373]"
						>
							إشعار المدير عبر البريد
						</Label>
						<Switch
							id="expiry-notify-manager"
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
							disabled={isPending}
							className="h-[15px] w-[30px]"
						/>
					</div>

					<Button
						onClick={confirm}
						disabled={isPending || qty <= 0 || !warehouse}
						className={cn(
							"h-[25.5px] cursor-pointer gap-2 rounded-[4px] px-3 text-[11px] font-semibold text-[#F7F7FA] transition-colors",
							copy.buttonClass,
						)}
					>
						<kbd className="pointer-events-none inline-flex items-center rounded-[4px] bg-white/20 px-[3px] py-[1.5px] font-mono text-[8px]">
							⌘↵
						</kbd>
						{copy.confirmLabel}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

// دايالوج تأكيد حذف إعلان — مطابق لتصميم Figma
import { IconArrowsDiagonal, IconChevronLeft, IconInfoCircle } from "@tabler/icons-react";
import { useState } from "react";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

const CONSEQUENCES = [
	{ text: "سيتم إزالة الإعلان من قائمة الإعلانات", color: "#DC2626" },
	{ text: "لن يتمكن المستلمون من رؤية الإعلان بعد الآن.", color: "#DC2626" },
	{ text: "سيتم إيقاف أي إشعارات أو تنبيهات مرتبطة بالإعلان", color: "#F59E0B" },
];

export function DeleteAnnouncementDialog({
	open,
	onOpenChange,
	onConfirm,
	authorName,
	authorInitials,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
	authorName: string;
	authorInitials: string;
}) {
	const [notifyManager, setNotifyManager] = useState(false);

	return (
		<Dialog
			open={open}
			onOpenChange={onOpenChange}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="w-[620px] max-w-[620px] gap-0 overflow-hidden rounded-[4px] border-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[620px]"
			>
				{/* الترويسة */}
				<div className="flex items-center justify-between border-b-[0.75px] border-[#E5E5E5] px-[11px] py-2">
					{/* المسار (يمين) */}
					<div className="flex items-center gap-1">
						<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] font-normal text-white">
							{authorInitials}
						</span>
						<span className="text-[13px] font-bold text-[#08090A]">{authorName}</span>
						<div className="flex items-center gap-[3px]">
							<IconChevronLeft className="size-[9px] text-[#272829]" />
							<span className="text-[10px] font-bold text-[#DC2626]">حذف إعلان</span>
						</div>
					</div>

					{/* أزرار (يسار) */}
					<div className="flex items-center gap-[6px]">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] transition-colors hover:bg-[#F2F2F2]"
							aria-label="إغلاق"
						>
							<svg
								width="14"
								height="14"
								viewBox="0 0 14 14"
								fill="none"
								role="img"
								aria-label="إغلاق"
							>
								<path
									d="M3.5 3.5L10.5 10.5M10.5 3.5L3.5 10.5"
									stroke="currentColor"
									strokeWidth="1.17"
									strokeLinecap="round"
								/>
							</svg>
						</button>
						<button
							type="button"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] transition-colors hover:bg-[#F2F2F2]"
							aria-label="توسيع"
						>
							<IconArrowsDiagonal className="size-3" />
						</button>
					</div>
				</div>

				{/* الجسم */}
				<div className="flex flex-col gap-[6px] px-[15px] pt-3 pb-3">
					<p className="text-right text-[12px] leading-[22px] text-[#08090A]">
						هل أنت متأكد من رغبتك في حذف هذا الإعلان؟ لن يتمكن الموظفون من الوصول إليه بعد
						الحذف.
					</p>

					{/* صندوق النتائج المترتبة */}
					<div className="rounded-[4px] border-[0.75px] border-[#DC2626] bg-[#FDEBEB] px-[10px] py-[9px]">
						<div className="flex flex-col items-start gap-[6px]">
							<div className="flex items-center gap-[5px]">
								<IconInfoCircle className="size-3 text-[#DC2626]" />
								<span className="text-[12px] font-bold leading-[16px] text-[#EF4444]">
									النتائج المترتبة:
								</span>
							</div>

							{CONSEQUENCES.map((item) => (
								<div
									key={item.text}
									className="flex items-center gap-[6px]"
								>
									<IconInfoCircle
										className="size-[11px] shrink-0"
										style={{ color: item.color }}
									/>
									<span className="text-right text-[11px] leading-[18px] text-[#08090A]">
										{item.text}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>

				{/* التذييل */}
				<div className="flex items-center justify-end gap-3 border-t-[0.75px] border-[#E5E5E5] px-3 py-[7.5px]">
					<div className="flex items-center gap-1 text-[10px] text-[#737373]">
						<span>إشعار المدير عبر البريد</span>
						<Switch
							size="sm"
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
						/>
					</div>

					<button
						type="button"
						onClick={() => {
							onConfirm();
							onOpenChange(false);
						}}
						className="flex h-[25.5px] items-center gap-[5px] rounded-[4px] bg-[#DC2626] px-3 text-[11px] font-semibold primarytransition-colors hover:bg-[#b91c1c]"
					>
						<span className="rounded-[4px] bg-white/20 px-[3px] py-[1.5px] text-[8px] font-normal leading-[12px]">
							⌘↵
						</span>
						حذف
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

import { IconX } from "@tabler/icons-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { CONTENT_TYPE_OPTIONS } from "@/features/services/training/data/training";
import { cn } from "@/lib/utils";
import type { CourseContentType } from "@/server/training/training.type";

// منتقي «إنشاء محتوى جديد» — يعرض بطاقات أنواع المحتوى (صفحة/درس/اختبار) بنظام تصميم التطبيق.
// متمركز، بتخطيط RTL؛ اختيار بطاقة يستدعي onSelect بالنوع، والإغلاق يستدعي onClose.
export function ContentTypeDialog({
	open,
	onClose,
	onSelect,
}: {
	open: boolean;
	onClose: () => void;
	onSelect: (type: CourseContentType) => void;
}) {
	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) onClose();
			}}
		>
			<DialogContent
				showCloseButton={false}
				// sm:max-w-[620px] ضروري: المكوّن الأساسي فيه sm:max-w-sm ولا يُلغيه max-w العادي
				className="w-[620px] max-w-[calc(100%-2rem)] gap-0 rounded-[12px] border-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[620px]"
			>
				{/* الرأس — في RTL: العنوان يمينًا وزر الإغلاق يسارًا */}
				<div className="flex items-center justify-between gap-3 border-b border-[#E5E5E5] px-4 py-3">
					<div className="flex flex-col gap-0.5">
						<DialogTitle className="text-[15px] font-bold leading-5 text-[#08090A]">
							إنشاء محتوى جديد
						</DialogTitle>
						<DialogDescription className="text-[11px] leading-4 text-[#737373]">
							اختر نوع المحتوى الذي تريد إضافته إلى الدورة التدريبية.
						</DialogDescription>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="إغلاق"
						className="flex size-[26px] shrink-0 items-center justify-center rounded-[6px] text-[#9B9B9D] hover:bg-muted"
					>
						<IconX className="size-4" />
					</button>
				</div>

				{/* شبكة البطاقات */}
				<div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2">
					{CONTENT_TYPE_OPTIONS.map(({ value, label, description, Icon, tint, fg }) => (
						<button
							key={value}
							type="button"
							onClick={() => onSelect(value)}
							className={cn(
								"group flex items-start gap-3 rounded-[10px] border border-[#E5E5E5] bg-white p-3 text-start transition-all",
								"hover:border-primary/60 hover:bg-primary/[0.03] hover:shadow-[0_2px_10px_rgba(16,16,24,0.06)]",
								"focus-visible:border-primary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/20",
							)}
						>
							<span
								className={cn(
									"flex size-9 shrink-0 items-center justify-center rounded-[8px]",
									tint,
									fg,
								)}
							>
								<Icon className="size-[18px]" />
							</span>
							<span className="flex min-w-0 flex-col gap-1">
								<span className="text-[13px] font-bold leading-5 text-[#08090A]">{label}</span>
								<span className="text-[11px] leading-[16px] text-[#737373]">
									{description}
								</span>
							</span>
						</button>
					))}
				</div>

				{/* التذييل — زر الإلغاء يسارًا (يتبع تدفّق RTL) */}
				<div className="flex items-center justify-end border-t border-[#E5E5E5] px-4 py-3">
					<button
						type="button"
						onClick={onClose}
						className="flex h-[30px] items-center rounded-[6px] border-[0.75px] border-[#E5E5E5] px-3 text-[12px] font-medium text-[#08090A] hover:bg-muted"
					>
						إلغاء
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

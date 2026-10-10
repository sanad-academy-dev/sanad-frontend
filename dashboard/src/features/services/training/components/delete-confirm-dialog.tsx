import {
	IconAlertCircle,
	IconArrowsDiagonal,
	IconChevronLeft,
	IconInfoCircle,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// حوار تأكيد حذف موحّد للوحدة والدرس (Figma node 4573-514157)
export function DeleteConfirmDialog({
	title,
	context,
	name,
	nameLabel,
	question,
	consequences,
	confirmLabel,
	open,
	onOpenChange,
	onConfirm,
}: {
	// العنوان الأحمر في الرأس، مثل «حذف الوحدة التدريبية»
	title: string;
	// السياق بعد العنوان في المسار (اسم الدورة أو اسم الوحدة)
	context: string;
	// الاسم الذي يجب كتابته حرفيًا لتأكيد الحذف
	name: string;
	nameLabel: string;
	question: string;
	consequences: string[];
	confirmLabel: string;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onConfirm: () => void;
}) {
	const [typedName, setTypedName] = useState("");

	// الحذف لا يُفعَّل إلا بمطابقة اسم الوحدة حرفيًا
	const canDelete = typedName.trim() === name.trim();

	const confirm = () => {
		if (!canDelete) return;
		onOpenChange(false);
		setTypedName("");
		onConfirm();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) setTypedName("");
				onOpenChange(next);
			}}
		>
			<DialogContent
				showCloseButton={false}
				// sm:max-w-[620px] ضروري: المكوّن الأساسي فيه sm:max-w-sm ولا يُلغيه max-w العادي
				className="w-[620px] max-w-[calc(100%-2rem)] gap-0 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-0 sm:max-w-[620px]"
				onKeyDown={(e) => {
					if ((e.metaKey || e.ctrlKey) && e.key === "Enter") confirm();
				}}
			>
				{/* الرأس — في RTL: مسار التنقّل يمينًا وأزرار النافذة يسارًا */}
				<div className="flex h-[35px] items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
					{/* العنوان أولًا (يمينًا) ثم السياق — نفس ترتيب حوار «بيانات غير محفوظة» */}
					<div className="flex min-w-0 items-center gap-1">
						<DialogTitle className="shrink-0 text-[10px] font-bold leading-[14px] text-[#DC2626]">
							{title}
						</DialogTitle>
						<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
						<span className="truncate text-[10px] font-bold leading-[10px] text-[#08090A]">
							{context}
						</span>
					</div>

					{/* في RTL أول عنصر يمين، والتصميم يضع زر الإغلاق في أقصى اليسار */}
					<div className="flex shrink-0 items-center gap-1.5">
						<span className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]">
							<IconArrowsDiagonal className="size-3" />
						</span>
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							aria-label="إغلاق"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]"
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				</div>

				{/* الجسم */}
				<div className="flex flex-col gap-2.5 px-[15px] pt-3 pb-0">
					<DialogDescription className="text-[12px] leading-[22px] text-[#08090A]">
						{question}
					</DialogDescription>

					{/* صندوق النتائج المترتبة */}
					<div className="flex flex-col gap-[3px] rounded-[4px] border-[0.75px] border-[#DC2626] bg-[#FDEBEB] px-[10.25px] py-[9.65px]">
						<div className="flex items-center gap-[5px]">
							<IconAlertCircle className="size-3 shrink-0 text-[#DC2626]" />
							<span className="text-[12px] font-bold leading-4 text-[#EF4444]">
								النتائج المترتبة:
							</span>
						</div>
						<div className="flex flex-col gap-1.5">
							{consequences.map((line) => (
								<div
									key={line}
									className="flex items-start gap-1.5"
								>
									<IconAlertCircle className="mt-[3px] size-[11px] shrink-0 text-[#DC2626]" />
									<span className="text-[11px] leading-[18px] text-[#08090A]">{line}</span>
								</div>
							))}
						</div>
					</div>

					{/* تأكيد الاسم — في RTL: النص ← «مطلوب» ← أيقونة المعلومات */}
					<div className="flex flex-col gap-[5px]">
						<div className="flex items-center gap-1">
							<span className="text-[12px] font-medium leading-[18px] text-[#08090A]">
								ادخل لتأكيد الحذف، اكتب {nameLabel}: {name}
							</span>
							<span className="rounded-[4px] bg-[#DC2626]/[0.06] px-[4.5px] py-[1.5px] text-[8px] font-medium leading-3 text-[#DC2626]">
								مطلوب
							</span>
							<IconInfoCircle className="size-2.5 shrink-0 text-[#9B9B9D] opacity-50" />
						</div>
						<Input
							value={typedName}
							onChange={(e) => setTypedName(e.target.value)}
							placeholder={`ادخل ${nameLabel} هنا`}
							className="h-8 rounded-[4px] px-[10.5px] text-[13px]"
						/>
					</div>
				</div>

				{/* التذييل — التصميم يضع زر الحذف في أقصى اليسار (justify-end في RTL) */}
				<div className="mt-3 flex items-center justify-end border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<button
						type="button"
						onClick={confirm}
						disabled={!canDelete}
						className={cn(
							"flex h-[25.5px] w-[105px] items-center justify-center gap-1.5 rounded-[4px] text-[11px] font-semibold text-[#F7F7FA] transition-colors",
							canDelete
								? "bg-[#DC2626] hover:bg-[#DC2626]/90"
								: "cursor-not-allowed bg-[#DC2626]/[0.38]",
						)}
					>
						{confirmLabel}
						<span className="rounded-[4px] bg-white/20 px-[3px] py-[1.5px] text-[8px] leading-3 text-white">
							⌘↵
						</span>
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

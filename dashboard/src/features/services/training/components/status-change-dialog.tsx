import { IconArrowsDiagonal, IconChevronLeft, IconX } from "@tabler/icons-react";
import type { ComponentType, ReactNode } from "react";
import { useState } from "react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

// نصوص الحوار وألوانه حسب نوع التغيير: تعطيل/إلغاء نشر (كهرماني) أو إعادة تفعيل (أخضر)
export type StatusCopy = {
	title: string;
	question: (name: string) => string;
	consequencesLabel: string;
	consequences: string[];
	confirmLabel: string;
	Icon: ComponentType<{ className?: string }>;
	// لون العنوان والأيقونات، ولون إطار الصندوق وخلفيّته، ولون زر التأكيد ووسم الصندوق
	accent: string;
	boxClass: string;
	buttonClass: string;
	labelClass: string;
};

// صف تفاصيل: الوسم (يمينًا) والقيمة (يسارًا) — يتّبع تدفّق RTL للصفحة
export function DetailRow({ label, children }: { label: string; children: ReactNode }) {
	return (
		<div className="flex items-center justify-between gap-2">
			<span className="text-[12px] font-semibold leading-[18px] text-[#08090A]">{label}</span>
			{children}
		</div>
	);
}

// تاريخ ميلادي مضغوط بأرقام لاتينية (dd/mm/yyyy) مطابقًا للتصميم
export const fmtDate = (d: Date | string) => new Date(d).toLocaleDateString("en-GB");

// شارة قيمة بلون أساسي خفيف (مثل نوع الدورة/القسم المستهدف في التصميم)
export function ValueChip({ children }: { children: ReactNode }) {
	return (
		<span className="rounded-[4px] bg-[#6366F1]/[0.125] px-1 py-[5px] text-[10px] leading-[10px] text-[#5B6ABF]">
			{children}
		</span>
	);
}

// هيكل حوار تغيير الحالة (Figma node 4422-526611) — يُستخدم لتعطيل/تفعيل الدورة
// وإلغاء نشر الاختبار: لا حقل تأكيد بالاسم، بطاقة تفاصيل، وصندوق نتائج ملوّن. متمركز وبتخطيط RTL.
export function StatusChangeDialog({
	open,
	name,
	copy,
	rows,
	onClose,
	onConfirm,
}: {
	open: boolean;
	// الاسم الظاهر في المسار وفي سؤال التأكيد
	name: string;
	copy: StatusCopy;
	// بطاقة التفاصيل — صفوف جاهزة يبنيها المستدعي من بيانات العنصر
	rows: ReactNode;
	onClose: () => void;
	onConfirm: () => void;
}) {
	const [notifyManager, setNotifyManager] = useState(false);

	const confirm = () => {
		setNotifyManager(false);
		onConfirm();
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(next) => {
				if (!next) {
					setNotifyManager(false);
					onClose();
				}
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
				{/* الرأس — في RTL: العنوان الملوّن والمسار يمينًا، أزرار النافذة يسارًا */}
				<div className="flex h-[35px] items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
					<div className="flex min-w-0 items-center gap-1">
						<DialogTitle
							className={cn("shrink-0 text-[10px] font-bold leading-[14px]", copy.accent)}
						>
							{copy.title}
						</DialogTitle>
						<IconChevronLeft className="size-[9px] shrink-0 text-[#272829]" />
						<span className="truncate text-[10px] font-bold leading-[14px] text-[#08090A]">
							{name}
						</span>
					</div>

					<div className="flex shrink-0 items-center gap-1.5">
						<span className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]">
							<IconArrowsDiagonal className="size-3" />
						</span>
						<button
							type="button"
							onClick={onClose}
							aria-label="إغلاق"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]"
						>
							<IconX className="size-3.5" />
						</button>
					</div>
				</div>

				{/* الجسم */}
				<div className="flex max-h-[70vh] flex-col gap-1.5 overflow-y-auto px-[15px] pt-3 pb-3">
					<DialogDescription className="text-[12px] leading-[22px] text-[#08090A]">
						{copy.question(name)}
					</DialogDescription>

					{/* بطاقة التفاصيل */}
					<div className="flex flex-col gap-2.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] px-[21.75px] py-2">
						{rows}
					</div>

					{/* صندوق النتائج/ما سيحدث — الأيقونة تتصدّر يمينًا والنص يليها يسارًا */}
					<div
						className={cn(
							"flex flex-col gap-1.5 rounded-[4px] border-[0.75px] px-[10.25px] py-[9.65px]",
							copy.boxClass,
						)}
					>
						<div className="flex items-center gap-[5px]">
							<copy.Icon className={cn("size-3 shrink-0", copy.accent)} />
							<span className={cn("text-[12px] font-bold leading-4", copy.labelClass)}>
								{copy.consequencesLabel}
							</span>
						</div>
						{copy.consequences.map((line) => (
							<div
								key={line}
								className="flex items-start gap-1.5"
							>
								<copy.Icon className={cn("mt-[3px] size-[11px] shrink-0", copy.accent)} />
								<span className="text-[11px] leading-[18px] text-[#08090A]">{line}</span>
							</div>
						))}
					</div>
				</div>

				{/* التذييل — زر التأكيد يسارًا، ومبدّل إشعار المدير يمينًا */}
				<div className="flex items-center justify-between border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<div className="flex items-center gap-2">
						<span className="text-[10px] leading-[15px] text-[#737373]">
							إشعار المدير عبر البريد
						</span>
						<Switch
							checked={notifyManager}
							onCheckedChange={setNotifyManager}
							aria-label="إشعار المدير عبر البريد"
						/>
					</div>
					<button
						type="button"
						onClick={confirm}
						className={cn(
							"flex h-[25.5px] items-center justify-center gap-1.5 rounded-[4px] px-3 text-[11px] font-semibold text-[#F7F7FA] transition-colors",
							copy.buttonClass,
						)}
					>
						{copy.confirmLabel}
						<span className="rounded-[4px] bg-white/20 px-[3px] py-[1.5px] text-[8px] leading-3 text-white">
							⌘↵
						</span>
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

import { IconAlertCircle, IconArrowsDiagonal, IconTrash, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

// أسماء الأشهر الميلادية بالعربية (أرقام لاتينية كما في التصميم)
const AR_MONTHS = [
	"يناير",
	"فبراير",
	"مارس",
	"أبريل",
	"مايو",
	"يونيو",
	"يوليو",
	"أغسطس",
	"سبتمبر",
	"أكتوبر",
	"نوفمبر",
	"ديسمبر",
];

// "yyyy-MM-dd" → "23 أبريل 2026"
const formatArabicDate = (d: string) => {
	if (!d) return "—";
	const [y, m, day] = d.split("-").map(Number);
	return `${day} ${AR_MONTHS[(m || 1) - 1]} ${y}`;
};

// "HH:mm" → "08:00 ص/م"
const time12Short = (t: string) => {
	const [h, m] = t.split(":").map(Number);
	const period = h < 12 ? "ص" : "م";
	const hh = h % 12 === 0 ? 12 : h % 12;
	return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};

// صف تفصيل داخل صندوق المناوبة (العنوان يمين، القيمة يسار)
function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex w-full items-center justify-between">
			<span className="text-[12px] font-medium text-[#08090A]">{label}</span>
			<span className="text-[12px] text-[#08090A]">{value || "—"}</span>
		</div>
	);
}

// سطر نتيجة مترتبة (الأيقونة يمين، النص يسارها بمحاذاة لليمين)
function ConsequenceRow({ text, color }: { text: string; color: string }) {
	return (
		<div className="flex w-full items-center gap-1.5">
			<IconAlertCircle
				className="size-[11px] shrink-0"
				style={{ color }}
			/>
			<span className="flex-1 text-right text-[11px] leading-[18px] text-[#08090A]">
				{text}
			</span>
		</div>
	);
}

export function ShiftDeleteDialog({
	open,
	onClose,
	staffName,
	staffInitials,
	staffCode,
	shiftAdjective,
	date,
	startTime,
	endTime,
	branchName,
	isPending,
	onConfirm,
}: {
	open: boolean;
	onClose: () => void;
	// اسم الموظف صاحب المناوبة
	staffName: string;
	// الأحرف الأولى للأڤاتار
	staffInitials: string;
	// كود الموظف/المناوبة (يظهر يسار الاسم)
	staffCode: string;
	// نوع المناوبة كصفة (صباحية/مسائية/ليلية)
	shiftAdjective: string;
	// تاريخ المناوبة "yyyy-MM-dd"
	date: string;
	// وقت البداية "HH:mm"
	startTime: string;
	// وقت النهاية "HH:mm"
	endTime: string;
	// اسم الفرع
	branchName: string;
	isPending?: boolean;
	// تأكيد الحذف — يمرّر خيار إشعار المدير عبر البريد
	onConfirm: (notifyEmail: boolean) => void;
}) {
	const [notifyEmail, setNotifyEmail] = useState(false);

	return (
		<Dialog
			open={open}
			onOpenChange={(o) => !o && onClose()}
		>
			<DialogContent
				dir="rtl"
				showCloseButton={false}
				className="w-[620px]! max-w-[620px]! gap-0 rounded-[4px] border-[0.75px] border-[#E5E5E5] p-0"
			>
				<DialogTitle className="sr-only">حذف المناوبة</DialogTitle>
				<DialogDescription className="sr-only">
					تأكيد حذف مناوبة الموظف من جدول العمل
				</DialogDescription>

				{/* الرأس — بريدكرَمب الحذف + الموظف يمينًا، أزرار الإغلاق/التوسيع يسارًا */}
				<div className="flex items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
					<div className="flex items-center gap-1.5">
						{/* بريدكرَمب الحذف */}
						<span className="flex items-center gap-1 text-[10px] font-bold text-[#DC2626]">
							<IconTrash className="size-[9px]" />
							حذف المناوبة
						</span>
						{/* اسم الموظف + الأڤاتار */}
						<span className="text-[13px] font-bold text-[#08090A]">{staffName}</span>
						<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] text-white">
							{staffInitials}
						</span>
						{/* الكود */}
						<span className="font-mono text-[10px] text-[#9B9B9D]">{staffCode}</span>
					</div>
					<div className="flex items-center gap-1.5">
						<button
							type="button"
							onClick={onClose}
							aria-label="إغلاق"
							className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D] hover:bg-muted"
						>
							<IconX className="size-3.5" />
						</button>
						{/* توسيع (زخرفي — مطابقة للتصميم) */}
						<span className="flex size-[18px] items-center justify-center rounded-[4px] text-[#9B9B9D]">
							<IconArrowsDiagonal className="size-3" />
						</span>
					</div>
				</div>

				{/* الجسم */}
				<div className="flex flex-col gap-3 px-[15px] pt-3 pb-0">
					{/* الفقرة التمهيدية */}
					<p className="w-full text-right text-[12px] leading-[22px] text-[#08090A]">
						هل أنت متأكد من رغبتك في حذف هذه المناوبة؟ سيتم إزالة المناوبة من الجدول ولن يتمكن
						من رؤيتها بعد الآن
					</p>

					{/* صندوق تفاصيل المناوبة */}
					<div className="flex w-full flex-col gap-2.5 rounded-[4px] border-[0.5px] border-[#D8D8D8] p-3">
						<DetailRow
							label="نوع المناوبة"
							value={shiftAdjective}
						/>
						<DetailRow
							label="التاريخ"
							value={formatArabicDate(date)}
						/>
						<DetailRow
							label="الوقت"
							value={`${time12Short(startTime)} - ${time12Short(endTime)}`}
						/>
						<DetailRow
							label="الفرع"
							value={branchName}
						/>
					</div>

					{/* صندوق النتائج المترتبة */}
					<div className="flex w-full flex-col gap-1.5 rounded-[4px] border-[0.75px] border-[#DC2626] bg-[#FDEBEB] p-2.5">
						{/* العنوان */}
						<div className="flex w-full items-center gap-1.5">
							<IconAlertCircle className="size-3 shrink-0 text-[#DC2626]" />
							<span className="text-[12px] font-bold text-[#EF4444]">النتائج المترتبة:</span>
						</div>
						{/* البنود */}
						<ConsequenceRow
							text="سيتم إزالة المناوبة من جدول العمل"
							color="#DC2626"
						/>
						<ConsequenceRow
							text="قد تتأثر التغطية التشغيلية لهذا اليوم"
							color="#DC2626"
						/>
						<ConsequenceRow
							text="سيتم إلغاء أي ارتباطات بالجلسات أو المهام المرتبطة بالمناوبة (إن وجدت)"
							color="#F59E0B"
						/>
					</div>
				</div>

				{/* التذييل — زر الحذف يسارًا و«إشعار المدير عبر البريد» على يمينه */}
				<div className="mt-3 flex items-center justify-end gap-3 border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<div className="flex items-center gap-2">
						<span className="text-[10px] text-[#737373]">إشعار المدير عبر البريد</span>
						<Switch
							checked={notifyEmail}
							onCheckedChange={setNotifyEmail}
						/>
					</div>
					<Button
						type="button"
						onClick={() => onConfirm(notifyEmail)}
						disabled={isPending}
						className="h-[25.5px] gap-2 rounded-[4px] bg-[#DC2626] px-3 text-[11px] font-semibold text-[#F7F7FA] hover:bg-[#DC2626]/90"
					>
						حذف
						<span className="rounded-[4px] bg-white/20 px-1 py-0.5 text-[8px]">⌘↵</span>
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

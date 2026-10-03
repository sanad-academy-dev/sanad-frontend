import {
	IconArrowRight,
	IconChevronLeft,
	IconClock,
	IconInfoCircle,
	IconSparkles,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";

import { buildTimeOptions } from "@/components/common/time-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

// "HH:mm" → "hh:mm صباحًا/مساءً"
const time12 = (t: string) => {
	const [h, m] = t.split(":").map(Number);
	const period = h < 12 ? "صباحًا" : "مساءً";
	const hh = h % 12 === 0 ? 12 : h % 12;
	return `${String(hh).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
};
// "HH:mm" → دقائق من منتصف الليل
const hmToMinutes = (t: string) => {
	const [h, m] = t.split(":").map(Number);
	return (h || 0) * 60 + (m || 0);
};
// دقائق من منتصف الليل → "HH:mm"
const minutesToHm = (m: number) =>
	`${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

// خيارات الوقت من الديزاين سيستم (نفس نطاق ومقاطع TimeSelect)
const TIME_OPTIONS = buildTimeOptions("H12");

// حقل وقت بدروب داون من الديزاين سيستم — بشكل البوكس (الوقت + لاحقة اختيارية + أيقونة ساعة)
function TimeField({
	value,
	onChange,
	suffix,
}: {
	value: string;
	onChange: (v: string) => void;
	// لاحقة اختيارية تُعرض بعد الوقت (مثل "إلي")
	suffix?: string;
}) {
	return (
		<Select
			value={String(hmToMinutes(value))}
			onValueChange={(next) => onChange(minutesToHm(Number(next)))}
			dir="rtl"
		>
			<SelectTrigger className="h-[34px]! w-full rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-white px-[9px] [&>svg:last-child]:hidden">
				<span className="flex items-center gap-1">
					<span className="text-[11px] font-medium text-[#9B9B9D]">{time12(value)}</span>
					{suffix && <span className="text-[10px] text-[#8D8D8D]">{suffix}</span>}
				</span>
				<IconClock className="size-[11px] shrink-0 text-[#8D8D8D]" />
			</SelectTrigger>
			{/* popper: يتموضع نسبةً للـ trigger — يعمل داخل الدايالوج المُزاح بـ transform */}
			<SelectContent
				position="popper"
				className="max-h-[240px]"
			>
				{TIME_OPTIONS.map((opt) => (
					<SelectItem
						key={opt.value}
						value={String(opt.value)}
					>
						{opt.label}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

// كيفية تعويض الساعات الإضافية الناتجة عن التمديد: صرف مقابل مادي أو إجازة تعويضية
export type CompensationChoice = "paid" | "compensatory";

export function ShiftExtendDialog({
	open,
	onClose,
	startTime,
	defaultEndTime,
	aiHint,
	isPending,
	onSave,
}: {
	open: boolean;
	onClose: () => void;
	// وقت بداية المناوبة الحالي (HH:mm)
	startTime: string;
	// وقت النهاية الحالي (HH:mm)
	defaultEndTime: string;
	// نص اقتراح الذكاء الاصطناعي
	aiHint?: string;
	isPending?: boolean;
	onSave: (
		startTime: string,
		endTime: string,
		notifyEmail: boolean,
		compensation: CompensationChoice,
	) => void;
}) {
	const [start, setStart] = useState(startTime);
	const [endTime, setEndTime] = useState(defaultEndTime);
	const [notifyEmail, setNotifyEmail] = useState(false);
	const [compensation, setCompensation] = useState<CompensationChoice>("paid");

	useEffect(() => {
		if (open) {
			setStart(startTime);
			setEndTime(defaultEndTime);
			setNotifyEmail(false);
			setCompensation("paid");
		}
	}, [open, startTime, defaultEndTime]);

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
				<DialogTitle className="sr-only">تمديد وقت المناوبة</DialogTitle>
				<DialogDescription className="sr-only">
					تمديد وقت مناوبة الموظف مع اقتراح الذكاء الاصطناعي
				</DialogDescription>

				{/* الرأس — بريدكرَمب يمينًا + زر رجوع دائري يسارًا */}
				<div className="flex items-center justify-between border-b border-[#E5E5E5] px-[11px] py-2">
					<div className="flex items-center gap-1.5">
						<span className="text-[11px] font-bold text-[#08090A]">تمديد وقت المناوبة</span>
						<IconChevronLeft className="size-2.5 text-[#9B9B9D]" />
						<span className="text-[10px] font-bold text-[#08090A]">تسجيل حضور وانصراف</span>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="رجوع"
						className="flex size-[23px] items-center justify-center rounded-full bg-[#E5E5E5] text-[#08090A]/[0.62]"
					>
						<IconArrowRight className="size-[13px]" />
					</button>
				</div>

				{/* الجسم */}
				<div className="flex flex-col gap-4 px-[15px] pt-3 pb-0">
					<div className="flex flex-col gap-2.5">
						{/* صندوق اقتراح الذكاء الاصطناعي */}
						<div className="flex flex-col items-end gap-2.5 rounded-[4px] border-[0.75px] border-[#E5E5E5] bg-[#FFFBEA] px-2.5 py-2">
							<div className="flex w-full items-center justify-start gap-1.5">
								<span className="text-[11px] font-medium text-[#C34E00]">اقتراح AI</span>
								<IconSparkles className="size-3.5 text-[#C34E00]" />
							</div>
							<p className="w-full text-right text-[10px] leading-[15px] text-[#08090A]">
								{aiHint ??
									"الموظف لديه مناوبة حتى 06:00 مساءً، ويُوصى بعدم تمديدها لأكثر من ساعتين نظرًا لارتباطه بزيارات ومهام مجدولة غدًا."}
							</p>
						</div>

						{/* حقلا الوقت: المدة الممتدة (يمين) + من (يسار) */}
						<div className="flex items-end gap-4">
							{/* المدة الممتدة — يمين: صف الليبل (النص + مطلوب + أيقونة) ثم منتقي الوقت */}
							<div className="flex flex-1 flex-col gap-1.5">
								<div className="flex items-center justify-start gap-1.5">
									<span className="text-[11px] font-medium text-[#08090A]">
										ادخل المدة الممتدة
									</span>
									<span className="rounded-[4px] bg-[#DC2626]/[0.06] px-[4.5px] py-[1.5px] text-[8px] font-medium text-[#DC2626]">
										مطلوب
									</span>
									<IconInfoCircle className="size-2.5 text-[#9B9B9D] opacity-50" />
								</div>
								<TimeField
									value={start}
									onChange={setStart}
								/>
							</div>

							{/* وقت النهاية — يسار مع لاحقة "إلي" */}
							<div className="flex flex-1 flex-col justify-end">
								<TimeField
									value={endTime}
									onChange={setEndTime}
									suffix="إلي"
								/>
							</div>
						</div>

						{/* تعويض الساعات الإضافية: صرف مقابل مادي أو إجازة تعويضية */}
						<div className="flex flex-col gap-1.5">
							<span className="text-[11px] font-medium text-[#08090A]">
								تعويض الساعات الإضافية
							</span>
							<div className="flex items-center gap-2">
								{(
									[
										{ key: "paid", label: "صرف مقابل مادي" },
										{ key: "compensatory", label: "إجازة تعويضية" },
									] as const
								).map((opt) => (
									<button
										key={opt.key}
										type="button"
										onClick={() => setCompensation(opt.key)}
										className={`flex h-[34px] flex-1 items-center justify-center rounded-[4px] border text-[11px] font-medium transition-colors ${
											compensation === opt.key
												? "border-[#6366F1] bg-[#6366F1]/[0.06] text-[#6366F1]"
												: "border-[#E5E5E5] bg-white text-[#08090A]"
										}`}
									>
										{opt.label}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* التذييل — حفظ يسارًا و«إشعار عبر البريد» ملاصقة له على يمينه */}
				<div className="mt-4 flex items-center justify-end gap-3 border-t border-[#E5E5E5] px-3 py-[7.5px]">
					<div className="flex items-center gap-2">
						<span className="text-[10px] text-[#737373]">إشعار عبر البريد</span>
						<Switch
							checked={notifyEmail}
							onCheckedChange={setNotifyEmail}
						/>
					</div>
					<Button
						type="button"
						onClick={() => onSave(start, endTime, notifyEmail, compensation)}
						disabled={isPending}
						className="h-[25.5px] gap-2 rounded-[4px] bg-[#6366F1] px-3 text-[11px]"
					>
						<span className="rounded-[4px] bg-white/20 px-1 py-0.5 text-[8px]">⌘↵</span>
						حفظ
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}

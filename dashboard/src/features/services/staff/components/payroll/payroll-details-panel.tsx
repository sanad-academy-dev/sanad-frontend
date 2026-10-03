import {
	IconArrowUp,
	IconClock,
	IconFileInvoice,
	IconLink,
	IconMailForward,
	IconMoodSmile,
	IconRosetteDiscountCheck,
	IconSend,
	IconTrendingUp,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// الحروف الأولى من الاسم للأفاتار
function initialsOf(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("");
}

// صف تفصيلي: التسمية يمين + القيمة يسار
function DetailRow({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex items-center justify-between">
			<span className="text-[12px] font-medium text-[#08090A]">{label}</span>
			<span className="text-[12px] font-normal text-[#08090A] tabular-nums">{value}</span>
		</div>
	);
}

// بطاقة ملخّص صغيرة (القيمة + التسمية)
function SummaryCard({ label, value }: { label: string; value: string }) {
	return (
		<div className="flex flex-1 items-center justify-between gap-2 rounded-[4px] border border-[#E5E5E5] bg-white px-[6px] py-[6px]">
			<span className="text-[12px] text-[#9B9B9D]">{label}</span>
			<span className="text-[11px] font-medium text-[#08090A] tabular-nums">{value}</span>
		</div>
	);
}

// خطوات سلسلة الموافقات (بيانات عيّنة مطابقة للتصميم)
const APPROVAL_STEPS = [
	{
		id: "created",
		icon: IconFileInvoice,
		title: "تم إنشاء مسير الراتب",
		date: "24/05/2022 10:23",
		by: "ماجد المطيري",
		badge: null as { label: string; className: string } | null,
	},
	{
		id: "sent",
		icon: IconMailForward,
		title: "إرسال للمراجعة إلى mohaned@gmail.com",
		date: "أُرسل في 24/05/2022 10:23",
		by: "ماجد المطيري",
		badge: null,
	},
	{
		id: "review",
		icon: IconClock,
		title: "اعتماد المدير المالي",
		date: null,
		by: "ماجد المطيري",
		badge: { label: "معلق", className: "bg-[#3B82F6]/[0.05] text-[#3B82F6]" },
	},
];

export function PayrollDetailsPanel({
	staff,
	onClose,
}: {
	staff: { name: string; code: string } | null;
	onClose: () => void;
}) {
	const open = !!staff;
	const name = staff?.name ?? "";
	const code = staff?.code ?? "";
	const [comment, setComment] = useState("");

	return (
		<Sheet
			open={open}
			onOpenChange={(isOpen) => {
				if (!isOpen) onClose();
			}}
		>
			<SheetContent
				side="left"
				showCloseButton={false}
				className="flex w-full flex-col gap-0 p-0 sm:max-w-[603px]!"
			>
				{/* الهيدر */}
				<div
					className="flex items-center justify-between border-b border-[#E5E5E5] px-3 py-2"
					dir="rtl"
				>
					<div className="flex items-center gap-3">
						<SheetTitle className="text-[10px] font-bold text-[#08090A]">
							مراجعة الطلب #25417
						</SheetTitle>
						<span className="flex items-center gap-1 text-[13px] font-bold text-[#08090A]">
							{name || "—"}
							<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] font-normal text-white">
								{name ? initialsOf(name) : "؟"}
							</span>
						</span>
						<span className="text-[10px] font-bold text-[#08090A]">تفاصيل الراتب</span>
					</div>
					<Button
						variant="ghost"
						size="icon-sm"
						onClick={onClose}
						type="button"
					>
						<IconX className="size-3.5 text-[#9B9B9D]" />
					</Button>
				</div>

				{/* المحتوى */}
				<div
					className="flex flex-1 flex-col gap-4 overflow-y-auto p-3"
					dir="rtl"
				>
					{/* بطاقة الراتب */}
					<div className="flex flex-col gap-3 rounded-[4px] border-[0.5px] border-[#D8D8D8] p-3">
						{/* الحالة + الموظف */}
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								<span className="flex items-center gap-1.5">
									<span className="flex size-[17px] items-center justify-center rounded-full bg-[#6366F1] text-[9px] font-normal text-white">
										{name ? initialsOf(name) : "؟"}
									</span>
									<span className="text-[13px] font-bold text-[#08090A]">{name || "—"}</span>
								</span>
								<span className="font-mono text-[10px] text-[#9B9B9D]">
									{code || "ST-001"}
								</span>
							</div>
							<span className="rounded-[3px] bg-[#F9CE35]/[0.18] px-[4.5px] py-[1.5px] text-[8px] font-medium text-[#E97400]">
								قيد الإنتظار
							</span>
						</div>

						{/* بطاقات الملخّص */}
						<div className="flex items-center gap-1.5">
							<SummaryCard
								label="الصافي"
								value="21,000 ر.س"
							/>
							<SummaryCard
								label="المستقطع"
								value="3,000 ر.س"
							/>
							<SummaryCard
								label="إجمالي الراتب"
								value="23,000 ر.س"
							/>
						</div>

						{/* ملاحظة صفراء */}
						<div className="flex items-start gap-1 rounded-[4px] bg-[#FFFBEA] px-2 py-3.5">
							<IconTrendingUp className="mt-0.5 size-3.5 shrink-0 text-[#C34E00]" />
							<p className="text-[12px] leading-[20px] text-[#C34E00]">
								زيادة صافي الراتب بنسبة 8% مقارنة بالشهر الماضي نتيجة ارتفاع ساعات العمل
								الإضافية وعدم وجود خصومات كبيرة
							</p>
						</div>

						{/* تفاصيل الراتب */}
						<div className="flex flex-col gap-[9px]">
							<span className="text-[12px] font-medium text-[#8C8C8C]">تفاصيل الراتب</span>
							<DetailRow
								label="فترة الراتب"
								value="01 يوليو 2026 - 31 يوليو 2026"
							/>
							<DetailRow
								label="دورة الرواتب"
								value="شهرية"
							/>
							<DetailRow
								label="الراتب الأساسي"
								value="12,000 ر.س"
							/>
							<DetailRow
								label="البدلات"
								value="+2,300 ر.س"
							/>
							<DetailRow
								label="المكافآت"
								value="+1,000 ر.س"
							/>
							<DetailRow
								label="الساعات الإضافية"
								value="+650 ر.س"
							/>
							<DetailRow
								label="الخصومات"
								value="-520 ر.س"
							/>
							<DetailRow
								label="صافي الراتب"
								value="15,430 ر.س"
							/>
						</div>

						{/* فاصل */}
						<span className="h-px w-full bg-[#EBEBEF]" />

						{/* ملخص الحضور */}
						<div className="flex flex-col gap-[9px]">
							<span className="text-[12px] font-medium text-[#8C8C8C]">ملخص الحضور</span>
							<DetailRow
								label="أيام العمل"
								value="22 يوم"
							/>
							<DetailRow
								label="الغياب"
								value="يوم"
							/>
							<DetailRow
								label="التأخير"
								value="3 أيام"
							/>
							<DetailRow
								label="الساعات الإضافية"
								value="16 ساعة"
							/>
						</div>
					</div>

					{/* سلسلة الموافقات */}
					<div className="flex flex-col gap-4">
						<span className="text-[12px] font-medium text-[#1B1B1B]">سلسله الموافقات</span>
						<div className="flex flex-col">
							{APPROVAL_STEPS.map((step, i) => {
								const StepIcon = step.icon;
								const isLast = i === APPROVAL_STEPS.length - 1;
								return (
									<div
										key={step.id}
										className="flex gap-3"
									>
										{/* الأيقونة + الخط الواصل (يمين) */}
										<div className="flex flex-col items-center gap-1">
											<span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0A0A0A]">
												<StepIcon className="size-3.5" />
											</span>
											{!isLast && <span className="w-px flex-1 bg-[#E8E8E8]" />}
										</div>

										{/* المحتوى (يسار) */}
										<div className="flex flex-1 flex-col items-end gap-1 pb-4">
											<span className="w-full text-right text-[12px] text-[#1E2939]">
												{step.title}
											</span>
											<div className="flex w-full items-center justify-start gap-1 text-[8px] text-[#5C5C5E]">
												{step.badge && (
													<>
														<span
															className={cn(
																"rounded-[2px] px-1 text-[8px] font-medium",
																step.badge.className,
															)}
														>
															{step.badge.label}
														</span>
														<span>.</span>
													</>
												)}
												{step.date && (
													<>
														<span>{step.date}</span>
														<span>.</span>
													</>
												)}
												<span className="flex items-center gap-1">
													<span className="text-[#1E2939]">{step.by}</span>
													<span>بواسطة:</span>
													<span className="flex size-[14px] items-center justify-center rounded-full bg-[#F4F4F4] text-[7px] text-[#0A0A0A]">
														{initialsOf(step.by)}
													</span>
												</span>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>

					{/* صندوق كتابة تعليق */}
					<div className="rounded-[5px] border border-[#E8E8E8] px-3 py-3">
						<div className="flex flex-col gap-2">
							<textarea
								value={comment}
								onChange={(e) => setComment(e.target.value)}
								placeholder="اكتب تعليق..."
								rows={1}
								className="w-full resize-none bg-transparent text-right text-[12px] leading-[20px] text-[#08090A] outline-none placeholder:text-[#9B9B9D]"
							/>
							<div className="flex items-center justify-between">
								<span className="flex size-6 items-center justify-center rounded-full bg-[#F4F4F4] text-[#0A0A0A]">
									<IconUser className="size-3.5" />
								</span>
								<div className="flex items-center gap-2">
									<span className="text-[14px] leading-none text-[#08090A]">@</span>
									<IconMoodSmile className="size-4 text-[#08090A]" />
									<IconLink className="size-4 text-[#08090A]" />
									<button
										type="button"
										className="flex size-6 items-center justify-center rounded-full border border-[#EDEAE9] bg-[#FCFCFC] opacity-50"
										aria-label="إرسال التعليق"
									>
										<IconArrowUp className="size-4 text-[#0A0A0A]" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* شريط الإجراءات السفلي */}
				<div
					className="flex items-center justify-end gap-2 border-t border-[#E5E5E5] px-3 py-2.5"
					dir="rtl"
				>
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="h-8 gap-1.5 text-[11px]"
					>
						<IconSend className="size-3.5" />
						إرسال للموظف
					</Button>
					<Button
						type="button"
						size="sm"
						className="h-8 gap-1.5 text-[11px] font-bold"
					>
						<IconRosetteDiscountCheck className="size-3.5" />
						اعتماد الراتب
					</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
}

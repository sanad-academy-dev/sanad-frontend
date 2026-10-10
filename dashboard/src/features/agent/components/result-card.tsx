import { IconChevronDown, IconCircleXFilled } from "@tabler/icons-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

export type ResultCardData = {
	durationSeconds?: number;
	title: string; // "تم إنشاء ملف الموظف #GAM-21"
	entityName: string;
	entityCode?: string; // "D-1234"
	entityInitials?: string; // "أم"
	statusLabel?: string; // "غير مفعّل"
	statusTone?: "muted" | "success" | "danger";
	detailsTitle?: string; // "تفاصيل الأجازة"
	details: { label: string; value: string }[];
};

// بطاقة "الإجراء المُنفّذ" — مطابقة لتصميم Figma (frame 4096)
export const ResultCard = ({ data }: { data: ResultCardData }) => {
	const [collapsed, setCollapsed] = useState(false);
	const initials = data.entityInitials ?? data.entityName.slice(0, 2);

	return (
		<div className="flex flex-col items-end gap-2.5 rounded-[4px] bg-white py-2.5 pe-3 ps-1">
			{/* الرأس: مدّة التنفيذ + طيّ */}
			<button
				type="button"
				onClick={() => setCollapsed((c) => !c)}
				className="flex items-center gap-2.5"
			>
				<IconChevronDown
					className={cn(
						"size-4 text-[#1a1a18] transition-transform",
						collapsed && "rotate-90",
					)}
				/>
				{typeof data.durationSeconds === "number" && (
					<span className="text-[15px] font-semibold text-[#1a1a18]">
						استغرق التنفيذ {data.durationSeconds} ثوانٍ
					</span>
				)}
			</button>

			{!collapsed && (
				<>
					<p className="w-full text-end text-[15px] font-semibold text-[#1a1a18]">
						{data.title}
					</p>

					{/* الصندوق الداخلي */}
					<div className="flex w-full flex-col items-end gap-3 rounded-[4px] border-[0.5px] border-[#d8d8d8] p-3.5">
						{/* صف الكيان: الكود + الاسم + الأفاتار (يمين) — الحالة (يسار) */}
						<div className="flex w-full items-center justify-between">
							{data.statusLabel && (
								<span className="flex items-center gap-1">
									<IconCircleXFilled
										className={cn(
											"size-4",
											data.statusTone === "danger"
												? "text-[#dc2626]"
												: "text-muted-foreground",
										)}
									/>
									<span
										className={cn(
											"text-[13px] font-medium",
											data.statusTone === "danger"
												? "text-[#dc2626]"
												: data.statusTone === "success"
													? "text-emerald-600"
													: "text-muted-foreground",
										)}
									>
										{data.statusLabel}
									</span>
								</span>
							)}

							<div className="flex items-center gap-1.5">
								{data.entityCode && (
									<span className="font-mono text-[12px] text-[#9b9b9d]">
										{data.entityCode}
									</span>
								)}
								<span className="text-[15px] font-bold text-[#08090a]">{data.entityName}</span>
								<span className="flex size-6 items-center justify-center rounded-full bg-[#6366f1] text-[11px] text-white">
									{initials}
								</span>
							</div>
						</div>

						{/* الفاصل */}
						<div className="h-px w-full bg-[#ebebef]" />

						{/* جدول التفاصيل: التسمية (يمين) — القيمة (يسار) */}
						<div className="flex w-full flex-col items-center gap-2.5">
							{data.detailsTitle && (
								<p className="w-full text-start text-[13px] font-medium text-[#8c8c8c]">
									{data.detailsTitle}
								</p>
							)}
							{data.details.map((row) => (
								<div
									key={row.label}
									className="flex w-full items-start justify-between"
								>
									<span className="text-[14px] font-medium text-[#08090a]">{row.label}</span>
									<span className="text-[14px] text-[#08090a]">{row.value}</span>
								</div>
							))}
						</div>
					</div>
				</>
			)}
		</div>
	);
};

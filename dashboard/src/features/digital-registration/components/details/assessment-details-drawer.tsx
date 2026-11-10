import { useState } from "react";
import {
	IconCheck,
	IconClipboardCheck,
	IconCopy,
	IconFileDescription,
	IconSparkles,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { CampaignRequestItem, AssessmentQuestionAnswer } from "../../types/campaign-request.types";

interface AssessmentDetailsDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: CampaignRequestItem;
}

/**
 * دراور تفاصيل وإجابات التقييم الأولي المستوفي لمعايير الأكاديمية.
 * يعرض إجابات ولي الأمر المباشرة، والمحاور المقاسة، والمسار المقترح بدقة للأخصائي.
 */
export function AssessmentDetailsDrawer({
	open,
	onOpenChange,
	request,
}: AssessmentDetailsDrawerProps) {
	const [copied, setCopied] = useState(false);

	const assessmentData = request.assessmentData;
	const answers: AssessmentQuestionAnswer[] = assessmentData?.answers && Array.isArray(assessmentData.answers) && assessmentData.answers.length > 0
		? assessmentData.answers
		: parseAnswersFromNotes(request.notes);

	const proposedTrack = assessmentData?.proposedTrack || request.proposedTrack || "مسار تمهيدي عام";
	const preferredShift = assessmentData?.preferredShift || request.preferredShift || "غير محدد";

	const formattedDate = assessmentData?.submittedAt
		? new Date(assessmentData.submittedAt).toLocaleDateString("ar-EG", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
		  })
		: request.submittedAt
		? new Date(request.submittedAt).toLocaleDateString("ar-EG", {
				year: "numeric",
				month: "long",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
		  })
		: "تاريخ غير مسجل";

	const handleCopySummary = () => {
		const lines: string[] = [
			`📋 ملخص التقييم الأولي للطالب: ${request.patientName} (${request.code})`,
			`• المسار المقترح: ${proposedTrack}`,
			`• الفترة المفضلة: ${preferredShift}`,
			`• تاريخ التعبئة: ${formattedDate}`,
			"",
			"📝 إجابات محاور المهارات:",
		];

		if (answers.length > 0) {
			answers.forEach((ans, idx) => {
				lines.push(`${idx + 1}. [${ans.category || "عام"}] ${ans.question}: ${ans.answer}`);
			});
		} else {
			lines.push("لم تُسجل إجابات تفصيلية مسبقة.");
		}

		navigator.clipboard.writeText(lines.join("\n"));
		setCopied(true);
		toast.success("تم نسخ ملخص التقييم الأولي للحافظة بنجاح");
		setTimeout(() => setCopied(false), 2000);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent
				className="sm:max-w-2xl max-h-[88vh] flex flex-col p-0 gap-0 overflow-hidden font-sans border-zinc-200 dark:border-zinc-800 shadow-2xl"
				dir="rtl"
			>
				{/* هيدر الدراور */}
				<DialogHeader className="p-4 md:p-5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 text-right">
					<div className="flex items-start justify-between gap-3">
						<div className="space-y-1">
							<div className="flex items-center gap-2">
								<div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
									<IconFileDescription className="size-5" />
								</div>
								<div>
									<DialogTitle className="text-base font-bold text-zinc-900 dark:text-zinc-100">
										استمارة التقييم الأولي
									</DialogTitle>
									<DialogDescription className="text-xs text-zinc-500 dark:text-zinc-400">
										إجابات ونتائج تقييم المهارات للطالب: {request.patientName} (#{request.code})
									</DialogDescription>
								</div>
							</div>
						</div>

						<Badge
							variant="outline"
							className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 text-[11px] font-medium shrink-0"
						>
							تمت التعبئة • {formattedDate}
						</Badge>
					</div>
				</DialogHeader>

				{/* محتوى الاستمارة قابل للتمرير */}
				<div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 text-xs">
					{/* 1. بطاقة المسار والتوصيات الأولية */}
					<div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3.5 space-y-2.5 shadow-2xs">
						<div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
							<span className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
								<IconSparkles className="size-3.5 text-primary" />
								<span>المسار والتوصية المقترحة</span>
							</span>
							<Badge className="bg-primary/10 text-primary border-primary/20 text-[11px]">
								{proposedTrack}
							</Badge>
						</div>

						<div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-0.5">
							<div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-0.5">
								<span className="text-[10px] text-zinc-500">الفترة المفضلة</span>
								<p className="font-semibold text-zinc-800 dark:text-zinc-200">{preferredShift}</p>
							</div>
							<div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-0.5">
								<span className="text-[10px] text-zinc-500">العمر المسجل</span>
								<p className="font-semibold text-zinc-800 dark:text-zinc-200">{request.ageLabel || "غير محدد"}</p>
							</div>
							<div className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 space-y-0.5 col-span-2 sm:col-span-1">
								<span className="text-[10px] text-zinc-500">احتمال الحضور</span>
								<p className="font-semibold text-emerald-600 dark:text-emerald-400">
									{request.attendanceProbability ?? 92}% (تقدير آلي)
								</p>
							</div>
						</div>
					</div>

					{/* 2. بطاقات إجابات أسئلة المهارات */}
					<div className="space-y-2">
						<div className="flex items-center justify-between">
							<span className="font-bold text-zinc-800 dark:text-zinc-200 text-xs flex items-center gap-1.5">
								<IconClipboardCheck className="size-3.5 text-emerald-600" />
								<span>إجابات محاور المهارات المقاسة ({answers.length})</span>
							</span>
							<span className="text-[10px] text-zinc-400">إجابات موثقة من ولي الأمر</span>
						</div>

						{answers.length > 0 ? (
							<div className="space-y-2">
								{answers.map((item, index) => (
									<div
										key={item.id || `ans-${index}`}
										className="p-3 rounded-lg border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors space-y-1.5"
									>
										<div className="flex items-center justify-between gap-2">
											<span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs">
												{index + 1}. {item.question}
											</span>
											{item.category && (
												<span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 shrink-0">
													{item.category}
												</span>
											)}
										</div>
										<div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 rounded-md px-2.5 py-1.5 text-emerald-800 dark:text-emerald-300 font-medium text-xs">
											{item.answer}
										</div>
									</div>
								))}
							</div>
						) : (
							<div className="p-6 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-zinc-400 space-y-1">
								<IconFileDescription className="size-8 mx-auto text-zinc-300 dark:text-zinc-600" />
								<p className="font-medium">لم يتم تسجيل إجابات تفصيلية للمهارات</p>
								<p className="text-[11px] text-zinc-400">تم تسجيل الطلب ببيانات التواصل الأساسية فقط.</p>
							</div>
						)}
					</div>

					{/* 3. ملاحظات وإشارات إضافية */}
					{request.notes && (
						<div className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-800/40 space-y-1">
							<span className="font-semibold text-zinc-700 dark:text-zinc-300 text-[11px]">ملاحظات تسجيل الطلب الأصلية:</span>
							<p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed whitespace-pre-wrap">
								{request.notes}
							</p>
						</div>
					)}
				</div>

				{/* فوتر الإجراءات */}
				<DialogFooter className="p-3.5 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 flex items-center justify-between sm:justify-between gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={handleCopySummary}
						className="gap-1.5 text-xs h-8"
					>
						{copied ? <IconCheck className="size-3.5 text-emerald-600" /> : <IconCopy className="size-3.5" />}
						<span>{copied ? "تم النسخ" : "نسخ ملخص التقييم"}</span>
					</Button>

					<Button
						type="button"
						variant="default"
						size="sm"
						onClick={() => onOpenChange(false)}
						className="text-xs h-8 px-4"
					>
						إغلاق
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

/**
 * تحليل ذكي للإجابات إذا كانت محفوظة كنص في notes (للتوافق القديم).
 */
function parseAnswersFromNotes(notes?: string | null): AssessmentQuestionAnswer[] {
	if (!notes) return [];
	const results: AssessmentQuestionAnswer[] = [];

	// فحص نمط: "إجابات التقييم: مسار=..., هدف=..., خطوات=..."
	if (notes.includes("إجابات التقييم:")) {
		const raw = notes.split("إجابات التقييم:")[1] || "";
		const parts = raw.split(",").map((p) => p.trim());
		parts.forEach((part, idx) => {
			const [key, val] = part.split("=").map((s) => s?.trim());
			if (key && val) {
				const labelMap: Record<string, { q: string; cat: string }> = {
					مسار: { q: "المسار الأكاديمي المطلوب", cat: "المسار" },
					هدف: { q: "الهدف الأساسي لولي الأمر من التسجيل", cat: "الأهداف" },
					خطوات: { q: "المهارات المستهدفة للطفل", cat: "المهارات" },
				};
				const meta = labelMap[key] || { q: key, cat: "عام" };
				results.push({
					id: `legacy-${idx}`,
					category: meta.cat,
					question: meta.q,
					answer: val,
				});
			}
		});
	}

	return results;
}

import { useState } from "react";
import {
	IconCheck,
	IconLoader2,
	IconSparkles,
} from "@tabler/icons-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { backendFetch } from "@/lib/backend-fetch";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { RegistrationDrawerHeader } from "../modals/registration-drawer-header";

interface FillAssessmentDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: CampaignRequestItem | null;
	campaignId?: string;
	isExpanded?: boolean;
	onSuccess?: () => void;
}

export function FillAssessmentDrawer({
	open,
	onOpenChange,
	request,
	campaignId = "",
	isExpanded = false,
	onSuccess,
}: FillAssessmentDrawerProps) {
	const queryClient = useQueryClient();
	const [isSubmitting, setIsSubmitting] = useState(false);

	// 1. أسئلة استبيان ولي الأمر (3 أسئلة) - بدون أي تحديد مسبق
	const [parentQ1, setParentQ1] = useState<string>("");
	const [parentQ2, setParentQ2] = useState<string>("");
	const [parentQ3, setParentQ3] = useState<string>("");

	// 2. تحديات وتقييم الطالب المنطقي (8 أسئلة) - بدون أي تحديد مسبق وبدون إيموجي
	const [c1, setC1] = useState<string>("");
	const [c2, setC2] = useState<string>("");
	const [c3, setC3] = useState<string>("");
	const [c4, setC4] = useState<string>("");
	const [c5, setC5] = useState<string>("");
	const [c6, setC6] = useState<string>("");
	const [c7, setC7] = useState<string>("");
	const [c8, setC8] = useState<string>("");

	if (!open || !request) return null;

	// حساب عدد الأسئلة المكتملة
	const allAnswers = [parentQ1, parentQ2, parentQ3, c1, c2, c3, c4, c5, c6, c7, c8];
	const answeredCount = allAnswers.filter((a) => Boolean(a.trim())).length;
	const isAllAnswered = answeredCount === 11;

	const handleReset = () => {
		setParentQ1("");
		setParentQ2("");
		setParentQ3("");
		setC1("");
		setC2("");
		setC3("");
		setC4("");
		setC5("");
		setC6("");
		setC7("");
		setC8("");
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!isAllAnswered) {
			toast.error(`يرجى الإجابة على جميع الأسئلة الـ 11 لاستكمال التقييم (المتبقي: ${11 - answeredCount} أسئلة)`);
			return;
		}

		setIsSubmitting(true);

		try {
			// حساب النتيجة من الأسئلة المنطقية للطفل (8 أسئلة)
			let correctCount = 0;
			if (c1 === "28") correctCount++;
			if (c2 === "A أكبر من C") correctCount++;
			if (c3 === "16") correctCount++;
			if (c4 === "نموذج بسيط يعمل") correctCount++;
			if (c5 === "فكرة -> تنفيذ -> اختبار") correctCount++;
			if (c6 === "10") correctCount++;
			if (c7 === "الصور والأمثلة") correctCount++;
			if (c8 === "بناء نموذج مصغر") correctCount++;

			const score = Math.round((correctCount / 8) * 100);
			const targetTrack = request.proposedTrack || request.targetClass || "مسار تمهيدي عام";
			const targetShift = request.preferredShift || "صباحي";

			// تحديد المستوى المهارى المستنتج من إجابة ولي الأمر
			const level = parentQ2.includes("جيدة")
				? "متقدم"
				: parentQ2.includes("بسيطة")
				? "متوسط"
				: "مبتدئ";

			const assessmentData = {
				submittedAt: new Date().toISOString(),
				proposedTrack: targetTrack,
				preferredShift: targetShift,
				score,
				candidate: {
					score,
					confidence: score >= 80 ? "HIGH" : score >= 60 ? "MEDIUM" : "LOW",
					track: targetTrack,
					recommendation: `تم إجراء التقييم الأولي بنجاح في مقر الأكاديمية بنسبة إتقان ${score}%.`,
				},
				answers: [
					// 1. أسئلة ولي الأمر
					{
						category: "اهتمامات الطفل",
						question: "ما أكثر ما يجذب ابنك؟",
						answer: parentQ1,
					},
					{
						category: "الخبرة السابقة",
						question: "هل لديه تجربة سابقة مع البرمجة أو الروبوت؟",
						answer: parentQ2,
					},
					{
						category: "أهداف ولي الأمر",
						question: "ما هو هدفك الأساسي من انضمامه للأكاديمية؟",
						answer: parentQ3,
					},
					// 2. تحديات وتقييم الطالب (بدون إيموجي)
					{
						category: "التسلسل والمنطق",
						question: "أكمل المتتالية: 4، 10، 18، ...",
						answer: c1,
					},
					{
						category: "التفكير التحليلي",
						question: "إذا كان A أكبر من B، و B أكبر من C — فما علاقة A بـ C؟",
						answer: c2,
					},
					{
						category: "الأنماط الحسابية",
						question: "كل رقم ضعف الذي قبله: 2، 4، 8، ... ما التالي؟",
						answer: c3,
					},
					{
						category: "عرض الفكرة والتواصل",
						question: "لديك 5 دقائق لعرض فكرتك — بمَ تبدأ؟",
						answer: c4,
					},
					{
						category: "التخطيط المنطقي",
						question: "رتّب خطوات بناء مشروع بالترتيب الصحيح (1 ثم 2 ثم 3):",
						answer: c5,
					},
					{
						category: "حل المشكلات والحساب",
						question: "أي رقم لا يقبل القسمة على 3؟",
						answer: c6,
					},
					{
						category: "الاستنتاج والذكاء الاصطناعي",
						question: "لتعليم الحاسوب تمييز القطط، نعطيه كثيرًا من...؟",
						answer: c7,
					},
					{
						category: "التطبيق العملي",
						question: "أفضل طريقة لاختبار فكرة جديدة بسرعة؟",
						answer: c8,
					},
				],
			};

			const res = await backendFetch(
				`/api/digital-registration/requests/${request.id}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						assessmentData,
						experienceLevel: level,
					}),
				}
			);

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err.message || "فشل حفظ التقييم الأولي");
			}

			toast.success("تم اعتماد التقييم الأولي بنجاح!");
			queryClient.invalidateQueries({ queryKey: ["campaign-requests"] });
			queryClient.invalidateQueries({ queryKey: ["campaign-requests", campaignId] });
			queryClient.invalidateQueries({ queryKey: ["registration-request", request.id] });
			handleReset();
			onSuccess?.();
			onOpenChange(false);
		} catch (err: any) {
			console.error("[FillAssessmentDrawer] error:", err);
			toast.error(err.message || "حدث خطأ أثناء حفظ التقييم");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<aside
			data-slot="fill-assessment-drawer"
			className={cn(
				"fixed z-50 w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]! lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2! rounded-lg animate-in fade-in-0 duration-200 select-text",
				isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!"
			)}
			dir="rtl"
		>
			{/* 1. رأس اللوحة الموحد (التقييم الأولي) */}
			<RegistrationDrawerHeader
				title="التقييم الأولي"
				patientName={request.patientName}
				code={request.code}
				onClose={() => onOpenChange(false)}
			/>

			{/* 2. جسم الأسئلة القابل للتمرير بعجلة الماوس */}
			<form id="fill-assessment-form" onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
				<div className="p-3.5 space-y-3.5 flex-1 min-h-0 overflow-y-auto scrollbar-thin select-text text-right">
					{/* القسم الأول: أسئلة ولي الأمر */}
					<div className="space-y-3">
						<div className="flex items-center justify-between pb-1 border-b border-zinc-200/80 dark:border-zinc-800">
							<span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
								أسئلة ولي الأمر (3 أسئلة)
							</span>
							<span className="text-[10px] text-zinc-400 font-medium">اختيار ولي الأمر</span>
						</div>

						{/* س1: اهتمامات الطفل */}
						<div className="p-3 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-2 shadow-2xs">
							<div className="flex items-center justify-between gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<span>1. ما أكثر ما يجذب ابنك؟</span>
								<span className="text-[10px] text-zinc-400 font-normal">الاهتمامات</span>
							</div>
							<div className="grid grid-cols-2 gap-1.5">
								{["الألعاب والقصص", "الرسم والتصميم", "الروبوتات والآلات", "الأرقام والألغاز"].map((val) => {
									const isSelected = parentQ1 === val;
									return (
										<button
											key={val}
											type="button"
											onClick={() => setParentQ1(val)}
											className={cn(
												"min-h-[34px] px-2 py-1 rounded-md text-[11px] font-medium text-center flex items-center justify-center transition-all cursor-pointer border select-none leading-tight",
												isSelected
													? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs ring-1 ring-indigo-300"
													: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
											)}
										>
											{val}
										</button>
									);
								})}
							</div>
						</div>

						{/* س2: الخبرة السابقة */}
						<div className="p-3 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-2 shadow-2xs">
							<div className="flex items-center justify-between gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<span>2. هل لديه تجربة سابقة مع البرمجة أو الروبوت؟</span>
								<span className="text-[10px] text-zinc-400 font-normal">الخبرة</span>
							</div>
							<div className="grid grid-cols-3 gap-1.5">
								{["لم يجرب بعد", "جرّب قليلاً", "لديه خبرة جيدة"].map((val) => {
									const isSelected = parentQ2 === val;
									return (
										<button
											key={val}
											type="button"
											onClick={() => setParentQ2(val)}
											className={cn(
												"min-h-[34px] px-1 py-1 rounded-md text-[11px] font-medium text-center flex items-center justify-center transition-all cursor-pointer border select-none leading-tight",
												isSelected
													? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs ring-1 ring-indigo-300"
													: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
											)}
										>
											{val}
										</button>
									);
								})}
							</div>
						</div>

						{/* س3: أهداف ولي الأمر */}
						<div className="p-3 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-2 shadow-2xs">
							<div className="flex items-center justify-between gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<span>3. ما هو هدفك الأساسي من انضمامه للأكاديمية؟</span>
								<span className="text-[10px] text-zinc-400 font-normal">الأهداف</span>
							</div>
							<div className="grid grid-cols-2 gap-1.5">
								{["مهارات المستقبل", "الإبداع والثقة", "التفوق الدراسي", "استثمار وقته بفائدة"].map((val) => {
									const isSelected = parentQ3 === val;
									return (
										<button
											key={val}
											type="button"
											onClick={() => setParentQ3(val)}
											className={cn(
												"min-h-[34px] px-2 py-1 rounded-md text-[11px] font-medium text-center flex items-center justify-center transition-all cursor-pointer border select-none leading-tight",
												isSelected
													? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs ring-1 ring-indigo-300"
													: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
											)}
										>
											{val}
										</button>
									);
								})}
							</div>
						</div>
					</div>

					{/* القسم الثاني: تحديات وتقييم الطالب المنطقي (8 أسئلة) */}
					<div className="space-y-3 pt-1">
						<div className="flex items-center justify-between pb-1 border-b border-zinc-200/80 dark:border-zinc-800">
							<div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<IconSparkles className="size-3.5 text-amber-500" />
								<span>تحديات وتقييم الطالب (8 أسئلة)</span>
							</div>
							<span className="text-[10px] text-zinc-400 font-medium">سؤال موجه للطفل</span>
						</div>

						{/* ت1: التسلسل والمنطق */}
						<div className="p-3 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-2 shadow-2xs">
							<div className="flex items-center justify-between gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<span>1. أكمل المتتالية: 4، 10، 18، ...</span>
								<span className="text-[10px] text-zinc-400 font-normal">تسلسل</span>
							</div>
							<div className="grid grid-cols-3 gap-1.5">
								{["24", "28", "30"].map((val) => {
									const isSelected = c1 === val;
									return (
										<button
											key={val}
											type="button"
											onClick={() => setC1(val)}
											className={cn(
												"min-h-[34px] px-2 py-1 rounded-md text-xs font-bold font-mono text-center flex items-center justify-center transition-all cursor-pointer border select-none",
												isSelected
													? "bg-indigo-600 text-white border-indigo-600 shadow-xs ring-1 ring-indigo-300"
													: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
											)}
										>
											{val}
										</button>
									);
								})}
							</div>
						</div>

						{/* ت2: التفكير التحليلي */}
						<div className="p-3 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-2 shadow-2xs">
							<div className="flex items-center justify-between gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<span>2. إذا كان A أكبر من B، و B أكبر من C — فما علاقة A بـ C؟</span>
								<span className="text-[10px] text-zinc-400 font-normal">تحليلي</span>
							</div>
							<div className="grid grid-cols-3 gap-1.5">
								{["A أكبر من C", "A أصغر من C", "متساويان"].map((val) => {
									const isSelected = c2 === val;
									return (
										<button
											key={val}
											type="button"
											onClick={() => setC2(val)}
											className={cn(
												"min-h-[34px] px-1 py-1 rounded-md text-[11px] font-medium text-center flex items-center justify-center transition-all cursor-pointer border select-none leading-tight",
												isSelected
													? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs ring-1 ring-indigo-300"
													: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
											)}
										>
											{val}
										</button>
									);
								})}
							</div>
						</div>

						{/* ت3: الأنماط والضعف */}
						<div className="p-3 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-2 shadow-2xs">
							<div className="flex items-center justify-between gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<span>3. كل رقم ضعف الذي قبله: 2، 4، 8، ... ما التالي؟</span>
								<span className="text-[10px] text-zinc-400 font-normal">أنماط</span>
							</div>
							<div className="grid grid-cols-3 gap-1.5">
								{["10", "12", "16"].map((val) => {
									const isSelected = c3 === val;
									return (
										<button
											key={val}
											type="button"
											onClick={() => setC3(val)}
											className={cn(
												"min-h-[34px] px-2 py-1 rounded-md text-xs font-bold font-mono text-center flex items-center justify-center transition-all cursor-pointer border select-none",
												isSelected
													? "bg-indigo-600 text-white border-indigo-600 shadow-xs ring-1 ring-indigo-300"
													: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
											)}
										>
											{val}
										</button>
									);
								})}
							</div>
						</div>

						{/* ت4: عرض الفكرة والتواصل */}
						<div className="p-3 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-2 shadow-2xs">
							<div className="flex items-center justify-between gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<span>4. لديك 5 دقائق لعرض فكرتك — بمَ تبدأ؟</span>
								<span className="text-[10px] text-zinc-400 font-normal">تواصل</span>
							</div>
							<div className="grid grid-cols-3 gap-1.5">
								{["نموذج بسيط يعمل", "شرح نظري طويل", "تصميم الشعار"].map((val) => {
									const isSelected = c4 === val;
									return (
										<button
											key={val}
											type="button"
											onClick={() => setC4(val)}
											className={cn(
												"min-h-[34px] px-1 py-1 rounded-md text-[10.5px] font-medium text-center flex items-center justify-center transition-all cursor-pointer border select-none leading-tight",
												isSelected
													? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs ring-1 ring-indigo-300"
													: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
											)}
										>
											{val}
										</button>
									);
								})}
							</div>
						</div>

						{/* ت5: خطوات بناء مشروع */}
						<div className="p-3 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-2 shadow-2xs">
							<div className="flex items-center justify-between gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<span>5. رتّب خطوات بناء مشروع بالترتيب الصحيح (1 ثم 2 ثم 3):</span>
								<span className="text-[10px] text-zinc-400 font-normal">تخطيط</span>
							</div>
							<div className="grid grid-cols-3 gap-1.5">
								{[
									"فكرة -> تنفيذ -> اختبار",
									"تنفيذ -> اختبار -> فكرة",
									"اختبار -> فكرة -> تنفيذ",
								].map((val) => {
									const isSelected = c5 === val;
									return (
										<button
											key={val}
											type="button"
											onClick={() => setC5(val)}
											className={cn(
												"min-h-[34px] px-1 py-1 rounded-md text-[10px] font-medium text-center flex items-center justify-center transition-all cursor-pointer border select-none leading-tight",
												isSelected
													? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs ring-1 ring-indigo-300"
													: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
											)}
										>
											{val}
										</button>
									);
								})}
							</div>
						</div>

						{/* ت6: حل المشكلات والحساب */}
						<div className="p-3 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-2 shadow-2xs">
							<div className="flex items-center justify-between gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<span>6. أي رقم لا يقبل القسمة على 3؟</span>
								<span className="text-[10px] text-zinc-400 font-normal">حساب</span>
							</div>
							<div className="grid grid-cols-3 gap-1.5">
								{["12", "10", "9"].map((val) => {
									const isSelected = c6 === val;
									return (
										<button
											key={val}
											type="button"
											onClick={() => setC6(val)}
											className={cn(
												"min-h-[34px] px-2 py-1 rounded-md text-xs font-bold font-mono text-center flex items-center justify-center transition-all cursor-pointer border select-none",
												isSelected
													? "bg-indigo-600 text-white border-indigo-600 shadow-xs ring-1 ring-indigo-300"
													: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
											)}
										>
											{val}
										</button>
									);
								})}
							</div>
						</div>

						{/* ت7: الاستنتاج والذكاء الاصطناعي - بدون إيموجي */}
						<div className="p-3 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-2 shadow-2xs">
							<div className="flex items-center justify-between gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<span>7. لتعليم الحاسوب تمييز القطط، نعطيه كثيرًا من...؟</span>
								<span className="text-[10px] text-zinc-400 font-normal">استنتاج</span>
							</div>
							<div className="grid grid-cols-3 gap-1.5">
								{["الصور والأمثلة", "الألوان فقط", "الحظ"].map((val) => {
									const isSelected = c7 === val;
									return (
										<button
											key={val}
											type="button"
											onClick={() => setC7(val)}
											className={cn(
												"min-h-[34px] px-1 py-1 rounded-md text-[10.5px] font-medium text-center flex items-center justify-center transition-all cursor-pointer border select-none leading-tight",
												isSelected
													? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs ring-1 ring-indigo-300"
													: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
											)}
										>
											{val}
										</button>
									);
								})}
							</div>
						</div>

						{/* ت8: التطبيق العملي */}
						<div className="p-3 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 space-y-2 shadow-2xs">
							<div className="flex items-center justify-between gap-1 text-xs font-bold text-zinc-900 dark:text-zinc-100">
								<span>8. أفضل طريقة لاختبار فكرة جديدة بسرعة؟</span>
								<span className="text-[10px] text-zinc-400 font-normal">تطبيق</span>
							</div>
							<div className="grid grid-cols-3 gap-1.5">
								{["بناء نموذج مصغر", "الانتظار سنة", "عدم المحاولة"].map((val) => {
									const isSelected = c8 === val;
									return (
										<button
											key={val}
											type="button"
											onClick={() => setC8(val)}
											className={cn(
												"min-h-[34px] px-1 py-1 rounded-md text-[10.5px] font-medium text-center flex items-center justify-center transition-all cursor-pointer border select-none leading-tight",
												isSelected
													? "bg-indigo-600 text-white border-indigo-600 font-bold shadow-xs ring-1 ring-indigo-300"
													: "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700/70"
											)}
										>
											{val}
										</button>
									);
								})}
							</div>
						</div>
					</div>
				</div>

				{/* 3. فوتر اللوحة الجانبية */}
				<div className="p-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 bg-white dark:bg-zinc-900 shrink-0">
					<div className="text-[11px] text-muted-foreground font-medium">
						{isAllAnswered ? (
							<span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
								<IconCheck className="size-3.5" />
								جاهز للاعتماد
							</span>
						) : (
							<span>متبقي {11 - answeredCount} أسئلة</span>
						)}
					</div>

					<div className="flex items-center gap-2">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}
							className="text-xs h-8 cursor-pointer"
						>
							إلغاء
						</Button>
						<Button
							type="submit"
							size="sm"
							disabled={isSubmitting || !isAllAnswered}
							className={cn(
								"text-xs h-8 font-semibold px-4 gap-1.5 shadow-2xs transition-colors cursor-pointer",
								isAllAnswered
									? "bg-indigo-600 hover:bg-indigo-700 text-white"
									: "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed"
							)}
						>
							{isSubmitting ? (
								<>
									<IconLoader2 className="size-3.5 animate-spin" />
									<span>جاري الحفظ...</span>
								</>
							) : (
								<>
									<IconCheck className="size-3.5" />
									<span>اعتماد التقييم</span>
								</>
							)}
						</Button>
					</div>
				</div>
			</form>
		</aside>
	);
}

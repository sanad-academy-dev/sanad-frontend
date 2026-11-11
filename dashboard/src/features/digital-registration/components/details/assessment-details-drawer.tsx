import { useMemo, useState } from "react";
import {
	IconChevronDown,
	IconDownload,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CampaignRequestItem } from "../../types/campaign-request.types";
import { RegistrationDrawerHeader } from "../modals/registration-drawer-header";

interface AssessmentDetailsDrawerProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	request: CampaignRequestItem | null;
	campaignId?: string;
	isExpanded?: boolean;
}

interface QuestionDef {
	id: number;
	category: string;
	title: string;
	type: "survey" | "quiz";
	options: string[];
	correctAnswer?: string;
	points: number;
}

const CANONICAL_QUESTIONS: QuestionDef[] = [
	// 1. أسئلة استبيان ولي الأمر (3 أسئلة)
	{
		id: 1,
		category: "اهتمامات الطفل",
		title: "ما أكثر ما يجذب ابنك؟",
		type: "survey",
		options: ["الألعاب والقصص", "الرسم والتصميم", "الروبوتات والآلات", "الأرقام والألغاز"],
		points: 0,
	},
	{
		id: 2,
		category: "الخبرة السابقة",
		title: "هل لديه تجربة سابقة مع البرمجة أو الروبوت؟",
		type: "survey",
		options: ["لم يجرب بعد", "جرّب قليلاً", "لديه خبرة جيدة"],
		points: 0,
	},
	{
		id: 3,
		category: "أهداف ولي الأمر",
		title: "ما هو هدفك الأساسي من انضمامه للأكاديمية؟",
		type: "survey",
		options: ["مهارات المستقبل", "الإبداع والثقة", "التفوق الدراسي", "استثمار وقته بفائدة"],
		points: 0,
	},
	// 2. تحديات وتقييم الطالب المنطقي (8 أسئلة)
	{
		id: 4,
		category: "التسلسل والمنطق",
		title: "أكمل المتتالية: 4، 10، 18، ...",
		type: "quiz",
		options: ["24", "28", "30"],
		correctAnswer: "28",
		points: 1,
	},
	{
		id: 5,
		category: "التفكير التحليلي",
		title: "إذا كان A أكبر من B، و B أكبر من C — فما علاقة A بـ C؟",
		type: "quiz",
		options: ["A أصغر من C", "A أكبر من C", "متساويان"],
		correctAnswer: "A أكبر من C",
		points: 1,
	},
	{
		id: 6,
		category: "الأنماط الحسابية",
		title: "كل رقم ضعف الذي قبله: 2، 4، 8، ... ما التالي؟",
		type: "quiz",
		options: ["12", "14", "16"],
		correctAnswer: "16",
		points: 1,
	},
	{
		id: 7,
		category: "عرض الفكرة والتواصل",
		title: "لديك 5 دقائق لعرض فكرتك — بمَ تبدأ؟",
		type: "quiz",
		options: ["نموذج بسيط يعمل", "عرض شرائح 20 شريحة", "شرح نظري طويل"],
		correctAnswer: "نموذج بسيط يعمل",
		points: 1,
	},
	{
		id: 8,
		category: "التخطيط المنطقي",
		title: "رتّب خطوات بناء مشروع بالترتيب الصحيح (1 ثم 2 ثم 3):",
		type: "quiz",
		options: ["فكرة -> تنفيذ -> اختبار", "تنفيذ -> فكرة -> اختبار", "اختبار -> تنفيذ -> فكرة"],
		correctAnswer: "فكرة -> تنفيذ -> اختبار",
		points: 1,
	},
	{
		id: 9,
		category: "حل المشكلات والحساب",
		title: "أي رقم لا يقبل القسمة على 3؟",
		type: "quiz",
		options: ["9", "10", "12"],
		correctAnswer: "10",
		points: 1,
	},
	{
		id: 10,
		category: "الاستنتاج والذكاء الاصطناعي",
		title: "لتعليم الحاسوب تمييز القطط، نعطيه كثيرًا من...؟",
		type: "quiz",
		options: ["الصور والأمثلة", "القواعد الجافة", "لا يمكن تعليمه"],
		correctAnswer: "الصور والأمثلة",
		points: 1,
	},
	{
		id: 11,
		category: "التطبيق العملي",
		title: "أفضل طريقة لاختبار فكرة جديدة بسرعة؟",
		type: "quiz",
		options: ["بناء نموذج مصغر", "كتابة خطة 50 صفحة", "الانتظار حتى تكتمل"],
		correctAnswer: "بناء نموذج مصغر",
		points: 1,
	},
];

export function AssessmentDetailsDrawer({
	open,
	onOpenChange,
	request,
	isExpanded = false,
}: AssessmentDetailsDrawerProps) {
	const [expandedQuestionIds, setExpandedQuestionIds] = useState<number[]>([]);
	const assessmentData = request?.assessmentData;
	const proposedTrack = assessmentData?.proposedTrack || request?.proposedTrack || "مسار تمهيدي عام";

	// قراءة الإجابات المسجلة
	const recordedAnswers: {
		id?: number;
		question: string;
		answer: string;
		category?: string;
		options?: string[];
		correctAnswer?: string;
		isCorrect?: boolean;
	}[] = useMemo(() => {
		if (!request) return [];
		if (assessmentData?.answers && Array.isArray(assessmentData.answers)) {
			return assessmentData.answers as any[];
		}
		return parseAnswersFromNotes(request.notes);
	}, [assessmentData, request]);

	// معالجة الأسئلة الـ 11 ومطابقتها مع إجابات الطالب
	const processedQuestions = useMemo(() => {
		if (!request) return [];

		const normalizedAnswers = recordedAnswers.filter(
			(rec) => !(rec.category === "المسار المستهدف" && rec.question?.includes("المسار الأكاديمي المطلوب")),
		);

		const isLegacySummaryOnly =
			recordedAnswers.length <= 3 &&
			recordedAnswers.some(
				(rec) =>
					rec.category === "المسار المستهدف" ||
					rec.category === "المهارات والخطوات" ||
					/^مسار\s/.test(rec.answer || "") ||
					/^هدف\s/.test(rec.answer || ""),
			);

		return CANONICAL_QUESTIONS.map((q, idx) => {
			// 1. المطابقة المباشرة بالمعرف أو نص السؤال أو الفئة
			let matched =
				normalizedAnswers.find((rec) => rec.id === q.id) ||
				normalizedAnswers.find(
					(rec) =>
						rec.question === q.title ||
						(rec.question && rec.question.length >= 8 && q.title.includes(rec.question.slice(0, 15))) ||
						(q.title && rec.question?.includes(q.title.slice(0, 15))),
				) ||
				normalizedAnswers.find((rec) => rec.category && rec.category === q.category);

			// 2. ترجمة الصيغ المختصرة القديمة وربطها بالأسئلة الحقيقية دون خلط الترتيب
			if (!matched && isLegacySummaryOnly) {
				if (q.id === 3) {
					const goalRec = recordedAnswers.find((rec) => rec.category === "أهداف ولي الأمر" || /^هدف\s/.test(rec.answer));
					if (goalRec) {
						const goalMap: Record<string, string> = {
							"هدف 1": "مهارات المستقبل",
							"هدف 2": "الإبداع والثقة",
							"هدف 3": "التفوق الدراسي",
							"هدف 4": "استثمار وقته بفائدة",
						};
						matched = { ...goalRec, answer: goalMap[goalRec.answer.trim()] || goalRec.answer };
					}
				} else if (q.id === 4) {
					const trackRec = recordedAnswers.find((rec) => rec.category === "المسار المستهدف" || /^مسار\s/.test(rec.answer));
					if (trackRec) {
						const num = trackRec.answer.match(/\d+/)?.[0];
						if (num) matched = { ...trackRec, answer: num };
					}
				} else if (q.id === 8) {
					const stepsRec = recordedAnswers.find((rec) => rec.category === "المهارات والخطوات" || /idea|execute|test/i.test(rec.answer));
					if (stepsRec) {
						const stepMap: Record<string, string> = { idea: "فكرة", execute: "تنفيذ", test: "اختبار" };
						const translated = stepsRec.answer
							.split(/,|->/)
							.map((s) => stepMap[s.trim().toLowerCase()] || s.trim())
							.filter(Boolean)
							.join(" -> ");
						matched = { ...stepsRec, answer: translated };
					}
				}
			}

			// 3. مطابقة احتياطية بالترتيب فقط عندما يكون السجل كاملاً وليس ملخصاً قديماً
			if (!matched && !isLegacySummaryOnly && normalizedAnswers[idx]) {
				matched = normalizedAnswers[idx];
			}

			const userAnswer = matched ? String(matched.answer).trim() : "";
			const effectiveTitle = matched?.question && matched.question.length >= 12 ? matched.question : q.title;
			const effectiveOptions =
				Array.isArray(matched?.options) && matched.options.length > 0 ? matched.options : q.options;
			const effectiveCorrectAnswer = matched?.correctAnswer || q.correctAnswer;

			if (!userAnswer) {
				return {
					...q,
					title: effectiveTitle,
					options: effectiveOptions,
					correctAnswer: effectiveCorrectAnswer,
					userAnswer: "",
					status: "skipped" as const,
					isCorrect: false,
				};
			}

			if (q.type === "survey") {
				return {
					...q,
					title: effectiveTitle,
					options: effectiveOptions,
					correctAnswer: effectiveCorrectAnswer,
					userAnswer,
					status: "survey" as const,
					isCorrect: true,
				};
			}

			// للأسئلة المنطقية (اختبار الطالب)
			const isCorrect =
				typeof matched?.isCorrect === "boolean"
					? matched.isCorrect
					: Boolean(
							userAnswer === effectiveCorrectAnswer ||
								(effectiveCorrectAnswer && userAnswer.includes(effectiveCorrectAnswer)) ||
								(effectiveCorrectAnswer && effectiveCorrectAnswer.includes(userAnswer)),
					  );

			return {
				...q,
				title: effectiveTitle,
				options: effectiveOptions,
				correctAnswer: effectiveCorrectAnswer,
				userAnswer,
				status: (isCorrect ? "correct" : "incorrect") as "correct" | "incorrect",
				isCorrect,
			};
		});
	}, [recordedAnswers, request]);

	if (!open || !request) return null;

	// استخراج وتنسيق التاريخ الفعلي
	const formattedDate = (() => {
		const rawDate = assessmentData?.submittedAt || request.submittedAt || request.createdAt;
		if (!rawDate) return "مؤخراً";
		const d = new Date(rawDate);
		if (isNaN(d.getTime())) return "مؤخراً";
		return new Intl.DateTimeFormat("ar-EG", {
			day: "numeric",
			month: "short",
			year: "numeric",
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		}).format(d);
	})();

	// الإحصائيات الدقيقة
	const quizQuestions = processedQuestions.filter((q) => q.type === "quiz");
	const correctCount = quizQuestions.filter((q) => q.status === "correct").length;
	const incorrectCount = quizQuestions.filter((q) => q.status === "incorrect").length;
	const surveyCount = processedQuestions.filter((q) => q.status === "survey").length;
	const skippedCount = processedQuestions.filter((q) => q.status === "skipped").length;
	const answeredCount = processedQuestions.length - skippedCount;

	// نسبة الدقة والدرجة
	const accuracy = typeof assessmentData?.score === "number"
		? assessmentData.score
		: Math.round((correctCount / Math.max(quizQuestions.length, 1)) * 100);

	const scorePoints = accuracy;

	const toggleQuestion = (id: number) => {
		setExpandedQuestionIds((prev) =>
			prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
		);
	};

	// فتح السؤال المختار والتمرير السلس إليه عند النقر على رقمه في المصفوفة
	const scrollToQuestion = (id: number) => {
		setExpandedQuestionIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
		setTimeout(() => {
			const el = document.getElementById(`question-card-${id}`);
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}, 30);
	};

	const handleExportPdf = () => {
		const html = buildAssessmentPdfHtml({
			patientName: request.patientName || "طالب",
			guardianName: request.guardianName,
			code: request.code || "",
			proposedTrack: proposedTrack || "مسار تمهيدي عام",
			formattedDate,
			accuracy,
			scorePoints,
			answeredCount,
			correctCount,
			surveyCount,
			incorrectCount,
			skippedCount,
			questions: processedQuestions,
		});

		const iframe = document.createElement("iframe");
		iframe.setAttribute("aria-hidden", "true");
		iframe.style.position = "fixed";
		iframe.style.right = "0";
		iframe.style.bottom = "0";
		iframe.style.width = "0";
		iframe.style.height = "0";
		iframe.style.border = "0";
		iframe.style.opacity = "0";
		document.body.appendChild(iframe);

		const previousTitle = document.title;
		const cleanName = (request.patientName || "تقرير").replace(/[\\/:*?"<>|]/g, "-");
		const cleanCode = (request.code || "").replace(/[\\/:*?"<>|]/g, "-");
		document.title = `تقرير-التقييم-الأولي-${cleanCode}-${cleanName}`;

		let cleanedUp = false;
		const cleanup = () => {
			if (cleanedUp) return;
			cleanedUp = true;
			document.title = previousTitle;
			setTimeout(() => {
				if (iframe.parentNode) iframe.parentNode.removeChild(iframe);
			}, 300);
		};

		const frameDoc = iframe.contentDocument || iframe.contentWindow?.document;
		if (!frameDoc || !iframe.contentWindow) {
			cleanup();
			window.print();
			return;
		}

		frameDoc.open();
		frameDoc.write(html);
		frameDoc.close();

		const triggerPrint = () => {
			try {
				if (iframe.contentWindow) {
					iframe.contentWindow.onafterprint = cleanup;
					iframe.contentWindow.focus();
					iframe.contentWindow.print();
				}
			} catch {
				cleanup();
			}
			// مهلة احتياطية آمنة في حال عدم إطلاق الحدث في بعض المتصفحات
			setTimeout(cleanup, 60_000);
		};

		// انتظار استقرار التخطيط داخل الإطار المخفي قبل فتح معاينة PDF
		setTimeout(triggerPrint, 120);
	};

	return (
		<aside
			data-slot="assessment-details-drawer"
			className={cn(
				"fixed z-50 w-full lg:w-[28vw]! lg:min-w-[20rem]! lg:max-w-[28rem]! lg:right-auto! p-0 gap-0 overflow-hidden font-sans border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col bg-background h-[calc(100dvh-1rem)]! max-h-[calc(100dvh-1rem)]! inset-y-2! rounded-lg animate-in fade-in-0 duration-200 select-text",
				isExpanded ? "lg:left-[calc(65vw+0.75rem)]!" : "lg:left-[calc(60vw+0.75rem)]!"
			)}
			dir="rtl"
		>
			{/* 1. ترويسة الدراور العلوية الموحدة */}
			<RegistrationDrawerHeader
				title="تقرير التقييم الأولي"
				patientName={request.patientName}
				code={request.code}
				onClose={() => onOpenChange(false)}
			/>

			{/* 2. المحتوى القابل للتمرير */}
			<div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 select-text text-right scrollbar-thin">
				{/* 3. كارت ملخص الاختبار والمؤشرات الإحصائية الثلاثية مطابق للتصميم المرجعي */}
				<div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3.5 shadow-2xs">
					{/* الصف الأول: العنوان + المؤشرات الثلاثة */}
					<div className="space-y-1.5">
						<div className="flex items-start justify-between gap-3">
							<h4 className="font-bold text-[14px] text-zinc-900 dark:text-zinc-100 leading-snug pt-0.5">
								{proposedTrack || "تقييم المهارات والتفكير المنطقي"}
							</h4>

							{/* المؤشرات الثلاثة: الدقة، النقاط، والمجاب */}
							<div className="flex items-start gap-3.5 shrink-0">
								{/* 1. الدقة بقوس نصف دائري */}
								<div className="flex flex-col items-start gap-0.5">
									<span className="text-[10px] text-zinc-400 font-medium">الدقة</span>
									<div className="flex items-center gap-1.5" dir="ltr">
										<svg className="w-[18px] h-[11px] shrink-0 overflow-visible" viewBox="0 0 36 20" fill="none">
											<path
												d="M 4 17 A 14 14 0 0 1 32 17"
												strokeWidth="5"
												strokeLinecap="round"
												className="text-zinc-200 dark:text-zinc-700"
												stroke="currentColor"
											/>
											<path
												d="M 4 17 A 14 14 0 0 1 32 17"
												pathLength="100"
												strokeDasharray={`${accuracy} 100`}
												strokeWidth="5"
												strokeLinecap="round"
												className="text-[#00B894]"
												stroke="currentColor"
											/>
										</svg>
										<span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 tabular-nums">
											{accuracy}%
										</span>
									</div>
								</div>

								{/* 2. النقاط بدائرة ذهبية ونقطة داخلية */}
								<div className="flex flex-col items-start gap-0.5">
									<span className="text-[10px] text-zinc-400 font-medium">النقاط</span>
									<div className="flex items-center gap-1.5" dir="ltr">
										<span className="size-3.5 rounded-full bg-amber-400 ring-2 ring-amber-400/30 flex items-center justify-center shrink-0">
											<span className="size-1 rounded-full bg-zinc-900" />
										</span>
										<span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 tabular-nums">
											{scorePoints}
										</span>
									</div>
								</div>

								{/* 3. عدد الأسئلة المجابة */}
								<div className="flex flex-col items-start gap-0.5">
									<span className="text-[10px] text-zinc-400 font-medium">المجاب</span>
									<span className="text-xs tabular-nums" dir="ltr">
										<span className="font-bold text-zinc-900 dark:text-zinc-100">{answeredCount}</span>
										<span className="font-medium text-zinc-400">/11</span>
									</span>
								</div>
							</div>
						</div>

						{/* سطر التاريخ وعدد الأسئلة أسفل الترويسة */}
						<div className="flex flex-wrap items-center gap-1.5 text-[10.5px] text-zinc-400 font-medium">
							<span>تم الإنجاز:</span>
							<span className="text-zinc-600 dark:text-zinc-300 font-semibold">{formattedDate}</span>
							<span>•</span>
							<span className="inline-flex items-center gap-1 text-zinc-600 dark:text-zinc-300 font-semibold">
								<span className="size-3.5 rounded-[3px] border border-zinc-400/70 inline-flex items-center justify-center text-[8px] font-bold text-zinc-500">
									؟
								</span>
								<span>11 سؤال</span>
							</span>
						</div>
					</div>

					{/* 4. مصفوفة أرقام الأسئلة الـ 11 بمربعات عريضة وشارات مربعة في الزاوية */}
					<div className="space-y-3">
						<div className="grid grid-cols-6 gap-2" dir="rtl">
							{processedQuestions.map((q) => (
								<button
									key={q.id}
									type="button"
									onClick={() => scrollToQuestion(q.id)}
									className="relative h-9 rounded-md border border-zinc-200/70 dark:border-zinc-700/70 bg-[#F8FAFC] dark:bg-zinc-800/70 hover:bg-zinc-100 dark:hover:bg-zinc-700 flex items-center justify-center text-[11px] font-bold text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer tabular-nums"
									title={`انتقل إلى السؤال ${q.id} (${q.category})`}
								>
									<span>{q.id}</span>
									{/* شارة الحالة المربعة الصغيرة في أعلى الزاوية */}
									<span
										className={cn(
											"absolute -top-1 -end-1 size-3.5 rounded-[4px] flex items-center justify-center text-[8px] font-bold leading-none shadow-2xs",
											q.status === "correct" && "bg-[#00B894] text-white",
											q.status === "incorrect" && "bg-[#EF4444] text-white",
											q.status === "survey" && "bg-[#3B82F6] text-white",
											q.status === "skipped" && "bg-zinc-200 text-zinc-500 dark:bg-zinc-700 dark:text-zinc-300"
										)}
									>
										{q.status === "correct" && "✓"}
										{q.status === "incorrect" && "✕"}
										{q.status === "survey" && "✓"}
										{q.status === "skipped" && "–"}
									</span>
								</button>
							))}
						</div>

						{/* مفتاح المصفوفة (Legend) بصفين مرتبين كالتصميم المرجعي */}
						<div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] text-zinc-500 dark:text-zinc-400 font-medium select-none">
							<span className="flex items-center gap-1.5">
								<span className="size-2 rounded-[2px] bg-[#00B894] shrink-0" />
								<span>صحيحة</span>
								<strong className="text-zinc-900 dark:text-zinc-100 tabular-nums">{correctCount}</strong>
								<span className="text-zinc-400">• {Math.round((correctCount / 11) * 100)}%</span>
							</span>
							<span className="flex items-center gap-1.5">
								<span className="size-2 rounded-[2px] bg-[#3B82F6] shrink-0" />
								<span>استبيان</span>
								<strong className="text-zinc-900 dark:text-zinc-100 tabular-nums">{surveyCount}</strong>
								<span className="text-zinc-400">• {Math.round((surveyCount / 11) * 100)}%</span>
							</span>
							<span className="flex items-center gap-1.5">
								<span className="size-2 rounded-[2px] bg-[#EF4444] shrink-0" />
								<span>خاطئة</span>
								<strong className="text-zinc-900 dark:text-zinc-100 tabular-nums">{incorrectCount}</strong>
								<span className="text-zinc-400">• {Math.round((incorrectCount / 11) * 100)}%</span>
							</span>
							<span className="flex items-center gap-1.5">
								<span className="size-2 rounded-[2px] bg-zinc-300 dark:bg-zinc-600 shrink-0" />
								<span>غير مجاب</span>
								<strong className="text-zinc-900 dark:text-zinc-100 tabular-nums">{skippedCount}</strong>
								<span className="text-zinc-400">• {Math.round((skippedCount / 11) * 100)}%</span>
							</span>
						</div>
					</div>
				</div>

				{/* 5. قائمة بطاقات الأسئلة القابلة للطي والفتح كالتصميم المرجعي تماماً */}
				<div className="space-y-2.5">
					{processedQuestions.map((q) => {
						const isQuestionExpanded = expandedQuestionIds.includes(q.id);

						return (
							<div
								key={q.id}
								id={`question-card-${q.id}`}
								className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs scroll-mt-4 overflow-hidden transition-colors"
							>
								{/* الترويسة القابلة للنقر مع السهم وعنوان السؤال */}
								<button
									type="button"
									aria-expanded={isQuestionExpanded}
									onClick={() => toggleQuestion(q.id)}
									className="w-full p-3.5 text-right cursor-pointer hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30 transition-colors"
								>
									{/* السطر العلوي: الرقم والحالة (يمين) + نوع السؤال والنقاط والسهم (يسار) */}
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-1.5 min-w-0">
											{/* مربع [؟] الأسود الصغير + رقم السؤال */}
											<span className="size-4 rounded-[4px] bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center text-[9.5px] font-bold shrink-0">
												؟
											</span>
											<span className="text-[11px] font-semibold text-zinc-800 dark:text-zinc-200 whitespace-nowrap">
												سؤال {q.id}
											</span>
											<span className="text-zinc-300 dark:text-zinc-600 text-xs">•</span>

											{/* مربع الحالة الصغير + النص الهادئ */}
											{q.status === "correct" && (
												<span className="inline-flex items-center gap-1.5 whitespace-nowrap">
													<span className="size-4 rounded-[4px] bg-[#00B894] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
														✓
													</span>
													<span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
														صحيحة
													</span>
												</span>
											)}
											{q.status === "incorrect" && (
												<span className="inline-flex items-center gap-1.5 whitespace-nowrap">
													<span className="size-4 rounded-[4px] bg-[#EF4444] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
														✕
													</span>
													<span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
														خاطئة
													</span>
												</span>
											)}
											{q.status === "survey" && (
												<span className="inline-flex items-center gap-1.5 whitespace-nowrap">
													<span className="size-4 rounded-[4px] bg-[#3B82F6] text-white flex items-center justify-center text-[9px] font-bold shrink-0">
														✓
													</span>
													<span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
														استبيان
													</span>
												</span>
											)}
											{q.status === "skipped" && (
												<span className="inline-flex items-center gap-1.5 whitespace-nowrap">
													<span className="size-4 rounded-[4px] bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-300 flex items-center justify-center text-[9px] font-bold shrink-0">
														–
													</span>
													<span className="text-[11px] font-medium text-zinc-400">
														لم يُجب
													</span>
												</span>
											)}
										</div>

										{/* الجهة اليسرى: النقاط + السهم */}
										<div className="flex items-center gap-2.5 shrink-0">
											{q.type === "quiz" && (
												<span className="inline-flex items-center gap-1.5 text-[10.5px] font-semibold text-zinc-700 dark:text-zinc-300 whitespace-nowrap">
													<span className="size-3.5 rounded-full bg-amber-400 ring-2 ring-amber-400/25 flex items-center justify-center shrink-0">
														<span className="size-1 rounded-full bg-zinc-900" />
													</span>
													<span>1 نقطة</span>
												</span>
											)}

											<IconChevronDown
												className={cn(
													"size-4 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 shrink-0",
													isQuestionExpanded && "rotate-180"
												)}
											/>
										</div>
									</div>

									{/* نص السؤال */}
									<p className="mt-2.5 text-[12px] font-medium text-zinc-900 dark:text-zinc-100 leading-relaxed text-right">
										{q.title}
									</p>
								</button>

								{/* تفاصيل خيارات الإجابة عند الفتح */}
								{isQuestionExpanded && (
									<div className="px-3.5 pb-3.5 pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 space-y-2 animate-in fade-in-0 duration-150">
										<div className="text-[10px] font-semibold text-zinc-400 tracking-wide">
											خيارات الإجابة
										</div>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
											{getDisplayedOptions(q).map((opt) => {
												const isUserAnswer = isOptionSelected(q.userAnswer, opt);
												const isCorrectChoice = q.type === "quiz" && opt === q.correctAnswer;

												return (
													<div
														key={opt}
														className={cn(
															"relative px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all select-none flex items-center justify-between gap-2 min-h-[36px]",
															// إجابة الطالب الصحيحة
															isUserAnswer && isCorrectChoice && "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100 ring-1 ring-emerald-400/30",
															// إجابة الطالب الخاطئة
															isUserAnswer && !isCorrectChoice && q.type === "quiz" && "bg-rose-50/80 dark:bg-rose-950/40 border-rose-400 dark:border-rose-700 text-rose-950 dark:text-rose-100 ring-1 ring-rose-400/30",
															// اختيار ولي الأمر باللون الأزرق المعتمد بالنظام
															isUserAnswer && q.type === "survey" && "bg-[#EFF6FF] dark:bg-blue-950/40 border-[#3B82F6] dark:border-blue-600 text-blue-950 dark:text-blue-100 ring-1 ring-[#3B82F6]/30",
															// الإجابة الصحيحة التي لم يخترها الطالب
															!isUserAnswer && isCorrectChoice && "bg-emerald-50/30 dark:bg-emerald-950/20 border-dashed border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200",
															// خيار عادي غير مختار
															!isUserAnswer && !isCorrectChoice && "bg-zinc-50/60 dark:bg-zinc-800/40 border-zinc-200/80 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400"
														)}
													>
														<span className="font-semibold text-[11px] leading-snug">
															{opt}
														</span>
														{isUserAnswer ? (
															<span
																className={cn(
																	"size-4 rounded-[4px] flex items-center justify-center text-[9px] font-bold text-white shrink-0 shadow-2xs",
																	isCorrectChoice ? "bg-[#00B894]" : q.type === "survey" ? "bg-[#3B82F6]" : "bg-[#EF4444]"
																)}
															>
																{isCorrectChoice || q.type === "survey" ? "✓" : "✕"}
															</span>
														) : (
															isCorrectChoice && (
																<span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300 shrink-0">
																	الصحيحة
																</span>
															)
														)}
													</div>
												);
											})}
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			</div>

			{/* 6. شريط الفوتر السفلي العائم مع زري حفظ المرفقات (PDF) والإغلاق */}
			<div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/90 dark:bg-zinc-900/90 flex items-center justify-between gap-2 shrink-0">
				<Button
					type="button"
					onClick={handleExportPdf}
					className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold h-8.5 px-4 rounded-lg flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
				>
					<IconDownload className="size-3.5" />
					<span>حفظ المرفقات</span>
				</Button>

				<Button
					type="button"
					variant="outline"
					onClick={() => onOpenChange(false)}
					className="text-xs font-semibold h-8.5 px-4 rounded-lg cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
				>
					إغلاق
				</Button>
			</div>
		</aside>
	);
}

type ProcessedQuestion = QuestionDef & {
	userAnswer: string;
	status: "correct" | "incorrect" | "survey" | "skipped";
	isCorrect: boolean;
};

function getDisplayedOptions(q: Pick<QuestionDef, "options"> & { userAnswer: string }): string[] {
	if (
		q.userAnswer &&
		!q.options.some(
			(opt) => opt === q.userAnswer || opt.includes(q.userAnswer) || q.userAnswer.includes(opt),
		)
	) {
		return [...q.options, q.userAnswer];
	}
	return q.options;
}

function isOptionSelected(userAnswer: string, opt: string): boolean {
	if (!userAnswer) return false;
	return userAnswer === opt || opt.includes(userAnswer) || userAnswer.includes(opt);
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function buildAssessmentPdfHtml(params: {
	patientName: string;
	guardianName?: string | null;
	code: string;
	proposedTrack: string;
	formattedDate: string;
	accuracy: number;
	scorePoints: number;
	answeredCount: number;
	correctCount: number;
	surveyCount: number;
	incorrectCount: number;
	skippedCount: number;
	questions: ProcessedQuestion[];
}): string {
	const statusMeta: Record<ProcessedQuestion["status"], { label: string; bg: string; color: string; symbol: string }> = {
		correct: { label: "صحيحة", bg: "#00B894", color: "#00B894", symbol: "✓" },
		incorrect: { label: "خاطئة", bg: "#EF4444", color: "#EF4444", symbol: "✕" },
		survey: { label: "استبيان", bg: "#3B82F6", color: "#3B82F6", symbol: "✓" },
		skipped: { label: "لم يُجب", bg: "#E4E4E7", color: "#71717A", symbol: "–" },
	};

	const questionsHtml = params.questions
		.map((q) => {
			const meta = statusMeta[q.status];
			const optionsHtml = getDisplayedOptions(q)
				.map((opt) => {
					const selected = isOptionSelected(q.userAnswer, opt);
					const isCorrectChoice = q.type === "quiz" && opt === q.correctAnswer;

					let cardStyle = "border:1px solid #E4E4E7;background:#FAFAFA;color:#52525B;";
					let badgeHtml = "";

					if (selected && isCorrectChoice) {
						cardStyle = "border:1.5px solid #00B894;background:#ECFDF5;color:#065F46;";
						badgeHtml = `<span style="width:16px;height:16px;border-radius:4px;background:#00B894;color:#fff;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;">✓</span>`;
					} else if (selected && !isCorrectChoice && q.type === "quiz") {
						cardStyle = "border:1.5px solid #EF4444;background:#FEF2F2;color:#7F1D1D;";
						badgeHtml = `<span style="width:16px;height:16px;border-radius:4px;background:#EF4444;color:#fff;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;">✕</span>`;
					} else if (selected && q.type === "survey") {
						cardStyle = "border:1.5px solid #3B82F6;background:#EFF6FF;color:#1E3A8A;";
						badgeHtml = `<span style="width:16px;height:16px;border-radius:4px;background:#3B82F6;color:#fff;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;">✓</span>`;
					} else if (!selected && isCorrectChoice) {
						cardStyle = "border:1px dashed #34D399;background:#ECFDF5;color:#065F46;";
						badgeHtml = `<span style="font-size:9px;font-weight:700;padding:1px 6px;border-radius:4px;background:#D1FAE5;color:#065F46;">الصحيحة</span>`;
					}

					return `<div style="border-radius:8px;padding:7px 10px;display:flex;align-items:center;justify-content:space-between;gap:8px;font-size:11px;font-weight:600;${cardStyle}"><span>${escapeHtml(opt)}</span>${badgeHtml}</div>`;
				})
				.join("");

			return `
				<div style="border:1px solid #E4E4E7;border-radius:10px;padding:10px 12px;margin-bottom:8px;page-break-inside:avoid;background:#fff;">
					<div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px;">
						<div style="display:flex;align-items:center;gap:6px;font-size:11px;">
							<span style="width:16px;height:16px;border-radius:4px;background:#18181B;color:#fff;font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;">؟</span>
							<strong style="color:#18181B;">سؤال ${q.id}</strong>
							<span style="color:#D4D4D8;">•</span>
							<span style="width:16px;height:16px;border-radius:4px;background:${meta.bg};color:${q.status === "skipped" ? "#52525B" : "#fff"};font-size:10px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;">${meta.symbol}</span>
							<span style="color:#71717A;font-weight:600;">${meta.label}</span>
						</div>
						${
							q.type === "quiz"
								? `<span style="display:inline-flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;color:#3F3F46;"><span style="width:12px;height:12px;border-radius:50%;background:#FBBF24;display:inline-flex;align-items:center;justify-content:center;"><span style="width:4px;height:4px;border-radius:50%;background:#18181B;"></span></span>1 نقطة</span>`
								: ""
						}
					</div>
					<div style="font-size:12px;font-weight:600;color:#18181B;margin-bottom:8px;line-height:1.5;">${escapeHtml(q.title)}</div>
					<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;">${optionsHtml}</div>
				</div>
			`;
		})
		.join("");

	return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
	<meta charset="utf-8" />
	<title>تقرير التقييم الأولي - ${escapeHtml(params.patientName)}</title>
	<style>
		@page { size: A4; margin: 12mm; }
		* { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
		body {
			margin: 0;
			font-family: "IBM Plex Sans Arabic", "Segoe UI", Tahoma, Arial, sans-serif;
			color: #18181B;
			background: #fff;
			direction: rtl;
		}
	</style>
</head>
<body>
	<div style="border-bottom:2px solid #E4E4E7;padding-bottom:10px;margin-bottom:12px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px;">
		<div>
			<div style="font-size:16px;font-weight:800;color:#18181B;">تقرير التقييم الأولي</div>
			<div style="font-size:12px;color:#52525B;margin-top:3px;">
				الطالب: <strong style="color:#18181B;">${escapeHtml(params.patientName)}</strong>
				${params.guardianName ? ` • ولي الأمر: ${escapeHtml(params.guardianName)}` : ""}
				${params.code ? ` • كود الطلب: <span dir="ltr">#${escapeHtml(params.code)}</span>` : ""}
			</div>
			<div style="font-size:11px;color:#71717A;margin-top:3px;">
				المسار: <strong>${escapeHtml(params.proposedTrack)}</strong> • تم الإنجاز: ${escapeHtml(params.formattedDate)}
			</div>
		</div>
		<div style="display:flex;gap:14px;align-items:center;border:1px solid #E4E4E7;border-radius:10px;padding:8px 12px;background:#FAFAFA;">
			<div style="text-align:center;">
				<div style="font-size:10px;color:#71717A;">الدقة</div>
				<div style="font-size:14px;font-weight:800;color:#00B894;">${params.accuracy}%</div>
			</div>
			<div style="text-align:center;">
				<div style="font-size:10px;color:#71717A;">النقاط</div>
				<div style="font-size:14px;font-weight:800;color:#18181B;">${params.scorePoints}</div>
			</div>
			<div style="text-align:center;">
				<div style="font-size:10px;color:#71717A;">المجاب</div>
				<div style="font-size:14px;font-weight:800;color:#18181B;" dir="ltr">${params.answeredCount}/11</div>
			</div>
		</div>
	</div>

	<div style="display:flex;gap:16px;font-size:11px;color:#52525B;margin-bottom:12px;padding:7px 10px;border-radius:8px;background:#F8FAFC;border:1px solid #E4E4E7;">
		<span><strong style="color:#00B894;">■</strong> صحيحة: <strong>${params.correctCount}</strong> (${Math.round((params.correctCount / 11) * 100)}%)</span>
		<span><strong style="color:#3B82F6;">■</strong> استبيان: <strong>${params.surveyCount}</strong> (${Math.round((params.surveyCount / 11) * 100)}%)</span>
		<span><strong style="color:#EF4444;">■</strong> خاطئة: <strong>${params.incorrectCount}</strong> (${Math.round((params.incorrectCount / 11) * 100)}%)</span>
		<span><strong style="color:#A1A1AA;">■</strong> غير مجاب: <strong>${params.skippedCount}</strong> (${Math.round((params.skippedCount / 11) * 100)}%)</span>
	</div>

	${questionsHtml}
</body>
</html>`;
}

/**
 * تحليل احتياطي للإجابات من حقل الملاحظات إذا كانت مسجلة مسبقاً كنص
 */
function parseAnswersFromNotes(notes?: string | null): { question: string; answer: string; category?: string }[] {
	if (!notes) return [];
	const results: { question: string; answer: string; category?: string }[] = [];

	if (notes.includes("إجابات التقييم:")) {
		const raw = notes.split("إجابات التقييم:")[1] || "";
		const parts = raw.split(",").map((p) => p.trim());
		parts.forEach((part) => {
			const [key, val] = part.split("=").map((s) => s?.trim());
			if (key && val) {
				const labelMap: Record<string, { q: string; cat: string }> = {
					مسار: { q: "المسار الأكاديمي المطلوب", cat: "المسار" },
					هدف: { q: "الهدف الأساسي لولي الأمر من التسجيل", cat: "الأهداف" },
					خطوات: { q: "المهارات المستهدفة للطفل", cat: "المهارات" },
				};
				const meta = labelMap[key] || { q: key, cat: "عام" };
				results.push({
					category: meta.cat,
					question: meta.q,
					answer: val,
				});
			}
		});
	}

	return results;
}

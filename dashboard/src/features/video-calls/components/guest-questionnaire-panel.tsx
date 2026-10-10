import { IconCircleCheck } from "@tabler/icons-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { QUESTIONNAIRE_QUESTIONS } from "@/features/video-calls/data/questionnaire-questions";
import {
	useQuestionnaire,
	useSaveQuestionnaire,
} from "@/features/video-calls/hooks/use-questionnaire";
import { cn } from "@/lib/utils";
import type { QuestionnaireAnswers } from "@/server/video-calls/video-calls.type";

// استبيان صاحب الطفل (نعم/لا) في الشريط الجانبي لصفحة الضيف —
// يجيب عنه قبل أو أثناء الجلسة ويظهر للمدرّب فور إرساله
export const GuestQuestionnairePanel = ({ room }: { room: string }) => {
	const { questionnaire, isLoading } = useQuestionnaire(room);
	const { saveQuestionnaire, isPending } = useSaveQuestionnaire(room);
	const [draft, setDraft] = useState<QuestionnaireAnswers>({});
	const [editing, setEditing] = useState(false);

	if (isLoading) {
		return <p className="py-6 text-center text-xs text-muted-foreground">جارٍ التحميل...</p>;
	}

	const saved = (questionnaire?.answers ?? {}) as QuestionnaireAnswers;
	const isCompleted = !!questionnaire?.completedAt && !editing;
	const answers = editing || !questionnaire?.completedAt ? { ...saved, ...draft } : saved;
	const allAnswered = QUESTIONNAIRE_QUESTIONS.every(
		(q) => typeof answers[q.key] === "boolean",
	);

	const submit = async () => {
		try {
			await saveQuestionnaire(answers);
		} catch {
			return;
		}
		setEditing(false);
		setDraft({});
	};

	if (isCompleted) {
		return (
			<div className="flex flex-col gap-3">
				<div className="flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
					<IconCircleCheck className="size-4 shrink-0" />
					<p className="text-sm">تم إرسال الاستبيان — شكرًا لك</p>
				</div>
				{QUESTIONNAIRE_QUESTIONS.map((q) => (
					<div
						key={q.key}
						className="rounded-lg bg-muted/60 p-3"
					>
						<p className="text-sm font-semibold">{q.question}</p>
						<p className="mt-1 text-sm text-muted-foreground">
							{saved[q.key] === true ? "نعم" : saved[q.key] === false ? "لا" : "—"}
						</p>
					</div>
				))}
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="w-fit text-foreground"
					onClick={() => setEditing(true)}
				>
					تعديل الإجابات
				</Button>
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-3">
			<p className="text-xs text-muted-foreground">
				ساعد المدرّب بالإجابة على الأسئلة التالية قبل بدء الفحص
			</p>
			{QUESTIONNAIRE_QUESTIONS.map((q) => {
				const value = answers[q.key];
				return (
					<div
						key={q.key}
						className="rounded-lg bg-muted/60 p-3"
					>
						<p className="text-sm font-semibold">{q.question}</p>
						<div className="mt-2 flex gap-2">
							<Button
								type="button"
								size="sm"
								variant={value === true ? "default" : "outline"}
								className={cn("h-8 flex-1", value !== true && "text-foreground")}
								onClick={() => setDraft((d) => ({ ...d, [q.key]: true }))}
								disabled={isPending}
							>
								نعم
							</Button>
							<Button
								type="button"
								size="sm"
								variant={value === false ? "default" : "outline"}
								className={cn("h-8 flex-1", value !== false && "text-foreground")}
								onClick={() => setDraft((d) => ({ ...d, [q.key]: false }))}
								disabled={isPending}
							>
								لا
							</Button>
						</div>
					</div>
				);
			})}
			<Button
				type="button"
				className="w-full"
				onClick={() => void submit()}
				disabled={isPending || !allAnswered}
			>
				إرسال الإجابات
			</Button>
		</div>
	);
};

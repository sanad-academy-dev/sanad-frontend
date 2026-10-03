import { IconClock, IconExternalLink, IconFileDescription } from "@tabler/icons-react";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";

import { useAppointmentDocuments } from "@/features/appointments/hooks/use-appointment-documents";
import { QUESTIONNAIRE_QUESTIONS } from "@/features/video-calls/data/questionnaire-questions";
import { useQuestionnaire } from "@/features/video-calls/hooks/use-questionnaire";
import type { AppointmentResponse } from "@/server/appointments/appointments.type";
import type { QuestionnaireAnswers } from "@/server/video-calls/video-calls.type";

// تبويب "الاستبيان الطبي" عند المدرّب: إجابات صاحب الطفل (نعم/لا) تظهر
// فور إرسالها (تحديث دوري)، مع بيانات الحجز والمرفقات من مستندات الزيارة
export const SessionQuestionnaire = ({
	appointment,
}: {
	appointment: AppointmentResponse;
}) => {
	const room = `${appointment.clinicId}:${appointment.id}`;
	const { questionnaire } = useQuestionnaire(room, { poll: true });
	const { documents } = useAppointmentDocuments(appointment.id);

	const answers = (questionnaire?.answers ?? {}) as QuestionnaireAnswers;
	const isCompleted = !!questionnaire?.completedAt;

	const bookingAnswers = [
		{ question: "ما هي الأعراض التي يعاني منها الطفل؟", answer: appointment.symptoms },
		{ question: "ما سبب الزيارة؟", answer: appointment.reason },
	];

	return (
		<div className="flex flex-col gap-4">
			{!isCompleted && (
				<div className="flex items-center gap-2 rounded-lg bg-amber-50 p-3 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
					<IconClock className="size-4 shrink-0" />
					<p className="text-xs">
						بانتظار إجابة صاحب الطفل — تظهر الإجابات هنا فور إرسالها من صفحة الضيف
					</p>
				</div>
			)}

			<div className="flex flex-col gap-2">
				{bookingAnswers.map(({ question, answer }) => (
					<div
						key={question}
						className="rounded-lg bg-muted/60 p-3"
					>
						<p className="text-sm font-semibold">{question}</p>
						<p className="mt-1 text-sm text-muted-foreground">{answer || "لم تتم الإجابة"}</p>
					</div>
				))}
				{QUESTIONNAIRE_QUESTIONS.map((q) => (
					<div
						key={q.key}
						className="rounded-lg bg-muted/60 p-3"
					>
						<p className="text-sm font-semibold">{q.question}</p>
						<p className="mt-1 text-sm text-muted-foreground">
							{answers[q.key] === true ? "نعم" : answers[q.key] === false ? "لا" : "—"}
						</p>
					</div>
				))}
			</div>

			<div className="flex flex-col gap-2">
				<p className="text-sm font-semibold">المرفقات</p>
				{documents.length === 0 && (
					<p className="text-xs text-muted-foreground">لا توجد مرفقات لهذه الزيارة</p>
				)}
				{documents.map((doc) => (
					<a
						key={doc.id}
						href={doc.url}
						target="_blank"
						rel="noreferrer"
						className="flex items-center justify-between gap-2 rounded-lg border p-2.5 transition-colors hover:bg-muted/50"
					>
						<span className="flex min-w-0 items-center gap-1.5">
							{doc.kind === "LINK" ? (
								<IconExternalLink className="size-4 shrink-0 text-muted-foreground" />
							) : (
								<IconFileDescription className="size-4 shrink-0 text-muted-foreground" />
							)}
							<span className="truncate text-sm font-medium">{doc.title}</span>
						</span>
						<span className="shrink-0 text-xs text-muted-foreground">
							{format(new Date(doc.createdAt), "d MMMM", { locale: arSA })}
						</span>
					</a>
				))}
			</div>
		</div>
	);
};

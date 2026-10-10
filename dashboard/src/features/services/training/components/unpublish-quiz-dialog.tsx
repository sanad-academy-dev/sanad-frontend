import { IconAlertCircle } from "@tabler/icons-react";

import {
	DetailRow,
	fmtDate,
	StatusChangeDialog,
	type StatusCopy,
	ValueChip,
} from "@/features/services/training/components/status-change-dialog";
import type { QuizListItemResponse } from "@/server/quizzes/quizzes.type";

const UNPUBLISH_COPY: StatusCopy = {
	title: "إلغاء نشر اختبار",
	question: (name) =>
		`هل أنت متأكد من إلغاء نشر الاختبار "${name}"؟ يمكنك إعادة نشره في أي وقت.`,
	consequencesLabel: "النتائج المترتبة:",
	consequences: [
		"لن يتمكّن الموظفون من بدء هذا الاختبار مؤقتًا.",
		"لن يظهر الاختبار ضمن الاختبارات المنشورة.",
		"سيحتفظ النظام بجميع الأسئلة والمحاولات والنتائج السابقة دون حذفها.",
	],
	confirmLabel: "إلغاء النشر",
	Icon: IconAlertCircle,
	accent: "text-[#F59E0B]",
	boxClass: "border-[#F59E0B] bg-[#F59E0B]/[0.12]",
	buttonClass: "bg-[#FFA000] hover:bg-[#F59E0B]",
	labelClass: "text-[#FFA000]",
};

// حوار إلغاء نشر الاختبار — نفس هيكل حوار تعطيل الدورة ببيانات الاختبار
export function UnpublishQuizDialog({
	quiz,
	onClose,
	onConfirm,
}: {
	quiz: QuizListItemResponse | null;
	onClose: () => void;
	onConfirm: () => void;
}) {
	return (
		<StatusChangeDialog
			open={!!quiz}
			name={quiz?.title ?? ""}
			copy={UNPUBLISH_COPY}
			onClose={onClose}
			onConfirm={onConfirm}
			rows={
				quiz && (
					<>
						<DetailRow label="اسم الاختبار">
							<span className="text-[10px] font-medium leading-[10px] text-[#7A7A7A]">
								{quiz.title}
							</span>
						</DetailRow>
						<DetailRow label="القسم المستهدف">
							{quiz.targetRole ? (
								<ValueChip>{quiz.targetRole.name}</ValueChip>
							) : (
								<span className="text-[12px] leading-[18px] text-[#08090A]">—</span>
							)}
						</DetailRow>
						<DetailRow label="# الموظفين المعيّنين">
							<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
								{quiz._count.assignments}
							</span>
						</DetailRow>
						<DetailRow label="# الأسئلة">
							<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
								{quiz._count.questions}
							</span>
						</DetailRow>
						<DetailRow label="نسبة النجاح">
							<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
								{quiz.passMark}%
							</span>
						</DetailRow>
						<DetailRow label="عدد المحاولات">
							<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
								{quiz.maxAttempts ?? "بلا حد"}
							</span>
						</DetailRow>
						<DetailRow label="مدة الاختبار">
							<span className="text-[12px] leading-[18px] text-[#08090A]">
								{quiz.timeLimitMinutes ? `${quiz.timeLimitMinutes} دقيقة` : "بلا حد"}
							</span>
						</DetailRow>
						<DetailRow label="تاريخ الإنشاء">
							<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
								{fmtDate(quiz.createdAt)}
							</span>
						</DetailRow>
					</>
				)
			}
		/>
	);
}

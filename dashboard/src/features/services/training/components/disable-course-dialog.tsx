import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";
import {
	DetailRow,
	fmtDate,
	StatusChangeDialog,
	type StatusCopy,
	ValueChip,
} from "@/features/services/training/components/status-change-dialog";
import {
	COURSE_TYPE_OPTIONS,
	formatTrainingCost,
} from "@/features/services/training/data/training";
import type { CourseListItemResponse } from "@/server/training/training.type";

const typeLabel = (t: CourseListItemResponse["type"]) =>
	COURSE_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t;

const DISABLE_COPY: StatusCopy = {
	title: "تعطيل دورة تدريبية",
	question: (name) =>
		`هل أنت متأكد من تعطيل الدورة التدريبية "${name}"؟ يمكنك إعادة تفعيلها في أي وقت.`,
	consequencesLabel: "النتائج المترتبة:",
	consequences: [
		"لن يمكن تعيين موظفين جدد على هذه الدورة التدريبية مؤقتًا.",
		"لن تظهر الدورة ضمن الدورات التدريبية النشطة.",
		"سيحتفظ النظام بجميع الوحدات والدروس والمواد التعليمية دون حذفها.",
	],
	confirmLabel: "تعطيل",
	Icon: IconAlertCircle,
	accent: "text-[#F59E0B]",
	boxClass: "border-[#F59E0B] bg-[#F59E0B]/[0.12]",
	buttonClass: "bg-[#FFA000] hover:bg-[#F59E0B]",
	labelClass: "text-[#FFA000]",
};

const ENABLE_COPY: StatusCopy = {
	title: "إلغاء تعطيل دورة تدريبية",
	question: (name) =>
		`هل أنت متأكد من إلغاء تعطيل الدورة التدريبية "${name}"؟ ستعود الدورة نشطة مباشرة.`,
	consequencesLabel: "ما سيحدث:",
	consequences: [
		"ستظهر الدورة مرّة أخرى ضمن الدورات التدريبية النشطة.",
		"سيمكن تعيين موظفين جدد على هذه الدورة التدريبية.",
		"سيستأنف المشتركون الحاليون تقدّمهم من حيث توقّفوا.",
	],
	confirmLabel: "إلغاء التعطيل",
	Icon: IconCircleCheck,
	accent: "text-[#00A63E]",
	boxClass: "border-[#00A63E] bg-[#00A63E]/[0.12]",
	buttonClass: "bg-[#00A63E] hover:bg-[#009E3A]",
	labelClass: "text-[#008E34]",
};

type CourseStatusDialogProps = {
	course: CourseListItemResponse | null;
	onClose: () => void;
	onConfirm: () => void;
};

// حوار تعطيل/إلغاء تعطيل الدورة التدريبية — نفس هيكل StatusChangeDialog ببيانات الدورة
function CourseStatusDialog({
	course,
	copy,
	onClose,
	onConfirm,
}: CourseStatusDialogProps & { copy: StatusCopy }) {
	const cost = course ? formatTrainingCost(course.trainingCost) : null;
	const trainerName = course?.trainers[0]?.name ?? "—";

	return (
		<StatusChangeDialog
			open={!!course}
			name={course?.name ?? ""}
			copy={copy}
			onClose={onClose}
			onConfirm={onConfirm}
			rows={
				course && (
					<>
						<DetailRow label="اسم الدورة">
							<span className="text-[10px] font-medium leading-[10px] text-[#7A7A7A]">
								{course.name}
							</span>
						</DetailRow>
						<DetailRow label="نوع الدورة">
							<ValueChip>{typeLabel(course.type)}</ValueChip>
						</DetailRow>
						<DetailRow label="# المشتركين الحالين">
							<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
								{course.assignedCount}
							</span>
						</DetailRow>
						<DetailRow label="# الوحدات">
							<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
								{course.contentCount}
							</span>
						</DetailRow>
						<DetailRow label="تاريخ الإنشاء">
							<span className="text-[12px] leading-[18px] tabular-nums text-[#08090A]">
								{fmtDate(course.createdAt)}
							</span>
						</DetailRow>
						<DetailRow label="المدرب">
							<span className="text-[14px] font-medium leading-[21px] text-[#08090A]">
								{trainerName}
							</span>
						</DetailRow>
						<DetailRow label="سعر الدورة">
							<span className="text-[12px] leading-[18px] text-[#08090A]">
								{cost ?? "مجانية"}
							</span>
						</DetailRow>
					</>
				)
			}
		/>
	);
}

export function DisableCourseDialog(props: CourseStatusDialogProps) {
	return (
		<CourseStatusDialog
			{...props}
			copy={DISABLE_COPY}
		/>
	);
}

export function EnableCourseDialog(props: CourseStatusDialogProps) {
	return (
		<CourseStatusDialog
			{...props}
			copy={ENABLE_COPY}
		/>
	);
}

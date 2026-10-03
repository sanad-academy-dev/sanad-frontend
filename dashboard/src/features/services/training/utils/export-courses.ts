import {
	COURSE_TYPE_OPTIONS,
	courseLanguageLabel,
	courseLocationLabel,
	formatCourseDuration,
} from "@/features/services/training/data/training";
import { downloadCsv } from "@/lib/csv";
import type { CourseListItemResponse } from "@/server/training/training.type";

// أعمدة تصدير CSV مطابقة لأعمدة جدول القائمة (بيانات حقيقية فقط؛ الفارغ يُترك فارغًا)
const HEADERS = [
	"اسم الدورة",
	"المعرّف",
	"تكلفة التدريب",
	"عدد المحتوى",
	"نوع الدورة",
	"الجهة",
	"اللغة",
	"مكان الدورة",
	"المدربون",
	"فترة الدورة",
	"عدد المستفيدين",
	"متوسط التقييم",
	"عدد التقييمات",
	"آخر تحديث",
	"تاريخ الإنشاء",
	"الحالة",
] as const;

const STATUS_LABEL: Record<string, string> = {
	PUBLISHED: "منشور",
	DRAFT: "مسودة",
	ARCHIVED: "مؤرشفة",
};

const typeLabel = (t: string) => COURSE_TYPE_OPTIONS.find((o) => o.value === t)?.label ?? t;

const iso = (d: Date | string) => new Date(d).toISOString().slice(0, 10);

function toRow(c: CourseListItemResponse): (string | number | null)[] {
	return [
		c.name,
		c.code,
		c.trainingCost ?? "",
		c.contentCount,
		typeLabel(c.type),
		c.institution ?? "",
		courseLanguageLabel(c.language),
		courseLocationLabel(c.locationMode) ?? "",
		c.trainers.map((t) => t.name).join(" / "),
		formatCourseDuration(c.startDate, c.dueDate, c.estimatedDurationWeeks) ?? "",
		c.assignedCount,
		c.reviewCount > 0 ? (c.avgRating?.toFixed(1) ?? "") : "",
		c.reviewCount,
		iso(c.updatedAt),
		iso(c.createdAt),
		STATUS_LABEL[c.status] ?? c.status,
	];
}

// يصدّر الصفوف الحالية (بعد التصفية) كملف CSV ويشغّل التنزيل — عميلي بالكامل
export function exportCoursesCsv(courses: CourseListItemResponse[]) {
	downloadCsv("courses", HEADERS, courses.map(toRow));
}

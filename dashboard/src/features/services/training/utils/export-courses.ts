import {
	courseLocationLabel,
	formatCourseDuration,
} from "@/features/services/training/data/training";
import { extractCourseAcademicStage } from "@/features/services/training/utils/course-meta";
import { downloadCsv } from "@/lib/csv";
import type { CourseListItemResponse } from "@sanad/contracts/runtime/server/training/training.type";

// أعمدة تصدير CSV مطابقة لأعمدة جدول الدورات الحالي
const HEADERS = [
	"اسم الدورة",
	"المعرّف",
	"المرحلة الدراسية",
	"التصنيف",
	"عدد الوحدات",
	"مكان الدورة",
	"المدربون",
	"فترة الدورة",
	"عدد المتدربين",
	"السعر (ج.م)",
	"الجهة المنظمة",
	"آخر تحديث",
	"تاريخ الإنشاء",
	"الحالة",
] as const;

const STATUS_LABEL: Record<string, string> = {
	PUBLISHED: "منشور",
	DRAFT: "مسودة",
	ARCHIVED: "معطلة",
};

const iso = (d: Date | string) => new Date(d).toISOString().slice(0, 10);

function toRow(c: CourseListItemResponse): (string | number | null)[] {
	return [
		c.name,
		c.code,
		extractCourseAcademicStage(c),
		c.category?.trim() || c.department?.trim() || "",
		c.contentCount,
		courseLocationLabel(c.locationMode) ?? "",
		c.trainers.map((t) => t.name).join(" / "),
		formatCourseDuration(c.startDate, c.dueDate, c.estimatedDurationWeeks, c.description) ??
			"",
		c.assignedCount,
		c.trainingCost ?? "",
		c.institution ?? "",
		iso(c.updatedAt),
		iso(c.createdAt),
		STATUS_LABEL[c.status] ?? c.status,
	];
}

// يصدّر الصفوف الحالية (بعد التصفية) كملف CSV ويشغّل التنزيل — عميلي بالكامل
export function exportCoursesCsv(courses: CourseListItemResponse[]) {
	downloadCsv("courses", HEADERS, courses.map(toRow));
}

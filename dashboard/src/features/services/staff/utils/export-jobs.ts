import type { PublishedJob } from "@/features/services/staff/types/jobs.types";
import { downloadCsv } from "@/lib/csv";

// أعمدة تصدير CSV مطابقة لبيانات الوظيفة المنشورة
const HEADERS = [
	"المسمى الوظيفي",
	"المعرّف",
	"القسم",
	"نوع التوظيف",
	"بيئة العمل",
	"الدولة",
	"المدينة",
	"عدد الشواغر",
	"الراتب من",
	"الراتب إلى",
	"العملة",
	"آخر موعد للتقديم",
	"تاريخ النشر",
] as const;

const iso = (d: Date | string | null | undefined) =>
	d ? new Date(d).toISOString().slice(0, 10) : "";

function toRow(j: PublishedJob): (string | number | null)[] {
	return [
		j.title,
		j.code,
		j.department,
		j.employmentType,
		j.workEnv,
		j.country,
		j.city,
		j.positions,
		j.undisclosed ? "" : j.salaryMin,
		j.undisclosed ? "" : j.salaryMax,
		j.undisclosed ? "" : j.currency,
		j.closeDate,
		iso(j.createdAt),
	];
}

// يصدّر الوظائف الظاهرة (بعد التصفية) كملف CSV ويشغّل التنزيل — عميلي بالكامل
export function exportJobsCsv(jobs: PublishedJob[]) {
	downloadCsv("jobs", HEADERS, jobs.map(toRow));
}

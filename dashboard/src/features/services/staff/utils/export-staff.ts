import { downloadCsv } from "@/lib/csv";
import type { StaffResponse } from "@/server/staff/staff.type";

// أعمدة تصدير CSV مطابقة لأعمدة جدول الموظفين (بيانات حقيقية فقط؛ الفارغ يُترك فارغًا)
const HEADERS = [
	"الاسم",
	"المعرّف",
	"البريد الإلكتروني",
	"الهاتف",
	"الدور",
	"الفرع",
	"التخصص",
	"نوع الدوام",
	"تاريخ التعيين",
	"الحالة",
	"حالة التسجيل",
	"تاريخ الإضافة",
] as const;

const STATUS_LABEL: Record<string, string> = {
	ACTIVE: "نشط",
	PENDING: "معلق",
	INACTIVE: "غير نشط",
};

const EMPLOYMENT_LABEL: Record<string, string> = {
	FULL_TIME: "دوام كلي",
	PART_TIME: "دوام جزئي",
};

const iso = (d: Date | string | null | undefined) =>
	d ? new Date(d).toISOString().slice(0, 10) : "";

function toRow(s: StaffResponse): (string | number | null)[] {
	return [
		`${s.prefix ? `${s.prefix} ` : ""}${s.name}`,
		s.code,
		s.email ?? "",
		s.phone ?? "",
		s.role?.name ?? "",
		s.branch?.name ?? "",
		s.primarySpecialization?.name ?? "",
		s.secondarySpecialization?.name ?? "",
		s.employmentType ? (EMPLOYMENT_LABEL[s.employmentType] ?? s.employmentType) : "",
		iso(s.hireDate),
		STATUS_LABEL[s.status] ?? s.status,
		s.user ? "مفعل" : "غير مفعل",
		iso(s.createdAt),
	];
}

// يصدّر الصفوف الحالية (بعد التصفية) كملف CSV ويشغّل التنزيل — عميلي بالكامل
export function exportStaffCsv(staff: StaffResponse[]) {
	downloadCsv("staff", HEADERS, staff.map(toRow));
}

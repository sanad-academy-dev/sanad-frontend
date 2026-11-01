import type { ClassroomResponse } from "@/server/classrooms/classrooms.type";

/**
 * حساب العمر بالسنوات من تاريخ الميلاد بدقة
 */
export function calculateAge(birthDate?: string | Date | null): number | null {
	if (!birthDate) return null;
	const birth = new Date(birthDate);
	if (Number.isNaN(birth.getTime())) return null;
	const diff = Date.now() - birth.getTime();
	if (diff < 0) return 0;
	const ageDate = new Date(diff);
	return Math.abs(ageDate.getUTCFullYear() - 1970);
}

/**
 * تحويل العمر الرقمي إلى الفئة العمرية المطابقة المعتمدة
 */
export function getAgeGroupFromAge(age?: number | null): string {
	if (age === null || age === undefined || Number.isNaN(age)) return "غير محدد";
	if (age <= 6) return "4-6 سنه";
	if (age <= 8) return "7-8 سنه";
	if (age <= 11) return "9-11 سنة";
	if (age <= 14) return "12-14 سنة";
	if (age <= 17) return "15-17 سنة";
	if (age <= 20) return "18-20 سنة";
	if (age <= 23) return "21-23 سنة";
	if (age <= 26) return "23-26 سنة";
	return "26+ سنة";
}

/**
 * استخراج الفئة العمرية للطالب، بالاعتماد على الفئة المسجلة صراحةً أو حسابها من تاريخ الميلاد/العمر
 */
export function getStudentAgeGroup(student?: {
	age?: number | null;
	birthDate?: string | Date | null;
	ageGroup?: string | null;
} | null): string {
	if (!student) return "غير محدد";
	if (student.ageGroup && student.ageGroup.trim()) return student.ageGroup.trim();
	if (student.age != null && student.age > 0) return getAgeGroupFromAge(student.age);
	if (student.birthDate) {
		const calc = calculateAge(student.birthDate);
		if (calc != null) return getAgeGroupFromAge(calc);
	}
	return "غير محدد";
}

/**
 * تحليل مدى الفئة العمرية (الحد الأدنى والأعلى)
 */
export function parseAgeRange(group?: string | null): { min: number; max: number } | null {
	if (!group || group === "جميع الأعمار") return { min: 0, max: 99 };
	const clean = group.trim();
	if (clean.includes("+")) {
		const num = parseInt(clean.replace(/\D/g, ""), 10);
		if (!Number.isNaN(num)) return { min: num, max: 99 };
	}
	const match = clean.match(/(\d+)\s*[-–—]\s*(\d+)/);
	if (match) {
		const min = parseInt(match[1], 10);
		const max = parseInt(match[2], 10);
		return { min, max };
	}
	const single = parseInt(clean.replace(/\D/g, ""), 10);
	if (!Number.isNaN(single)) return { min: single, max: single };
	return null;
}

/**
 * التحقق من توافق الطالب مع الفئة العمرية المحددة للفصل
 */
export function isStudentMatchingClassroomAge(
	student: {
		age?: number | null;
		birthDate?: string | Date | null;
		ageGroup?: string | null;
	},
	classroomAgeGroup?: string | null,
): boolean {
	if (!classroomAgeGroup || classroomAgeGroup === "جميع الأعمار" || !classroomAgeGroup.trim()) {
		return true;
	}
	const classRange = parseAgeRange(classroomAgeGroup);
	if (!classRange) return true;

	const studentGroup = getStudentAgeGroup(student);
	if (studentGroup === "غير محدد") {
		// في حال عدم توفر الفئة الصريحة، نتحقق من العمر المحسوب
		const studentAge = student.age ?? calculateAge(student.birthDate);
		if (studentAge != null) {
			return studentAge >= classRange.min && studentAge <= classRange.max;
		}
		// إذا لم يتوفر أي تاريخ ميلاد أو عمر، لا نحجبه منعاً للتعطيل
		return true;
	}

	// مطابقة تامة بعد إزالة الفراغات وتوحيد التاء المربوطة
	const normStudent = studentGroup.replace(/\s+/g, "").replace(/ه/g, "ة");
	const normClass = classroomAgeGroup.replace(/\s+/g, "").replace(/ه/g, "ة");
	if (normStudent === normClass) return true;

	const studentRange = parseAgeRange(studentGroup);
	if (!studentRange) return true;

	// تداخل المدى العمري بين الطالب والفصل
	return studentRange.min <= classRange.max && studentRange.max >= classRange.min;
}

/**
 * تصفية الفصول لعرض الفصول المتوافقة فقط مع الفئة العمرية المحددة
 */
export function filterClassroomsByAgeGroup(
	classrooms: ClassroomResponse[],
	targetAgeGroup?: string | null,
): ClassroomResponse[] {
	if (!targetAgeGroup || !targetAgeGroup.trim() || targetAgeGroup === "جميع الأعمار") {
		return classrooms;
	}
	const targetRange = parseAgeRange(targetAgeGroup);
	if (!targetRange) return classrooms;

	const normTarget = targetAgeGroup.replace(/\s+/g, "").replace(/ه/g, "ة");

	return classrooms.filter((cls) => {
		if (!cls.ageGroup || cls.ageGroup === "جميع الأعمار") return true;
		const normClass = cls.ageGroup.replace(/\s+/g, "").replace(/ه/g, "ة");
		if (normClass === normTarget) return true;

		const classRange = parseAgeRange(cls.ageGroup);
		if (!classRange) return true;

		// تحقق من وجود تداخل بين فئة الفصل والفئة العمرية المستهدفة
		return targetRange.min <= classRange.max && targetRange.max >= classRange.min;
	});
}


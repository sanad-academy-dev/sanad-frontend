export const DEFAULT_CLINIC_TIMEZONE = "Africa/Cairo";

/**
 * تنسيق موعد المقابلة بالتاريخ والوقت مع ضمان التقيد بالمنطقة الزمنية للمركز/الأكاديمية دائماً
 * لمنع انزياح الساعة (مثلاً 1:00 م إلى 12:00 م) بسبب اختلاف المنطقة الزمنية لمتصفح المستخدم
 */
export function formatAppointmentDateTime(
	date: Date | string | number | null | undefined,
	timeZone: string = DEFAULT_CLINIC_TIMEZONE,
	locale: string = "ar-EG-u-nu-latn",
): string {
	if (!date) return "لم يُحدد بعد";
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return "غير صالح";
	try {
		return new Intl.DateTimeFormat(locale, {
			timeZone: timeZone || DEFAULT_CLINIC_TIMEZONE,
			weekday: "short",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(d);
	} catch {
		return d.toLocaleString(locale);
	}
}

/**
 * تنسيق التاريخ مع مراعاة المنطقة الزمنية للمركز
 */
export function formatAppointmentDate(
	date: Date | string | number | null | undefined,
	timeZone: string = DEFAULT_CLINIC_TIMEZONE,
	locale: string = "ar-EG-u-nu-latn",
	options?: Intl.DateTimeFormatOptions,
): string {
	if (!date) return "غير محدد";
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return "غير صالح";
	try {
		return new Intl.DateTimeFormat(locale, {
			timeZone: timeZone || DEFAULT_CLINIC_TIMEZONE,
			weekday: "long",
			year: "numeric",
			month: "long",
			day: "numeric",
			...options,
		}).format(d);
	} catch {
		return d.toLocaleDateString(locale);
	}
}

/**
 * تنسيق الوقت فقط مع مراعاة المنطقة الزمنية للمركز (مثال: 01:00 م)
 */
export function formatAppointmentTime(
	date: Date | string | number | null | undefined,
	timeZone: string = DEFAULT_CLINIC_TIMEZONE,
	locale: string = "ar-EG-u-nu-latn",
): string {
	if (!date) return "--:--";
	const d = new Date(date);
	if (Number.isNaN(d.getTime())) return "--:--";
	try {
		return new Intl.DateTimeFormat(locale, {
			timeZone: timeZone || DEFAULT_CLINIC_TIMEZONE,
			hour: "2-digit",
			minute: "2-digit",
		}).format(d);
	} catch {
		return d.toLocaleTimeString(locale);
	}
}

/**
 * حساب العمر باللغة العربية بدقة من تاريخ الميلاد مع إعطاء الأولوية لتاريخ الميلاد الحقيقي دائماً
 */
export function computeAgeLabel(
	birthDate?: string | Date | null,
	fallbackAge?: string | null,
): string {
	if (birthDate) {
		const birth = typeof birthDate === "string" ? new Date(birthDate) : birthDate;
		if (!Number.isNaN(birth.getTime())) {
			const now = new Date();
			let years = now.getFullYear() - birth.getFullYear();
			const m = now.getMonth() - birth.getMonth();
			if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
				years--;
			}
			if (years > 0) {
				return `${years} ${years <= 10 ? "سنوات" : "سنة"}`;
			}
			const months = Math.max(
				1,
				(now.getFullYear() - birth.getFullYear()) * 12 +
					now.getMonth() -
					birth.getMonth(),
			);
			return `${months} شهر`;
		}
	}
	// إذا لم يتوفر تاريخ ميلاد صالح، نستخدم العمر البديل بشرط ألا يكون قيمة من قيم المستوى
	if (
		fallbackAge &&
		fallbackAge.trim() &&
		!["مبتدئ", "متوسط", "متقدم", "غير متأكد", "محترف"].includes(
			fallbackAge.trim(),
		)
	) {
		return fallbackAge.trim();
	}
	return "غير محدد";
}

const VALID_LEVELS = ["مبتدئ", "متوسط", "متقدم", "غير متأكد", "محترف"];

/**
 * استخراج مستوى الطالب المهارى بدقة مع استبعاد أي نصوص أعمار سابقة (مثل "12 سنوات")
 * واستنتاج المستوى تلقائياً عند التسجيل من الموقع.
 */
export function getStudentLevel(item: {
	experienceLevel?: string | null;
	ageLabel?: string | null;
	assessmentData?: any;
}): string | null {
	// 1. فحص حقل المستوى الصريح واستبعاد أي نص يمثل عمراً (سنة / سنوات أو أرقام مجردة)
	if (item.experienceLevel && item.experienceLevel.trim()) {
		const lvl = item.experienceLevel.trim();
		if (!lvl.includes("سنة") && !lvl.includes("سنوات") && !/^\d+$/.test(lvl)) {
			if (VALID_LEVELS.includes(lvl)) return lvl;
			if (lvl.toLowerCase() === "beginner") return "مبتدئ";
			if (lvl.toLowerCase() === "intermediate") return "متوسط";
			if (lvl.toLowerCase() === "advanced") return "متقدم";
			return lvl;
		}
	}

	// 2. فحص إذا كان المستوى مخزناً في ageLabel كقيمة نصية صحيحة
	if (item.ageLabel && item.ageLabel.trim()) {
		const lbl = item.ageLabel.trim();
		if (VALID_LEVELS.includes(lbl)) {
			return lbl;
		}
	}

	// 3. استنتاج المستوى من إجابات استبيان التقييم الأولي إن وُجدت
	if (item.assessmentData && typeof item.assessmentData === "object") {
		const answers = item.assessmentData.answers;
		if (Array.isArray(answers)) {
			const expAns = answers.find(
				(a: any) =>
					a.question?.includes("خبرة") ||
					a.category?.includes("الخبرة") ||
					a.question?.includes("تجربة"),
			);
			if (expAns?.answer) {
				const ansStr = String(expAns.answer).trim();
				if (ansStr.includes("جيدة") || ansStr === "3") return "متقدم";
				if (ansStr.includes("بسيطة") || ansStr === "2") return "متوسط";
				if (ansStr.includes("لا يوجد") || ansStr.includes("لم يجرب") || ansStr === "1") return "مبتدئ";
			}
		}

		if (typeof item.assessmentData.score === "number") {
			const s = item.assessmentData.score;
			if (s >= 80) return "متقدم";
			if (s >= 50) return "متوسط";
			return "مبتدئ";
		}
	}

	return null;
}

/**
 * تحديد ما إذا كان موعد المقابلة جاري الآن (الوقت الحالي ضمن نطاق بداية الموعد ونهايته)
 */
export function isInterviewOngoing(params: {
	isInterviewStage?: boolean;
	appointmentDate?: Date | string | null;
	durationMinutes?: number | null;
	nowMs?: number | null;
}): boolean {
	if (params.isInterviewStage === false || params.nowMs == null) return false;
	if (!params.appointmentDate) return false;
	const startMs = new Date(params.appointmentDate).getTime();
	if (Number.isNaN(startMs)) return false;
	const duration =
		typeof params.durationMinutes === "number" && params.durationMinutes > 0
			? params.durationMinutes
			: 60;
	const endMs = startMs + duration * 60_000;
	return params.nowMs >= startMs && params.nowMs < endMs;
}


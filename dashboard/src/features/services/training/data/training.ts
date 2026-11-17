import {
	IconAlignRight,
	IconBook,
	IconCheckbox,
	IconFile,
	IconFileCheck,
	IconFileDiff,
	IconFileText,
	IconMicrophone,
	IconVideoPlus,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import type {
	CourseContentType,
	CourseLanguage,
	CourseLocationMode,
	CourseType,
	LessonType,
	QuizAnswerType,
} from "@sanad/contracts/runtime/server/training/training.type";

// خيارات تجريبية حتى تتوفر جداول الأقسام من الـ API
export const COURSE_DEPARTMENT_OPTIONS: { value: string; label: string }[] = [
	{ value: "surgery", label: "الجراحة" },
	{ value: "lab", label: "المختبر" },
	{ value: "emergency", label: "الطوارئ" },
	{ value: "reception", label: "الاستقبال" },
	{ value: "hr", label: "التنمية البشرية" },
	{ value: "all", label: "جميع الأقسام" },
];

export const COURSE_TYPE_OPTIONS: { value: CourseType; label: string }[] = [
	{ value: "INTERNAL", label: "تدريب داخلي" },
	{ value: "WORKSHOP", label: "ورشة عمل" },
	{ value: "ONLINE", label: "دورة أونلاين" },
	{ value: "CERTIFICATION", label: "شهادة مهنية" },
	{ value: "CONFERENCE", label: "مؤتمر" },
];

// أنواع مواد الدرس — الترتيب هو ترتيب DOM في RTL: أول عنصر في أقصى اليمين
export const LESSON_TYPE_OPTIONS: { value: LessonType; label: string }[] = [
	{ value: "TEXT", label: "نص" },
	{ value: "PAGE", label: "صفحة" },
	{ value: "VIDEO", label: "فيديو" },
	{ value: "DOCUMENT", label: "مستند" },
	{ value: "QUIZ", label: "تقييم" },
	{ value: "SURVEY", label: "استبيان" },
	{ value: "AUDIO", label: "صوت" },
];

// أيقونة كل نوع درس — تُستخدم في منتقي النوع داخل النموذج وفي صف الدرس المحفوظ
export const LESSON_TYPE_ICONS: Record<LessonType, ComponentType<{ className?: string }>> = {
	TEXT: IconAlignRight,
	PAGE: IconFileText,
	VIDEO: IconVideoPlus,
	DOCUMENT: IconFileDiff,
	QUIZ: IconFileCheck,
	SURVEY: IconCheckbox,
	AUDIO: IconMicrophone,
};

// أنواع بطاقات المحتوى (منتقي «إنشاء محتوى جديد») — مطابقة لـ CourseContentType.
// الترتيب هو ترتيب DOM في RTL: أول عنصر في أقصى اليمين. `tint`/`fg` صفوف Tailwind للأيقونة.
export const CONTENT_TYPE_OPTIONS: {
	value: CourseContentType;
	label: string;
	description: string;
	Icon: ComponentType<{ className?: string }>;
	tint: string;
	fg: string;
}[] = [
	{
		value: "PAGE",
		label: "صفحة",
		description: "صفحة محتوى مستقلة تحتوي على مادة تعليمية مقروءة يطّلع عليها المتدرّب.",
		Icon: IconFile,
		tint: "bg-[#F97316]/10",
		fg: "text-[#F97316]",
	},
	{
		value: "LESSON",
		label: "درس",
		description: "درس تعليمي (فيديو، نص، مستند أو صوت) لعرض مادة الدورة على المتدرّب.",
		Icon: IconBook,
		tint: "bg-primary/10",
		fg: "text-primary",
	},
	{
		value: "QUIZ",
		label: "تقييم",
		description: "تقييم يقيس مدى استيعاب المتدرّب للمادة التعليمية بعد دراستها.",
		Icon: IconFileCheck,
		tint: "bg-[#8B5CF6]/10",
		fg: "text-[#8B5CF6]",
	},
];

// خيارات لوحة إعدادات «إنشاء دورة بالذكاء الاصطناعي»
export const AI_DIFFICULTY_OPTIONS = [
	{ value: "BEGINNER", label: "مبتدئ" },
	{ value: "INTERMEDIATE", label: "متوسط" },
	{ value: "ADVANCED", label: "متقدم" },
] as const;

export const AI_DEPTH_OPTIONS = [
	{ value: "BRIEF", label: "موجز" },
	{ value: "BALANCED", label: "متوازن" },
	{ value: "DETAILED", label: "مفصّل" },
] as const;

export const AI_LEVEL_COUNT_OPTIONS = [2, 3, 4, 5] as const;

// ترتيب عربي للعناوين المرقّمة («السؤال الأول»، «الخيار الثاني»...)
const ARABIC_ORDINALS = [
	"الأول",
	"الثاني",
	"الثالث",
	"الرابع",
	"الخامس",
	"السادس",
	"السابع",
	"الثامن",
	"التاسع",
	"العاشر",
];

export const arabicOrdinal = (index: number) => ARABIC_ORDINALS[index] ?? `${index + 1}`;

// خيارات نوع الإجابة في باني الاختبار — الترتيب هو ترتيب DOM في RTL (أول عنصر يمينًا)
export const QUIZ_ANSWER_TYPE_OPTIONS: { value: QuizAnswerType; label: string }[] = [
	{ value: "TEXT", label: "نص" },
	{ value: "SINGLE", label: "خيارات" },
	{ value: "MULTIPLE", label: "خيارات متعددة" },
];

// امتدادات الملفات المقبولة لكل نوع درس
export const LESSON_ACCEPT: Partial<Record<LessonType, string>> = {
	VIDEO: "video/mp4,video/webm,video/quicktime",
	AUDIO: "audio/mpeg,audio/mp4,audio/wav,audio/webm",
	DOCUMENT: "application/pdf,application/msword,.docx,.xlsx",
};

// ===== بيانات صفحة القائمة =====

// مكان الدورة (عمود «مكان الدورة» + فلتر + منتقي اللوحة)
export const COURSE_LOCATION_OPTIONS: { value: CourseLocationMode; label: string }[] = [
	{ value: "ONLINE", label: "أونلاين" },
	{ value: "ONSITE", label: "حضوري" },
	{ value: "HYBRID", label: "مدمج" },
];

const COURSE_LOCATION_LABELS: Record<CourseLocationMode, string> = {
	ONLINE: "أونلاين",
	ONSITE: "حضوري",
	HYBRID: "مدمج",
};
export const courseLocationLabel = (m: CourseLocationMode | null) =>
	m ? COURSE_LOCATION_LABELS[m] : null;

const COURSE_LANGUAGE_LABELS: Record<CourseLanguage, string> = {
	AR: "العربية",
	EN: "الإنجليزية",
};
export const courseLanguageLabel = (l: CourseLanguage) => COURSE_LANGUAGE_LABELS[l];

// استخراج رمز وعملة الدورة من قاعدة البيانات
export function getCourseCurrency(
	course?: { currency?: string | null; institution?: string | null } | null,
): string {
	if (!course) return "EGP";
	const rawCurr = (course as { currency?: string | null }).currency;
	if (rawCurr && typeof rawCurr === "string" && rawCurr.trim()) {
		return rawCurr.trim();
	}
	if (course.institution) {
		try {
			if (course.institution.startsWith("{")) {
				const meta = JSON.parse(course.institution);
				if (meta.currency) return meta.currency;
			}
		} catch {}
	}
	return "EGP";
}

// الرمز المختصر للعملة المعروضة
export function getCurrencySymbol(currencyCode?: string | null): string {
	switch (currencyCode) {
		case "SAR":
			return "ر.س";
		case "USD":
			return "$";
		case "AED":
			return "د.إ";
		default:
			return "ج.م";
	}
}

// تكلفة التدريب / السعر مع دعم عملة الدورة المحددة في قاعدة البيانات
export const formatTrainingCost = (
	cost: number | null,
	courseOrCurrency?: string | { currency?: string | null; institution?: string | null } | null,
): string | null => {
	if (cost == null) return null;
	if (cost === 0) return "مجانية";
	const currency =
		typeof courseOrCurrency === "string"
			? courseOrCurrency
			: getCourseCurrency(courseOrCurrency);
	const symbol = getCurrencySymbol(currency);
	if (currency === "USD") {
		return `$${cost.toLocaleString("ar-EG")}`;
	}
	return `${cost.toLocaleString("ar-EG")} ${symbol}`;
};

// فترة الدورة: تُشتقّ أولاً من وسم [duration:...] في الوصف، أو من (البدء→الاستحقاق)، أو من المدة المتوقعة.
// لا يتم تقريب الأسابيع قسراً لأشهر إلا إذا كانت مضاعفات صريحة للأشهر (4، 8، 12...).
export function formatCourseDuration(
	startDate: Date | string | null,
	dueDate: Date | string | null,
	estimatedWeeks: number | null,
	description?: string | null,
): string | null {
	// 1. إذا وجد وسم مدة صريح في الوصف تم حفظه من الخطوة الأولى
	if (description) {
		const match = description.match(/\[(?:duration|مدة):([^\]]+)\]/i);
		if (match?.[1]?.trim()) {
			return match[1].trim();
		}
	}

	// 2. اعتماد المدة المقدرة بالأسابيع المحددة في الخطوة الأولى أولاً
	let weeks: number | null = null;
	if (estimatedWeeks && estimatedWeeks > 0) {
		weeks = estimatedWeeks;
	} else if (startDate && dueDate) {
		// حساب الأسابيع من تاريخ البدء وتاريخ الاستحقاق عند غياب المدة المقدرة
		const ms = new Date(dueDate).getTime() - new Date(startDate).getTime();
		if (ms > 0) weeks = Math.max(1, Math.round(ms / (7 * 24 * 60 * 60 * 1000)));
	}
	if (weeks == null) return null;

	// 3. إن كانت مضاعفاً صريحاً للأشهر (4، 8، 12...)
	if (weeks % 4 === 0 && weeks >= 4) {
		const months = weeks / 4;
		return months === 1
			? "شهر"
			: months === 2
				? "شهران"
				: months <= 10
					? `${months} أشهر`
					: `${months} شهراً`;
	}

	// 4. الحفاظ على الأسابيع بدقة (مثلاً: 6 أسابيع، 5 أسابيع، 7 أسابيع)
	return weeks === 1
		? "أسبوع واحد"
		: weeks === 2
			? "أسبوعان"
			: weeks <= 10
				? `${weeks} أسابيع`
				: `${weeks} أسبوعاً`;
}

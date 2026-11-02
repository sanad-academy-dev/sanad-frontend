/** قوالب رسائل جاهزة قابلة للتعديل لمنظومة سند. */

export function generateShortlistMessage({
	studentName,
	guardianName,
	targetClass,
}: {
	studentName: string;
	guardianName: string;
	targetClass?: string | null;
}): string {
	const className = targetClass || "المستوى الأكاديمي المقترح";
	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName} (${guardianName})،\nيسر إدارة القبول والتسجيل في أكاديمية سند إفادتكم باجتياز الطلب لمرحلة الفرز الأولي وإدراجه ضمن القائمة المختصرة للالتحاق بـ "${className}".\nسيتم التواصل معكم قريباً لإتمام الترتيبات المقررة. مع تمنياتنا بالتوفيق.`;
}

export function generateWaitlistMessage({
	studentName,
	guardianName,
	targetClass,
	queueRank,
	estimatedWait,
}: {
	studentName: string;
	guardianName: string;
	targetClass?: string | null;
	queueRank?: number | null;
	estimatedWait?: string | null;
}): string {
	const className = targetClass || "البرنامج الأكاديمي";
	const rankText = queueRank ? ` بالترتيب رقم (#${queueRank})` : "";
	const waitText = estimatedWait
		? ` الوقت المتوقع لتوفر شواغر هو قرابة (${estimatedWait}).`
		: " سيتم إشعاركم فور توفر مقعد شاغر.";
	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}،\nنود إحاطتكم علماً بأنه نظراً للإقبال الشديد واكتمال المقاعد الشاغرة حالياً في "${className}"، فقد تم إدراج طلبكم في قائمة الانتظار${rankText}.\n${waitText}\nشاكرين ومقدرين ثقتكم الغالية في أكاديمية سند.`;
}

export function generateRescheduleMessage({
	studentName,
	guardianName,
	reason,
	newDate,
}: {
	studentName: string;
	guardianName: string;
	reason: string;
	newDate?: string;
}): string {
	const dateText = newDate || "الموعد الجديد الموضح في رسالة التأكيد";
	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}،\nنود إعلامكم بأنه تمت إعادة جدولة موعد جلسة التقييم والمقابلة الأكاديمية، نظراً لـ (${reason})، ليكون الموعد الجديد في: ${dateText}.\nيرجى التكرم بالحضور قبل الموعد بـ 10 دقائق لضمان انسيابية الإجراءات. دمتم بحفظ الله ورعايته.`;
}

export function generateRejectMessage({
	studentName,
	guardianName,
	reason,
}: {
	studentName: string;
	guardianName: string;
	reason: string;
}): string {
	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName} (${guardianName})،\nنشكركم خالص الشكر على اهتمامكم بالتقديم وثقتكم في أكاديمية سند التعليمية.\nبعد المراجعة الدقيقة لملف التقديم، نعتذر عن عدم إمكانية قبول الطلب في الفصل الحالي نظراً لـ (${reason}).\nسيبقى ملفكم في أرشيفنا للرجوع إليه مستقبلاً، ونتمنى للطالب دوام التوفيق والتميز في مسيرته القادمة.`;
}

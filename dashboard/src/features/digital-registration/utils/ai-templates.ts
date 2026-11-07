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
	guardianName?: string | null;
	targetClass?: string | null;
	queueRank?: number | null;
	estimatedWait?: string | null;
}): string {
	const className = targetClass || "البرنامج الأكاديمي";
	const rankText = queueRank ? ` بالترتيب رقم (#${queueRank})` : "";
	const waitText = estimatedWait
		? ` الوقت المتوقع لتوفر شواغر هو قرابة (${estimatedWait}).`
		: " سيتم إشعاركم فور توفر مقعد شاغر.";
	const guardianGreeting = guardianName ? ` (${guardianName})` : "";
	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}${guardianGreeting}،\nنود إحاطتكم علماً بأنه نظراً للإقبال الشديد واكتمال المقاعد الشاغرة حالياً في "${className}"، فقد تم إدراج طلبكم في قائمة الانتظار${rankText}.\n${waitText}\nشاكرين ومقدرين ثقتكم الغالية في أكاديمية سند.`;
}

export function generateScheduleMessage({
	studentName,
	guardianName,
	appointmentDate,
	interviewMode,
}: {
	studentName: string;
	guardianName?: string | null;
	appointmentDate: string;
	interviewMode?: "IN_CLINIC" | "REMOTE";
}): string {
	const modeText =
		interviewMode === "REMOTE" ? "عبر اتصال مرئي / هاتفي" : "حضورياً بمقر الأكاديمية";
	const guardianGreeting = guardianName ? ` (${guardianName})` : "";
	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}${guardianGreeting}،\nيسرنا إبلاغكم بأنه تم تحديد موعد جلسة التقييم والمقابلة الأكاديمية (${modeText}) في: ${appointmentDate}.\nيرجى التكرم بالحضور أو الاستعداد قبل الموعد بـ 10 دقائق لضمان انسيابية الإجراءات. شاكرين ومقدرين ثقتكم في أكاديمية سند.`;
}

export function generateRescheduleMessage({
	studentName,
	guardianName,
	reason,
	newDate,
}: {
	studentName: string;
	guardianName?: string | null;
	reason: string;
	newDate?: string;
}): string {
	const dateText = newDate || "الموعد الجديد الموضح في رسالة التأكيد";
	const guardianGreeting = guardianName ? ` (${guardianName})` : "";
	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}${guardianGreeting}،\nنود إعلامكم بأنه تمت إعادة جدولة موعد جلسة التقييم والمقابلة الأكاديمية، نظراً لـ (${reason})، ليكون الموعد الجديد في: ${dateText}.\nيرجى التكرم بالحضور قبل الموعد بـ 10 دقائق لضمان انسيابية الإجراءات. دمتم بحفظ الله ورعايته.`;
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

export function generateAwaitingPaymentMessage({
	studentName,
	guardianName,
	planName,
	amount,
}: {
	studentName: string;
	guardianName?: string | null;
	planName?: string | null;
	amount?: number | null;
}): string {
	const guardianGreeting = guardianName ? ` (${guardianName})` : "";
	const planText = planName ? ` لـ "${planName}"` : "";
	const amountText = amount ? ` والبالغة (${amount} ج.م)` : "";

	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}${guardianGreeting}،\nيسعدنا إبلاغكم باجتياز الطالب لمرحلة التقييم والمقابلة الشخصية بنجاح في أكاديمية سند التعليمية.\nلحجز المقعد النهائي وتأكيد القيد، يرجى سداد الرسوم الأكاديمية المقررة${planText}${amountText}.\nسيسعد فريق الحسابات والقبول بمساعدتكم لإتمام السداد، مع تمنياتنا للطالب بمسيرة تعليمية ملهمة ومتميزة.`;
}

export function generateReferralMessage({
	studentName,
	guardianName,
	staffName,
}: {
	studentName: string;
	guardianName?: string | null;
	staffName?: string | null;
}): string {
	const guardianGreeting = guardianName ? ` (${guardianName})` : "";
	const reviewerText = staffName ? ` الأخصائي/المراجع أ/ ${staffName}` : "الأخصائي المتابع";
	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}${guardianGreeting}،\nنود إحاطتكم بأنه تم تحويل ومتابعة ملف الطالب إلى${reviewerText} في أكاديمية سند لإتمام الترتيبات والمتابعة الأكاديمية والتأهيلية.\nنسعد دائماً بخدمتكم وتوفير أفضل رعاية لطفلكم، ولأي استفسار يسعدنا تواصلكم المباشر معنا.`;
}

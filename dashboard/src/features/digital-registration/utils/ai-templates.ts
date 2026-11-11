/** قوالب رسائل جاهزة قابلة للتعديل لمنظومة سند. */

export function generateQueueMessage({
	studentName,
	guardianName,
	targetClass,
}: {
	studentName: string;
	guardianName?: string | null;
	targetClass?: string | null;
}): string {
	const className = targetClass || "البرنامج الأكاديمي";
	const guardianGreeting = guardianName ? ` (${guardianName})` : "";
	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}${guardianGreeting}،\nنحيطكم علماً بأنه قد تم تحديث ونقل حالة طلبكم إلى طابور مراجعة واستقبال الطلبات في "${className}".\nسيقوم فريق القبول والتسجيل بمتابعة الطلب واستكمال الإجراءات والتواصل معكم قريباً. مع تمنياتنا بالتوفيق.`;
}

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
	meetingUrl,
	roomName,
	assessmentUrl,
	isAssessmentDone,
}: {
	studentName: string;
	guardianName?: string | null;
	appointmentDate: string;
	interviewMode?: "IN_CLINIC" | "REMOTE";
	meetingUrl?: string | null;
	roomName?: string | null;
	assessmentUrl?: string | null;
	isAssessmentDone?: boolean;
}): string {
	const guardianGreeting = guardianName ? ` (${guardianName})` : "";
	const isRemote = interviewMode === "REMOTE";

	// فقرة رابط التقييم الأولي: تظهر حصراً إذا كان التقييم لم يُعبأ بعد (مثل التسجيل اليدوي في الأكاديمية)
	const assessmentSection =
		!isAssessmentDone && assessmentUrl
			? `\n\n📝 استمارة التقييم الأولي المطلوبة قبل المقابلة:\nيرجى التكرم بتعبئة استبيان المهارات والمسار التعليمي للطفل عبر الرابط التالي قبل موعد المقابلة ليتسنى لفريق التقييم مراجعته:\n${assessmentUrl}`
			: "";

	if (isRemote) {
		const linkLine = meetingUrl ? `\n• رابط الدخول للمقابلة:\n${meetingUrl}` : "";
		return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}${guardianGreeting}،\nيسرنا إبلاغكم بأنه تم تحديد موعد جلسة التقييم والمقابلة الأكاديمية (مكالمة عبر تطبيق الويب):\n\n📋 تفاصيل الموعد:\n• الموعد المحدد: ${appointmentDate}\n• نظام المقابلة: مكالمة عبر تطبيق الويب (عن بُعد)${linkLine}${assessmentSection}\n\nيرجى التكرم بالاستعداد والنقر على الرابط قبل الموعد بـ 10 دقائق لضمان انسيابية الجلسة.\nشاكرين ومقدرين ثقتكم في أكاديمية سند.`;
	}

	const locationText = roomName && roomName !== "الغرفة" ? roomName : "مقر أكاديمية سند - القاعة الرئيسية للاستقبال والتقييم";
	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}${guardianGreeting}،\nيسرنا إبلاغكم بأنه تم تحديد موعد جلسة التقييم والمقابلة الأكاديمية (حضورياً داخل الأكاديمية):\n\n📋 تفاصيل الموعد:\n• الموعد المحدد: ${appointmentDate}\n• مكان المقابلة: ${locationText}${assessmentSection}\n\nيرجى التكرم بالحضور لمقر الأكاديمية قبل الموعد بـ 10 دقائق لضمان انسيابية الإجراءات.\nشاكرين ومقدرين ثقتكم في أكاديمية سند.`;
}

export function generateRescheduleMessage({
	studentName,
	guardianName,
	reason,
	newDate,
	interviewMode,
	meetingUrl,
	roomName,
}: {
	studentName: string;
	guardianName?: string | null;
	reason: string;
	newDate?: string;
	interviewMode?: "IN_CLINIC" | "REMOTE";
	meetingUrl?: string | null;
	roomName?: string | null;
}): string {
	const dateText = newDate || "الموعد الجديد الموضح في رسالة التأكيد";
	const guardianGreeting = guardianName ? ` (${guardianName})` : "";
	const isRemote = interviewMode === "REMOTE";

	if (isRemote) {
		const linkLine = meetingUrl ? `\n• رابط الدخول للمقابلة:\n${meetingUrl}` : "";
		return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}${guardianGreeting}،\nنود إعلامكم بأنه تمت إعادة جدولة موعد جلسة التقييم والمقابلة الأكاديمية نظراً لـ (${reason}).\n\n📋 تفاصيل الموعد الجديد:\n• الموعد الجديد: ${dateText}\n• نظام المقابلة: مكالمة عبر تطبيق الويب (عن بُعد)${linkLine}\n\nيرجى التكرم بالاستعداد والنقر على الرابط قبل الموعد بـ 10 دقائق لضمان انسيابية الجلسة.\nدمتم بحفظ الله ورعايته.`;
	}

	const locationText = roomName && roomName !== "الغرفة" ? roomName : "مقر أكاديمية سند - القاعة الرئيسية للاستقبال والتقييم";
	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}${guardianGreeting}،\nنود إعلامكم بأنه تمت إعادة جدولة موعد جلسة التقييم والمقابلة الأكاديمية نظراً لـ (${reason}).\n\n📋 تفاصيل الموعد الجديد:\n• الموعد الجديد: ${dateText}\n• مكان المقابلة: ${locationText}\n\nيرجى التكرم بالحضور لمقر الأكاديمية قبل الموعد بـ 10 دقائق لضمان انسيابية الإجراءات.\nدمتم بحفظ الله ورعايته.`;
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

export function getChildAssessmentUrl(code?: string): string {
	const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
	const baseUrl = isLocal ? "http://localhost:3000" : "https://sanad-frontend-delta.vercel.app";
	return code ? `${baseUrl}/?assessment=true&ref=${encodeURIComponent(code)}` : `${baseUrl}/?assessment=true`;
}

export function getPublicPaymentUrl(token: string): string {
	if (!token) return "";
	const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
	const baseUrl = isLocal ? "http://localhost:3000" : "https://sanad-frontend-delta.vercel.app";
	return `${baseUrl}/pay/${token}`;
}

export function generateAwaitingPaymentMessage({
	studentName,
	guardianName,
	planName,
	amount,
	includeMeals,
	enableDailyStipend,
	code,
	currency = "ج.م",
	paymentToken,
	paymentUrl,
}: {
	studentName: string;
	guardianName?: string | null;
	planName?: string | null;
	amount?: number | null;
	includeMeals?: boolean;
	enableDailyStipend?: boolean;
	code?: string | null;
	currency?: string;
	paymentToken?: string | null;
	paymentUrl?: string | null;
}): string {
	const guardianGreeting = guardianName ? ` (${guardianName})` : "";
	const finalLink = paymentUrl || (paymentToken ? getPublicPaymentUrl(paymentToken) : "");
	const formattedAmount = amount ? `${amount.toLocaleString("en-US")} ${currency}` : null;

	const subscriptionDetailsLines = [
		planName ? `• الباقة المختارة: ${planName}` : null,
		formattedAmount ? `• قيمة الباقة: ${formattedAmount}` : null,
		typeof includeMeals === "boolean"
			? `• تضمين الوجبات (ضمن مشمولات الباقة): ${includeMeals ? "مشمولة ضمن الباقة" : "غير مشمولة"}`
			: null,
		typeof enableDailyStipend === "boolean"
			? `• تفعيل المصروف اليومي (ضمن مشمولات الباقة): ${enableDailyStipend ? "مفعّل ضمن الباقة" : "غير مفعّل"}`
			: null,
	]
		.filter(Boolean)
		.join("\n");

	const detailsSection = subscriptionDetailsLines
		? `\n\n📋 تفاصيل الباقة والاشتراك المعتمد:\n${subscriptionDetailsLines}`
		: "";

	const linkSection = finalLink
		? `\n\n💳 لسداد الرسوم إلكترونياً (بطاقة بنكية أو محفظة إلكترونية) وتأكيد حجز المقعد فورياً:\n${finalLink}`
		: "";

	const cashHint = code
		? `\n\nكما يمكنكم السداد نقداً في مقر الأكاديمية باستخدام كود الطلب (#${code}).`
		: "\n\nكما يسعد فريق الحسابات والقبول باستقبالكم للسداد نقداً في مقر الأكاديمية.";

	return `السلام عليكم ورحمة الله وبركاته،\nعزيزي ولي أمر الطالب ${studentName}${guardianGreeting}،\nيسعدنا إبلاغكم باجتياز الطالب لمرحلة التقييم والمقابلة الشخصية بنجاح في أكاديمية سند التعليمية.\nيرجى استكمال سداد الرسوم الأكاديمية خلال 72 ساعة لتأكيد القيد وحجز المقعد النهائي للطالب.${detailsSection}${linkSection}${cashHint}\n\nمع تمنياتنا للطالب بمسيرة تعليمية ملهمة ومتميزة.`;
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

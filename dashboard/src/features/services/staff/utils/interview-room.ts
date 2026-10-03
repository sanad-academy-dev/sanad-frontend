// قاعة المقابلة ورابطها مشتقّان من (كود الوظيفة + معرّف المرشّح)، فالرابط ثابت
// لا يتغيّر بين الجلسات ولا عند إعادة فتح الحوار، وهو نفسه الذي تنضم إليه المكالمة.
// أكواد الوظائف تبدأ بـ «#»، فنُبقي الحروف والأرقام والشرطات فقط ليخرج رابط نظيف
const slug = (value: string) => value.replace(/[^\w-]+/g, "");

export const interviewRoomCode = (jobCode: string, candidateId: string) =>
	`${slug(jobCode)}-${slug(candidateId)}`;

// رابط الضيف يحمل اسم القاعة الكامل، وهو `<clinicId>:<room>` كما يبنيه الخادم
// في video-calls.controller.ts — نبنيه محليًا من الأكاديمية النشطة حتى يظهر الرابط
// دائمًا، بلا انتظار رمز LiveKit ولا تعطّل إن لم تكن الدورة مهيّأة.
export const interviewRoomName = (clinicId: string, jobCode: string, candidateId: string) =>
	`${clinicId}:${interviewRoomCode(jobCode, candidateId)}`;

export const guestCallUrl = (roomName: string) => {
	// أثناء التصيير على الخادم لا يوجد origin — الحوار يُعرَض على العميل دائمًا
	const origin = typeof window === "undefined" ? "" : window.location.origin;
	return `${origin}/call/${encodeURIComponent(roomName)}`;
};

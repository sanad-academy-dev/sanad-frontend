// أنواع وحدة «الرسائل» — واجهة فقط في هذه المرحلة (لا يوجد موديل Prisma بعد).
// عند ربط الخادم تُستبدل هذه الأنواع بـ Prisma.XGetPayload وتُشتق منها أنواع العميل.

/** نوع المحادثة: فردية (طرفان) أو جماعية (عدة أعضاء) */
export type ConversationKind = "direct" | "group";

/** تبويبات تصفية قائمة المحادثات في هيدر الصفحة */
export type MessagesFilter = "all" | "unread" | "pinned";

export const MESSAGES_FILTERS: { value: MessagesFilter; label: string }[] = [
	{ value: "all", label: "الكل" },
	{ value: "unread", label: "غير مقروء" },
	{ value: "pinned", label: "المثبتة" },
];

/** تبويبات لوحة بروفايل المحادثة */
export type ProfileTab = "visits" | "members" | "media" | "links" | "documents";

export const PROFILE_TABS: { value: ProfileTab; label: string }[] = [
	{ value: "visits", label: "زياراتي" },
	{ value: "members", label: "الأعضاء" },
	{ value: "media", label: "الوسائط" },
	{ value: "links", label: "الروابط" },
	{ value: "documents", label: "المستندات" },
];

/** حالة تسليم الرسالة الصادرة — تُرسم بعلامات الصح تحت الفقاعة */
export type MessageDeliveryStatus = "sent" | "delivered" | "read";

/** عضو في المحادثة (موظف داخل الأكاديمية) */
export type ChatMember = {
	id: string;
	name: string;
	/** المسمّى الوظيفي — يظهر تحت الاسم في قائمة الأعضاء والمستلمين */
	role: string;
	online: boolean;
};

/** مرفق رسالة — بياناته الوصفية ورابط التنزيل المحروس */
export type ChatAttachment = {
	name: string;
	mime: string;
	sizeLabel: string;
	url: string;
	isImage: boolean;
};

export type ChatMessage = {
	id: string;
	authorId: string;
	/** اسم المرسِل — للأفاتار والاسم في الجماعية */
	authorName: string;
	body: string;
	attachment?: ChatAttachment;
	/** وقت الإرسال بصيغة عرض جاهزة (09:00) — يُستبدل بـ Date عند الربط */
	timeLabel: string;
	/** رسالة مني (تُرسم في جهة البداية) أم من طرف آخر (جهة النهاية) */
	outgoing: boolean;
	status: MessageDeliveryStatus;
};

/** فاصل زمني داخل مجرى المحادثة (اليوم، أمس، ...) */
export type ChatDayGroup = {
	label: string;
	messages: ChatMessage[];
};

export type SharedMedia = {
	id: string;
	/** وصف بديل للصورة المشتركة */
	alt: string;
	/** رابط العرض المحروس */
	url: string;
};

export type SharedLink = {
	id: string;
	title: string;
	url: string;
};

export type SharedDocument = {
	id: string;
	name: string;
	sizeLabel: string;
	dateLabel: string;
	/** رابط التنزيل المحروس */
	url: string;
};

/** حالة الزيارة في تبويب «زياراتي» */
export type VisitStatus = "queue" | "inService" | "onHold" | "done" | "cancelled";

export const VISIT_STATUS_LABELS: Record<VisitStatus, string> = {
	queue: "طابور",
	inService: "جاري",
	onHold: "معلق",
	done: "مكتمل",
	cancelled: "ملغي",
};

export type ConversationVisit = {
	id: string;
	patientName: string;
	ownerName: string;
	/** وقت الموعد ونوعه — يظهران فقط بعد بدء الزيارة */
	timeLabel: string | null;
	typeLabel: string | null;
	status: VisitStatus;
	/** رقم اليوم في الشهر — لتصفية الزيارات حسب اليوم المختار */
	day: number;
};

export type Conversation = {
	id: string;
	kind: ConversationKind;
	title: string;
	/** آخر رسالة/نشاط يظهر تحت الاسم في القائمة */
	preview: string;
	/** وقت آخر نشاط كما يظهر في القائمة (أمس، 09:15) */
	timeLabel: string;
	unreadCount: number;
	pinned: boolean;
	muted: boolean;
	online: boolean;
	/** بيانات البروفايل */
	joinedLabel: string;
	email: string;
	phone: string;
	location: string;
	members: ChatMember[];
	groups: ChatDayGroup[];
	media: SharedMedia[];
	links: SharedLink[];
	documents: SharedDocument[];
	visits: ConversationVisit[];
};

import { toast } from "sonner";

import { InboxToast } from "@/features/inbox/components/inbox-toast";
import { playInboxSound } from "@/features/inbox/utils/inbox-sound";
import type { InboxItemType } from "@/generated/prisma/enums";
import type { InboxPushPayload } from "@/server/inbox/inbox.type";
import type { InboxSettingsResponse } from "@/server/inbox-settings/inbox-settings.type";

// أي مفتاح إعداد يحكم كل نوع من عناصر الوارد. CARE/SYSTEM يقعان تحت "النظام".
const TYPE_SETTING_KEY = {
	APPOINTMENT_CANCELLED: "typeAppointments",
	APPOINTMENT_NEW: "typeAppointments",
	APPOINTMENT_PENDING: "typeAppointments",
	APPOINTMENT_CONFIRMED: "typeAppointments",
	INVOICE: "typeInvoices",
	// [MI-P1] إشعارات العضويات (تجديد/تأخر/انقضاء) شأن فوترة — تتبع مفتاح الفواتير
	MEMBERSHIP: "typeInvoices",
	INSURANCE: "typeInvoices",
	TASK: "typeTasks",
	SYSTEM: "typeSystem",
	LAB: "typeLab",
	RADIOLOGY: "typeRadiology",
	CARE: "typeSystem",
	STOCK: "typeStock",
	MENTION: "typeMentions",
	// إشعارات العمليات الجراحية تتبع مفتاح النظام حتى يُفرد لها مفتاح خاص
	OPERATION: "typeSystem",
	// تفاعلات ما بعد التطعيم تتبع مفتاح النظام (كالعمليات والعناية) حتى يُفرد لها مفتاح
	VACCINATION: "typeSystem",
	// [CRM-P1] §3.2 — إسناد عميل محتمل إشعارُ إسنادٍ مثل المهمّة تمامًا («أُسنِد إليك…»)،
	// فيتبع مفتاح المهام حتى يُفرد مفتاح خاص بإدارة العملاء.
	LEAD: "typeTasks",
	// [CRM-P2] إسناد الصفقة إشعارُ إسنادٍ كسابقيه («أُسنِدت إليك…») — مفتاح المهام
	DEAL: "typeTasks",
	// إشعارات التجميل (ملاحظة عاجلة أو حادثة) تتبع مفتاح النظام كأخواتها
	GROOMING: "typeSystem",
	// [IP1] التنويم مفتاحه الخاص لا «النظام»: جرعة فائتة أو قراءة حرجة ليست
	// إشعارًا إداريًّا، ومن يكتم النظام لا ينبغي أن يكتمها معه.
	INPATIENT: "typeInpatients",
	// [E0] الطوارئ تتبع مفتاح التنويم مؤقّتًا لنفس حجّته وبقوّة أشدّ: تجاوز هدف
	// انتظار أو ترقية فرز ليس إشعارًا إداريًّا، ومن يكتم «النظام» يجب ألّا يكتمها
	// معه. ولا مفتاح `typeTriage` في `InboxSettingsResponse` بعد — إضافته ترحيلٌ
	// على إعدادات الوارد، وربطُها هنا بأقرب مفتاح لا يُسكِتها هو الأسلم إلى حينه.
	TRIAGE: "typeInpatients",
} as const satisfies Record<InboxItemType, keyof InboxSettingsResponse>;

// معرّف ثابت: sonner يستبدل البطاقة ذات المعرّف نفسه بدل تكديس بطاقات فوق بعضها،
// فيبقى تنبيه واحد ظاهرًا مهما تتابعت الأحداث.
const INBOX_TOAST_ID = "inbox-live-alert";

// نافذة تجميع الدفعة الواحدة — حدث واحد قد يولّد عدّة عناصر وارد (باعث لكل مُستلِم)
const COALESCE_MS = 6000;

let burstStartedAt = 0;
let burstCount = 0;

/** يزيد عدّاد الدفعة الحالية أو يبدأ دفعة جديدة. يعيد ترتيب التنبيه داخل دفعته. */
function nextBurstCount(now: number): number {
	if (now - burstStartedAt > COALESCE_MS) {
		burstStartedAt = now;
		burstCount = 1;
	} else {
		burstCount += 1;
	}
	return burstCount;
}

/** لإعادة ضبط حالة التجميع في الاختبارات. */
export function resetInboxAlertBurst(): void {
	burstStartedAt = 0;
	burstCount = 0;
}

/**
 * هل يستحق هذا العنصر تنبيهًا لحظيًا لهذا المستخدم؟ دالّة نقيّة (قابلة للاختبار).
 *
 * ملاحظة: العنصر يصل صندوق الوارد في كل الأحوال — هذه الدالّة تقرّر التنبيه
 * (نافذة/صوت/سطح المكتب) فقط.
 */
export function shouldAlert(
	payload: InboxPushPayload,
	settings: InboxSettingsResponse,
	currentUserId: string | null,
): boolean {
	if (!settings.liveEnabled) return false;

	// عنصر موجّه لمستخدم بعينه لا يُنبّه غيره (وإن ظهر في قائمة الأكاديمية)
	if (payload.recipientUserId && payload.recipientUserId !== currentUserId) return false;

	if (settings.onlyHighImportance && payload.importance !== "HIGH") return false;

	// الموافقات تُحكم بمفتاحها الخاص مهما كان نوع المستند تحتها
	if (payload.kind === "APPROVAL") return settings.typeApprovals;

	return settings[TYPE_SETTING_KEY[payload.type]] === true;
}

// نص فرعي قصير أسفل عنوان التنبيه
function alertDescription(payload: InboxPushPayload): string {
	if (payload.kind === "APPROVAL") return "طلب موافقة جديد بانتظار مراجعتك";
	return payload.importance === "HIGH"
		? "إشعار مهم في صندوق الوارد"
		: "إشعار جديد في صندوق الوارد";
}

// صيغة الجمع العربية الصحيحة للعدد (مثنّى / جمع قلّة / تمييز مفرد منصوب)
function newNotificationsLabel(count: number): string {
	if (count === 2) return "إشعاران جديدان";
	if (count <= 10) return `${count} إشعارات جديدة`;
	return `${count} إشعارًا جديدًا`;
}

export type InboxAlertContent = { title: string; description: string };

/**
 * نص البطاقة حسب عدد التنبيهات في الدفعة. دالّة نقيّة (قابلة للاختبار).
 * دفعة من أكثر من عنصر تُعرض كعدّاد، مع آخر عنوان كوصف.
 */
export function formatAlertContent(
	payload: InboxPushPayload,
	count: number,
): InboxAlertContent {
	if (count > 1) {
		return { title: newNotificationsLabel(count), description: payload.title };
	}
	return { title: payload.title, description: alertDescription(payload) };
}

/** يُظهر إشعار سطح المكتب إن كان الإذن ممنوحًا. لا يطلب الإذن هنا. */
function showDesktopNotification(content: InboxAlertContent): void {
	try {
		if (typeof Notification === "undefined" || Notification.permission !== "granted") return;
		// التبويب الظاهر لديه التنبيه المنبثق أصلًا — لا تُكرّر على مستوى النظام
		if (typeof document !== "undefined" && document.visibilityState === "visible") return;

		const notification = new Notification(content.title, {
			body: content.description,
			// وسم ثابت: إشعار النظام يُستبدل بدل أن يتراكم، مثل البطاقة تمامًا
			tag: INBOX_TOAST_ID,
			icon: "/favicon.ico",
			lang: "ar",
			dir: "rtl",
		});
		notification.onclick = () => {
			window.focus();
			notification.close();
		};
	} catch {
		// إذن مرفوض أو متصفّح لا يدعمه — تجاهل
	}
}

/** ينفّذ التنبيه المسموح به: بطاقة واحدة + صوت + إشعار سطح المكتب. */
export function deliverInboxAlert(
	payload: InboxPushPayload,
	settings: InboxSettingsResponse,
	onOpen: () => void,
): void {
	const count = nextBurstCount(Date.now());
	const content = formatAlertContent(payload, count);

	if (settings.toastEnabled) {
		toast.custom(
			(id) => (
				<InboxToast
					title={content.title}
					description={content.description}
					onOpen={() => {
						toast.dismiss(id);
						onOpen();
					}}
				/>
			),
			{
				id: INBOX_TOAST_ID,
				duration: COALESCE_MS,
				// بطاقتنا ترسم إطارها وخلفيتها بنفسها — بلا هذا تتضاعف حدود sonner
				unstyled: true,
				classNames: { toast: "w-full" },
			},
		);
	}

	// الصوت مرّة واحدة لكل دفعة — لا نغمة لكل عنصر في الدفعة نفسها
	if (settings.soundEnabled && count === 1) {
		playInboxSound(settings.soundName, settings.soundVolume);
	}

	if (settings.desktopEnabled) {
		showDesktopNotification(content);
	}
}

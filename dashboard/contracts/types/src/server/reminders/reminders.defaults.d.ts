import { NotificationChannel, ReminderTrigger } from "@/generated/prisma/enums";
/**
 * [RC3] مجموعة القواعد الافتراضية — تُنشأ عند أوّل فتحٍ لشاشة التذكيرات في أكاديمية.
 *
 * **كلّها `active: false`.** وحدةٌ تبدأ بإرسال رسائل إلى أولياء أمور حقيقيّين لحظةَ
 * الترحيل ليست ميزةً بل حادثة؛ والأكاديمية هي من يقرّر متى تبدأ ونصَّ ما يُرسَل.
 *
 * ولماذا تُنشأ أصلًا إن كانت مُطفأة: لأن البديل شاشةٌ فارغة تطلب من موظّف
 * الاستقبال تأليف نصّ تذكيرٍ بالتطعيم من الصفر. القوالب هنا صيغٌ صالحة للإرسال كما
 * هي، والتعديل تحسينٌ لا شرط بدء.
 *
 * وهي تُنشأ **بالدورة لا بالترحيل** عمدًا: `ensureGlobalDefaults` تقصر على قواعد
 * بيانات مأهولة، فبيانات افتراضية تُشحن في ملفّ بذرٍ لا تصل الإنتاج أبدًا (درسٌ
 * مسجَّل). الإنشاء الكسول عند أوّل قراءة يصل كل أكاديمية، قديمةً كانت أو جديدة.
 */
export type DefaultRuleSeed = {
    trigger: ReminderTrigger;
    name: string;
    offsetHours: number;
    repeatAfterDays: number | null;
    maxSends: number;
    channels: NotificationChannel[];
    subjectTemplate: string | null;
    bodyTemplate: string;
    quietHoursStart: number | null;
    quietHoursEnd: number | null;
    horizonDays: number;
};
export declare const DEFAULT_REMINDER_RULES: readonly DefaultRuleSeed[];
/** وصفٌ عربيّ لكل سبب — يُعرض في الشاشات وفي سجلّ التواصل. */
export declare const TRIGGER_LABELS: Record<ReminderTrigger, string>;
/** وصفٌ عربيّ لكل قناة، مع ما إذا كان لها مزوّد في هذه الحزمة. */
export declare const CHANNEL_LABELS: Record<NotificationChannel, string>;

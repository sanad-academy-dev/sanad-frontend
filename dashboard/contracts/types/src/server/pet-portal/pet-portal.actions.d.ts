import type { PetOwnerScope } from "@/server/pet-portal/pet-auth.macro";
/**
 * [PP] أفعال وليّ الأمر وقراءاته المشتقّة.
 *
 * مفصولة عن `pet-portal.dao.ts` لأن ذاك يقرأ سجلّات، وهذه تكتب أو تشتقّ.
 * **كل دالّة تأخذ `scope` وتُرشِّح عليه** — نفس القاعدة، بلا استثناء.
 */
export declare function updateProfile(scope: PetOwnerScope, body: {
    name?: string;
    email?: string | null;
    locale?: string;
}): Promise<{
    ok: true;
}>;
/** إخفاء أكاديمية أو إظهارها — لا يقطع الربط ولا يمسّ سجلّ وليّ الأمر لديها. */
export declare function setClinicHidden(scope: PetOwnerScope, linkId: string, hidden: boolean): Promise<boolean>;
/**
 * ربط أكاديمية برمز وليّ الأمر المطبوع على الفاتورة.
 * المخرج حين يفشل تطابق الهاتف — أكاديمية كتبت الرقم بصيغة أخرى، أو رقم ثانٍ في البيت.
 */
export declare function claimByCode(scope: PetOwnerScope, code: string): Promise<boolean>;
export declare function cancelAppointment(scope: PetOwnerScope, appointmentId: string, reason?: string): Promise<{
    ok: false;
    reason: "NOT_FOUND";
} | {
    ok: true;
    reason?: undefined;
} | {
    ok: false;
    reason: "FINISHED";
} | {
    ok: false;
    reason: "TOO_LATE";
}>;
export declare function checkIn(scope: PetOwnerScope, appointmentId: string): Promise<{
    ok: false;
    reason: "NOT_FOUND";
} | {
    ok: false;
    reason: "OUT_OF_WINDOW";
} | {
    ok: true;
    reason?: undefined;
}>;
/**
 * طلبات وليّ الأمر — **مصدران**: طلبات الزيارة المنزلية، والطلبات المكتوبة.
 *
 * الأولى تعيش في طابور المركبات (`MobileBookingRequest`) والثانية في جدولها الخاصّ
 * (`PetOwnerRequest`). دمجُهما هنا لا في جدول واحد: الطابور أداةُ عملٍ يومية للمركبات،
 * وحشرُ طلب تجديد دواءٍ فيه يُفسده. وليّ الأمر يرى قائمةً واحدة لأن الفرق لا يعنيه.
 */
export declare function listRequests(scope: PetOwnerScope): Promise<{
    id: string;
    kind: import("../../../generated/prisma/enums").PetOwnerRequestKind;
    status: import("../../../generated/prisma/enums").PetOwnerRequestStatus;
    clinicName: string;
    petName: string | null;
    body: string | null;
    createdAt: string;
    handledAt: string | null;
    declineReason: string | null;
}[]>;
/** إنشاء طلب مكتوب. الأكاديمية والطفل يُتحقَّق من أنهما ضمن نطاق وليّ الأمر. */
export declare function createRequest(scope: PetOwnerScope, input: {
    kind: string;
    clinicId: string;
    petId?: string;
    body?: string;
}): Promise<{
    id: string;
    kind: import("../../../generated/prisma/enums").PetOwnerRequestKind;
    status: import("../../../generated/prisma/enums").PetOwnerRequestStatus;
    clinicName: string;
    petName: string | null;
    body: string | null;
    createdAt: string;
    handledAt: string | null;
    declineReason: string | null;
} | null>;
/**
 * التنبيهات **مشتقّة من السجلّات**، لا صفوفًا تُكتب.
 *
 * لا يوجد ناقل إرسال بعد ([PP4])، فجدول تنبيهات سيبقى فارغًا إلى الأبد بينما البيانات
 * التي تستحقّ تنبيهًا موجودة فعلًا: جرعة مستحقّة، موعد هذا الأسبوع، فاتورة غير مدفوعة.
 * الاشتقاق يجعل الشاشة صادقة اليوم، ويصير مصدرًا للإرسال حين يُبنى.
 *
 * ولكلٍّ **مفتاح مستقرّ** يُحفظ في `PetOwnerNotificationRead` — فالقراءة تدوم رغم أن
 * التنبيه نفسه لا يُخزَّن.
 */
export declare function listNotifications(scope: PetOwnerScope): Promise<{
    readAt: string | null;
    id: string;
    category: "APPOINTMENT" | "REMINDER_DUE" | "BILLING";
    title: string;
    body: string;
    createdAt: string;
    href: string | null;
}[]>;
export declare function markNotificationsRead(scope: PetOwnerScope, ids: string[]): Promise<{
    ok: true;
}>;
/** التفضيلات — الفئات الستّ دائمًا، بقيمها المحفوظة أو بالافتراضي. */
export declare function listPreferences(scope: PetOwnerScope): Promise<{
    category: "APPOINTMENT" | "REMINDER_DUE" | "BILLING" | "RESULTS" | "CHAT" | "MARKETING";
    push: boolean;
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
}[]>;
export declare function savePreferences(scope: PetOwnerScope, items: {
    category: string;
    push: boolean;
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
}[]): Promise<{
    ok: true;
}>;
export declare function registerDevice(scope: PetOwnerScope, body: {
    expoPushToken?: string;
    platform: string;
    appVersion?: string | null;
    osVersion?: string | null;
}): Promise<{
    ok: true;
}>;
export declare function revokeSession(scope: PetOwnerScope, sessionId: string): Promise<boolean>;
export declare function signOutEverywhere(scope: PetOwnerScope): Promise<{
    ok: true;
}>;
/**
 * حذف الحساب — يُجدوَل ولا يُنفَّذ فورًا (D11).
 *
 * ── ما يُحذف وما لا يُحذف ─────────────────────────────────────────────────
 *
 * يُحذف **حساب التطبيق**: الملفّ الشخصي، والتفضيلات، والأجهزة، والارتباط بالأكاديميات.
 * **لا يُحذف** السجلّ الطبّي ولا الفواتير — الأكاديمية ملزَمة نظاميًّا بحفظها، وحذف
 * الحساب يوقف وصول وليّ الأمر إليها من التطبيق لا يمحوها من الأكاديمية.
 *
 * ومهلة سبعة أيام: تسجيل دخول خلالها يُلغي الحذف. الحذف الفوري لا رجعة فيه، وأكثر
 * طلباته تُقدَّم في لحظة غضب.
 */
export declare function scheduleDeletion(scope: PetOwnerScope): Promise<{
    ok: true;
    deletionAt: string;
}>;
/** فاتورة واحدة بسطورها — مُرشَّحة على النطاق. */
export declare function invoiceDetail(scope: PetOwnerScope, invoiceId: string): Promise<{
    invoice: {
        id: string;
        code: string;
        clinicId: string;
        clinicName: string;
        petName: string | null;
        issuedAt: string;
        subtotal: number;
        vatAmount: number;
        discount: number;
        total: number;
        amountPaid: number;
        currencyCode: string;
        status: import("../invoices/invoices.type").InvoiceStatus;
        canPay: boolean;
    };
    lines: {
        name: string;
        quantity: number;
        price: number;
    }[];
} | null>;
/**
 * ما هو **مستحقّ الآن** على أطفال وليّ الأمر — قسم «مستحقّ» في الشاشة الرئيسية.
 *
 * كان يعود فارغًا دائمًا (`due: []` في `/home`) بينما البيانات موجودة: كل جرعة تحمل
 * `nextDueAt`، وكل زيارة خطّة رعاية تحمل `scheduledAt` وحالة. الفراغ لم يكن سياسةً هنا
 * كما في التحاليل، بل محرّكًا لم يوصَل.
 *
 * **المستحقّ = ما حان أو فات، لا ما سيحين بعد شهرين.** النافذة أربعة عشر يومًا إلى
 * الأمام بلا حدّ إلى الخلف: جرعةٌ فاتت قبل سنة تبقى مستحقّة — وهي بالضبط ما يجب أن
 * يراه وليّ الأمر — بينما موعدٌ بعد شهرين ليس فعلًا مطلوبًا اليوم، وإدراجه يجعل القسم
 * قائمةَ جلسات لا قائمةَ عمل.
 */
export declare function listDue(scope: PetOwnerScope): Promise<({
    id: string;
    kind: "VACCINATION";
    petId: string;
    petName: string;
    petPhotoUrl: string | null;
    clinicName: string;
    title: string;
    dueAt: string | null;
    ageUnknown: boolean;
} | {
    id: string;
    kind: "CARE_PLAN_VISIT";
    petId: string;
    petName: string;
    petPhotoUrl: string | null;
    clinicName: string;
    title: string;
    dueAt: string;
    ageUnknown: boolean;
})[]>;
/** عدد التنبيهات غير المقروءة — نفس اشتقاق `listNotifications` بلا حمولتها. */
export declare function unreadNotificationCount(scope: PetOwnerScope): Promise<number>;
/**
 * تصدير بيانات وليّ الأمر — **يُسلَّم في الاستجابة، لا يُرسَل بريدًا**.
 *
 * كانت النقطة تردّ ٥٠٣ لأن التصدير صُمّم على «نرسل لك ملفًّا على بريدك» ولا ناقل بريد
 * للوليّ أمر في النظام. لكنّ الحقّ المطلوب (نسخة من بياناته) لا يشترط بريدًا أصلًا: الطلب
 * موثَّقٌ بجلسة، ووليّ الأمر ينتظر الاستجابة، فتسليم الحمولة إليه مباشرةً أبسط وأأمن —
 * لا نسخة تبقى في صندوق بريد، ولا رابط يُعاد استعماله.
 *
 * ويُصدَّر **ما يراه في التطبيق**: حسابه وأكاديمياته وأطفاله وجلساته وفواتيره وسجلّ
 * كل طفل. لا تحاليل ولا أشعة — ما لا يُعرض لا يُصدَّر، وإلّا صار التصدير بابًا
 * خلفيًّا حول بوّابة النشر ([D6]).
 */
export declare function exportData(scope: PetOwnerScope): Promise<{
    generatedAt: string;
    account: {
        id: string;
        phoneE164: string;
        name: string | null;
        email: string | null;
        locale: string;
        avatarUrl: string | null;
        marketingOptIn: boolean;
        consentVersion: string | null;
        deletionScheduledAt: string | null;
        mustChangePassword: boolean;
    } | null;
    clinics: {
        linkId: string;
        clinicId: string;
        clinicName: string;
        clinicSlug: string | null;
        logoUrl: string | null;
        phone: string | null;
        city: string | null;
        source: import("../../../generated/prisma/enums").PetOwnerLinkSource;
        hidden: boolean;
        ownerCode: string;
        petCount: number;
        directBooking: boolean;
    }[];
    pets: {
        id: string;
        clinicId: string;
        clinicName: string;
        code: string;
        name: string;
        gender: import("../staff/staff.type").Gender;
        animalType: string;
        animalStrain: string | null;
        birthDate: string | null;
        weightKg: number | null;
        microchipNumber: string | null;
        coat: string | null;
        photoUrl: string | null;
        linkedPatientIds: string[];
    }[];
    appointments: {
        id: string;
        clinicId: string;
        clinicName: string;
        branchName: string;
        petId: string;
        petName: string;
        petPhotoUrl: string | null;
        doctorName: string | null;
        serviceName: string;
        startsAt: string;
        endsAt: string;
        status: import("../../../generated/prisma/enums").AppointmentStatus;
        location: import("../../../generated/prisma/enums").AppointmentLocation;
        canCancel: boolean;
        canReschedule: boolean;
        canCheckIn: boolean;
        trackingAvailable: boolean;
        callRoom: string | null;
        invoiceId: string | null;
    }[];
    invoices: {
        id: string;
        code: string;
        clinicId: string;
        clinicName: string;
        petName: string | null;
        issuedAt: string;
        subtotal: number;
        vatAmount: number;
        discount: number;
        total: number;
        amountPaid: number;
        currencyCode: string;
        status: import("../invoices/invoices.type").InvoiceStatus;
        canPay: boolean;
    }[];
    timelines: {
        petId: string;
        petName: string;
        entries: ({
            id: string;
            kind: "APPOINTMENT";
            title: string;
            subtitle: string | null;
            occurredAt: string;
            clinicName: string;
            href: string;
        } | {
            id: string;
            kind: "VACCINATION";
            title: string;
            subtitle: string | null;
            occurredAt: string;
            clinicName: string;
            href: string;
        } | {
            id: string;
            kind: "VITALS";
            title: string;
            subtitle: string | null;
            occurredAt: string;
            clinicName: string;
            href: string;
        } | {
            id: string;
            kind: "CARE_PLAN";
            title: string;
            subtitle: string;
            occurredAt: string;
            clinicName: string;
            href: string;
        } | {
            id: string;
            kind: "GROOMING";
            title: string;
            subtitle: string;
            occurredAt: string;
            clinicName: string;
            href: string;
        })[];
    }[];
}>;

export type FleetEventName = "mobile.ready" | "mobile.unit.location" | "mobile.unit.status" | "mobile.unit.disabled" | "mobile.unit.enabled" | "mobile.visit.stage" | "mobile.visit.reordered" | "mobile.shift.started" | "mobile.shift.ended" | "mobile.request.created" | "mobile.request.handled";
export declare const isClinicWideEvent: (event: FleetEventName) => boolean;
/** حمولة حدث طلب — بلا مركبة، وبلا أي بيانات شخصية (انظر `publishRequestEvent`). */
export type FleetRequestPayload = {
    clinicId: string;
    requestId: string;
    code: string;
    status: string;
};
export type FleetSubscriber = {
    clinicId: string;
    /** يُرسل حدثًا واحدًا للعميل؛ يرمي إن كان الاتصال مغلقًا. */
    send: (event: FleetEventName, data: unknown) => void;
};
export type FleetLocationPayload = {
    clinicId: string;
    mobileUnitId: string;
    lat: number;
    lng: number;
    speedKph: number | null;
    heading: number | null;
    batteryPct: number | null;
    recordedAt: string;
};
export type FleetUnitPayload = {
    clinicId: string;
    mobileUnitId: string;
    [key: string]: unknown;
};
/** يسجّل مستمعًا جديدًا ويعيد دالة إلغاء الاشتراك. */
export declare function subscribeToFleet(subscriber: FleetSubscriber): () => void;
/**
 * يبثّ موقعًا جديدًا، مخنوقًا لكل مركبة على حدة.
 *
 * الإسقاط هنا بلا ضرر: الحمولة هي آخر موقع معروف لا فرقًا تراكميًّا، فالحدث التالي يحمل
 * الحقيقة كاملة. المسار الكامل يبقى في قاعدة البيانات على أي حال.
 */
export declare function publishFleetLocation(payload: FleetLocationPayload, now?: number): boolean;
/**
 * حدث طلب زيارة — يُبثّ لكل مشتركي الأكاديمية.
 *
 * **الحمولة مقصودة الفقر**: معرّف ورمز وحالة، ولا اسم ولا هاتف ولا عنوان. البثّ يصل
 * إلى كل مركبة في الأكاديمية وإلى كل لوحة مفتوحة، والغرض منه أن يقول «تغيّر شيء، أعد
 * الجلب» لا أن ينقل السجلّ. النسخة الكاملة تمرّ عبر نقطة محروسة تعرف من يسأل.
 */
export declare function publishRequestEvent(event: "mobile.request.created" | "mobile.request.handled", payload: FleetRequestPayload): void;
/** أحداث نادرة ومهمّة — تُبثّ دائمًا بلا خنق. */
export declare function publishFleetEvent(event: Exclude<FleetEventName, "mobile.unit.location" | "mobile.ready">, payload: FleetUnitPayload): void;
/**
 * هل يخصّ هذا الحدث المركبة المعنيّة؟
 *
 * **مغلق افتراضًا**: حمولة بلا `mobileUnitId` لا تُسلَّم لأحد، بدل أن تُسلَّم للجميع.
 * الأنواع تضمن وجود الحقل في كل نداء اليوم، لكنّ البثّ يقرأ الحمولة كـ`unknown` —
 * وحارسٌ يفتح عند الشكّ يسرّب زيارات مركبة إلى سائق مركبة أخرى.
 */
export declare function isFleetEventForUnit(payload: unknown, mobileUnitId: string): boolean;
/** عدد الاتصالات المفتوحة حاليًا (للتشخيص/الفحوص). */
export declare function fleetSubscriberCount(): number;
/** لأغراض الاختبار فقط — يصفّر حالة الخنق بين الحالات. */
export declare function __resetFleetBusForTests(): void;

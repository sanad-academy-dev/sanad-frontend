export type PingInput = {
    lat: number;
    lng: number;
    accuracyM?: number;
    speedKph?: number;
    heading?: number;
    altitudeM?: number;
    batteryPct?: number;
    isMoving?: boolean;
    isCharging?: boolean;
    recordedAt: string;
};
export type AppUnitStatus = "AVAILABLE" | "EN_ROUTE" | "ON_SITE" | "RETURNING" | "ON_BREAK" | "OUT_OF_SERVICE";
export declare const mobileAppDao: {
    /**
     * [MC3.2] بدء وردية.
     *
     * الفهرس الجزئي `mobile_unit_shift_one_open_per_unit` هو الحارس الحقيقي ضدّ ورديتين
     * مفتوحتين؛ هذا الفحص من أجل الرسالة العربية فقط. لو اعتمدنا عليه وحده لمرّ سباقُ
     * فتحٍ متزامن من جهازين.
     */
    startShift(clinicId: string, mobileUnitId: string, staffId: string, input: {
        odometerStart?: number;
        lat?: number;
        lng?: number;
    }): Promise<{
        id: string;
        startedAt: Date;
    }>;
    /**
     * إنهاء وردية. المسافة تُحسب من الأثر المخزَّن لا من عدّاد المركبة: `trailDistanceKm`
     * يُسقط ارتجاف الوقوف، وإلّا راكمت مركبةٌ متوقّفة كيلومترات وهميّة في تقرير الوردية.
     */
    endShift(clinicId: string, mobileUnitId: string, shiftId: string, input: {
        odometerEnd?: number;
    }): Promise<{
        id: string;
        startedAt: Date;
        distanceKm: import("@prisma/client-runtime-utils").Decimal | null;
        endedAt: Date | null;
    }>;
    /**
     * [MC3.2] استقبال دفعة نبضات.
     *
     * `createMany({ skipDuplicates: true })` مع القيد الفريد (mobileUnitId, recordedAt) يجعل
     * إعادة إرسال دفعة مُخزَّنة عمليةً بلا أثر — وهذا ما يسمح للتطبيق بإعادة المحاولة بعد
     * مهلة غامضة بدل المخاطرة بفقدان الطابور.
     *
     * النبضات تُرفض خارج وردية مفتوحة: تتبّعٌ بلا وردية تتبّعٌ لشخص لا لمركبة.
     */
    ingestPings(clinicId: string, mobileUnitId: string, pings: PingInput[]): Promise<{
        accepted: number;
        duplicates: number;
        rejected: number;
    }>;
    /** [MC3.2] تغيير الحالة التشغيلية من التطبيق. */
    setStatusFromApp(clinicId: string, mobileUnitId: string, status: AppUnitStatus): Promise<{
        id: string;
        status: import("@/generated/prisma/client").MobileUnitStatus;
    }>;
    /** أرصدة مستودع المركبة كما يراها الطاقم. */
    stock(clinicId: string, mobileUnitId: string): Promise<{
        itemId: string;
        code: string;
        name: string;
        qty: number;
        isLow: boolean;
        tracksBatches: boolean;
    }[]>;
    /**
     * [MC6.2] صرف من مخزون المركبة أثناء زيارة.
     *
     * يمرّ على `issueStock` نفسه الذي تستعمله الأكاديمية — نفس الدفتر، ونفس FEFO، ونفس
     * تقييم المتوسط المتحرّك. الفارق الوحيد هو المستودع ونوع السند (`MOBILE_CLINIC`)،
     * وهو ما يجعل استهلاك المركبات قابلًا للفصل في التقارير لاحقًا.
     */
    consumeStock(clinicId: string, mobileUnitId: string, userId: string, input: {
        visitId: string;
        items: {
            itemId: string;
            qty: number;
            batchId?: string;
        }[];
    }): Promise<{
        success: true;
        lines: number;
    }>;
};
export declare const mobileVisitMediaDao: {
    /**
     * [A4] ملاحظة ميدانية.
     *
     * تُكتب سطرًا في `AppointmentActivity` بنوع `COMMENT` — أثر التدقيق القائم نفسه الذي
     * تعرضه شاشة الموعد. لا جدول ملاحظات ثانيًا للزيارات المتنقلة: الملاحظة التي لا يراها
     * من يفتح الموعد في اللوحة ملاحظة ضائعة.
     */
    addNote(visitId: string, clinicId: string, mobileUnitId: string, userId: string, note: string): Promise<{
        id: string;
        createdAt: Date;
        body: string | null;
    }>;
    /**
     * [A4] صورة الزيارة أو توقيع وليّ الأمر.
     *
     * الصور تُلحق بمصفوفة `photos`، والتوقيع يحلّ محلّ `signatureUrl` — توقيع واحد لكل
     * زيارة، وإعادة التوقيع تصحيحٌ لا سجلّ ثانٍ.
     */
    addMedia(visitId: string, clinicId: string, mobileUnitId: string, key: string, kind: "PHOTO" | "SIGNATURE"): Promise<{
        id: string;
        signatureUrl: string | null;
        photos: string[];
    }>;
};
/**
 * [A7] طلبات الدورة الواردة، من داخل التطبيق.
 *
 * كان الفرز حكرًا على اللوحة: يصل طلب، فينتظر منسّقًا يفتح الحاسوب ليحوّله. والطاقم في
 * الميدان أقرب إلى القرار — يعرف أين هو وكم بقي في يومه — فمنحُه القبول يختصر الحلقة
 * كلّها. والقبول يمرّ بـ `mobileRequestsDao.convert` نفسه الذي تستعمله اللوحة: مسار
 * تحويل واحد لا اثنان ينحرفان.
 */
export declare const mobileRequestsAppDao: {
    /** الطلبات المفتوحة للأكاديمية — الجديدة والتي جرى التواصل بشأنها فقط. */
    open(clinicId: string): Promise<{
        animalType: {
            id: string;
            arName: string;
        } | null;
        id: string;
        createdAt: Date;
        phone: string;
        city: string | null;
        code: string;
        notes: string | null;
        status: import("@/generated/prisma/client").MobileBookingRequestStatus;
        ownerName: string;
        addressLine: string;
        district: string | null;
        lat: import("@prisma/client-runtime-utils").Decimal | null;
        lng: import("@prisma/client-runtime-utils").Decimal | null;
        landmark: string | null;
        petName: string | null;
        petNotes: string | null;
        preferredDate: Date | null;
        preferredWindow: import("@/generated/prisma/client").PreferredWindow | null;
        zone: {
            name: string;
            id: string;
            travelFee: import("@prisma/client-runtime-utils").Decimal | null;
        } | null;
    }[]>;
};
/**
 * [A7] إبلاغ وليّ الأمر بالوصول.
 *
 * **لا يُرسل الخادم شيئًا** — ولا يدّعي ذلك. لا مزوّد رسائل في هذا المستودع: «واتساب»
 * فيه خانة تفضيل لا قناة إرسال. فالإرسال يتمّ من هاتف الطاقم عبر واتساب الجهاز نفسه،
 * وهو ما تفعله الأكاديميات فعلًا اليوم.
 *
 * وظيفة الخادم هنا شيئان: يجهّز نصًّا عربيًّا موحّدًا مع رابط التتبّع، ويسجّل أن
 * الإبلاغ جرى — فيظهر في سجلّ الموعد على اللوحة بوقته وصاحبه. بلا هذا السجلّ تبقى
 * «هل أُبلغ وليّ الأمر؟» سؤالًا يُجاب بالذاكرة.
 */
export declare const mobileNotifyDao: {
    notifyOwnerArrived(visitId: string, clinicId: string, mobileUnitId: string, userId: string, appOrigin: string): Promise<{
        phone: string;
        ownerName: string;
        message: string;
        trackingUrl: string;
    }>;
};

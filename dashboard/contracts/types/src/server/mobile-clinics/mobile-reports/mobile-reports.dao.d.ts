/**
 * [MC9.1] مؤشّرات الأسطول.
 *
 * كل رقم هنا يجيب سؤالًا تشغيليًّا محدَّدًا يطرحه وليّ أمر أكاديمية متنقلة، لا مجرّد عدّ متاح:
 *   • زيارات لكل مركبة يوميًّا → هل الأسطول مستغَلّ أم فائض؟
 *   • كم لكل زيارة → كلفة التنقّل الحقيقية لكل دورة
 *   • نسبة الوصول ضمن النافذة → هل الوعد المعطى للوليّ أمر صادق؟
 *   • أسباب التعذّر → أين يضيع اليوم فعلًا
 */
export declare const mobileReportsDao: {
    /**
     * [MC10.4] ما أدّته المركبات فعلًا، وبكم.
     *
     * كان كل شيء في هذه الوحدة يقيس الحركة — مسافةً وورديّاتٍ وعدد محطّات — ولا شيء يقيس
     * المال. ومع ذلك فإنّ السؤال الأوّل لوليّ أمر أسطول هو «هل يغطّي دخلُ المركبة كلفتَها؟»،
     * وهو سؤال لا يُجاب من `revenue.builder` لأنّه يجمع القناتين في رقم واحد بلا بُعد موقع.
     *
     * المصدر هو `mobile_visit_service` لا `appointment_service`: الأوّل سجلّ ما جرى في
     * الموقع، والثاني قد يحمل أسطرًا أُضيفت في الأكاديمية على الموعد نفسه.
     */
    servicesSummary(clinicId: string, from: Date, to: Date): Promise<{
        services: {
            serviceId: string;
            name: string;
            count: number;
            revenue: number;
        }[];
        serviceRevenue: number;
        travelRevenue: number;
        totalRevenue: number;
        scheduledRevenue: number;
        fieldRevenue: number;
        visitCount: number;
        revenuePerVisit: number;
    }>;
    fleetSummary(clinicId: string, from: Date, to: Date): Promise<{
        activeUnits: number;
        shifts: number;
        totalDistanceKm: number;
        visits: number;
        completed: number;
        failed: number;
        visitsPerUnitPerDay: number;
        kmPerVisit: number;
        onTimeRate: number | null;
        onTimeSampleSize: number;
        failureReasons: {
            reason: import("../mobile-visits/mobile-visits.type").MobileVisitFailureReason | null;
            count: number;
        }[];
    }>;
    /** استهلاك مخزون المركبات — يفصله نوع السند MOBILE_CLINIC عن استهلاك الأكاديمية. */
    vanConsumption(clinicId: string, from: Date, to: Date): Promise<{
        itemId: string;
        name: string;
        qty: number;
    }[]>;
};

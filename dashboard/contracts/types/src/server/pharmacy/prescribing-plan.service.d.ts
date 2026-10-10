import type { prescriptionsDao } from "@/server/pharmacy/prescriptions.dao";
type DoseContext = Awaited<ReturnType<typeof prescriptionsDao.doseContext>>;
export declare function buildPrescribingPlan(context: DoseContext, options: {
    frequencyCode?: string | null;
    durationDays?: number | null;
    routeCode?: string | null;
}): {
    dose: {
        ok: true;
        mg: string;
        withinDocumentedRange: boolean;
        source: "CALCULATED" | "OVERRIDE";
        documentedRange: {
            min: string | null;
            max: string | null;
        };
        reason?: undefined;
        message?: undefined;
    } | {
        ok: false;
        reason: import("@/server/pharmacy/dose.rules").DoseRefusalReason;
        message: string;
        mg?: undefined;
        withinDocumentedRange?: undefined;
        source?: undefined;
        documentedRange?: undefined;
    };
    /** ما يُسحب في المحقنة فعلًا — الخطوة التي تقع فيها أخطاء العامل ١٠ */
    measured: {
        ok: true;
        amount: string;
        unit: "mL" | "g" | "قرص";
        display: string;
        basis: string;
        reason?: undefined;
        message?: undefined;
    } | {
        ok: false;
        reason: import("@/server/pharmacy/concentration.rules").ConcentrationRefusalReason;
        message: string;
        amount?: undefined;
        unit?: undefined;
        display?: undefined;
        basis?: undefined;
    } | null;
    totalQuantity: string | null;
    suggestedSig: string;
    warnings: ({
        kind: "WEIGHT";
        message: string;
    } | {
        kind: "DUPLICATE_THERAPY";
        message: string;
    } | {
        kind: "WITHDRAWAL";
        message: string;
    } | {
        kind: "MONOGRAPH";
        message: string;
    })[];
    suggestions: {
        routeCode: string | null;
        frequencyOptions: readonly [{
            readonly code: "SID";
            readonly labelAr: "مرة واحدة يوميًا";
            readonly perDay: {
                readonly num: 1;
                readonly den: 1;
            };
            readonly everyHours: 24;
        }, {
            readonly code: "BID";
            readonly labelAr: "مرتين يوميًا";
            readonly perDay: {
                readonly num: 2;
                readonly den: 1;
            };
            readonly everyHours: 12;
        }, {
            readonly code: "TID";
            readonly labelAr: "ثلاث مرات يوميًا";
            readonly perDay: {
                readonly num: 3;
                readonly den: 1;
            };
            readonly everyHours: 8;
        }, {
            readonly code: "QID";
            readonly labelAr: "أربع مرات يوميًا";
            readonly perDay: {
                readonly num: 4;
                readonly den: 1;
            };
            readonly everyHours: 6;
        }, {
            readonly code: "Q48H";
            readonly labelAr: "مرة كل يومين";
            readonly perDay: {
                readonly num: 1;
                readonly den: 2;
            };
            readonly everyHours: 48;
        }, {
            readonly code: "EOD";
            readonly labelAr: "يوم بعد يوم";
            readonly perDay: {
                readonly num: 1;
                readonly den: 2;
            };
            readonly everyHours: 48;
        }, {
            readonly code: "WEEKLY";
            readonly labelAr: "مرة أسبوعيًا";
            readonly perDay: {
                readonly num: 1;
                readonly den: 7;
            };
            readonly everyHours: 168;
        }, {
            readonly code: "ONCE";
            readonly labelAr: "جرعة واحدة فقط";
            readonly perDay: {
                readonly num: 1;
                readonly den: 1;
            };
            readonly everyHours: 0;
        }, {
            readonly code: "PRN";
            readonly labelAr: "عند اللزوم";
            readonly perDay: null;
            readonly everyHours: null;
        }];
        routeOptions: readonly [{
            readonly code: "PO";
            readonly labelAr: "عن طريق الفم";
        }, {
            readonly code: "IV";
            readonly labelAr: "وريدي";
        }, {
            readonly code: "IM";
            readonly labelAr: "عضلي";
        }, {
            readonly code: "SC";
            readonly labelAr: "تحت الجلد";
        }, {
            readonly code: "TOPICAL";
            readonly labelAr: "موضعي";
        }, {
            readonly code: "OTIC";
            readonly labelAr: "في الأذن";
        }, {
            readonly code: "OPHTH";
            readonly labelAr: "في العين";
        }, {
            readonly code: "INTRANASAL";
            readonly labelAr: "في الأنف";
        }, {
            readonly code: "IU";
            readonly labelAr: "داخل الرحم";
        }, {
            readonly code: "IMAM";
            readonly labelAr: "داخل الضرع";
        }];
        /** التواتر الموصوف نصًّا في النشرة — يُعرض للمدرّب ولا يُفسَّر آليًّا (§5.1) */
        monographFrequencyText: string | null;
        monographDurationText: string | null;
    };
};
/** يُصدَّر للاختبار: الضرب في المصفوفة العشرية لا في العائم */
export declare const toDecimal: (v: string) => import("@prisma/client-runtime-utils").Decimal;
export {};

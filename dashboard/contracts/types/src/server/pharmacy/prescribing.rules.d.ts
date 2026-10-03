import type { CatalogSpecies } from "@/generated/prisma/enums";
/**
 * [PH7.3] ذكاء الوصف — النظام يقود المستخدم، لا العكس.
 *
 * كل ما هنا **اشتقاق من بيانات موجودة**، لا اختراع لبيانات سريرية: مفردات تواتر
 * مضبوطة بدل نصّ حرّ، ونصّ تعليمات يُركَّب من حقول مُدخَلة، وحدود وزن تكشف الأخطاء
 * المطبعية. لا شيء منها يخترع جرعة (§0.4).
 */
/**
 * **لماذا قائمة مضبوطة بدل نصّ حرّ.** محرّك الجرعة يرفض تفسير `frequency` النصّي
 * («BID»، «q12h»، «مرتين يوميًا») لأن تحويله إلى رقم تخمين. والحلّ ليس أن يُحسب
 * التواتر يدويًّا في كل مرّة، بل ألّا يُكتب نصًّا أصلًا: المدرّب يختار من هذه القائمة،
 * فيصير `timesPerDay` **معلومًا** لا مستنتَجًا، وتُحسب الكمّية الإجمالية آليًّا.
 *
 * هذا هو الفرق العملي بين نظام يقود المستخدم ونظام يستجوبه.
 */
export declare const FREQUENCY_OPTIONS: readonly [{
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
export type FrequencyCode = (typeof FREQUENCY_OPTIONS)[number]["code"];
export declare const frequencyByCode: (code: string | null | undefined) => {
    readonly code: "SID";
    readonly labelAr: "مرة واحدة يوميًا";
    readonly perDay: {
        readonly num: 1;
        readonly den: 1;
    };
    readonly everyHours: 24;
} | {
    readonly code: "BID";
    readonly labelAr: "مرتين يوميًا";
    readonly perDay: {
        readonly num: 2;
        readonly den: 1;
    };
    readonly everyHours: 12;
} | {
    readonly code: "TID";
    readonly labelAr: "ثلاث مرات يوميًا";
    readonly perDay: {
        readonly num: 3;
        readonly den: 1;
    };
    readonly everyHours: 8;
} | {
    readonly code: "QID";
    readonly labelAr: "أربع مرات يوميًا";
    readonly perDay: {
        readonly num: 4;
        readonly den: 1;
    };
    readonly everyHours: 6;
} | {
    readonly code: "Q48H";
    readonly labelAr: "مرة كل يومين";
    readonly perDay: {
        readonly num: 1;
        readonly den: 2;
    };
    readonly everyHours: 48;
} | {
    readonly code: "EOD";
    readonly labelAr: "يوم بعد يوم";
    readonly perDay: {
        readonly num: 1;
        readonly den: 2;
    };
    readonly everyHours: 48;
} | {
    readonly code: "WEEKLY";
    readonly labelAr: "مرة أسبوعيًا";
    readonly perDay: {
        readonly num: 1;
        readonly den: 7;
    };
    readonly everyHours: 168;
} | {
    readonly code: "ONCE";
    readonly labelAr: "جرعة واحدة فقط";
    readonly perDay: {
        readonly num: 1;
        readonly den: 1;
    };
    readonly everyHours: 0;
} | {
    readonly code: "PRN";
    readonly labelAr: "عند اللزوم";
    readonly perDay: null;
    readonly everyHours: null;
} | null;
/** جرعة واحدة لا تتكرّر — المدّة لا تُضرب فيها */
export declare const isSingleDose: (code: string | null | undefined) => code is "ONCE";
/**
 * التواتر **كسر صحيح** لا عدد عائم.
 *
 * كان `1/7` مخزَّنًا كـ`0.14285714285714285`، وضربُه في `Decimal` يُدخل خطأ العائم
 * في حساب كمّية دواء — وهو ما يمنعه قيد الدقّة C2 صراحةً («الحساب بمكتبة عشرية لا
 * بعائم JS»). البسط والمقام يبقيان صحيحين، والقسمة تقع مرّة واحدة في النهاية.
 *
 * `PRN` يُعيد `null` عمدًا: «عند اللزوم» ليس عددًا في اليوم، وإعطاؤه ١ يجعل النظام
 * يحسب كمّية إجمالية لا أساس لها. الكمّية عندها قرار المدرّب.
 */
export declare const perDayOf: (code: string | null | undefined) => {
    num: number;
    den: number;
} | null;
/** للعرض وحده — لا يُستعمل في حساب كمّية (راجع `perDayOf`) */
export declare const timesPerDayOf: (code: string | null | undefined) => number | null;
export declare const ROUTE_OPTIONS: readonly [{
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
export declare const routeLabel: (code: string | null | undefined) => string | null;
/**
 * يُركّب تعليمات الاستعمال بالعربية من الحقول المُدخَلة.
 *
 * **يُقترح ولا يُفرض**: النصّ يُملأ في الحقل ويبقى قابلًا للتحرير. المدرّب يضيف ما
 * لا يعرفه النظام («مع الطعام»، «أوقف عند القيء»)، والاقتراح يوفّر عليه كتابة
 * الجزء الميكانيكي — وهو أيضًا الجزء الذي يُنسى فيه سطر كامل عند الاستعجال.
 */
export declare function buildSig(input: {
    measuredAmount?: string | null;
    measureUnit?: string | null;
    routeCode?: string | null;
    frequencyCode?: string | null;
    durationDays?: number | null;
    prn?: boolean;
}): string;
/**
 * **ليست بيانات سريرية ولا جرعات** — حدود بيولوجية عامّة تكشف الخطأ المطبعي.
 *
 * لماذا تستحقّ الوجود: الجرعة حاصل ضرب في الوزن، فخطأ خانة واحدة في الوزن يضرب
 * الجرعة عشرة أضعاف مباشرةً. قطّة وزنها ٤٥ كغ (بدل ٤٫٥) تُنتج جرعة قاتلة يقبلها
 * كل فحص آخر في النظام، لأن الحساب نفسه صحيح تمامًا.
 *
 * المدى واسع عمدًا: الغرض التقاط خطأ الخانة لا الحكم على حالة الطفل. والنتيجة
 * **تحذير لا رفض** — سلالات عملاقة موجودة، والنظام لا يعرف أفضل من المدرّب.
 */
export declare const SPECIES_WEIGHT_RANGE_KG: Partial<Record<CatalogSpecies, {
    min: number;
    max: number;
}>>;
export type WeightPlausibility = {
    plausible: true;
} | {
    plausible: false;
    messageAr: string;
    min: number;
    max: number;
};
export declare function checkWeightPlausibility(species: CatalogSpecies | null, weightKg: number | null): WeightPlausibility;

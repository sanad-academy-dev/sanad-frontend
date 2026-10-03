/**
 * [PH1.4] أخطاء الصيدلية التي يجب أن تصل للمستخدم بنصّها العربي.
 *
 * لماذا صنف مستقلّ ولماذا يُسجَّل في `CLIENT_ERROR_NAMES`: معالج الأخطاء العامّ في
 * `src/server/app.ts` يبتلع كل رمية غير مُدرَجة في 500 «حدث خطأ غير متوقع». وقد
 * سقط صنفان من تلك القائمة قبلًا فضاعت ١٧ رسالة، وكان الكاشير يرى خطأً عامًّا بدل
 * سبب الرفض. الرفض هنا سريري — «الدواء ممنوع لهذا النوع»، «لا وزن مسجّل» — وابتلاعه
 * في 500 يجعل المدرّب يعيد المحاولة بدل أن يقرأ السبب.
 */
export declare class PharmacyValidationError extends Error {
    constructor(message: string);
}
/** رفض سريري: مانع استعمال، أو جرعة بلا سبب تجاوز — لا يُتجاوز بإعادة المحاولة */
export declare class PharmacyClinicalRefusalError extends Error {
    constructor(message: string);
}
/** حالة المستند تمنع العملية (تعديل وصفة صادرة، صرف مسوّدة، …) */
export declare class PharmacyStateError extends Error {
    constructor(message: string);
}
/** نقص مخزون، دفعة منتهية، أو تجاوز حدّ إعادة الصرف */
export declare class PharmacyStockError extends Error {
    constructor(message: string);
}

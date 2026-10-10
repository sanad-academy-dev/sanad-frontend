/**
 * Therapeutic classification — the "what kind of drug is this" layer
 * (painkiller, antibiotic, anaesthetic, contrast medium…).
 *
 * WHY NOT ATCvet: the WHO Collaborating Centre's terms forbid copying and
 * distribution for commercial purposes, and forbid altering the material. This
 * is a commercial product, so bundling ATCvet in a migration is not an option.
 * `DrugCatalogProduct.atcVetCode` stays in the schema, empty, so a licensed
 * ATCvet import can be layered on later without a migration.
 *
 * WHAT THIS IS INSTEAD: derived from the APVMA PubCRIS `hlevel1` column —
 * Australian government open data, veterinary-native, redistributable with
 * attribution. APVMA publishes 44 raw labels including combination categories
 * ("ANTIBIOTIC + NUTRITIONAL"); those collapse onto the primary class here.
 */
/** Canonical class codes. Kept coarse on purpose — a vet filters by these. */
export declare const THERAPEUTIC_CLASSES: readonly [{
    readonly code: "ANTIPARASITIC";
    readonly nameEn: "Antiparasitic";
    readonly nameAr: "مضاد طفيليات";
}, {
    readonly code: "ANTIBIOTIC";
    readonly nameEn: "Antibiotic & anti-infective";
    readonly nameAr: "مضاد حيوي";
}, {
    readonly code: "ANAESTHETIC";
    readonly nameEn: "Anaesthetic & analgesic";
    readonly nameAr: "مخدّر ومسكّن";
}, {
    readonly code: "ANALGESIC";
    readonly nameEn: "Analgesic & anti-inflammatory";
    readonly nameAr: "مسكّن ومضاد التهاب";
}, {
    readonly code: "NERVOUS_SYSTEM";
    readonly nameEn: "Central nervous system";
    readonly nameAr: "الجهاز العصبي";
}, {
    readonly code: "IMMUNOLOGICAL";
    readonly nameEn: "Vaccine & immunological";
    readonly nameAr: "لقاحات ومناعة";
}, {
    readonly code: "MUSCULOSKELETAL";
    readonly nameEn: "Musculoskeletal";
    readonly nameAr: "الجهاز العضلي الهيكلي";
}, {
    readonly code: "DERMATOLOGICAL";
    readonly nameEn: "Dermatological";
    readonly nameAr: "مستحضرات جلدية";
}, {
    readonly code: "ENDOCRINE";
    readonly nameEn: "Endocrine & hormones";
    readonly nameAr: "الغدد والهرمونات";
}, {
    readonly code: "CARDIOVASCULAR";
    readonly nameEn: "Cardiovascular";
    readonly nameAr: "القلب والأوعية";
}, {
    readonly code: "ALIMENTARY";
    readonly nameEn: "Alimentary & metabolism";
    readonly nameAr: "الجهاز الهضمي والأيض";
}, {
    readonly code: "GENITOURINARY";
    readonly nameEn: "Genitourinary";
    readonly nameAr: "الجهاز البولي التناسلي";
}, {
    readonly code: "RESPIRATORY";
    readonly nameEn: "Respiratory";
    readonly nameAr: "الجهاز التنفسي";
}, {
    readonly code: "ENT";
    readonly nameEn: "Ear, nose & throat";
    readonly nameAr: "الأذن والأنف والحنجرة";
}, {
    readonly code: "OPHTHALMIC";
    readonly nameEn: "Ophthalmic";
    readonly nameAr: "مستحضرات العين";
}, {
    readonly code: "ANTIHISTAMINE";
    readonly nameEn: "Antihistamine";
    readonly nameAr: "مضاد هيستامين";
}, {
    readonly code: "ANTINEOPLASTIC";
    readonly nameEn: "Antineoplastic";
    readonly nameAr: "مضاد أورام";
}, {
    readonly code: "ANTIDOTE";
    readonly nameEn: "Antidote";
    readonly nameAr: "ترياق";
}, {
    readonly code: "EUTHANASIA";
    readonly nameEn: "Euthanasia agent";
    readonly nameAr: "مستحضر إنهاء الحياة الرحيم";
}, {
    readonly code: "DIAGNOSTIC";
    readonly nameEn: "Diagnostic & contrast media";
    readonly nameAr: "عوامل تشخيصية وتباين";
}, {
    readonly code: "NUTRITION";
    readonly nameEn: "Nutrition & supplements";
    readonly nameAr: "تغذية ومكمّلات";
}, {
    readonly code: "DISINFECTANT";
    readonly nameEn: "Disinfectant";
    readonly nameAr: "مطهّرات";
}, {
    readonly code: "OTHER";
    readonly nameEn: "Other veterinary product";
    readonly nameAr: "مستحضر بيطري آخر";
}];
export type TherapeuticClassCode = (typeof THERAPEUTIC_CLASSES)[number]["code"];
/** Maps one APVMA label to a canonical class, or null if unknown (reported, not guessed). */
export declare function classFromApvmaLabel(label: string | null | undefined): TherapeuticClassCode | null;
export declare function isTherapeuticClassCode(value: string): value is TherapeuticClassCode;

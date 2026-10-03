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
export const THERAPEUTIC_CLASSES = [
	{ code: "ANTIPARASITIC", nameEn: "Antiparasitic", nameAr: "مضاد طفيليات" },
	{ code: "ANTIBIOTIC", nameEn: "Antibiotic & anti-infective", nameAr: "مضاد حيوي" },
	{ code: "ANAESTHETIC", nameEn: "Anaesthetic & analgesic", nameAr: "مخدّر ومسكّن" },
	{ code: "ANALGESIC", nameEn: "Analgesic & anti-inflammatory", nameAr: "مسكّن ومضاد التهاب" },
	{ code: "NERVOUS_SYSTEM", nameEn: "Central nervous system", nameAr: "الجهاز العصبي" },
	{ code: "IMMUNOLOGICAL", nameEn: "Vaccine & immunological", nameAr: "لقاحات ومناعة" },
	{ code: "MUSCULOSKELETAL", nameEn: "Musculoskeletal", nameAr: "الجهاز العضلي الهيكلي" },
	{ code: "DERMATOLOGICAL", nameEn: "Dermatological", nameAr: "مستحضرات جلدية" },
	{ code: "ENDOCRINE", nameEn: "Endocrine & hormones", nameAr: "الغدد والهرمونات" },
	{ code: "CARDIOVASCULAR", nameEn: "Cardiovascular", nameAr: "القلب والأوعية" },
	{ code: "ALIMENTARY", nameEn: "Alimentary & metabolism", nameAr: "الجهاز الهضمي والأيض" },
	{ code: "GENITOURINARY", nameEn: "Genitourinary", nameAr: "الجهاز البولي التناسلي" },
	{ code: "RESPIRATORY", nameEn: "Respiratory", nameAr: "الجهاز التنفسي" },
	{ code: "ENT", nameEn: "Ear, nose & throat", nameAr: "الأذن والأنف والحنجرة" },
	{ code: "OPHTHALMIC", nameEn: "Ophthalmic", nameAr: "مستحضرات العين" },
	{ code: "ANTIHISTAMINE", nameEn: "Antihistamine", nameAr: "مضاد هيستامين" },
	{ code: "ANTINEOPLASTIC", nameEn: "Antineoplastic", nameAr: "مضاد أورام" },
	{ code: "ANTIDOTE", nameEn: "Antidote", nameAr: "ترياق" },
	{ code: "EUTHANASIA", nameEn: "Euthanasia agent", nameAr: "مستحضر إنهاء الحياة الرحيم" },
	{
		code: "DIAGNOSTIC",
		nameEn: "Diagnostic & contrast media",
		nameAr: "عوامل تشخيصية وتباين",
	},
	{ code: "NUTRITION", nameEn: "Nutrition & supplements", nameAr: "تغذية ومكمّلات" },
	{ code: "DISINFECTANT", nameEn: "Disinfectant", nameAr: "مطهّرات" },
	{ code: "OTHER", nameEn: "Other veterinary product", nameAr: "مستحضر بيطري آخر" },
] as const;

export type TherapeuticClassCode = (typeof THERAPEUTIC_CLASSES)[number]["code"];

const CODES = new Set(THERAPEUTIC_CLASSES.map((c) => c.code));

/**
 * APVMA `hlevel1` label → canonical class. Combination labels resolve to the
 * clinically dominant class (an "ANTIBIOTIC + NUTRITIONAL" premix is stocked
 * and prescribed as an antibiotic, not as a supplement).
 */
const APVMA_LABEL_MAP: Record<string, TherapeuticClassCode> = {
	PARASITICIDES: "ANTIPARASITIC",
	"PARASITICIDE+NUTRITIONAL": "ANTIPARASITIC",
	"IMMUNO+PARASITE+NUTRITION": "ANTIPARASITIC",
	"ANTIBIOTIC & RELATED": "ANTIBIOTIC",
	"ANTIBIOTIC + NUTRITIONAL": "ANTIBIOTIC",
	"ANTIBIOTIC+GENITOURINARY": "ANTIBIOTIC",
	"RESPIRATORY + ANTIBIOTIC": "ANTIBIOTIC",
	"ALIMENTARY + ANTIBIOTIC": "ANTIBIOTIC",
	"ANAESTHETICS/ANALGESICS": "ANAESTHETIC",
	"ANALGESIC+MUSCULOSKELETAL": "ANALGESIC",
	"CENTRAL NERVOUS SYSTEM": "NERVOUS_SYSTEM",
	IMMUNOTHERAPY: "IMMUNOLOGICAL",
	"MUSCULOSKELETAL SYSTEM": "MUSCULOSKELETAL",
	"DERMATOLOGICAL PREPS.": "DERMATOLOGICAL",
	"MEDICATED SHAMPOO": "DERMATOLOGICAL",
	ANTIPRURITIC: "DERMATOLOGICAL",
	"DERMAL+EQUIP DISINFECTANT": "DERMATOLOGICAL",
	"EAR,NOSE,THROAT + DERMAL": "DERMATOLOGICAL",
	"ENDOCRINE SYSTEM": "ENDOCRINE",
	"ANABOLIC HORMONE": "ENDOCRINE",
	"ENDOCRINE + NUTRITIONAL": "ENDOCRINE",
	"CARDIOVASCULAR SYSTEM": "CARDIOVASCULAR",
	"ALIMENTARY SYSTEM": "ALIMENTARY",
	"GENITOURINARY SYSTEM": "GENITOURINARY",
	"RESPIRATORY SYSTEM": "RESPIRATORY",
	"EAR,NOSE,THROAT PREPS.": "ENT",
	"EAR,NOSE,THROAT + OCULAR": "ENT",
	"OPHTHALMIC PREPARATIONS": "OPHTHALMIC",
	ANTIHISTAMINES: "ANTIHISTAMINE",
	"ANTI-HISTAMINE": "ANTIHISTAMINE",
	"ANTIHISTAMINE + ENDOCRINE": "ANTIHISTAMINE",
	"ANTI-NEOPLASTIC AGENT": "ANTINEOPLASTIC",
	ANTIDOTES: "ANTIDOTE",
	EUTHANASIATES: "EUTHANASIA",
	"DIAGNOSTIC AGENTS": "DIAGNOSTIC",
	"NUTRITION & METABOLISM": "NUTRITION",
	"WEIGHT CONTROL": "NUTRITION",
	"NATURAL HEALTH PRODUCT": "NUTRITION",
	DISINFECTANT: "DISINFECTANT",
	"MISCELLANEOUS VETERINARY": "OTHER",
	"OTHER DRUGS": "OTHER",
	"BRANDING SUBSTANCE": "OTHER",
	"V15C + V15F VET SMALL ANI": "OTHER",
	"ACTIVE CONSTITUENT": "OTHER",
};

/** Maps one APVMA label to a canonical class, or null if unknown (reported, not guessed). */
export function classFromApvmaLabel(
	label: string | null | undefined,
): TherapeuticClassCode | null {
	const key = (label ?? "").trim().toUpperCase().replace(/\s+/g, " ");
	return APVMA_LABEL_MAP[key] ?? null;
}

export function isTherapeuticClassCode(value: string): value is TherapeuticClassCode {
	return CODES.has(value as TherapeuticClassCode);
}

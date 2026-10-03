import type {
	GroomingBehaviorScore,
	GroomingModifierCalc,
	GroomingModifierCode,
	GroomingSizeBand,
	HairType,
	MattingGrade,
	ParasiteFinding,
} from "@/generated/prisma/enums";
import {
	DEFAULT_SENIOR_AGE_YEARS,
	mattingGradeRank,
	requiresShaveDownApproval,
} from "@sanad/contracts/runtime/server/grooming/grooming.workflow";

/**
 * محرّك تسعير التجميل — دوال نقية بلا db، تُستورد من الخادم والواجهة معًا.
 * الخطة الحاكمة: docs/grooming-module-plan.md §5.
 *
 * لماذا محرّك أصلًا: `ClinicServiceConfig` يعطي سعرًا واحدًا ومدّة واحدة لكل
 * دورة، وهذا خطأ قاتل في التجميل — «قص كامل» لكلب شيواوا و«قص كامل» لكلب
 * جبال البيرينيه هما الدورة نفسها، بفارق ساعتين ونصف وأضعاف في السعر.
 *
 * قاعدتان تحكمان كل ما يلي:
 *  1. الأخصّ يفوز، والسلّم مصرَّح به هنا لا مستنتَج — وكل تسعيرة تُرجع الرتبة
 *     التي طابقت ومعرّف القاعدة، فتعرض الواجهة «سعر السلالة» مقابل «سعر
 *     افتراضي»، ويرى المدير لماذا ظهر هذا الرقم. لا احتياطيات صامتة.
 *  2. الحساب حتمي: عند تساوي الرتبة تُرتَّب القواعد بالأقدم فالأقدم ثم بالمعرّف،
 *     فلا يمكن لصفّين متكافئين أن يعطيا سعرين مختلفين بين استدعاءين.
 */

const round2 = (n: number) => Math.round(n * 100) / 100;

// ── سلّم الحلّ (§5) ─────────────────────────────────────────────────────────

/**
 * رتب المطابقة من الأخصّ إلى الأعمّ. `PROFILE_OVERRIDE` ليست رتبة قاعدة —
 * تُطبَّق فوق نتيجة السلّم (قد تتجاوز السعر وحده أو المدّة وحدها).
 */
export const GROOMING_PRICE_LEVELS = [
	"STRAIN_COAT",
	"STRAIN",
	"TYPE_SIZE_COAT",
	"TYPE_SIZE",
	"SIZE",
	"DEFINITION_BASE",
	"SERVICE_CONFIG",
] as const;

export type GroomingPriceLevel = (typeof GROOMING_PRICE_LEVELS)[number];

export const GROOMING_PRICE_LEVEL_LABELS: Record<GroomingPriceLevel, string> = {
	STRAIN_COAT: "سعر السلالة ونوع الفرو",
	STRAIN: "سعر السلالة",
	TYPE_SIZE_COAT: "سعر النوع والحجم ونوع الفرو",
	TYPE_SIZE: "سعر النوع والحجم",
	SIZE: "سعر شريحة الحجم",
	DEFINITION_BASE: "السعر الأساسي للدورة",
	SERVICE_CONFIG: "سعر افتراضي من إعداد الأكاديمية",
};

// ── المدخلات ───────────────────────────────────────────────────────────────

/** صفّ من مصفوفة التسعير — الشكل الذي يقرأه المحرّك، لا صفّ Prisma نفسه */
export type GroomingPriceRuleInput = {
	id: string;
	animalTypeId: string | null;
	animalStrainId: string | null;
	sizeBand: GroomingSizeBand | null;
	coatType: HairType | null;
	price: number;
	durationMin: number;
	dryingMinutes: number | null;
	createdAt: Date;
};

/** أبعاد الطفل التي تُطابَق عليها القواعد */
export type GroomingPetContext = {
	animalTypeId: string | null;
	animalStrainId: string | null;
	/** الشريحة بعد تطبيق تجاوز كرت التجميل، أو المشتقة من الوزن (القرار D4) */
	sizeBand: GroomingSizeBand | null;
	/** نوع الفرو بعد تطبيق تجاوز كرت التجميل، أو الموروث من السلالة */
	coatType: HairType | null;
};

export type GroomingDefinitionInput = {
	id: string;
	serviceId: string;
	nameSnapshot: string;
	basePrice: number;
	baseDurationMin: number;
	dryingMinutes: number;
	/** سعر/مدّة `ClinicServiceConfig` — الملاذ الأخير (الرتبة الثامنة) */
	serviceConfigPrice?: number | null;
	serviceConfigDuration?: number | null;
};

/** تجاوز كرت التجميل — يفوز دائمًا على السلّم، حقلًا حقلًا */
export type GroomingProfileOverride = {
	customPrice?: number | null;
	customDurationMin?: number | null;
};

// ── مطابقة رتبة واحدة ──────────────────────────────────────────────────────

type LevelMatcher = (rule: GroomingPriceRuleInput, pet: GroomingPetContext) => boolean;

/**
 * كل رتبة تشترط شكلًا دقيقًا للصفّ: أي بُعد لا تسمّيه الرتبة يجب أن يكون NULL
 * في الصفّ. بغير هذا الشرط يتسرّب صفّ «السلالة + الحجم» إلى رتبة «السلالة»
 * فيُطبَّق على طفل من شريحة أخرى.
 */
const LEVEL_MATCHERS: Record<
	Exclude<GroomingPriceLevel, "DEFINITION_BASE" | "SERVICE_CONFIG">,
	LevelMatcher
> = {
	STRAIN_COAT: (r, p) =>
		r.animalStrainId != null &&
		r.animalStrainId === p.animalStrainId &&
		r.coatType != null &&
		r.coatType === p.coatType &&
		r.sizeBand == null,
	STRAIN: (r, p) =>
		r.animalStrainId != null &&
		r.animalStrainId === p.animalStrainId &&
		r.coatType == null &&
		r.sizeBand == null,
	TYPE_SIZE_COAT: (r, p) =>
		r.animalStrainId == null &&
		r.animalTypeId != null &&
		r.animalTypeId === p.animalTypeId &&
		r.sizeBand != null &&
		r.sizeBand === p.sizeBand &&
		r.coatType != null &&
		r.coatType === p.coatType,
	TYPE_SIZE: (r, p) =>
		r.animalStrainId == null &&
		r.animalTypeId != null &&
		r.animalTypeId === p.animalTypeId &&
		r.sizeBand != null &&
		r.sizeBand === p.sizeBand &&
		r.coatType == null,
	SIZE: (r, p) =>
		r.animalStrainId == null &&
		r.animalTypeId == null &&
		r.coatType == null &&
		r.sizeBand != null &&
		r.sizeBand === p.sizeBand,
};

/**
 * الفاصل الحتمي عند تكافؤ الرتبة. القيد الفريد في القاعدة لا يمنع التكرار حين
 * تكون أبعاد المطابقة NULL — فـ Postgres يعدّ NULL مميّزًا عن NULL في الفهارس
 * الفريدة. مسار الكتابة يمنع التكرار بالبحث على الرباعية كاملة قبل الإنشاء،
 * وهذا الترتيب هو الحزام الثاني: صفّان متكافئان يعطيان النتيجة نفسها دائمًا.
 */
const byDeterministicOrder = (a: GroomingPriceRuleInput, b: GroomingPriceRuleInput) => {
	const t = a.createdAt.getTime() - b.createdAt.getTime();
	return t !== 0 ? t : a.id.localeCompare(b.id);
};

// ── نتيجة التسعير ──────────────────────────────────────────────────────────

export type GroomingResolvedPrice = {
	price: number;
	durationMin: number;
	dryingMinutes: number;
	/** الرتبة التي طابقت في السلّم — قبل تجاوز كرت التجميل */
	level: GroomingPriceLevel;
	matchedRuleId: string | null;
	/** أي الحقول جاء من كرت التجميل بدل السلّم */
	overridden: { price: boolean; duration: boolean };
};

/**
 * الرتبة الأخصّ التي تطابق هذا الطفل، ثم تجاوز كرت التجميل فوقها.
 * لا يُخمَّن بُعد غائب: طفل بلا وزن ولا شريحة يسقط ببساطة إلى رتبة أدنى.
 */
export const resolveGroomingPrice = (
	definition: GroomingDefinitionInput,
	rules: readonly GroomingPriceRuleInput[],
	pet: GroomingPetContext,
	override: GroomingProfileOverride = {},
): GroomingResolvedPrice => {
	let level: GroomingPriceLevel = "DEFINITION_BASE";
	let matched: GroomingPriceRuleInput | null = null;

	for (const candidateLevel of GROOMING_PRICE_LEVELS) {
		if (candidateLevel === "DEFINITION_BASE" || candidateLevel === "SERVICE_CONFIG") break;
		const matcher = LEVEL_MATCHERS[candidateLevel];
		const hits = rules.filter((rule) => matcher(rule, pet)).sort(byDeterministicOrder);
		if (hits.length > 0) {
			level = candidateLevel;
			matched = hits[0];
			break;
		}
	}

	let price: number;
	let durationMin: number;
	let dryingMinutes: number;

	if (matched) {
		price = matched.price;
		durationMin = matched.durationMin;
		dryingMinutes = matched.dryingMinutes ?? definition.dryingMinutes;
	} else if (definition.basePrice > 0 || definition.serviceConfigPrice == null) {
		// السعر الأساسي للتعريف — الرتبة السابعة
		price = definition.basePrice;
		durationMin = definition.baseDurationMin;
		dryingMinutes = definition.dryingMinutes;
		level = "DEFINITION_BASE";
	} else {
		// الملاذ الأخير: إعداد الأكاديمية للدورة نفسها
		price = definition.serviceConfigPrice;
		durationMin = definition.serviceConfigDuration ?? definition.baseDurationMin;
		dryingMinutes = definition.dryingMinutes;
		level = "SERVICE_CONFIG";
	}

	const overridePrice = override.customPrice != null;
	const overrideDuration = override.customDurationMin != null;
	if (overridePrice) price = override.customPrice as number;
	if (overrideDuration) durationMin = override.customDurationMin as number;

	return {
		price: round2(price),
		durationMin,
		dryingMinutes,
		level,
		matchedRuleId: matched?.id ?? null,
		overridden: { price: overridePrice, duration: overrideDuration },
	};
};

// ── الرسوم والخصوم المشروطة (§5) ───────────────────────────────────────────

export type GroomingModifierInput = {
	code: GroomingModifierCode;
	labelAr: string;
	calc: GroomingModifierCalc;
	value: number;
	autoAppliesFrom: number | null;
	requiresOwnerApproval: boolean;
	active: boolean;
};

/** الوقائع التي تُفعّل الرسوم — معظمها يأتي من الفحص القبلي */
export type GroomingModifierTrigger = {
	mattingGrade?: MattingGrade | null;
	/** دقائق فكّ التعقّد المقدَّرة — أساس حساب PER_MINUTE */
	dematMinutes?: number;
	behaviorScore?: GroomingBehaviorScore | null;
	requiresTwoHandlers?: boolean;
	ageYears?: number | null;
	seniorAgeYears?: number;
	parasiteFinding?: ParasiteFinding | null;
	shaveDownRequired?: boolean;
	isSecondPetSameDay?: boolean;
	/** رسوم يطبّقها الطاقم يدويًا (مستعجل/خارج الدوام) */
	manualCodes?: readonly GroomingModifierCode[];
	/** عتبة الحلاقة الاضطرارية من إعداد الفرع */
	shaveDownThreshold?: MattingGrade;
};

/**
 * هل يُطبَّق هذا الرسم آليًا؟ العتبة `autoAppliesFrom` تُقرأ بحسب الرمز: رتبة
 * درجة التعقّد لـ MATTING، وسنوات العمر لـ SENIOR. الرموز اليدوية لا تُطبَّق
 * آليًا أبدًا مهما كانت العتبة.
 */
export const isModifierAutoApplied = (
	modifier: GroomingModifierInput,
	trigger: GroomingModifierTrigger,
): boolean => {
	if (!modifier.active) return false;
	switch (modifier.code) {
		case "MATTING": {
			if (trigger.mattingGrade == null) return false;
			const threshold = modifier.autoAppliesFrom ?? 2; // MODERATE
			return mattingGradeRank(trigger.mattingGrade) >= threshold;
		}
		case "SHAVE_DOWN":
			return (
				trigger.shaveDownRequired === true ||
				requiresShaveDownApproval(trigger.mattingGrade, trigger.shaveDownThreshold)
			);
		case "BEHAVIOR":
			return (
				trigger.requiresTwoHandlers === true ||
				trigger.behaviorScore === "YELLOW" ||
				trigger.behaviorScore === "RED"
			);
		case "SENIOR": {
			if (trigger.ageYears == null) return false;
			const seniorAge =
				modifier.autoAppliesFrom ?? trigger.seniorAgeYears ?? DEFAULT_SENIOR_AGE_YEARS;
			return trigger.ageYears >= seniorAge;
		}
		case "FLEA":
			return trigger.parasiteFinding != null && trigger.parasiteFinding !== "NONE";
		case "SECOND_PET":
			return trigger.isSecondPetSameDay === true;
		default:
			// EXPRESS / OUT_OF_HOURS — يدويّان فقط
			return false;
	}
};

export type GroomingAppliedModifier = {
	code: GroomingModifierCode;
	labelAr: string;
	amount: number;
	requiresOwnerApproval: boolean;
	/** آلي من الفحص القبلي أم مطبَّق يدويًا */
	auto: boolean;
};

/**
 * مبلغ الرسم. النسبة تُحسب على مجموع البنود قبل أي رسم آخر — فلا يتراكم رسم
 * على رسم ويصبح الترتيب مؤثّرًا في الرقم النهائي.
 */
const modifierAmount = (
	modifier: GroomingModifierInput,
	itemsSubtotal: number,
	dematMinutes: number,
): number => {
	switch (modifier.calc) {
		case "PERCENT":
			return round2((itemsSubtotal * modifier.value) / 100);
		case "PER_MINUTE":
			return round2(modifier.value * dematMinutes);
		default:
			return round2(modifier.value);
	}
};

// ── التسعيرة الكاملة ───────────────────────────────────────────────────────

export type GroomingQuoteItemInput = {
	definition: GroomingDefinitionInput;
	rules: readonly GroomingPriceRuleInput[];
	quantity?: number;
};

export type GroomingQuoteLine = GroomingResolvedPrice & {
	definitionId: string;
	serviceId: string;
	nameSnapshot: string;
	quantity: number;
	lineTotal: number;
};

export type GroomingQuote = {
	lines: readonly GroomingQuoteLine[];
	adjustments: readonly GroomingAppliedModifier[];
	itemsSubtotal: number;
	adjustmentsTotal: number;
	total: number;
	/** مجموع دقائق العمل — مدخل الجدولة لا الفوترة (§7) */
	durationMin: number;
	/** مجموع دقائق التجفيف — يحجز فتحة تجفيف مستقلة عن المُجمِّل */
	dryingMinutes: number;
	/** هل تحتاج التسعيرة إقرار وليّ الأمر قبل بدء العمل */
	requiresOwnerApproval: boolean;
};

export const quoteGroomingSession = (input: {
	items: readonly GroomingQuoteItemInput[];
	pet: GroomingPetContext;
	override?: GroomingProfileOverride;
	modifiers?: readonly GroomingModifierInput[];
	trigger?: GroomingModifierTrigger;
	/** رموز يطبّقها الطاقم يدويًا فوق الآلي */
	manualCodes?: readonly GroomingModifierCode[];
}): GroomingQuote => {
	const trigger = input.trigger ?? {};
	const manual = new Set<GroomingModifierCode>([
		...(input.manualCodes ?? []),
		...(trigger.manualCodes ?? []),
	]);

	const lines: GroomingQuoteLine[] = input.items.map((item) => {
		const quantity = item.quantity ?? 1;
		// تجاوز كرت التجميل يخصّ الدورة الأساسية لا الإضافات — الإضافات تُسعَّر
		// من السلّم دائمًا، وإلا صار سعر «تقليم الأظافر» هو سعر القصّ الكامل.
		const resolved = resolveGroomingPrice(
			item.definition,
			item.rules,
			input.pet,
			input.override,
		);
		return {
			...resolved,
			definitionId: item.definition.id,
			serviceId: item.definition.serviceId,
			nameSnapshot: item.definition.nameSnapshot,
			quantity,
			lineTotal: round2(resolved.price * quantity),
		};
	});

	const itemsSubtotal = round2(lines.reduce((sum, line) => sum + line.lineTotal, 0));
	const dematMinutes = trigger.dematMinutes ?? 0;

	const adjustments: GroomingAppliedModifier[] = [];
	for (const modifier of input.modifiers ?? []) {
		if (!modifier.active) continue;
		const auto = isModifierAutoApplied(modifier, trigger);
		const applied = auto || manual.has(modifier.code);
		if (!applied) continue;
		adjustments.push({
			code: modifier.code,
			labelAr: modifier.labelAr,
			amount: modifierAmount(modifier, itemsSubtotal, dematMinutes),
			requiresOwnerApproval: modifier.requiresOwnerApproval,
			auto,
		});
	}

	const adjustmentsTotal = round2(adjustments.reduce((sum, a) => sum + a.amount, 0));

	return {
		lines,
		adjustments,
		itemsSubtotal,
		adjustmentsTotal,
		// التسعيرة لا تنزل تحت الصفر مهما تراكمت الخصوم
		total: Math.max(0, round2(itemsSubtotal + adjustmentsTotal)),
		durationMin: lines.reduce((sum, l) => sum + l.durationMin * l.quantity, 0) + dematMinutes,
		dryingMinutes: lines.reduce((sum, l) => sum + l.dryingMinutes, 0),
		requiresOwnerApproval: adjustments.some((a) => a.requiresOwnerApproval),
	};
};

/**
 * هل تستوجب التسعيرة الجديدة إقرارًا من وليّ الأمر؟ الزيادة وحدها هي ما يُقرّ —
 * انخفاض السعر لا يحتاج إذنًا. النسبة إعداد فرع (`quoteReapprovalPercent`).
 */
export const requiresQuoteReapproval = (
	bookedTotal: number,
	newTotal: number,
	thresholdPercent: number,
): boolean => {
	if (newTotal <= bookedTotal) return false;
	if (bookedTotal <= 0) return newTotal > 0;
	return ((newTotal - bookedTotal) / bookedTotal) * 100 > thresholdPercent;
};

import type { ConsentLocale } from "@/generated/prisma/enums";
import type {
	ConsentAutofill,
	ConsentBlock,
	ConsentFieldDef,
	ConsentOptionDef,
	ConsentTemplateDef,
} from "@/server/patient-consents/consent-template.type";
import type { ConsentFieldValues } from "@/server/patient-consents/patient-consents.type";

// تصيير مستند الموافقة — دوال خالصة بلا وصول لقاعدة البيانات: المُستدعي يُحمّل
// السجلّات ويمرّر سياقًا مسطّحًا. هذا ما يجعل التصيير قابلًا للاختبار بلا قاعدة
// بيانات (القاعدة 8: اختبارات الـ DB لا تعمل إلا في CI).

/** السياق المسطّح الذي تُحلّ منه التعبئة الآلية */
export type ConsentAutofillContext = Partial<Record<ConsentAutofill, string>>;

/** أسعار البنود المسعَّرة وقت العرض — رمز الدورة إلى سعرها منسّقًا */
export type ConsentPriceMap = Record<string, string>;

const AR_DATE = new Intl.DateTimeFormat("ar", { dateStyle: "medium" });

const formatDate = (value: Date | string | null | undefined): string =>
	value ? AR_DATE.format(new Date(value)) : "";

/** يبني السياق من السجلّات المحمّلة — أي حقل غائب يبقى فارغًا ولا يُلفَّق */
export const buildAutofillContext = (input: {
	clinicName?: string | null;
	owner?: {
		name?: string | null;
		phone?: string | null;
		email?: string | null;
		city?: string | null;
		address?: string | null;
	} | null;
	patient?: {
		name?: string | null;
		code?: string | null;
		birthDate?: Date | string | null;
		weight?: number | null;
		gender?: string | null;
		microchipNumber?: string | null;
		coat?: string | null;
		animalType?: { arName?: string | null; enName?: string | null } | null;
		animalStrain?: { arName?: string | null; enName?: string | null } | null;
	} | null;
	operationCase?: {
		diagnosis?: string | null;
		procedures?: { nameSnapshot: string }[];
		surgeonName?: string | null;
	} | null;
	now?: Date;
}): ConsentAutofillContext => {
	const { clinicName, owner, patient, operationCase } = input;
	const ctx: ConsentAutofillContext = {};

	const set = (key: ConsentAutofill, value: string | null | undefined) => {
		if (value != null && String(value).trim() !== "") ctx[key] = String(value).trim();
	};

	set("clinic.name", clinicName);
	set("today", formatDate(input.now ?? new Date()));

	set("owner.name", owner?.name);
	set("owner.phone", owner?.phone);
	set("owner.email", owner?.email);
	set("owner.city", owner?.city);
	set("owner.address", owner?.address);

	set("patient.name", patient?.name);
	set("patient.code", patient?.code);
	set("patient.birthDate", formatDate(patient?.birthDate));
	set("patient.weight", patient?.weight == null ? null : String(patient.weight));
	set(
		"patient.gender",
		patient?.gender === "MALE" ? "ذكر" : patient?.gender === "FEMALE" ? "أنثى" : null,
	);
	set("patient.microchip", patient?.microchipNumber);
	set("patient.coat", patient?.coat);
	set("patient.animalType", patient?.animalType?.arName);
	set("patient.breed", patient?.animalStrain?.arName);

	set("case.diagnosis", operationCase?.diagnosis);
	set("case.surgeon", operationCase?.surgeonName);
	const procedures = operationCase?.procedures?.map((p) => p.nameSnapshot).filter(Boolean);
	set("case.procedures", procedures?.length ? procedures.join("، ") : null);

	return ctx;
};

/** كل حقول القالب مسطّحة عبر كتله */
export const templateFields = (template: ConsentTemplateDef): ConsentFieldDef[] =>
	template.blocks.flatMap((b) =>
		b.kind === "fields" || b.kind === "clinicUse" ? b.fields : [],
	);

/**
 * يملأ الحقول من السياق. القيم التي أدخلها المستخدم لا تُمسّ أبدًا — التعبئة
 * الآلية اقتراح أوّلي لا سلطة: الموظّف يبقى وليّ أمر كل حقل.
 */
export const applyAutofill = (
	template: ConsentTemplateDef,
	ctx: ConsentAutofillContext,
	existing: ConsentFieldValues = {},
): ConsentFieldValues => {
	const values: ConsentFieldValues = { ...existing };
	for (const field of templateFields(template)) {
		if (!field.autofill) continue;
		const current = values[field.key];
		const isBlank =
			current == null || current === "" || (Array.isArray(current) && !current.length);
		if (!isBlank) continue;
		const filled = ctx[field.autofill];
		if (filled) values[field.key] = filled;
	}
	return values;
};

const asText = (value: ConsentFieldValues[string]): string => {
	if (value == null) return "";
	if (Array.isArray(value)) return value.join("، ");
	if (typeof value === "boolean") return value ? "نعم" : "لا";
	return value;
};

/** يستبدل {{key}} بقيمة الحقل أو السياق — ما لا يُحلّ يبقى شرطةً لا وسمًا خامًا */
const interpolate = (
	text: string,
	values: ConsentFieldValues,
	ctx: ConsentAutofillContext,
): string =>
	text.replace(/\{\{(\w+(?:\.\w+)?)\}\}/g, (_match, key: string) => {
		const fromValues = asText(values[key]);
		if (fromValues) return fromValues;
		const fromCtx = ctx[key as ConsentAutofill];
		return fromCtx ?? "……";
	});

const TICK = "☑";
const UNTICK = "☐";

type RenderOpts = {
	locale: ConsentLocale;
	values: ConsentFieldValues;
	ctx: ConsentAutofillContext;
	prices?: ConsentPriceMap;
};

/** يعيد نصّي الكتلة بحسب اللغة — BOTH يضع العربي ثم الإنجليزي */
const bilingual = (ar: string, en: string, locale: ConsentLocale): string[] => {
	if (locale === "AR") return [ar];
	if (locale === "EN") return [en];
	return [ar, en];
};

const renderOptionLabel = (
	option: ConsentOptionDef,
	locale: ConsentLocale,
	prices: ConsentPriceMap | undefined,
): string => {
	const label = bilingual(option.labelAr, option.labelEn, locale).join(" / ");
	// السعر يُحقن وقت العرض ويتجمّد داخل اللقطة — تغييره لاحقًا لا يمسّ الموقَّع
	const price =
		(option.priceServiceCode ? prices?.[option.priceServiceCode] : undefined) ??
		option.priceFallback;
	return price ? `${label} — ${price}` : label;
};

const renderBlock = (block: ConsentBlock, opts: RenderOpts): string[] => {
	const { locale, values, ctx, prices } = opts;
	switch (block.kind) {
		case "heading":
			return bilingual(block.ar, block.en, locale).map((t) => `\n## ${t}`);
		case "paragraph":
			return bilingual(block.ar, block.en, locale).map((t) => interpolate(t, values, ctx));
		case "fields":
			return block.fields.map((f) => {
				const label = bilingual(f.labelAr, f.labelEn, locale).join(" / ");
				return `${label}: ${asText(values[f.key]) || "……"}`;
			});
		case "choice": {
			const label = bilingual(block.labelAr, block.labelEn, locale).join(" / ");
			const chosen = asText(values[block.key]);
			return [
				`${label}:`,
				...block.options.map(
					(o) =>
						`  ${o.value === chosen ? TICK : UNTICK} ${renderOptionLabel(o, locale, prices)}`,
				),
			];
		}
		case "checklist": {
			const label = bilingual(block.labelAr, block.labelEn, locale).join(" / ");
			const raw = values[block.key];
			const chosen = Array.isArray(raw) ? raw : raw ? [String(raw)] : [];
			return [
				`${label}:`,
				...block.options.map(
					(o) =>
						`  ${chosen.includes(o.value) ? TICK : UNTICK} ${renderOptionLabel(o, locale, prices)}`,
				),
			];
		}
		case "initial": {
			const initials = asText(values[block.key]);
			return bilingual(block.ar, block.en, locale).map(
				(t) => `${t} (الأحرف الأولى: ${initials || "……"})`,
			);
		}
		case "clinicUse":
			return [
				`\n## ${bilingual(block.ar, block.en, locale).join(" / ")}`,
				...block.fields.map((f) => {
					const label = bilingual(f.labelAr, f.labelEn, locale).join(" / ");
					return `${label}: ${asText(values[f.key]) || "……"}`;
				}),
			];
	}
};

/**
 * المستند كما عُرض على الموقِّع. يُحفظ في textSnapshot عند التوقيع فيصير السجل
 * القانوني: تعديل القالب أو الأسعار بعدها لا يُغيّر حرفًا مما وُقّع عليه.
 */
export const renderConsentDocument = (
	template: ConsentTemplateDef,
	opts: RenderOpts,
): string => {
	const title = bilingual(template.titleAr, template.titleEn, opts.locale).join(" / ");
	const body = template.blocks.flatMap((b) => renderBlock(b, opts));
	return [`# ${title}`, ...body]
		.join("\n")
		.replace(/\n{3,}/g, "\n\n")
		.trim();
};

/** الحقول الإلزامية الناقصة — تمنع الانتقال إلى التوقيع */
export const missingRequiredFields = (
	template: ConsentTemplateDef,
	values: ConsentFieldValues,
): ConsentFieldDef[] =>
	templateFields(template).filter((f) => {
		if (!f.required) return false;
		const v = values[f.key];
		return v == null || v === "" || (Array.isArray(v) && !v.length);
	});

/** الاختيارات الإلزامية غير المحدَّدة — «يرجى تحديد خيار واحد فقط» */
export const missingRequiredChoices = (
	template: ConsentTemplateDef,
	values: ConsentFieldValues,
): { key: string; labelAr: string }[] =>
	template.blocks
		.filter((b): b is Extract<ConsentBlock, { kind: "choice" }> => b.kind === "choice")
		.filter((b) => b.required && !asText(values[b.key]))
		.map((b) => ({ key: b.key, labelAr: b.labelAr }));

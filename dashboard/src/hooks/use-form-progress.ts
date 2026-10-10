import type { ZodType } from "zod";

// حقل فارغ فعليًا — لا يكفي التحقق بالمخطط وحده:
// z.coerce.number() يقبل "" (تتحول إلى 0)، والحقل nullable يقبل null.
const isBlank = (value: unknown) =>
	value === undefined ||
	value === null ||
	value === "" ||
	(Array.isArray(value) && value.length === 0);

type ZodShape = Record<string, ZodType>;
type DiscriminatedDef = {
	discriminator?: string;
	options?: { shape?: ZodShape }[];
};

// المخطط قد يكون discriminatedUnion (لا shape له) — نختار الفرع المطابق للقيمة الحالية.
const getShape = (schema: ZodType, values: Record<string, unknown>): ZodShape | undefined => {
	const direct = (schema as unknown as { shape?: ZodShape }).shape;
	if (direct) return direct;

	const def = (schema as unknown as { def?: DiscriminatedDef }).def;
	if (!def?.discriminator || !def.options) return undefined;

	const current = values[def.discriminator];
	const branch = def.options.find(
		(option) => option.shape?.[def.discriminator as string]?.safeParse(current).success,
	);
	return branch?.shape;
};

// الحقل مطلوب إذا رفض المخطط قيمة undefined — أي ليس optional ولا له default.
const getRequiredEntries = (schema: ZodType, values: Record<string, unknown>) => {
	const shape = getShape(schema, values);
	if (!shape) return [];
	return Object.entries(shape).filter(([, field]) => !field.safeParse(undefined).success);
};

/**
 * نسبة إكمال الحقول المطلوبة، مستخرجة من مخطط Zod نفسه.
 * لا قوائم حقول يدوية: أي تغيير في المخطط ينعكس تلقائيًا.
 */
export const useFormProgress = <T extends Record<string, unknown>>({
	schema,
	values,
}: {
	schema: ZodType;
	values: T;
}) => {
	// بلا useMemo: فرع الـ discriminatedUnion يتبدّل مع القيم، والحساب رخيص (حقول معدودة)
	const required = getRequiredEntries(schema, values);

	const filledCount = required.filter(
		([key, field]) => !isBlank(values[key]) && field.safeParse(values[key]).success,
	).length;

	const requiredCount = required.length;
	const progress = requiredCount === 0 ? 0 : Math.round((filledCount / requiredCount) * 100);

	return { filledCount, requiredCount, progress, isComplete: progress === 100 };
};

export type FormProgress = ReturnType<typeof useFormProgress<Record<string, unknown>>>;

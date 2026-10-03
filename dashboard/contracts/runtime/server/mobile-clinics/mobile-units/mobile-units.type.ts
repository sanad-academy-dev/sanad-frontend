import { z } from "zod";

import type { Prisma } from "@/generated/prisma/client";
import { MobileUnitCrewRole, MobileUnitStatus } from "@/generated/prisma/enums";

export { MobileUnitCrewRole, MobileUnitStatus };

/**
 * [MC1.2] أخطاء المجال — تُسجَّل أسماؤها في `CLIENT_ERROR_NAMES` في `src/server/app.ts`
 * حتى تصل رسالتها العربية إلى العميل. أي خطأ آخر يُبتلع ويُرد 500 بلا تفاصيل.
 */
export class MobileUnitValidationError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MobileUnitValidationError";
	}
}

export class MobileUnitConflictError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MobileUnitConflictError";
	}
}

/**
 * [MC2.1] المركبة موقوفة إداريًّا — يُترجَم إلى **423 Locked** في `src/server/app.ts`.
 *
 * رمزٌ منفصل عن 401 و403 لأنّ التطبيق يتصرّف بناءً عليه تصرّفًا مختلفًا: 401 يعيده إلى
 * تسجيل الدخول، و403 يعني «لست من هذا الطاقم»، أمّا 423 فيقفل الشاشة ويستمرّ في
 * الاستفسار كل دقيقة حتى يُعاد التفعيل — دون أن يفقد اقترانه بالمركبة.
 */
export class MobileUnitLockedError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "MobileUnitLockedError";
	}
}

// ─── Selects ─────────────────────────────────────────────

export const mobileUnitSelect = {
	id: true,
	code: true,
	name: true,
	plateNumber: true,
	vehicleMake: true,
	vehicleModel: true,
	year: true,
	color: true,
	photo: true,
	status: true,
	active: true,
	branchId: true,
	branch: { select: { id: true, name: true } },
	warehouseId: true,
	warehouse: { select: { id: true, code: true, name: true } },
	lastLat: true,
	lastLng: true,
	lastLocationAt: true,
	lastSpeedKph: true,
	lastHeading: true,
	lastBatteryPct: true,
	notes: true,
	editsCount: true,
	createdAt: true,
	_count: { select: { crew: true } },
} as const;

export type MobileUnitResponse = Prisma.MobileUnitGetPayload<{
	select: typeof mobileUnitSelect;
}>;

export const mobileUnitCrewSelect = {
	id: true,
	role: true,
	isPrimary: true,
	active: true,
	staffId: true,
	staff: {
		select: {
			id: true,
			name: true,
			avatar: true,
			phone: true,
			prefix: true,
			role: { select: { id: true, name: true } },
		},
	},
} as const;

export type MobileUnitCrewResponse = Prisma.MobileUnitCrewGetPayload<{
	select: typeof mobileUnitCrewSelect;
}>;

export const mobileUnitDetailSelect = {
	...mobileUnitSelect,
	crew: {
		where: { active: true },
		select: mobileUnitCrewSelect,
		orderBy: [{ isPrimary: "desc" }, { createdAt: "asc" }],
	},
} as const satisfies Prisma.MobileUnitSelect;

export type MobileUnitDetailResponse = Prisma.MobileUnitGetPayload<{
	select: typeof mobileUnitDetailSelect;
}>;

export const mobileUnitActivitySelect = {
	id: true,
	type: true,
	body: true,
	metadata: true,
	createdAt: true,
	author: { select: { id: true, name: true, image: true } },
} as const;

export type MobileUnitActivityResponse = Prisma.MobileUnitActivityGetPayload<{
	select: typeof mobileUnitActivitySelect;
}>;

/**
 * [MC2.1] أجهزة المركبة. `tokenHash` **غير موجود هنا عمدًا** — لا يخرج من قاعدة البيانات
 * إلى أي استجابة، ولو للمسؤول. المعروض هو البادئة فقط للتمييز بين جهازين.
 */
export const mobileUnitDeviceSelect = {
	id: true,
	label: true,
	tokenPrefix: true,
	platform: true,
	appVersion: true,
	lastSeenAt: true,
	pairedAt: true,
	revokedAt: true,
	createdBy: { select: { id: true, name: true } },
	revokedBy: { select: { id: true, name: true } },
} as const;

export type MobileUnitDeviceResponse = Prisma.MobileUnitDeviceGetPayload<{
	select: typeof mobileUnitDeviceSelect;
}>;

/**
 * استجابة الاقتران — المرّة **الوحيدة** التي يغادر فيها الرمز الخام الخادم. لا يُخزَّن
 * ولا يُسترجع؛ فقدانه يعني إبطال الجهاز وإصدار رمز جديد.
 */
export type PairedDeviceResponse = MobileUnitDeviceResponse & { token: string };

/**
 * [O4] ما يعود من نقطة الاقتران فعليًّا: استجابة الاقتران نفسها مضافًا إليها صورة QR
 * جاهزة للعرض (data URI). الصورة تُولَّد في وحدة التحكّم لا في الـ DAO — الـ DAO
 * استعلامات Prisma فقط — ولا تُخزَّن، تمامًا كالرمز الخام الذي ترمّزه.
 */
export type PairedDeviceWithQrResponse = PairedDeviceResponse & { qrDataUri: string };

export const pairDeviceSchema = z.object({
	label: z
		.string({ error: "اسم الجهاز مطلوب" })
		.min(1, "اسم الجهاز مطلوب")
		.max(80, "اسم الجهاز طويل"),
});

export type PairDeviceFormInput = z.infer<typeof pairDeviceSchema>;

/** الموظّفون المؤهّلون للانضمام إلى طاقم مركبة — انظر `listEligibleStaff` في الـ DAO. */
export const eligibleStaffSelect = {
	id: true,
	name: true,
	avatar: true,
	phone: true,
	prefix: true,
	branchId: true,
	role: { select: { id: true, name: true } },
} as const;

export type EligibleStaffResponse = Prisma.StaffGetPayload<{
	select: typeof eligibleStaffSelect;
}>;

// ─── Forms ───────────────────────────────────────────────

/**
 * سنة الصنع: الحقل اختياري، لكن `z.coerce.number()` يحوّل السلسلة الفارغة إلى 0 لا إلى
 * undefined — فحقلٌ تركه المستخدم فارغًا كان سيسقط على «0 خارج المدى». المعالجة المسبقة
 * تُرجع الفراغ إلى undefined قبل أن يراه المحوّل.
 */
const optionalYear = z.preprocess(
	(value) => (value === "" || value === null ? undefined : value),
	z.coerce
		.number({ error: "سنة الصنع يجب أن تكون رقمًا" })
		.int("سنة الصنع يجب أن تكون عددًا صحيحًا")
		.min(1970, "سنة الصنع غير منطقية")
		.max(2100, "سنة الصنع غير منطقية")
		.optional(),
);

const optionalText = (max: number) =>
	z.preprocess(
		(value) => (value === "" || value === null ? undefined : value),
		z.string().max(max).optional(),
	);

export const createMobileUnitSchema = z.object({
	name: z.string({ error: "اسم الوحدة مطلوب" }).min(1, "اسم الوحدة مطلوب").max(120),
	branchId: z.string({ error: "الفرع مطلوب" }).min(1, "الفرع مطلوب"),
	plateNumber: optionalText(40),
	vehicleMake: optionalText(60),
	vehicleModel: optionalText(60),
	year: optionalYear,
	color: optionalText(40),
	notes: optionalText(1000),
});

export type CreateMobileUnitFormInput = z.infer<typeof createMobileUnitSchema>;

export const updateMobileUnitSchema = createMobileUnitSchema
	.partial()
	// الفرع الأمّ لا يتغيّر بعد الإنشاء: مستودع المركبة مرتبط به، وتغييره يعني نقل مخزون
	// بين فرعين خلسةً بلا سند تحويل. النقل — إن لزم — عمليةٌ صريحة لا تعديل حقل.
	.omit({ branchId: true });

export type UpdateMobileUnitFormInput = z.infer<typeof updateMobileUnitSchema>;

export const addCrewMemberSchema = z.object({
	staffId: z.string({ error: "الموظف مطلوب" }).min(1, "الموظف مطلوب"),
	role: z.enum(MobileUnitCrewRole, { error: "الدور مطلوب" }),
	isPrimary: z.boolean().optional().default(false),
});

export type AddCrewMemberFormInput = z.infer<typeof addCrewMemberSchema>;

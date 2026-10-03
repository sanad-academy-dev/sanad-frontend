import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { MobileUnitCrewRole, MobileUnitStatus } from "@/generated/prisma/enums";
export { MobileUnitCrewRole, MobileUnitStatus };
/**
 * [MC1.2] أخطاء المجال — تُسجَّل أسماؤها في `CLIENT_ERROR_NAMES` في `src/server/app.ts`
 * حتى تصل رسالتها العربية إلى العميل. أي خطأ آخر يُبتلع ويُرد 500 بلا تفاصيل.
 */
export declare class MobileUnitValidationError extends Error {
    constructor(message: string);
}
export declare class MobileUnitConflictError extends Error {
    constructor(message: string);
}
/**
 * [MC2.1] المركبة موقوفة إداريًّا — يُترجَم إلى **423 Locked** في `src/server/app.ts`.
 *
 * رمزٌ منفصل عن 401 و403 لأنّ التطبيق يتصرّف بناءً عليه تصرّفًا مختلفًا: 401 يعيده إلى
 * تسجيل الدخول، و403 يعني «لست من هذا الطاقم»، أمّا 423 فيقفل الشاشة ويستمرّ في
 * الاستفسار كل دقيقة حتى يُعاد التفعيل — دون أن يفقد اقترانه بالمركبة.
 */
export declare class MobileUnitLockedError extends Error {
    constructor(message: string);
}
export declare const mobileUnitSelect: {
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly plateNumber: true;
    readonly vehicleMake: true;
    readonly vehicleModel: true;
    readonly year: true;
    readonly color: true;
    readonly photo: true;
    readonly status: true;
    readonly active: true;
    readonly branchId: true;
    readonly branch: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly warehouseId: true;
    readonly warehouse: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
        };
    };
    readonly lastLat: true;
    readonly lastLng: true;
    readonly lastLocationAt: true;
    readonly lastSpeedKph: true;
    readonly lastHeading: true;
    readonly lastBatteryPct: true;
    readonly notes: true;
    readonly editsCount: true;
    readonly createdAt: true;
    readonly _count: {
        readonly select: {
            readonly crew: true;
        };
    };
};
export type MobileUnitResponse = Prisma.MobileUnitGetPayload<{
    select: typeof mobileUnitSelect;
}>;
export declare const mobileUnitCrewSelect: {
    readonly id: true;
    readonly role: true;
    readonly isPrimary: true;
    readonly active: true;
    readonly staffId: true;
    readonly staff: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly avatar: true;
            readonly phone: true;
            readonly prefix: true;
            readonly role: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                };
            };
        };
    };
};
export type MobileUnitCrewResponse = Prisma.MobileUnitCrewGetPayload<{
    select: typeof mobileUnitCrewSelect;
}>;
export declare const mobileUnitDetailSelect: {
    readonly crew: {
        readonly where: {
            readonly active: true;
        };
        readonly select: {
            readonly id: true;
            readonly role: true;
            readonly isPrimary: true;
            readonly active: true;
            readonly staffId: true;
            readonly staff: {
                readonly select: {
                    readonly id: true;
                    readonly name: true;
                    readonly avatar: true;
                    readonly phone: true;
                    readonly prefix: true;
                    readonly role: {
                        readonly select: {
                            readonly id: true;
                            readonly name: true;
                        };
                    };
                };
            };
        };
        readonly orderBy: [{
            readonly isPrimary: "desc";
        }, {
            readonly createdAt: "asc";
        }];
    };
    readonly id: true;
    readonly code: true;
    readonly name: true;
    readonly plateNumber: true;
    readonly vehicleMake: true;
    readonly vehicleModel: true;
    readonly year: true;
    readonly color: true;
    readonly photo: true;
    readonly status: true;
    readonly active: true;
    readonly branchId: true;
    readonly branch: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly warehouseId: true;
    readonly warehouse: {
        readonly select: {
            readonly id: true;
            readonly code: true;
            readonly name: true;
        };
    };
    readonly lastLat: true;
    readonly lastLng: true;
    readonly lastLocationAt: true;
    readonly lastSpeedKph: true;
    readonly lastHeading: true;
    readonly lastBatteryPct: true;
    readonly notes: true;
    readonly editsCount: true;
    readonly createdAt: true;
    readonly _count: {
        readonly select: {
            readonly crew: true;
        };
    };
};
export type MobileUnitDetailResponse = Prisma.MobileUnitGetPayload<{
    select: typeof mobileUnitDetailSelect;
}>;
export declare const mobileUnitActivitySelect: {
    readonly id: true;
    readonly type: true;
    readonly body: true;
    readonly metadata: true;
    readonly createdAt: true;
    readonly author: {
        readonly select: {
            readonly id: true;
            readonly name: true;
            readonly image: true;
        };
    };
};
export type MobileUnitActivityResponse = Prisma.MobileUnitActivityGetPayload<{
    select: typeof mobileUnitActivitySelect;
}>;
/**
 * [MC2.1] أجهزة المركبة. `tokenHash` **غير موجود هنا عمدًا** — لا يخرج من قاعدة البيانات
 * إلى أي استجابة، ولو للمسؤول. المعروض هو البادئة فقط للتمييز بين جهازين.
 */
export declare const mobileUnitDeviceSelect: {
    readonly id: true;
    readonly label: true;
    readonly tokenPrefix: true;
    readonly platform: true;
    readonly appVersion: true;
    readonly lastSeenAt: true;
    readonly pairedAt: true;
    readonly revokedAt: true;
    readonly createdBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
    readonly revokedBy: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type MobileUnitDeviceResponse = Prisma.MobileUnitDeviceGetPayload<{
    select: typeof mobileUnitDeviceSelect;
}>;
/**
 * استجابة الاقتران — المرّة **الوحيدة** التي يغادر فيها الرمز الخام الخادم. لا يُخزَّن
 * ولا يُسترجع؛ فقدانه يعني إبطال الجهاز وإصدار رمز جديد.
 */
export type PairedDeviceResponse = MobileUnitDeviceResponse & {
    token: string;
};
/**
 * [O4] ما يعود من نقطة الاقتران فعليًّا: استجابة الاقتران نفسها مضافًا إليها صورة QR
 * جاهزة للعرض (data URI). الصورة تُولَّد في وحدة التحكّم لا في الـ DAO — الـ DAO
 * استعلامات Prisma فقط — ولا تُخزَّن، تمامًا كالرمز الخام الذي ترمّزه.
 */
export type PairedDeviceWithQrResponse = PairedDeviceResponse & {
    qrDataUri: string;
};
export declare const pairDeviceSchema: z.ZodObject<{
    label: z.ZodString;
}, z.core.$strip>;
export type PairDeviceFormInput = z.infer<typeof pairDeviceSchema>;
/** الموظّفون المؤهّلون للانضمام إلى طاقم مركبة — انظر `listEligibleStaff` في الـ DAO. */
export declare const eligibleStaffSelect: {
    readonly id: true;
    readonly name: true;
    readonly avatar: true;
    readonly phone: true;
    readonly prefix: true;
    readonly branchId: true;
    readonly role: {
        readonly select: {
            readonly id: true;
            readonly name: true;
        };
    };
};
export type EligibleStaffResponse = Prisma.StaffGetPayload<{
    select: typeof eligibleStaffSelect;
}>;
export declare const createMobileUnitSchema: z.ZodObject<{
    name: z.ZodString;
    branchId: z.ZodString;
    plateNumber: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    vehicleMake: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    vehicleModel: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    year: z.ZodPreprocess<z.ZodOptional<z.ZodCoercedNumber<unknown>>, unknown>;
    color: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
    notes: z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>;
}, z.core.$strip>;
export type CreateMobileUnitFormInput = z.infer<typeof createMobileUnitSchema>;
export declare const updateMobileUnitSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    year: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodCoercedNumber<unknown>>, unknown>>;
    notes: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
    color: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
    plateNumber: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
    vehicleMake: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
    vehicleModel: z.ZodOptional<z.ZodPreprocess<z.ZodOptional<z.ZodString>, unknown>>;
}, z.core.$strip>;
export type UpdateMobileUnitFormInput = z.infer<typeof updateMobileUnitSchema>;
export declare const addCrewMemberSchema: z.ZodObject<{
    staffId: z.ZodString;
    role: z.ZodEnum<{
        readonly DRIVER: "DRIVER";
        readonly VET: "VET";
        readonly TECHNICIAN: "TECHNICIAN";
        readonly GROOMER: "GROOMER";
        readonly ASSISTANT: "ASSISTANT";
    }>;
    isPrimary: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, z.core.$strip>;
export type AddCrewMemberFormInput = z.infer<typeof addCrewMemberSchema>;

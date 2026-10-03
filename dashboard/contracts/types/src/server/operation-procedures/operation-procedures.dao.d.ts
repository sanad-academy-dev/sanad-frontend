import { OperationTier } from "@/generated/prisma/enums";
import { type ChecklistTemplateResponse, type OperationProcedureTemplateResponse, type UpsertOperationDefinitionInput } from "@/server/operation-procedures/operation-procedures.type";
export declare const operationProceduresDao: {
    /** كل قوالب الإجراءات: دورات ITEM تحت فئة «العمليات الجراحية» + تعريفاتها + السعر/المدة */
    listTemplates(clinicId: string): Promise<OperationProcedureTemplateResponse[]>;
    findByService(clinicId: string, serviceId: string): Promise<{
        id: string;
        clinicId: string;
        active: boolean;
        serviceId: string;
        defaultTier: OperationTier;
        defaultAnesthesia: import("@/generated/prisma/enums").SedationLevel;
        defaultWoundClass: import("@/generated/prisma/enums").WoundClass | null;
        requiresLaterality: boolean;
        bodySystem: string | null;
        codes: import("@prisma/client/runtime/client").JsonValue;
        specializationId: string | null;
        prepNotes: string | null;
        kitItems: {
            inventoryItem: {
                name: string;
                code: string;
            };
            id: string;
            quantity: number;
            inventoryItemId: string;
        }[];
    } | null>;
    /** التعريف يُنشأ عند أول حفظ ثم يُحدَّث — upsert على (الأكاديمية، الدورة) */
    upsert(input: UpsertOperationDefinitionInput): Promise<{
        id: string;
        clinicId: string;
        active: boolean;
        serviceId: string;
        defaultTier: OperationTier;
        defaultAnesthesia: import("@/generated/prisma/enums").SedationLevel;
        defaultWoundClass: import("@/generated/prisma/enums").WoundClass | null;
        requiresLaterality: boolean;
        bodySystem: string | null;
        codes: import("@prisma/client/runtime/client").JsonValue;
        specializationId: string | null;
        prepNotes: string | null;
        kitItems: {
            inventoryItem: {
                name: string;
                code: string;
            };
            id: string;
            quantity: number;
            inventoryItemId: string;
        }[];
    }>;
    /** قوالب قوائم التحقق المتاحة للأكاديمية: قوالب النظام + قوالب الأكاديمية (قراءة في OP0) */
    listChecklistTemplates(clinicId: string): Promise<ChecklistTemplateResponse[]>;
    /**
     * حفظ نسخة أكاديمية من قالب قائمة تحقق (OP8): كل حفظ نسخة جديدة برقم أعلى،
     * والنسخ الأقدم تُعطَّل لا تُمحى — تشغيلات الحالات التقطت نسختها وقت
     * التنفيذ فلا يعيد التاريخ كتابة نفسه أبدًا (S1، S21).
     */
    saveChecklistTemplate(args: {
        clinicId: string;
        scope: "OPERATION_SIGN_IN" | "OPERATION_TIME_OUT" | "OPERATION_SIGN_OUT" | "OPERATION_MINOR_COMBINED";
        tier?: "MINOR" | "INTERMEDIATE" | "MAJOR" | null;
        nameAr: string;
        nameEn?: string | null;
        items: {
            textAr: string;
            textEn?: string | null;
            required?: boolean;
            responseType?: "CONFIRM" | "YES_NO_NA" | "TEXT" | "NUMBER";
        }[];
    }): Promise<ChecklistTemplateResponse>;
};

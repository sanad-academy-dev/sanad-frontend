import { type RadiologyExamTemplateResponse, type UpsertRadiologyDefinitionInput } from "@/server/radiology-exams/radiology-exams.type";
export declare const radiologyExamsDao: {
    /** كل قوالب الفحوصات: دورات ITEM تحت فئة "الأشعة" + تعريفاتها + السعر/المدة */
    listTemplates(clinicId: string): Promise<RadiologyExamTemplateResponse[]>;
    findByService(clinicId: string, serviceId: string): Promise<{
        id: string;
        clinicId: string;
        active: boolean;
        serviceId: string;
        modality: import("../../../generated/prisma/enums").RadiologyModality;
        bodyPart: string | null;
        prepNotes: string | null;
        defaultViews: string[];
        lateralityRequired: boolean;
        contrastDefault: boolean;
        sedationDefault: import("../../../generated/prisma/enums").SedationLevel;
    } | null>;
    /** التعريف يُنشأ عند أول حفظ ثم يُحدَّث — upsert على (الأكاديمية، الدورة) */
    upsert(input: UpsertRadiologyDefinitionInput): Promise<{
        id: string;
        clinicId: string;
        active: boolean;
        serviceId: string;
        modality: import("../../../generated/prisma/enums").RadiologyModality;
        bodyPart: string | null;
        prepNotes: string | null;
        defaultViews: string[];
        lateralityRequired: boolean;
        contrastDefault: boolean;
        sedationDefault: import("../../../generated/prisma/enums").SedationLevel;
    }>;
};

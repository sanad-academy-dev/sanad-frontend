import { type CreateLabParameterInput, type LabTestTemplateResponse } from "@/server/lab-test-parameters/lab-test-parameters.type";
export declare const labTestParametersDao: {
    /** كل قوالب التحاليل: دورات ITEM تحت فئة "التحاليل" + مُحلِّلاتها + السعر/المدة */
    listTemplates(clinicId: string): Promise<LabTestTemplateResponse[]>;
    listByService(clinicId: string, serviceId: string): Promise<{
        type: import("../../../generated/prisma/enums").LabParameterType;
        name: string;
        id: string;
        clinicId: string;
        order: number;
        active: boolean;
        serviceId: string;
        section: string | null;
        unit: string | null;
        refLow: import("@prisma/client-runtime-utils").Decimal | null;
        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
        editsCount: number;
    }[]>;
    create(input: CreateLabParameterInput): Promise<{
        type: import("../../../generated/prisma/enums").LabParameterType;
        name: string;
        id: string;
        clinicId: string;
        order: number;
        active: boolean;
        serviceId: string;
        section: string | null;
        unit: string | null;
        refLow: import("@prisma/client-runtime-utils").Decimal | null;
        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
        editsCount: number;
    }>;
    update(id: string, clinicId: string, data: Partial<Omit<CreateLabParameterInput, "clinicId" | "serviceId">>): Promise<{
        type: import("../../../generated/prisma/enums").LabParameterType;
        name: string;
        id: string;
        clinicId: string;
        order: number;
        active: boolean;
        serviceId: string;
        section: string | null;
        unit: string | null;
        refLow: import("@prisma/client-runtime-utils").Decimal | null;
        refHigh: import("@prisma/client-runtime-utils").Decimal | null;
        editsCount: number;
    } | null>;
    remove(id: string, clinicId: string): Promise<{
        id: string;
    } | null>;
};

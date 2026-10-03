import { type CompensatorySource } from "@/server/compensatory/compensatory.type";
type CreateCompensatoryInput = {
    staffId: string;
    minutes: number;
    source: CompensatorySource;
    reason?: string | null;
    date: string;
};
export declare const compensatoryDao: {
    create(clinicId: string, createdById: string, input: CreateCompensatoryInput): import("../../../generated/prisma/models").Prisma__CompensatoryEntryClient<{
        date: Date;
        id: string;
        createdAt: Date;
        reason: string | null;
        staffId: string;
        minutes: number;
        source: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../../../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    balanceMinutes(clinicId: string, staffId: string): Promise<number>;
    balance(clinicId: string, staffId: string): Promise<{
        minutes: number;
        days: number;
    }>;
    list(clinicId: string, staffId: string): import("../../../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        date: Date;
        id: string;
        createdAt: Date;
        reason: string | null;
        staffId: string;
        minutes: number;
        source: string;
    }[]>;
};
export {};

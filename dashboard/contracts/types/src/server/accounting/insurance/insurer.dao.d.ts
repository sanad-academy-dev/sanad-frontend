import { type InsurerFormInput, type InsurerResponse } from "@/server/accounting/insurance/insurer.type";
/**
 * [MI-P3] Insurer DAO (MI §8.1) — Prisma queries only. Soft-delete like Owner: deactivate
 * flips `active`; `isDeleted` stays for a future hard-hide and is filtered everywhere.
 * The MI-P0 party branch (`party.dao.ts` → "Insurer") reads this same table, so an
 * insurer created here appears on «حسابات الأطراف» with zero extra wiring.
 */
export declare const insurerDao: {
    list(clinicId: string): Promise<InsurerResponse[]>;
    find(clinicId: string, id: string): Promise<InsurerResponse | null>;
    create(clinicId: string, input: InsurerFormInput): Promise<InsurerResponse>;
    update(clinicId: string, id: string, input: InsurerFormInput): Promise<InsurerResponse>;
    /** التعطيل لا الحذف — الشركة تبقى على البوالص والمطالبات القائمة */
    setActive(clinicId: string, id: string, active: boolean): Promise<InsurerResponse>;
};

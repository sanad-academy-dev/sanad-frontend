import type { Prisma } from "@/generated/prisma/client";
import { DocStatus } from "@/generated/prisma/enums";
import { type VoucherActor, type VoucherConfig } from "@/server/accounting/voucher/voucher.service";
/**
 * [P0.2] Reference implementation of the voucher lifecycle on the `voucher_demo` table.
 * It is the smoke-test target for create→submit→cancel→amend and the template real
 * vouchers (Journal Entry in P2, …) follow when they wire their own {@link VoucherConfig}.
 */
export declare const voucherDemoSelect: {
    readonly id: true;
    readonly clinicId: true;
    readonly documentNo: true;
    readonly docstatus: true;
    readonly postingDate: true;
    readonly amendedFromId: true;
    readonly title: true;
    readonly amount: true;
    readonly createdById: true;
    readonly submittedAt: true;
    readonly submittedById: true;
    readonly cancelledAt: true;
    readonly cancelledById: true;
    readonly createdAt: true;
    readonly updatedAt: true;
};
export type VoucherDemoRecord = Prisma.VoucherDemoGetPayload<{
    select: typeof voucherDemoSelect;
}>;
/** Fields editable after submit on the demo voucher (BRD AR-1 whitelist). */
export declare const VOUCHER_DEMO_UPDATABLE_AFTER_SUBMIT: readonly ["title"];
export declare const demoVoucherConfig: VoucherConfig<VoucherDemoRecord>;
export type CreateDemoVoucherInput = Pick<Prisma.VoucherDemoUncheckedCreateInput, "clinicId" | "title" | "amount" | "postingDate"> & Partial<Pick<Prisma.VoucherDemoUncheckedCreateInput, "createdById">>;
/** Create a Draft demo voucher (no ledger impact, no number yet). */
export declare function createDemoVoucher(data: CreateDemoVoucherInput): Prisma.Prisma__VoucherDemoClient<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    amount: import("@prisma/client-runtime-utils").Decimal;
    documentNo: string | null;
}, never, import("@prisma/client/runtime/client").DefaultArgs, {
    omit: Prisma.GlobalOmitConfig | undefined;
}>;
export declare const submitDemoVoucher: (id: string, actor: VoucherActor) => Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    amount: import("@prisma/client-runtime-utils").Decimal;
    documentNo: string | null;
}>;
export declare const cancelDemoVoucher: (id: string, actor: VoucherActor) => Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    amount: import("@prisma/client-runtime-utils").Decimal;
    documentNo: string | null;
}>;
export declare const amendDemoVoucher: (id: string, actor: VoucherActor) => Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    amount: import("@prisma/client-runtime-utils").Decimal;
    documentNo: string | null;
}>;
/** Editable fields on the demo voucher (title always; amount only while Draft). */
export type UpdateDemoVoucherInput = {
    title?: string;
    amount?: string;
};
export declare const updateDemoVoucher: (id: string, changes: UpdateDemoVoucherInput, actor: VoucherActor) => Promise<{
    id: string;
    clinicId: string;
    createdById: string | null;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    docstatus: DocStatus;
    amendedFromId: string | null;
    submittedAt: Date | null;
    submittedById: string | null;
    cancelledAt: Date | null;
    cancelledById: string | null;
    postingDate: Date;
    amount: import("@prisma/client-runtime-utils").Decimal;
    documentNo: string | null;
}>;

import type { ListVoucherDemoFilter, VoucherDemoRecord } from "@/server/accounting/voucher-demo/voucher-demo.type";
/**
 * [P0.2 UI] Read queries for the demo voucher. Writes deliberately live in the lifecycle
 * service (`voucher/voucher.demo.ts`) — a DAO that could flip `docstatus` on its own would
 * be a way around the AR-1 state machine and the permission gate.
 */
export declare const voucherDemoDao: {
    list(clinicId: string, filter?: ListVoucherDemoFilter): Promise<VoucherDemoRecord[]>;
    findById(clinicId: string, id: string): Promise<VoucherDemoRecord | null>;
};

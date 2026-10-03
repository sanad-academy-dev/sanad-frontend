import { type CreatePurchaseOrderFormInput, type ItemPurchaseOrderResponse, type PurchaseOrderResponse, type ReceivePurchaseOrderFormInput } from "@/server/purchasing/purchasing.type";
export declare const purchasingDao: {
    list(clinicId: string): Promise<PurchaseOrderResponse[]>;
    findById(id: string, clinicId: string): Promise<PurchaseOrderResponse | null>;
    listByItem(itemId: string, clinicId: string): Promise<ItemPurchaseOrderResponse[]>;
    create(clinicId: string, input: CreatePurchaseOrderFormInput, createdById?: string | null): Promise<PurchaseOrderResponse>;
    /** استلام كميات (قد تكون جزئية) → حركات RECEIPT في مستودع الأمر + تحديث الحالة */
    receive(id: string, clinicId: string, input: ReceivePurchaseOrderFormInput, createdById?: string | null): Promise<PurchaseOrderResponse>;
    cancel(id: string, clinicId: string): Promise<PurchaseOrderResponse>;
};

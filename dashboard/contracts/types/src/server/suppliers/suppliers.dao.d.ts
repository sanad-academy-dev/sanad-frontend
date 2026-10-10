import { type CreateSupplierInput, type ItemSupplierResponse, type SupplierResponse } from "@/server/suppliers/suppliers.type";
export declare const suppliersDao: {
    list(clinicId: string): Promise<SupplierResponse[]>;
    findById(id: string, clinicId: string): Promise<SupplierResponse | null>;
    listByItem(itemId: string, clinicId: string): Promise<ItemSupplierResponse[]>;
    create(input: CreateSupplierInput): Promise<SupplierResponse>;
};

import { type CreateInventoryInput, type InventoryAlertResponse, type InventoryResponse, type ProductActivityEntry, type UpdateInventoryInput } from "@/server/inventory/inventory.type";
export declare const inventoryDao: {
    lowStock(clinicId: string): Promise<InventoryAlertResponse[]>;
    list(clinicId: string): Promise<InventoryResponse[]>;
    findById(id: string, clinicId: string): Promise<InventoryResponse | null>;
    create(input: CreateInventoryInput): Promise<InventoryResponse>;
    update(id: string, clinicId: string, data: UpdateInventoryInput): Promise<InventoryResponse | null>;
    disable(id: string, clinicId: string): Promise<InventoryResponse | null>;
    softDelete(id: string, clinicId: string): Promise<boolean>;
    activity(itemId: string, clinicId: string): Promise<ProductActivityEntry[]>;
};

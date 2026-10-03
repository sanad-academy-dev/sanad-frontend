import { type CreateMovementFormInput, type CreateTransferFormInput, type CreateWarehouseFormInput, type LedgerFilters, type ReconcileFormInput, type StockAgeingReport, type StockBatchResponse, type StockBinResponse, type StockLedgerResponse, type StockOverview, type UpdateWarehouseFormInput, type ValuationReport, type WarehouseResponse } from "@/server/stock/stock.type";
export declare const stockDao: {
    /** سجل الحركات مع فلترة اختيارية (المنتج/المستودع/النوع/الفترة) — الأحدث أولًا */
    ledger(clinicId: string, filters?: LedgerFilters): Promise<StockLedgerResponse[]>;
    /** أعمار المخزون (Stock Ageing): يُعيد بناء أعمار الكمية الحالية من الدفتر بطريقة FIFO */
    ageingReport(clinicId: string): Promise<StockAgeingReport>;
    listWarehouses(clinicId: string): Promise<WarehouseResponse[]>;
    createWarehouse(clinicId: string, input: CreateWarehouseFormInput): Promise<WarehouseResponse>;
    updateWarehouse(id: string, clinicId: string, data: UpdateWarehouseFormInput): Promise<WarehouseResponse | null>;
    disableWarehouse(id: string, clinicId: string): Promise<{
        success: true;
    }>;
    /** أرصدة منتج عبر كل المستودعات */
    binsForItem(itemId: string, clinicId: string): Promise<StockBinResponse[]>;
    /** أرصدة مستودع محدّد */
    binsForWarehouse(warehouseId: string, clinicId: string): Promise<StockBinResponse[]>;
    /** ملخّص لوحة المخزون: بطاقات حيّة + أعداد التنبيهات */
    overview(clinicId: string): Promise<StockOverview>;
    /** تقرير قيمة المخزون: قيمة كل صنف (الكمية × متوسط التكلفة) + الإجماليات */
    valuationReport(clinicId: string): Promise<ValuationReport>;
    /** دُفعات الأكاديمية (qty>0)؛ مع فلترة اختيارية بمنتج أو قرب الانتهاء (أيام) */
    listBatches(clinicId: string, opts?: {
        itemId?: string;
        expiringInDays?: number;
    }): Promise<StockBatchResponse[]>;
    /** إتلاف/صرف كمية من دفعة — حركة ISSUE مرتبطة بالدفعة */
    writeOffBatch(batchId: string, clinicId: string, qty: number, reason?: string | null, createdById?: string | null): Promise<{
        success: boolean;
    }>;
    /** استلام/صرف يدوي لمستودع واحد (حركة لكل سطر) */
    createMovement(clinicId: string, input: CreateMovementFormInput, createdById?: string | null): Promise<{
        success: boolean;
        voucherId: string;
    }>;
    /** جرد/تسوية: يقارن الكمية الفعلية بالدفترية ويسجّل حركة ADJUSTMENT لكل فرق */
    reconcile(clinicId: string, input: ReconcileFormInput, createdById?: string | null): Promise<{
        success: boolean;
        code: string;
        adjustments: number;
    }>;
    /** تحويل بين مستودعين (حركتان لكل سطر) */
    createTransfer(clinicId: string, input: CreateTransferFormInput, createdById?: string | null): Promise<{
        success: boolean;
        voucherId: string;
    }>;
};

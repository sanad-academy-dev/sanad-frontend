import type { Prisma } from "@/generated/prisma/client";
/**
 * [IP2] خصم المخزون عند إعطاء جرعة.
 *
 * ── لحظة الخصم ──────────────────────────────────────────────────────────────
 *
 * الخصم يقع لحظة **الإعطاء** لا لحظة السداد، على نمط مستهلكات العمليات لا نمط
 * منتجات الزيارة. السبب أنّ المُستهلَك مُستهلَك: أمبولةٌ دخلت وريد الطفل لا
 * تعود إلى الرفّ إن تعثّرت الفاتورة، وربطُ الخصم بالسداد يُبقي المخزون كاذبًا
 * طوال إقامةٍ قد تمتدّ أسبوعًا.
 *
 * ── الحارس ضدّ الخصم المزدوج ────────────────────────────────────────────────
 *
 * الصفّ يُخصم مرّة واحدة لأن حالته تصير GIVEN في المعاملة نفسها، والإعطاء لا
 * يُقبل إلا على صفّ PENDING. هذا هو نظير `AppointmentProduct.issuedAt` — الدرس
 * المكتوب في `dispense-billing.service.ts` بأن الخطر الحقيقي في هذا الملفّ هو
 * الخصم مرّتين.
 */
type Tx = Prisma.TransactionClient;
export type AdministrationStockInput = {
    clinicId: string;
    inventoryItemId: string;
    /** بوحدات المخزون — عدد صحيح موجب */
    quantity: number;
    batchId?: string | null;
    warehouseId?: string | null;
    /** صفّ الإعطاء — يصير `voucherId` على سطر الدفتر */
    administrationId: string;
    stayCode: string;
    patientId: string;
    patientName: string;
    performedById?: string | null;
    witnessId?: string | null;
    requireWitnessOnWaste: boolean;
};
export type AdministrationStockResult = {
    warehouseId: string;
    batchNoSnapshot: string | null;
    expiryDateSnapshot: Date | null;
    priceSnapshot: Prisma.Decimal | null;
};
/**
 * يخصم كمّية جرعة من المخزون ويُرجع اللقطات التي تُكتب على صفّ الإعطاء.
 *
 * يُستدعى داخل معاملة الإعطاء نفسها — لا خارجها: صفٌّ يُعلَّم «أُعطي» ومخزونٌ لم
 * يُخصم (أو العكس) خللٌ لا يُكتشف إلا في الجرد بعد شهر.
 */
export declare function issueAdministrationStock(tx: Tx, input: AdministrationStockInput): Promise<AdministrationStockResult>;
/**
 * هل هذا الصنف مادّة مراقَبة؟ تُقرأ قبل فتح نافذة الإعطاء كي تُظهر الواجهة حقل
 * الشاهد سلفًا بدل أن تُفشل الحفظ بعد أن يملأ الممرّض النموذج.
 */
export declare function administrationRequiresWitness(tx: Tx, clinicId: string, inventoryItemId: string | null | undefined): Promise<boolean>;
export {};

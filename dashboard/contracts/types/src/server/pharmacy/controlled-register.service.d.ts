import type { Prisma } from "@/generated/prisma/client";
import type { ControlledMovementType } from "@/generated/prisma/enums";
/**
 * [PH4.2] سجل المواد المراقبة — BRD_Pharmacy_Module.md §8.
 *
 * **إلحاقيّ بحت.** لا تُصدَّر من هذا الملفّ دالّة تعديل ولا دالّة حذف، وهذا ليس سهوًا:
 * التصحيح صفٌّ معاكس (`ADJUSTMENT`) بسبب مسجَّل. سجلٌّ يمكن تعديله ليس سجل عهدة.
 *
 * **حالة O-PH-1**: ما يجعل مادةً «مراقبة» هنا هو وسمُ الأكاديمية نفسها
 * (`ControlledSource.CLINIC`) لا جدول جدولة رقابي — لأن `legalStatus` في الكتالوج
 * لا يحمل الجدولة (صفّان من ١٣٦٥، BRD §2.3). فهذا السجل **صحيح كأثر عهدة، وغير
 * مطابِق للجهة الرقابية بعد**، والفرق مسجَّل في العمود `source` نفسه.
 */
type Tx = Prisma.TransactionClient;
/** هل هذا الصنف مُعلَّم مادةً مراقبة في هذه الأكاديمية؟ */
export declare function isControlled(tx: Tx, clinicId: string, inventoryItemId: string): Promise<boolean>;
/** الرصيد الجاري = آخر صفّ موقَّع، لا مجموع محسوب في كل قراءة */
export declare function currentBalance(tx: Tx, clinicId: string, inventoryItemId: string): Promise<number>;
export type RegisterEntryInput = {
    clinicId: string;
    inventoryItemId: string;
    movementType: ControlledMovementType;
    /** موجب للإدخال وسالب للإخراج — التوقيع في الرقم لا في نوع الحركة */
    quantity: number;
    dispenseEventId?: string | null;
    patientId?: string | null;
    prescriberId?: string | null;
    performedById: string | null;
    witnessId?: string | null;
    reasonAr?: string | null;
    occurredAt?: Date;
};
/**
 * يُلحِق صفًّا بالسجل داخل معاملة قائمة.
 *
 * الشاهد إلزامي على الإتلاف ويجب أن يختلف عن المنفِّذ (§8.3): شاهدٌ هو نفسه المنفِّذ
 * ليس شاهدًا، وقبولُه يجعل الحقل زينةً تُرضي مدقّقًا ولا تمنع شيئًا.
 */
export declare function appendRegisterEntry(tx: Prisma.TransactionClient, input: RegisterEntryInput, options: {
    requireWitnessOnWaste: boolean;
}): Promise<{
    id: string;
    recordedAt: Date;
    quantity: number;
    occurredAt: Date;
    movementType: ControlledMovementType;
    balanceAfter: number;
}>;
/** كشف الحركة والرصيد لصنف — أساس تقرير §12.4 */
export declare function registerLedger(clinicId: string, inventoryItemId: string, range?: {
    from?: Date;
    to?: Date;
}): Promise<{
    patient: {
        name: string;
        id: string;
    } | null;
    id: string;
    witness: {
        name: string;
        id: string;
    } | null;
    recordedAt: Date;
    quantity: number;
    performedBy: {
        name: string;
        id: string;
    } | null;
    occurredAt: Date;
    movementType: ControlledMovementType;
    balanceAfter: number;
    reasonAr: string | null;
}[]>;
export {};

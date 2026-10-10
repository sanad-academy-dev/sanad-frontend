/**
 * [PH17] إتلاف دفعة بشاهد أو أكثر.
 *
 * الإتلاف واقعة تُراجَع لاحقًا، فتُوثَّق صفًّا مستقلًّا (`batch_disposal`) بمنفّذها
 * وشهودها — مستخدمين حقيقيّين في الأكاديمية — لا ملاحظةً على حركة مخزون. والحركة نفسها
 * تُكتب في الدفتر بـ`voucherId` يشير إلى صفّ الإتلاف. مادةٌ مراقبة تُقيَّد في سجل
 * العهدة أيضًا داخل المعاملة نفسها (الشاهد الأول يُسجَّل فيه؛ البقيّة على صفّ الإتلاف).
 *
 * قواعد الشهود: واحد على الأقل، لا يكرَّر، ليس المنفّذ نفسه، وكلٌّ منهم عضو في الأكاديمية.
 */
export declare function disposeBatch(input: {
    clinicId: string;
    batchId: string;
    qty: number;
    reasonAr: string;
    performedById: string;
    witnessIds: string[];
    requireWitnessOnWaste: boolean;
}): Promise<{
    id: string;
    createdAt: Date;
    item: {
        name: string;
    };
    qty: number;
    performedBy: {
        name: string;
        id: string;
    } | null;
    batch: {
        batchNo: string;
    };
    reasonAr: string;
    witnesses: {
        user: {
            name: string;
            id: string;
        };
    }[];
}>;
export declare const disposalSelect: {
    id: true;
    qty: true;
    reasonAr: true;
    createdAt: true;
    batch: {
        select: {
            batchNo: true;
        };
    };
    item: {
        select: {
            name: true;
        };
    };
    performedBy: {
        select: {
            id: true;
            name: true;
        };
    };
    witnesses: {
        select: {
            user: {
                select: {
                    id: true;
                    name: true;
                };
            };
        };
    };
};
/** الدفعات المنتهية التي ما زال لها رصيد — هي ما يجب إتلافه */
export declare function listExpiredBatches(clinicId: string): Promise<{
    warehouse: {
        name: string;
    };
    id: string;
    item: {
        controlledSubstance: {
            id: string;
        }[];
        name: string;
        id: string;
    };
    qty: number;
    expiryDate: Date | null;
    batchNo: string;
}[]>;
/** أعضاء الأكاديمية الصالحون شهودًا */
export declare function listWitnessCandidates(clinicId: string): Promise<{
    name: string;
    id: string;
}[]>;

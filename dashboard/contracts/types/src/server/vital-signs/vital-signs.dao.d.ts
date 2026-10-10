import { type CreateVitalSignsInput, type UpdateVitalSignsInput, type VitalSignsRecordResponse, type VitalsAttachTarget, type VitalsDaoError } from "@/server/vital-signs/vital-signs.type";
export declare const vitalSignsDao: {
    list(clinicId: string, patientId: string, opts?: {
        limit?: number;
        offset?: number;
    }): Promise<{
        rows: VitalSignsRecordResponse[];
        total: number;
    }>;
    /**
     * آخر قياس صالح للاقتراح في مستند جديد. السجلات المُصحَّحة مستبعدة — التصحيح
     * نفسه هو الأحدث، واقتراح الأصل يعيد قيمة عُرف أنها خاطئة.
     */
    latest(clinicId: string, patientId: string): Promise<VitalSignsRecordResponse | null>;
    findById(id: string, clinicId: string): Promise<VitalSignsRecordResponse | null>;
    create(input: CreateVitalSignsInput, attachTo?: VitalsAttachTarget): Promise<VitalSignsRecordResponse | VitalsDaoError>;
    /**
     * تعديل سجل. السجل المرتبط بمستند لا يُكتب فوقه أبدًا — يُنشأ سجل تصحيح يشير
     * إليه، فيبقى ما رآه المستند وقت الربط كما هو (§4). التعديل المتكرّر يتبع
     * سلسلة التصحيح إلى طرفها، فالتصحيح غير المرتبط يُعدَّل في مكانه.
     */
    update(id: string, clinicId: string, data: UpdateVitalSignsInput, editedById: string | null): Promise<VitalSignsRecordResponse | VitalsDaoError>;
    /** الحذف الناعم مرفوض للسجلات المرتبطة — المستند يفقد لقطته وإلا */
    softDelete(id: string, clinicId: string): Promise<VitalSignsRecordResponse | VitalsDaoError>;
    /**
     * ربط سجل قائم بمستند. تستدعيه متحكّمات الزيارة/التحاليل/الأشعة بعد أن تتحقّق
     * من أن المستند ما زال قابلًا للتحرير — تجميد الربط سياسة كل وحدة لا سياسة هنا.
     */
    attach(target: VitalsAttachTarget, recordId: string, clinicId: string): Promise<"ok" | VitalsDaoError>;
};

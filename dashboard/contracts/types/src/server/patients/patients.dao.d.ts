import type { CreatePatientInput, PatientActivityResponse, PatientHistoryEntry, PatientResponse, UpdatePatientInput } from "@/server/patients/patients.type";
export declare const patientsDao: {
    list(clinicId: string): Promise<PatientResponse[]>;
    listByOwner(ownerId: string, clinicId: string): Promise<PatientResponse[]>;
    findById(id: string, clinicId: string): Promise<PatientResponse | null>;
    create(input: CreatePatientInput): Promise<PatientResponse>;
    update(id: string, clinicId: string, data: UpdatePatientInput): Promise<PatientResponse | null>;
    transferOwnership(id: string, clinicId: string, input: {
        ownerId: string;
        comment?: string;
    }, authorUserId: string): Promise<PatientResponse | "not-found" | "owner-not-found" | "duplicate-name">;
    listActivity(patientId: string, clinicId: string): Promise<PatientActivityResponse[] | null>;
    /**
     * الخط الزمني الموحّد لكل ما أُجري للطفل — زيارات وتحاليل وأشعة وقياسات
     * واشتراكات خطط. المصادر تُجلب متوازيةً ثم تُدمج وتُرتَّب في الذاكرة: لا
     * جدول واحد يجمعها في القاعدة، وكل استعلام منها يمرّ على فهرس
     * `[patientId, ...]` القائم، فالدمج أرخص من جدول أحداث موازٍ يحتاج مزامنة.
     *
     * التصفية بالنوع والتصفّح يقعان على العميل: السجل الطبي لطفل واحد يُقرأ
     * كاملًا في العادة، وتقسيمه على الخادم يعني خمسة مؤشرات صفحات لا واحدًا.
     */
    listHistory(patientId: string, clinicId: string): Promise<PatientHistoryEntry[] | null>;
    softDelete(id: string, clinicId: string): Promise<boolean>;
};

import { type ClinicalNoteResponse, type CreateClinicalNoteFormInput, type ExamBlock, type ExamTemplateResponse, type UpdateClinicalNoteFormInput, type UpsertExamTemplateFormInput } from "@/server/clinical-notes/clinical-notes.type";
/**
 * [S2] استعلامات السجل السريري — Prisma فقط، والمنطق في الخدمتين الصرفتين المجاورتين.
 *
 * حارس §5 يعيش هنا لا في المتحكّم: `finalize` و`update` و`addendum` كلّها تقرأ الحالة
 * وتكتب في **معاملة واحدة**، فلا نافذة بين القراءة والكتابة يمرّ منها تعديلٌ على
 * ملاحظة وُثِّقت لتوّها. الحارس في المتحكّم يقرأ ثم يكتب على اتصالين، وهو تحديدًا
 * الفرق بين قفلٍ وقواعد على ورق.
 */
/** نتائج الفشل — يترجمها المتحكّم إلى رموز HTTP ورسائل عربية */
export type NoteFailure = "not-found" | "patient-not-found" | "appointment-not-found" | "template-not-found" | "already-final" | "not-final" | "not-author" | "missing-required";
export declare const clinicalNotesDao: {
    /**
     * قوالب الأكاديمية وقوالب النظام معًا. الترتيب النهائي يجري في محلّل القوالب
     * الصرف، فهذه الدالّة تجلب ولا تقرّر.
     */
    listTemplates(clinicId: string): Promise<ExamTemplateResponse[]>;
    findTemplate(id: string, clinicId: string): Promise<ExamTemplateResponse | null>;
    /**
     * أفضل قالب لزيارة. يجلب المُرشَّحين ثم يفوّض الترتيب للدالّة الصرفة.
     */
    resolveDefaultTemplate(clinicId: string, input: {
        presentingComplaint?: string | null;
        animalTypeId?: string | null;
        consultationTypeId?: string | null;
    }): Promise<ExamTemplateResponse | null>;
    /**
     * إنشاء قالب أكاديمية، أو إصدارٌ جديد منه.
     *
     * **لا تعديل في مكانه لقالبٍ له ملاحظات.** معرّفات الكتل هي مفاتيح `answers`،
     * فتحرير قالبٍ مستعمَل ييتّم إجاباتٍ مخزّنة. الإصدار الجديد يترك القديم مثبَّتًا
     * على ملاحظاته — وهي قاعدة `ConsentTemplate` نفسها.
     */
    upsertTemplate(clinicId: string, input: Omit<UpsertExamTemplateFormInput, "blocks"> & {
        blocks: ExamBlock[];
    }): Promise<ExamTemplateResponse>;
    listByPatient(clinicId: string, patientId: string): Promise<ClinicalNoteResponse[]>;
    listByAppointment(clinicId: string, appointmentId: string): Promise<ClinicalNoteResponse[]>;
    findById(id: string, clinicId: string): Promise<ClinicalNoteResponse | null>;
    create(clinicId: string, authorUserId: string, input: CreateClinicalNoteFormInput): Promise<ClinicalNoteResponse | NoteFailure>;
    /**
     * تعديل مسوّدة. **المسوّدة وحدها** — الملاحظة الموثَّقة تُصحَّح بمُلحَق لا بكتابة
     * فوقها (§5). الفحص والكتابة في معاملة واحدة فلا سباق بينهما.
     */
    update(id: string, clinicId: string, input: UpdateClinicalNoteFormInput): Promise<ClinicalNoteResponse | NoteFailure>;
    /**
     * التوثيق — قفلٌ لا رجعة فيه، ومُتماثل: توثيقٌ ثانٍ يعيد الملاحظة كما هي ولا
     * يكتب `finalizedAt` جديدًا. المُهِمّ أن التاريخ الأصلي لا يتحرّك.
     */
    finalize(id: string, clinicId: string, userId: string): Promise<ClinicalNoteResponse | NoteFailure | {
        missing: {
            id: string;
            labelAr: string;
        }[];
    }>;
    /**
     * المُلحَق — الطريق الوحيد لتغيير شيء بعد التوثيق. يُرفض على المسوّدة: هناك
     * لا يزال النصّ نفسه قابلًا للتعديل، ومُلحَقٌ على مسوّدة يوهم بسجلّ تدقيق لا وجود له.
     */
    addAddendum(id: string, clinicId: string, userId: string, isSuperAdmin: boolean, text: string): Promise<ClinicalNoteResponse | NoteFailure>;
    /**
     * بوّابة «تمت» للزيارة (القرار §11-D): ملاحظةٌ موثَّقة واحدة على الأقل.
     * `AMENDED` تُحتسب — التصحيح بعد التوثيق لا يُعيد الزيارة غيرَ مكتملة.
     */
    hasFinalNote(clinicId: string, appointmentId: string): Promise<boolean>;
};

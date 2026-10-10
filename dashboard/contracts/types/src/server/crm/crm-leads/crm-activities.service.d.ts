import type { CrmReferenceType } from "@/generated/prisma/enums";
import { type CrmCommentFormInput, type CrmNoteFormInput, type CrmTaskFormInput, type CrmTaskUpdateFormInput } from "@/server/crm/crm-leads/crm-leads.type";
/**
 * [CRM-P1] أنشطة §8.2 المرتبطة بعميل محتمل. النمط متعدد الأشكال (§8.1): كل صف يحمل
 * (referenceType, referenceId)، فيخدم الجدولُ نفسه الصفقات في CRM-P2 بلا هجرة ثانية.
 *
 * المهام هنا **ليست** `Task` الأكاديمية العامة: تلك مهامّ تشغيلية للفريق، وهذه مربوطة
 * بمسار بيع. دمجهما كان سيخلط لوحتَي عملٍ مختلفتَين في قائمة واحدة.
 */
/**
 * [CRM-P2] §8.1 — المرجع الذي يُعلَّق عليه النشاط. صار معاملًا صريحًا بدل «معرّف عميل
 * محتمل» المضمر، لأن الصفقة تشارك الجداول نفسها؛ وتمرير النوع يجعل المُنادي يقرّره
 * بدل أن يخمّنه هذا الملف.
 */
export type CrmReference = {
    type: CrmReferenceType;
    id: string;
};
export declare function addNote(clinicId: string, reference: CrmReference, input: CrmNoteFormInput, actorUserId: string): Promise<{
    id: string;
    createdAt: Date;
    title: string | null;
    content: string;
    authorUserId: string | null;
    author: {
        name: string;
        id: string;
    } | null;
}>;
export declare function addTask(clinicId: string, reference: CrmReference, input: CrmTaskFormInput, actorUserId: string): Promise<{
    priority: import("@/generated/prisma/enums").CrmTaskPriority;
    id: string;
    createdAt: Date;
    description: string | null;
    title: string;
    status: import("@/generated/prisma/enums").CrmTaskStatus;
    referenceId: string;
    assignedTo: {
        name: string;
        id: string;
    } | null;
    dueAt: Date | null;
    assignedToUserId: string | null;
}>;
export declare function updateTask(clinicId: string, taskId: string, input: CrmTaskUpdateFormInput, actorUserId: string): Promise<{
    priority: import("@/generated/prisma/enums").CrmTaskPriority;
    id: string;
    createdAt: Date;
    description: string | null;
    title: string;
    status: import("@/generated/prisma/enums").CrmTaskStatus;
    referenceId: string;
    assignedTo: {
        name: string;
        id: string;
    } | null;
    dueAt: Date | null;
    assignedToUserId: string | null;
}>;
export declare function addComment(clinicId: string, reference: CrmReference, input: CrmCommentFormInput, actorUserId: string): Promise<{
    id: string;
    createdAt: Date;
    content: string;
    authorUserId: string | null;
    author: {
        name: string;
        id: string;
    } | null;
    mentionedUserIds: string[];
}>;
/** §8.4 — الحذف ناعم؛ النشاط يختفي من الخيط ولا يُمحى. */
export declare const softDeleteActivity: {
    readonly note: (clinicId: string, id: string) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<import("../../../../generated/prisma/internal/prismaNamespace").BatchPayload>;
    readonly task: (clinicId: string, id: string) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<import("../../../../generated/prisma/internal/prismaNamespace").BatchPayload>;
    readonly comment: (clinicId: string, id: string) => import("../../../../generated/prisma/internal/prismaNamespace").PrismaPromise<import("../../../../generated/prisma/internal/prismaNamespace").BatchPayload>;
};
/**
 * §8.4 — حذف العميل المحتمل يُخفي أنشطته معه. الحذف ناعم على الطرفين، فلا شيء يُفقَد؛
 * والغرض أن لا يظهر نشاطٌ يتيم في أي خيطٍ زمني لاحق.
 */
export declare function softDeleteLeadCascade(clinicId: string, leadId: string): Promise<void>;
/** المهمة متأخّرة اشتقاقًا عند القراءة (لا وظيفة يومية في هذه المرحلة — قرار §17). */
export declare const isOverdue: (dueAt: Date | null, status: string, now: Date) => boolean;

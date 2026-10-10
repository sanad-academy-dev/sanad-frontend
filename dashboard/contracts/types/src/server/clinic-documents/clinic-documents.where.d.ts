import type { Prisma } from "@/generated/prisma/client";
import type { ClinicDocumentCategory, DocumentKind } from "@/generated/prisma/enums";
import { type ExpiryFilter } from "@/server/clinic-documents/clinic-documents.type";
/**
 * نطاق القراءة: `null` = كل مستندات الأكاديمية (مدير أو documents.view_full)، وقيمة =
 * مستندات هذا الفرع + المستندات العامّة فقط (documents.view_limited).
 */
export type BranchScope = {
    branchId: string | null;
} | null;
export type ListClinicDocumentsFilters = {
    category?: ClinicDocumentCategory;
    branchId?: string;
    expiry?: ExpiryFilter;
    search?: string;
    kind?: DocumentKind;
};
export declare const utcToday: () => Date;
export declare const expirySoonCutoff: (today: Date) => Date;
/** يترجم نطاق الفرع إلى شرط Prisma: الفرع نفسه أو المستندات العامّة. */
export declare const branchWhere: (scope: BranchScope) => Prisma.ClinicDocumentWhereInput;
/** يترجم فلتر الصلاحية إلى شرط تاريخ. «سارية» تشمل ما لا تاريخ انتهاء له. */
export declare function expiryWhere(filter: ExpiryFilter | undefined): Prisma.ClinicDocumentWhereInput;
/**
 * شرط القائمة. الشروط تُجمَع في AND ولا تُدمَج بالنشر داخل كائن واحد: ثلاثة مصادر
 * منها قد تُصدِر مفتاح OR (نطاق الفرع، فلتر «سارية»، البحث) فيدهس المتأخّرُ السابقَ
 * بصمت. عمليًا كان بحثُ مستخدمٍ بصلاحية view_limited يُسقط قيد الفرع فيرى مستندات
 * الفروع كلّها — تسريب صلاحيات لا مجرّد نتائج زائدة.
 */
export declare function buildListWhere(clinicId: string, scope: BranchScope, filters?: ListClinicDocumentsFilters): Prisma.ClinicDocumentWhereInput;

import { Prisma } from "@/generated/prisma/client";
import type { CreateOwnerInput, OwnerResponse, UpdateOwnerInput } from "@/server/owners/owners.type";
export declare const ownersDao: {
    list(clinicId: string): Promise<OwnerResponse[]>;
    findById(id: string, clinicId: string): Promise<OwnerResponse | null>;
    /**
     * `tx` — العميل المُعامِلي للمُنادي، حين يكون إنشاء وليّ الأمر خطوةً داخل معاملةٍ أكبر
     * (مسار الفوز في CRM §7). Prisma لا تعشّش `$transaction`: النداء بلا هذا المعامل من
     * داخل معاملةٍ قائمة يفتح معاملةً مستقلّة تنجو من تراجع الأولى، فيبقى وليّ أمرٌ أُنشئ
     * لصفقةٍ لم تُكسَب. تمريره يجعل الإنشاء وما حوله ذرّةً واحدة.
     *
     * السلوك بلا `tx` لم يتغيّر حرفًا: نفس المعاملة، ونفس ترجمة P2002 العربية — وهي
     * المقصد من إعادة الاستعمال هنا بدل إدراجٍ مُوازٍ في وحدة الـ CRM.
     */
    create(input: CreateOwnerInput, tx?: Prisma.TransactionClient): Promise<OwnerResponse>;
    update(id: string, clinicId: string, data: UpdateOwnerInput): Promise<OwnerResponse | null>;
    disable(id: string, clinicId: string, newOwnerId?: string): Promise<OwnerResponse | null>;
    softDelete(id: string, clinicId: string, newOwnerId?: string): Promise<boolean>;
};

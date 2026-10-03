import { type ReminderCollector } from "@/server/reminders/collectors/collector.type";
/**
 * [RC5] جامع الفواتير المتأخّرة.
 *
 * ── لماذا `SalesInvoice` لا `Invoice` ────────────────────────────────────────
 *
 * فاتورة الأكاديمية (`Invoice`) **لا تاريخ استحقاق لها أصلًا**، ولا وليّ أمرًا مباشرًا —
 * وليّ الأمر يُبلَغ عبر الزيارة أو الطلب. فبناءُ «متأخّرة» عليها يعني اختراع تاريخ
 * استحقاق من `createdAt` زائد رقمٍ نؤلّفه، ثم مطالبةَ وليّ أمرٍ بمالٍ استنادًا إلى ذلك
 * الاختراع. وهذا خطٌّ لا يُعبَر.
 *
 * `SalesInvoice` تحمل `dueDate` حقيقيًّا من شروط الدفع (§4.9) و`outstandingAmount`
 * يُغذّيه دفتر الدفعات، وهي **نفس** الفواتير التي يقرؤها محرّك المطالبة
 * (`dunning.service.ts`). فالتذكير هنا يقول ما يقوله كشف الحساب حرفيًّا.
 *
 * والطرف `Owner` وحده: `Supplier` و`Staff` جهةُ دفعٍ لا تحصيل، و`Insurer` تُلاحَق
 * بمسار المطالبات لا برسالة واتساب لوليّ أمر.
 */
export declare const invoiceOverdueCollector: ReminderCollector;

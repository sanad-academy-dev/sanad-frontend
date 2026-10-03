import type { ProviderNotification, WhatsappProvider, WhatsappStatus } from "@/server/crm/crm-whatsapp/whatsapp-provider";
/** حالات المزوّد كما يوثّقها → تعدادنا. المجهول يُعامَل كـ`SENT` لا كفشل: تحديثٌ لا
 *  نفهمه لا يعني أنّ الرسالة لم تصل، وتحويله إلى FAILED كذبٌ في الاتجاه المخيف. */
export declare function toStatus(raw: string | undefined): WhatsappStatus;
/** يصنّف الإشعار الوارد. الشكل موثَّق وغير متحقَّق منه حيًّا. */
export declare function classifyNotification(raw: unknown): ProviderNotification | null;
export declare const greenApiProvider: WhatsappProvider;

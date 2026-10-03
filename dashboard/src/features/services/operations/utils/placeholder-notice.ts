import { toast } from "sonner";

// بعض الأدوات (قوائم التحقق، ورقة التخدير، التعليقات) تصل في مراحل قادمة
// (OP2/OP3) — الزر يعلن ذلك بدل أن يبدو معطوبًا
export const PLACEHOLDER_NOTICE = "هذه الأداة تصل في مرحلة قادمة من وحدة العمليات";

export const notifyPlaceholder = () => toast.info(PLACEHOLDER_NOTICE);

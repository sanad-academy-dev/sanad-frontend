import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ReminderTrigger = t.Union(
  [
    t.Literal("VACCINATION_DUE"),
    t.Literal("GROOMING_DUE"),
    t.Literal("NUTRITION_RECHECK_DUE"),
    t.Literal("APPOINTMENT_UPCOMING"),
    t.Literal("APPOINTMENT_NO_SHOW"),
    t.Literal("CARE_PLAN_VISIT_DUE"),
    t.Literal("INVOICE_OVERDUE"),
    t.Literal("MEMBERSHIP_RENEWAL"),
    t.Literal("POST_OP_FOLLOW_UP"),
  ],
  {
    additionalProperties: false,
    description: `سببُ التذكير. كلٌّ منها مربوطٌ بمحرّك استحقاق **قائم بالفعل** — لا يعيد أيٌّ
منها حساب موعدٍ من جديد، وهذا شرطٌ لا تفصيل: نسخةٌ ثانية من منطق الجدولة تختلف
عن الأولى حتمًا، فيصير التذكير يقول غير ما تقوله الشاشة.`,
  },
);

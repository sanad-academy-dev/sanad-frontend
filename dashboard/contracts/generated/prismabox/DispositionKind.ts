import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DispositionKind = t.Union(
  [
    t.Literal("DISCHARGED"),
    t.Literal("ADMITTED"),
    t.Literal("TO_SURGERY"),
    t.Literal("TRANSFERRED"),
    t.Literal("LEFT_AGAINST_ADVICE"),
    t.Literal("DIED"),
    t.Literal("EUTHANIZED"),
  ],
  {
    additionalProperties: false,
    description: `[E5] مآل حالة الطوارئ — القرار الذي يُقفل الحلقة ويسلّم إلى الوحدة التالية.
كل قيمة تسلّم إلى شيء قائم: الإدخال يكتب **طلب** تنويم (لا إسكانًا — الفصل الذي
اختارته وحدة التنويم بين قرار الطبيب وفعل العنبر)، والجراحة تفتح حالة عملية
بالإلحاح الموروث، والخروج يُكمل مسار الزيارة العادي إلى الدفع.`,
  },
);

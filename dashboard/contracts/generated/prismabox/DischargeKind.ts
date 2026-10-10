import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DischargeKind = t.Union(
  [
    t.Literal("ROUTINE"),
    t.Literal("AGAINST_MEDICAL_ADVICE"),
    t.Literal("TRANSFERRED"),
    t.Literal("DIED"),
    t.Literal("EUTHANIZED"),
  ],
  {
    additionalProperties: false,
    description: `طريقة انتهاء الإقامة. ليست تفصيلًا إحصائيًا: النافق والمُيسَّر موته يتجاوزان
بوابات الأوامر (لا معنى لطلب إيقاف مضادّ حيوي على حيوان نفق) ويستلزمان سببًا.`,
  },
);

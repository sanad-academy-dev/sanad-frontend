import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const MembershipStatus = t.Union(
  [
    t.Literal("PENDING_PAYMENT"),
    t.Literal("ACTIVE"),
    t.Literal("PAST_DUE"),
    t.Literal("LAPSED"),
    t.Literal("CANCELLED"),
    t.Literal("EXPIRED"),
  ],
  {
    additionalProperties: false,
    description: `§5.2 — CANCELLED وEXPIRED نهائيتان دومًا؛ LAPSED نهائية بعد انقضاء فترتها فقط
(قرار المالك MI-P1 س5: داخل الفترة تبقى غير نهائية لأنها قابلة للإحياء بالدفع).`,
  },
);

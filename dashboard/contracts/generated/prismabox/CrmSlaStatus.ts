import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmSlaStatus = t.Union(
  [t.Literal("DUE"), t.Literal("FULFILLED"), t.Literal("FAILED")],
  {
    additionalProperties: false,
    description: `[CRM-P2] §10.3 — حالة اتفاقية مستوى الخدمة. العمود يُشحن فارغًا الآن؛ المحرّك في CRM-P5.`,
  },
);

import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmSlaAppliesTo = t.Union(
  [t.Literal("LEAD"), t.Literal("DEAL"), t.Literal("BOTH")],
  {
    additionalProperties: false,
    description: `[CRM-P5] §10.1 — على أيّ كيانٍ تنطبق السياسة.`,
  },
);

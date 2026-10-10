import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const CrmDealProductItemType = t.Union(
  [t.Literal("SERVICE"), t.Literal("MEMBERSHIP_PLAN"), t.Literal("FREE_TEXT")],
  {
    additionalProperties: false,
    description: `[CRM-P2] §6.1 — نوع سطر المنتج في الصفقة.`,
  },
);

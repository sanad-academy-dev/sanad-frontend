import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LoyaltyLedgerSourceType = t.Union(
  [t.Literal("CLINIC_INVOICE"), t.Literal("POS_SALE"), t.Literal("MANUAL")],
  { additionalProperties: false, description: `[LY-P1] §9 — مصدر الحركة.` },
);

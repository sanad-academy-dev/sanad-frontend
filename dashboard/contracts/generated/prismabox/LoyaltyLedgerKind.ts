import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const LoyaltyLedgerKind = t.Union(
  [
    t.Literal("EARN"),
    t.Literal("REDEEM"),
    t.Literal("EXPIRY"),
    t.Literal("REVERSAL"),
    t.Literal("REDEMPTION_RESTORE"),
    t.Literal("ADJUSTMENT"),
  ],
  { additionalProperties: false, description: `[LY-P1] §9 — نوع حركة النقاط.` },
);

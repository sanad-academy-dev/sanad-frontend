import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ModeOfPaymentType = t.Union(
  [
    t.Literal("CASH"),
    t.Literal("BANK"),
    t.Literal("GENERAL"),
    t.Literal("PHONE"),
  ],
  { additionalProperties: false },
);

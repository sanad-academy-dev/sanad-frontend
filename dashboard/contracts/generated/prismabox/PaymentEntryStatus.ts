import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const PaymentEntryStatus = t.Union(
  [t.Literal("DRAFT"), t.Literal("SUBMITTED"), t.Literal("CANCELLED")],
  { additionalProperties: false },
);

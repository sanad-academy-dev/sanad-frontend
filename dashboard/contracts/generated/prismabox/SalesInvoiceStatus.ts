import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const SalesInvoiceStatus = t.Union(
  [
    t.Literal("DRAFT"),
    t.Literal("SUBMITTED"),
    t.Literal("UNPAID"),
    t.Literal("PAID"),
    t.Literal("PARTLY_PAID"),
    t.Literal("OVERDUE"),
    t.Literal("RETURN"),
    t.Literal("CREDIT_NOTE_ISSUED"),
    t.Literal("INTERNAL_TRANSFER"),
    t.Literal("CONSOLIDATED"),
    t.Literal("CANCELLED"),
  ],
  { additionalProperties: false },
);

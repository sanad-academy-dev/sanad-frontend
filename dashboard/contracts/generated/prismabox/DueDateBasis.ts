import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const DueDateBasis = t.Union(
  [
    t.Literal("DAYS_AFTER_INVOICE_DATE"),
    t.Literal("DAYS_AFTER_INVOICE_MONTH_END"),
    t.Literal("MONTHS_AFTER_INVOICE_MONTH_END"),
  ],
  { additionalProperties: false },
);

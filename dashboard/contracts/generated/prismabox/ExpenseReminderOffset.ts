import { t } from "elysia";

import { __transformDate__ } from "./__transformDate__";

import { __nullable__ } from "./__nullable__";

export const ExpenseReminderOffset = t.Union(
  [t.Literal("ONE_DAY"), t.Literal("TWO_DAYS"), t.Literal("THREE_DAYS")],
  { additionalProperties: false },
);
